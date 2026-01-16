import { 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  FlatList, 
  ActivityIndicator, 
  Button 
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'expo-router';
import { API_URL } from '../../constants/api';
import NumberList from "../../components/number";
import { useAuthUserStore, checkUser } from '../../library/authUserStore';
import { Ionicons } from "@expo/vector-icons";

const Api_Url = `${API_URL}/api/blog/stories`;

export default function Index() { 
  const router = useRouter();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [showNumbers] = useState(false);
  const { token, _hasHydrated } = useAuthUserStore();
  
  // Use ref to track abort controller
  const abortControllerRef = useRef(null);

  useEffect(() => { checkUser(); }, []);

  const handleStoryPress = (item) => {
    const path = item.slug ? `/story/${item.slug}` : `/story/${item._id || item.id}`;
    router.push(path);
  };

  const handleSambolePress = () => {
    router.push('/screens/QAListScreen');
  };

  const fetchStories = useCallback(async () => {
    // Cancel any previous request
    if (abortControllerRef. current) {
      abortControllerRef.current.abort();
    }

    if (! token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setFetchError(null);

    // Create new controller
    abortControllerRef. current = new AbortController();
    const timeoutId = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current. abort();
      }
    }, 30000);

    try {
      const response = await fetch(Api_Url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        signal: abortControllerRef.current.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const processedStories = Array.isArray(data)
        ? data.map(item => ({
            ...item,
            snippet: item.content ? item.content.slice(0, 120) + '...' : 'No content available.',
          }))
        : [];
      
      setStories(processedStories);

    } catch (error) {
      clearTimeout(timeoutId);
      
      // Ignore abort errors - they're expected when component unmounts or new request starts
      if (error.name === 'AbortError') {
        // Don't log or set error for abort - it's expected behavior
        return;
      }
      
      setFetchError("Likambo ezali. Meka lisusu.");
      console.error("Error fetching stories:", error.message);
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (_hasHydrated && token) {
      fetchStories();
    } else if (_hasHydrated && !token) {
      setIsLoading(false);
    }

    // Cleanup: abort fetch when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [_hasHydrated, token, fetchStories]);

  const renderStoryContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgb(38, 154, 155)" />
          <Text style={styles.loadingText}>Tozali koluka masolo...</Text>
        </View>
      );
    }

    if (fetchError) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline-outline" size={48} color="#d9534f" />
          <Text style={styles.errorText}>{fetchError}</Text>
          <Button title="Meka lisusu" onPress={fetchStories} color="rgb(38, 154, 155)" />
        </View>
      );
    }

    if (stories.length === 0) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.emptyListText}>Masolo ezali te mpo na sikoyo.</Text>
        </View>
      );
    }

    return (
      <>
        <View style={styles.itemHeader}>
          <FlatList
            data={stories}
            keyExtractor={(item) => item._id || item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleStoryPress(item)} style={{ marginHorizontal: 5 }}>
                <Text style={styles.title}>{item.title}</Text>
              </TouchableOpacity>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {stories.map((item) => (
            <TouchableOpacity key={item._id || item.id} onPress={() => handleStoryPress(item)}>
              <View style={styles.lisapo_container}>
                <Text style={styles.lisapo__title}>{item.title}</Text>
                <Text style={styles.lisolo}>{item.snippet}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Sambole Section */}
        <View style={styles.samboleSection}>
          <TouchableOpacity style={styles.samboleButton} onPress={handleSambolePress}>
            <Text style={styles.samboleButtonText}>🎯 Sambole</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.motango_container}>
          <Text style={styles.motango}>Motango</Text>
          <View style={styles.yekola_mitango}>
            <Text style={styles.yekola}>Yekola kotanga na biso</Text>
            <Ionicons name="book" size={75} color="rgb(0, 251, 255)" />
            <TouchableOpacity onPress={() => router.navigate('/number/numberlistScreen')} style={styles.linkText63}>
              <Text style={styles.yekola__moko}>1 2 3 4 5 6 7 8 9 . . .</Text>
              <Ionicons name="arrow-up-outline" size={24} color="rgb(0, 251, 255)" />
            </TouchableOpacity>
            {showNumbers && <NumberList />}
          </View>
        </View>
        <Text style={styles.title__top}>Masapo</Text>
        {renderStoryContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet. create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  container: {
    flex: 1,
    marginBottom: -70,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#d9534f',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 15,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
    color: '#888',
  },
  motango_container: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 4,
    marginHorizontal: 10,
  },
  motango: {
    color: '#000',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    padding: 6,
    textTransform: 'uppercase',
    borderRadius: 8,
    borderColor: 'rgb(78, 89, 175)',
    borderWidth: 2,
    borderBottomColor: 'rgb(0, 0, 0)',
    borderLeftColor: 'rgb(0, 208, 255)',
    borderRightColor: 'rgb(251, 0, 255)',
  },
  yekola_mitango: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgb(38, 154, 155)',
  },
  yekola: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 8,
    fontFamily: 'Palatino',
  },
  yekola__moko: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgb(255, 255, 255)',
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 16,
    textShadowColor: 'rgb(0, 255, 238)',
    fontFamily: 'Papyrus',
    marginTop: 1,
    marginBottom: 6,
  },
  linkText63: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 5,
  },
  title__top: {
    fontSize: 17,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgb(78, 89, 175)',
    marginHorizontal: 10,
    padding: 6,
    borderBottomColor: 'rgb(0, 0, 0)',
    borderLeftColor: 'rgb(0, 255, 34)',
    borderRightColor: 'rgb(251, 0, 255)',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    backgroundColor: 'rgb(155, 154, 155)',
    padding: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  lisapo_container: {
    backgroundColor: 'rgb(38, 154, 155)',
    padding: 2,
    borderRadius: 10,
    marginTop: 18,
    marginHorizontal: 14,
  },
  lisolo: {
    fontSize: 18,
    color: '#000',
    padding: 16,
    textAlign: 'justify',
    lineHeight: 30,
    fontFamily: 'Palatino',
  },
  lisapo__title: {
    fontSize: 17,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'sans-serif',
  },
  samboleSection: {
    marginHorizontal: 14,
    marginTop: 10,
    marginBottom: 40,
    padding: 10,
    backgroundColor: '#4a487d',
    borderRadius: 12,
    alignItems: 'center',
  },
  samboleTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  samboleSubtitle: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 16,
  },
  samboleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFB800',
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: 8,
    gap: 8,
  },
  samboleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});