import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import StoryRatingChart from "../../components/StoryRatingChart";
import { useStoryStore } from "../../library/storyStore";
import { getStoryRatingDistribution } from "../../components/RatedStory";

const MIN_RATING_SCORE = 1;

const Ranked = () => {
  const router = useRouter();
  const {
    allRatedStories,
    allRatedStoriesLoading,
    allRatedStoriesError,
    fetchAllRatedStories,
  } = useStoryStore();

  const [refreshing, setRefreshing] = useState(false);

  const loadStories = React.useCallback(async () => {
    await fetchAllRatedStories(MIN_RATING_SCORE);
  }, [fetchAllRatedStories]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadStories();
    } catch (e) {
      console.log("Refresh error", e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, [ loadStories]);

  const navigateToStory = (story) => {
    const storyId = story. id || story._id;
    const route = story.slug ? `/story/${story.slug}` : `/story/${storyId}`;
    router.push(route);
  };

  if (allRatedStoriesLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Loading... </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (allRatedStoriesError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles. errorText}>Error: {allRatedStoriesError}</Text>
          <Pressable style={styles.retryButton} onPress={loadStories}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles. scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Masolo nyonso oyo batu ba pesi motuya</Text>
          <Text style={styles.subHeaderText}>
            {allRatedStories.length} {allRatedStories.length === 1 ? 'lisolo' : 'masolo'}
          </Text>
        </View>

        {allRatedStories.length > 0 ? (
          allRatedStories. map(story => {
            const storyId = story. id || story._id;
            const distribution = getStoryRatingDistribution(story);
            const totalRatings = story.totalRatings || 0;
            const averageRating = story.averageRating || 0;

            return (
              <Pressable
                key={storyId}
                style={styles.storyCard}
                onPress={() => navigateToStory(story)}
              >
                <Text style={styles.storyTitle}>{story.title}</Text>

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles. statStars}>
                      {"⭐".repeat(Math.round(averageRating))}
                    </Text>
                    <Text style={styles. statLabel}>
                      {averageRating.toFixed(1)} / 5
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles. statValue}>{totalRatings}</Text>
                    <Text style={styles.statLabel}>
                      {totalRatings === 1 ? 'moto' : 'bato'}
                    </Text>
                  </View>
                </View>

                <StoryRatingChart distribution={distribution} />

                <Text style={styles.readMore}>Tanga lisolo →</Text>
              </Pressable>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Ezali lisolo moko te oyo batu ba pesi motuya. 
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  storyCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statStars: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  readMore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a90e2',
    textAlign: 'center',
    marginTop: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 16,
    color: '#d9534f',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default Ranked;