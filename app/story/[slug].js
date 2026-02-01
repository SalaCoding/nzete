import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// ✅ IMPORT fetchProtected FROM STORE TO GET TIMEOUT/RETRY LOGIC
import { useAuthUserStore, fetchProtected } from '../../library/authUserStore'; 
import { useStoryStore } from '../../library/storyStore';
import { StoryImage } from '../../components/StoryImage';
import { StatusBar } from 'expo-status-bar';
import { getRatingMessage } from '../../lib/message';
import { Ionicons } from '@expo/vector-icons';
import { addNetworkStateListener } from 'expo-network';
import { StoryLiveCount } from '../../components/StoryLiveCount';
import { useShareStory } from '../../hooks/useShareStory';
//import { AdBanner } from '../../components/AdBanner.js';

export default function StoryPage() {
  const storyScrollViewRef = useRef(null);
  const router = useRouter();

  const [story, setStory] = useState(null);
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [error, setError] = useState(null);

  const { fetchRatedStories, fetchRatingStats } = useStoryStore.getState();
  const { token, user } = useAuthUserStore();
  const { setCurrentStory } = useStoryStore();
  const { slug: slugParam } = useLocalSearchParams();
  
  // Handle array or string slug from expo-router
  const rawSlug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
  const apiSlug = typeof rawSlug === 'string' ? rawSlug.trim().toLowerCase() : '';
  const userId = user?._id || user?.id;

  const shareStory = useShareStory();

  const fetchStoryData = useCallback(async () => {
    if (!apiSlug || !token) {
      console.warn('Skipping fetch: missing slug or token');
      return;
    }

    setIsLoading(true);
    try {
      const url = `/api/blog/story/${encodeURIComponent(apiSlug)}`;
      // This uses the robust fetchProtected with timeout/retry
      const data = await fetchProtected(url);

      if (data?.title) {
        setCurrentStory(data);
        setStory(data);
      } else {
        setStory({
          title: apiSlug,
          slug: apiSlug,
          content: 'Lisapo ezali te.',
          reason: 'No story found',
        });
      }
      setError(null);
    } catch (err) {
      console.error('❌ Fetch story error:', err);
      // User friendly error message
      const msg = err.message.includes('timeout') 
        ? 'Ekokaki kozwa lisapo te due to connection issues.' 
        : 'Ekokaki kozwa lisapo te.';
      setError(msg);
      setStory({
        title: apiSlug,
        slug: apiSlug,
        content: msg,
        reason: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [apiSlug, token, setCurrentStory]);

  const fetchRating = useCallback(async () => {
    if (!story?._id || !token) return;
    try {
      const result = await fetchProtected(`/api/blog/check?storyId=${story._id}`);
      const score = result?.score ?? 0;
      setRating(score);
      setHasRated(score > 0);
    } catch (err) {
      console.warn('Rating hydration failed:', err);
    }
  }, [story?._id, token]);

  const submitRating = useCallback(async () => {
    if (!story?._id || rating === 0) {
      Alert.alert('Invalid Rating', 'Please select a star to submit your rating.');
      return;
    }
    try {
      const response = await fetchProtected(
        `/api/blog/story/${story._id}/rate`,
        { method: 'POST', body: JSON.stringify({ score: rating }) }
      );
      const newScore = response.score ?? rating;
      setRating(newScore);
      setHasRated(newScore > 0);
      setSubmissionMessage(getRatingMessage(newScore, { lang: 'ln', tense: 'past' }));
      Alert.alert('Rating Submitted', `You rated this story ${newScore} stars.`);
    } catch (err) {
      console.error('❌ Rating submission failed:', err);
      Alert.alert('Error', 'Failed to submit rating. Please try again.');
    }
    // Refresh stats in background
    fetchRatedStories();
    fetchRatingStats();
  }, [story?._id, rating, fetchRatedStories, fetchRatingStats]);

  useEffect(() => {
    if (token) fetchStoryData();
  }, [token, fetchStoryData]);

  useEffect(() => {
    if (story?._id) {
      fetchRating();
    }
  }, [story?._id, fetchRating]);

  useEffect(() => {
    const subscription = addNetworkStateListener(({ isInternetReachable }) => {
      if (isInternetReachable) {
        fetchStoryData();
        if (story?._id) fetchRating();
      }
    });
    return () => subscription.remove();
  }, [fetchStoryData, fetchRating, story?._id]);

  const onRefresh = useCallback(() => {
    fetchStoryData();
  }, [fetchStoryData]);

  const renderRatingStar = () => (
    <View style={{ marginBottom: 20 }}>
      {isLoading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <View
          key={rating}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            borderRadius: 12,
            borderColor: rating > 0 ? 'gold' : 'gray',
            borderWidth: 1,
            gap: 6,
            padding: 10,
            marginTop: 20,
          }}
        >
          {[1, 2, 3, 4, 5].map((starValue) => {
            const isActive = starValue <= rating;
            return (
              <TouchableOpacity
                key={starValue}
                onPress={() => !hasRated && setRating(starValue)}
                accessibilityLabel={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
              >
                <Ionicons
                  name={isActive ? 'star' : 'star-outline'}
                  size={24}
                  color={isActive ? 'rgba(248, 211, 0, 1)' : 'gold'}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.select({ ios: 2, android: 0 })}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: 'white' }}
          contentContainerStyle={{ padding: 20 }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
          }
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={24}
          ref={storyScrollViewRef}
        >
          {error && (
            <View style={{
              padding: 10,
              backgroundColor: '#ffecec',
              borderRadius: 8,
              marginBottom: 15,
              alignItems: 'center',
            }}>
              <Text style={{ color: '#d9534f', fontWeight: 'bold' }}>
                {error}
              </Text>
            </View>
          )}
          
          {/* Header Actions */}
          <Ionicons
            name="arrow-back"
            size={28}
            color="black"
            onPress={() => router.back()}
            style={{ position: 'absolute', top: 14, left: 10, zIndex: 1, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 14, padding: 2 }}
          />
          <TouchableOpacity
            onPress={() => shareStory(story)}
            style={{
              position: 'absolute',
              top: 14,
              right: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: 'rgba(187, 193, 187, 0.1)',
              padding: 5,
              borderRadius: 8,
              zIndex: 100,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#68696aff' }}>Kabola</Text>
            <Ionicons name="share-social-outline" size={25} color="#333" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', marginTop: 40 }}>
            {story?.title}
          </Text>

          {/* Image */}
          {story?.image && (
            <StoryImage
              uri={
                story.image?.startsWith('data:image')
                  ? story.image
                  : `data:image/png;base64,${story.image}`
              }
            />
          )}

          {/* Content */}
          <Text style={{ fontSize: 17, marginTop: 30, lineHeight: 28, marginBottom: 20, fontFamily: 'Palatino'}}>
            {story?.content}
          </Text>

          {/* Rating Section */}
          <View style={{ marginBottom: 4, marginTop: 2 }}>
            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Monzoto:</Text>
            {renderRatingStar()}
            <TouchableOpacity
              onPress={submitRating}
              disabled={hasRated || isLoading}
              style={{
                marginTop: 5,
                backgroundColor: hasRated ? '#ccc' : '#FFD000',
                padding: 10,
                borderRadius: 8,
                alignItems: 'center',
                opacity: isLoading ? 0.7 : 1,
              }}
              accessibilityLabel="Submit rating"
            >
              <Text style={{ color: '#333', fontWeight: 'bold' }}>
                {hasRated ? 'Rating Submitted' : isLoading ? 'Submitting...' : 'Submit Rating'}
              </Text>
            </TouchableOpacity>
            {!!submissionMessage && (
              <Text
                style={{
                  marginTop: 26,
                  fontWeight: 'bold',
                  color: submissionMessage.includes('error') ? 'red' : 'green',
                  textAlign: 'center',
                }}
              >
                {submissionMessage}
              </Text>
            )}
          </View>

          {/* Live Count Component */}
          <StoryLiveCount storyId={story?._id} userId={userId} />
          {/*<AdBanner />*/}
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}