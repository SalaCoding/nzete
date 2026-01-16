import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQAStore } from '../../library/storeQA';
import { StatusBar } from 'expo-status-bar';

const QUIZ_STATE_KEY = 'quiz_state';

const QAListScreen = () => {
  const { 
    qas, 
    isLoading, 
    fetchQAs, 
    fetchCategories, 
    categories, 
    checkAnswer,
    saveScore,
    deleteAllScores,
    fetchBestScore,
    fetchScores,
    bestScore,
    lastScore,
  } = useQAStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [shuffledQAs, setShuffledQAs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [results, setResults] = useState({});
  const [answeredOrder, setAnsweredOrder] = useState([]);
  const [previousScore, setPreviousScore] = useState(null);
  const [mode, setMode] = useState('quiz');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(true);
  const [scoreSaved, setScoreSaved] = useState(false);
  
  const isInitializedRef = useRef(false);
  const previousCategoryRef = useRef('');
  const lastQuestionIdRef = useRef(null);

  const saveQuizState = useCallback(async (state) => {
    try {
      await AsyncStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving quiz state:', error);
    }
  }, []);

  const loadQuizState = useCallback(async () => {
    try {
      const savedState = await AsyncStorage.getItem(QUIZ_STATE_KEY);
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error('Error loading quiz state:', error);
    }
    return null;
  }, []);

  const clearQuizState = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(QUIZ_STATE_KEY);
    } catch (error) {
      console.error('Error clearing quiz state:', error);
    }
  }, []);

  // Shuffle array ensuring no consecutive duplicates
  const shuffleArray = useCallback((array, lastId = null) => {
    if (array.length <= 1) return [...array];
    
    const shuffled = [...array];
    
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math. floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // If the first item is the same as the last question, swap it
    if (lastId && shuffled. length > 1 && shuffled[0]._id === lastId) {
      // Find a different question to swap with
      for (let i = 1; i < shuffled.length; i++) {
        if (shuffled[i]._id !== lastId) {
          [shuffled[0], shuffled[i]] = [shuffled[i], shuffled[0]];
          break;
        }
      }
    }
    
    // Ensure no consecutive duplicates throughout the array
    for (let i = 1; i < shuffled.length; i++) {
      if (shuffled[i]._id === shuffled[i - 1]._id) {
        // Find a non-duplicate to swap with
        for (let j = i + 1; j < shuffled.length; j++) {
          if (shuffled[j]._id !== shuffled[i - 1]._id && shuffled[j]._id !== shuffled[i + 1]?._id) {
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            break;
          }
        }
      }
    }
    
    return shuffled;
  }, []);

  const loadData = useCallback(async () => {
    await fetchCategories();
    await fetchQAs(1, 50, selectedCategory ?  { category: selectedCategory } : {});
    await fetchBestScore();
    await fetchScores(1);
  }, [fetchCategories, fetchQAs, selectedCategory, fetchBestScore, fetchScores]);

  useEffect(() => {
    const initializeQuiz = async () => {
      setIsLoadingState(true);
      
      const savedState = await loadQuizState();
      
      if (savedState && savedState.results && Object.keys(savedState.results).length > 0) {
        setResults(savedState.results || {});
        setAnsweredOrder(savedState.answeredOrder || []);
        setCurrentIndex(savedState.currentIndex || 0);
        setMode(savedState.mode || 'quiz');
        setPreviousScore(savedState.previousScore || null);
        setSelectedCategory(savedState.selectedCategory || '');
        setScoreSaved(savedState.scoreSaved || false);
        lastQuestionIdRef.current = savedState.lastQuestionId || null;
        previousCategoryRef.current = savedState.selectedCategory || '';
      }
      
      await loadData();
      
      isInitializedRef.current = true;
      setIsLoadingState(false);
    };
    
    initializeQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const restoreShuffledOrder = async () => {
      if (qas.length > 0 && isInitializedRef.current) {
        const savedState = await loadQuizState();
        if (savedState && savedState.shuffledQAIds && savedState.shuffledQAIds.length > 0) {
          const orderedQAs = savedState.shuffledQAIds
            .map(id => qas.find(qa => qa._id === id))
            .filter(qa => qa !== undefined);
          
          if (orderedQAs.length > 0) {
            setShuffledQAs(orderedQAs);
            return;
          }
        }
        setShuffledQAs(shuffleArray(qas, lastQuestionIdRef.current));
      } else if (qas.length > 0) {
        setShuffledQAs(shuffleArray(qas, lastQuestionIdRef.current));
      }
    };
    
    restoreShuffledOrder();
  }, [qas, loadQuizState, shuffleArray]);

  useEffect(() => {
    if (! isLoadingState && shuffledQAs.length > 0 && isInitializedRef.current) {
      saveQuizState({
        results,
        answeredOrder,
        currentIndex,
        mode,
        previousScore,
        selectedCategory,
        scoreSaved,
        lastQuestionId: lastQuestionIdRef.current,
        shuffledQAIds: shuffledQAs.map(qa => qa._id),
      });
    }
  }, [results, answeredOrder, currentIndex, mode, previousScore, selectedCategory, shuffledQAs, saveQuizState, isLoadingState, scoreSaved]);

  const autoSaveScore = useCallback(async (correct, wrong, total, category) => {
    setIsSaving(true);
    try {
      const result = await saveScore(correct, wrong, total, category || 'all');
      if (result. success) {
        setScoreSaved(true);
        await fetchBestScore();
        await fetchScores(1);
      }
    } catch (error) {
      console.error('Auto-save score error:', error);
    } finally {
      setIsSaving(false);
    }
  }, [saveScore, fetchBestScore, fetchScores]);

  const correctCount = Object.values(results).filter(r => r.isCorrect).length;
  const wrongCount = Object.values(results).filter(r => !r.isCorrect).length;
  const totalAnswered = Object.keys(results).length;

  useEffect(() => {
    if (mode === 'complete' && ! scoreSaved && ! isSaving && totalAnswered > 0) {
      autoSaveScore(correctCount, wrongCount, totalAnswered, selectedCategory);
    }
  }, [mode, scoreSaved, isSaving, autoSaveScore, correctCount, selectedCategory, totalAnswered, wrongCount]);

  const resetQuizState = useCallback((clearStorage = false) => {
    // Store the last question ID before resetting
    const currentLastId = shuffledQAs.length > 0 ?  shuffledQAs[shuffledQAs.length - 1]?._id : null;
    
    setCurrentIndex(0);
    setUserAnswer('');
    setResults({});
    setAnsweredOrder([]);
    setPreviousScore(null);
    setMode('quiz');
    setScoreSaved(false);
    
    if (qas.length > 0) {
      // Pass the last question ID to ensure it's not first in the new shuffle
      setShuffledQAs(shuffleArray(qas, currentLastId));
    }
    
    if (clearStorage) {
      lastQuestionIdRef.current = null;
      clearQuizState();
    }
  }, [qas, clearQuizState, shuffleArray, shuffledQAs]);

  useEffect(() => {
    if (isInitializedRef.current && previousCategoryRef.current !== selectedCategory) {
      previousCategoryRef.current = selectedCategory;
      resetQuizState(false);
    }
  }, [selectedCategory, resetQuizState]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const currentQuestionSet = useMemo(() => {
    if (mode === 'retryFailed') {
      const failedIds = Object.entries(results)
        .filter(([_, result]) => !result.isCorrect)
        .map(([id]) => id);
      const failedQAs = shuffledQAs.filter(qa => failedIds.includes(qa._id));
      return shuffleArray(failedQAs, lastQuestionIdRef.current);
    }
    if (mode === 'retryAll') {
      return shuffleArray([...shuffledQAs], lastQuestionIdRef.current);
    }
    return shuffledQAs;
  }, [mode, shuffledQAs, results, shuffleArray]);

  const handleSubmit = async () => {
    const trimmedAnswer = userAnswer.trim();
    if (! trimmedAnswer) return;

    const currentQA = currentQuestionSet[currentIndex];
    if (! currentQA) return;

    // Store the current question ID as the last answered
    lastQuestionIdRef.current = currentQA._id;

    const response = await checkAnswer(currentQA._id, trimmedAnswer);
    
    const resultWithSuggestions = {
      ...response,
      suggestions: currentQA.suggestions || [],
    };

    const newResults = {
      ...results,
      [currentQA._id]: resultWithSuggestions,
    };
    setResults(newResults);

    setAnsweredOrder(prev => {
      const filtered = prev.filter(id => id !== currentQA._id);
      return [currentQA._id, ...filtered];
    });

    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    setUserAnswer('');

    if (newIndex >= currentQuestionSet.length) {
      setMode('complete');
      setScoreSaved(false);
      
      const finalCorrect = Object.values(newResults).filter(r => r.isCorrect).length;
      const finalWrong = Object.values(newResults).filter(r => !r.isCorrect). length;
      const finalTotal = Object.keys(newResults).length;
      
      autoSaveScore(finalCorrect, finalWrong, finalTotal, selectedCategory);
    }
  };

  const handleRetryFailed = () => {
    const failedCount = Object.values(results). filter(r => ! r.isCorrect).length;
    if (failedCount === 0) return;
    
    setPreviousScore({ correct: correctCount, total: totalAnswered });
    
    const newResults = {};
    Object.entries(results). forEach(([id, result]) => {
      if (result.isCorrect) {
        newResults[id] = result;
      }
    });
    setResults(newResults);
    setAnsweredOrder([]);
    setCurrentIndex(0);
    setUserAnswer('');
    setMode('retryFailed');
    setScoreSaved(false);
  };

  const handleRetryAll = () => {
    setPreviousScore({ correct: correctCount, total: totalAnswered });
    
    // Store last question before retry
    const currentQA = currentQuestionSet[currentIndex];
    if (currentQA) {
      lastQuestionIdRef.current = currentQA._id;
    }
    
    setResults({});
    setAnsweredOrder([]);
    setCurrentIndex(0);
    setUserAnswer('');
    setMode('retryAll');
    setScoreSaved(false);
  };

  const handleReset = () => {
    Alert.alert(
      '🆕 Banda lisusu',
      'Olingi kobanda lisusu?  Score nyonso ekosila.',
      [
        { text: 'Te', style: 'cancel' },
        { 
          text: 'Iyo', 
          style: 'destructive',
          onPress: async () => {
            await deleteAllScores();
            lastQuestionIdRef.current = null;
            resetQuizState(true);
            Alert.alert('✅ Esili! ', 'Score nyonso elongwe.');
          }
        },
      ]
    );
  };

  const currentQA = currentQuestionSet[currentIndex];
  const isQuizComplete = mode === 'complete';

  const answeredQAsList = answeredOrder
    .map(id => ({
      qa: shuffledQAs.find(qa => qa._id === id),
      result: results[id],
    }))
    .filter(item => item.qa && item.result);

  if ((isLoading && qas.length === 0) || isLoadingState) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Tozali koluka mituna...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Lisano</Text>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreCorrect}>✅ {correctCount}</Text>
            <Text style={styles.scoreWrong}>❌ {wrongCount}</Text>
            <Text style={styles.scoreTotal}>/ {currentQuestionSet.length}</Text>
          </View>
          
          {bestScore && (
            <Text style={styles.bestScoreText}>
              🏆 Score ya likolo: {bestScore.percentage}%
            </Text>
          )}
          
          {lastScore && (
            <Text style={styles.lastScoreText}>
              📊 Score ya suka: {lastScore.correctCount}/{lastScore.totalQuestions} ({lastScore.percentage}%)
            </Text>
          )}
          
          {mode !== 'quiz' && mode !== 'complete' && (
            <Text style={styles.modeText}>
              {mode === 'retryFailed' ?  '🔄 Meka: Mituna ya mabunga' : 
               mode === 'retryAll' ? '🔄 Meka: Mituna nyonso' : ''}
            </Text>
          )}
          {previousScore && (
            <Text style={styles.previousScore}>
              Score ya liboso: {previousScore.correct}/{previousScore.total}
            </Text>
          )}
        </View>

        <View style={styles.filterContainer}>
          {categories.map(cat => (
            <Pressable
              key={cat}
              style={[
                styles.filterButton,
                selectedCategory === cat && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedCategory === cat && styles.filterButtonTextActive,
              ]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>

        <FlatList
          data={[]}
          ListHeaderComponent={
            <>
              {isQuizComplete && (
                <View style={styles.completeCard}>
                  <Text style={styles.completeEmoji}>🎉</Text>
                  <Text style={styles.completeTitle}>Osilisi! </Text>
                  
                  <View style={styles.finalScoreContainer}>
                    <View style={styles.finalScoreBox}>
                      <Text style={styles.finalScoreNumber}>{correctCount}</Text>
                      <Text style={styles.finalScoreLabel}>Malamu ✅</Text>
                    </View>
                    <View style={styles.finalScoreDivider} />
                    <View style={styles.finalScoreBox}>
                      <Text style={[styles.finalScoreNumber, styles.wrongNumber]}>{wrongCount}</Text>
                      <Text style={styles.finalScoreLabel}>Mabunga ❌</Text>
                    </View>
                  </View>

                  <View style={styles.percentageContainer}>
                    <Text style={styles.percentageText}>
                      {totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0}%
                    </Text>
                    <Text style={styles.percentageLabel}>Score</Text>
                  </View>

                  <View style={styles.saveStatusContainer}>
                    {isSaving ?  (
                      <View style={styles.savingRow}>
                        <ActivityIndicator size="small" color="#4a90e2" />
                        <Text style={styles.savingText}>Tozali kobomba score...</Text>
                      </View>
                    ) : scoreSaved ? (
                      <Text style={styles.savedText}>✅ Score ebombami!</Text>
                    ) : null}
                  </View>

                  {previousScore && (
                    <View style={styles.comparisonContainer}>
                      <Text style={styles.comparisonTitle}>Bokeseni:</Text>
                      <Text style={styles.comparisonText}>
                        Liboso: {previousScore.correct}/{previousScore.total} → Sika: {correctCount}/{totalAnswered}
                      </Text>
                      {correctCount > previousScore.correct ?  (
                        <Text style={styles.comparisonBetter}>📈 Ozali kokola!  +{correctCount - previousScore.correct}</Text>
                      ) : correctCount < previousScore.correct ?  (
                        <Text style={styles.comparisonWorse}>📉 Meka lisusu! {correctCount - previousScore.correct}</Text>
                      ) : (
                        <Text style={styles.comparisonSame}>➡️ Score ekokani</Text>
                      )}
                    </View>
                  )}

                  <View style={styles.actionButtons}>
                    {wrongCount > 0 && (
                      <Pressable style={styles.retryFailedButton} onPress={handleRetryFailed}>
                        <Text style={styles.retryFailedButtonText}>
                          🔄 Zongela mabunga ({wrongCount})
                        </Text>
                      </Pressable>
                    )}
                    
                    <Pressable style={styles.retryAllButton} onPress={handleRetryAll}>
                      <Text style={styles.retryAllButtonText}>
                        🔁 Zongela nyonso
                      </Text>
                    </Pressable>
                    
                    <Pressable style={styles.resetButton} onPress={handleReset}>
                      <Text style={styles.resetButtonText}>
                        🆕 Banda lisusu (Reset)
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {currentQA && ! isQuizComplete && (
                <View style={styles.currentCard}>
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>
                      Motuna {currentIndex + 1} / {currentQuestionSet.length}
                    </Text>
                  </View>
                  
                  <Text style={styles.questionLabel}>Motuna:</Text>
                  <Text style={styles.question}>{currentQA.question}</Text>

                  <View style={styles.metaRow}>
                    {currentQA.category && (
                      <Text style={styles.metaTag}>{currentQA.category}</Text>
                    )}
                    {currentQA.difficulty && (
                      <Text style={[
                        styles.metaTag,
                        currentQA.difficulty === 'easy' && styles.tagEasy,
                        currentQA.difficulty === 'medium' && styles.tagMedium,
                        currentQA.difficulty === 'hard' && styles.tagHard,
                      ]}>
                        {currentQA.difficulty}
                      </Text>
                    )}
                  </View>

                  <View style={styles.inputSection}>
                    <TextInput
                      style={styles.input}
                      placeholder="Koma eyano na yo..."
                      placeholderTextColor="#999"
                      value={userAnswer}
                      onChangeText={setUserAnswer}
                      onSubmitEditing={handleSubmit}
                      autoCapitalize="none"
                    />
                    <Pressable 
                      style={[
                        styles.submitButton,
                        !userAnswer.trim() && styles.submitButtonDisabled
                      ]} 
                      onPress={handleSubmit}
                      disabled={!userAnswer.trim()}
                    >
                      <Text style={styles.submitButtonText}>Tala eyano</Text>
                    </Pressable>
                    
                    <Pressable style={styles.skipButton} onPress={handleRetryAll}>
                      <Text style={styles.skipButtonText}>Zongela nyonso</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {answeredQAsList.length > 0 && (
                <View style={styles.divider}>
                  <Text style={styles.dividerText}>
                    Mituna oyanolaki ({answeredQAsList.length})
                  </Text>
                </View>
              )}
            </>
          }
          renderItem={null}
          ListFooterComponent={
            <>
              {answeredQAsList.map((item) => (
                <View 
                  key={item.qa._id} 
                  style={[
                    styles.answeredCard,
                    item.result.isCorrect ?  styles.answeredCorrect : styles.answeredWrong,
                  ]}
                >
                  <View style={styles.answeredHeader}>
                    <Text style={styles.answeredEmoji}>
                      {item.result. isCorrect ? '✅' : '❌'}
                    </Text>
                    <Text style={[
                      styles.answeredStatus,
                      item.result.isCorrect ? styles.statusCorrect : styles.statusWrong,
                    ]}>
                      {item. result.isCorrect ? 'Malamu!' : 'Elongi te'}
                    </Text>
                  </View>
                  
                  <Text style={styles.answeredQuestionLabel}>Motuna:</Text>
                  <Text style={styles.answeredQuestion}>{item.qa.question}</Text>
                  
                  <View style={styles.answersContainer}>
                    <View style={styles.answerRow}>
                      <Text style={styles.answerLabel}>Eyano na yo:</Text>
                      <Text style={[
                        styles.userAnswerValue,
                        item.result.isCorrect ? styles.answerCorrectText : styles.answerWrongText,
                      ]}>
                        {item.result.userAnswer}
                      </Text>
                    </View>
                    
                    {! item.result.isCorrect && (
                      <View style={styles.answerRow}>
                        <Text style={styles.answerLabel}>Ezali? :</Text>
                        <Text style={styles.suggestionsValue}>
                          {item.result.suggestions && item.result.suggestions.length > 0
                            ? item.result.suggestions.join(', ')
                            : item.result.correctAnswer}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.metaRow}>
                    {item.qa.category && (
                      <Text style={styles.metaTagSmall}>{item.qa.category}</Text>
                    )}
                    {item.qa.difficulty && (
                      <Text style={[
                        styles.metaTagSmall,
                        item.qa.difficulty === 'easy' && styles.tagEasy,
                        item.qa.difficulty === 'medium' && styles.tagMedium,
                        item.qa.difficulty === 'hard' && styles.tagHard,
                      ]}>
                        {item.qa.difficulty}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </>
          }
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            qas.length === 0 && !isLoading ?  (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Mituna ezali te</Text>
              </View>
            ) : null
          }
        />
        <StatusBar style="dark" />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet. create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
    gap: 19,
  },
  scoreCorrect: {
    fontSize: 14,
    fontWeight: '600',
    color: '#28a745',
  },
  scoreWrong: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc3545',
  },
  scoreTotal: {
    fontSize: 14,
    color: '#666',
  },
  bestScoreText: {
    fontSize: 14,
    color: '#ffc107',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
  },
  lastScoreText: {
    fontSize: 12,
    color: '#17a2b8',
    textAlign: 'center',
    marginTop: 2,
  },
  modeText: {
    fontSize: 14,
    color: '#4a90e2',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
  },
  previousScore: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#4a90e2',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  currentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#4a90e2',
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  currentBadge: {
    backgroundColor: '#4a90e2',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  currentBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  questionLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  metaTag: {
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#eee',
    color: '#666',
  },
  metaTagSmall: {
    fontSize: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#eee',
    color: '#666',
  },
  tagEasy: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  tagMedium: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  tagHard: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  inputSection: {
    marginTop: 20,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 10,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    marginTop: 12,
    width: '36%',
    alignSelf: 'flex-end',
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  divider: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 12,
  },
  dividerText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },
  answeredCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
  },
  answeredCorrect: {
    backgroundColor: '#f0f9f0',
    borderColor: '#28a745',
  },
  answeredWrong: {
    backgroundColor: '#fdf2f2',
    borderColor: '#dc3545',
  },
  answeredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  answeredEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  answeredStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusCorrect: {
    color: '#28a745',
  },
  statusWrong: {
    color: '#dc3545',
  },
  answeredQuestionLabel: {
    fontSize: 10,
    color: '#666',
  },
  answeredQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  answersContainer: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  answerLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  userAnswerValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  answerCorrectText: {
    color: '#28a745',
  },
  answerWrongText: {
    color: '#dc3545',
    textDecorationLine: 'line-through',
  },
  suggestionsValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  completeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4a90e2',
  },
  completeEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  completeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  finalScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  finalScoreBox: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  finalScoreNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#28a745',
  },
  wrongNumber: {
    color: '#dc3545',
  },
  finalScoreLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  finalScoreDivider: {
    width: 2,
    height: 50,
    backgroundColor: '#ddd',
  },
  percentageContainer: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  percentageLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  saveStatusContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  savingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  savingText: {
    fontSize: 14,
    color: '#4a90e2',
  },
  savedText: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: '600',
  },
  comparisonContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  comparisonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  comparisonText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  comparisonBetter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  comparisonWorse: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc3545',
  },
  comparisonSame: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  actionButtons: {
    width: '100%',
    gap: 12,
  },
  retryFailedButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryFailedButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  retryAllButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryAllButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default QAListScreen;