// 🔹 Imports
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useStoryStore } from '../library/storyStore';
import { useRouter } from "expo-router";

// 🔹 Selector: Get user's rating for a story
export function selectUserRating(story, userId) {
  if (!story || !userId) return 0;
  
  // First check if rating is directly on the story (from fetchRatedStories)
  if (typeof story.rating === 'number') {
    return story. rating;
  }
  
  // Otherwise look in interactions
  const interaction = story.interactions?. find(
    i => String(i.userId) === String(userId) && i.type === 'rating'
  );
  return interaction?.score ??  0;
};

// 🔹 Utility Functions
export function getUserRatedStoriesAbove(stories, userId, minScore = 1) {
  return stories.filter(story => selectUserRating(story, userId) >= minScore);
}

export function getStoriesRatedAboveByAny(stories, minScore = 1) {
  return stories.filter(story =>
    story.interactions?.some(i => i.type === 'rating' && i.score >= minScore)
  );
}

export default function getPopularStoriesWithUsers(stories, minScore = 3) {
  return stories.map(story => {
    const highRatings = story.interactions?.filter(
      i => i.type === 'rating' && i. score >= minScore
    );
    return highRatings?. length
      ? { ... story, highRatedBy: highRatings.map(i => i.userId) }
      : null;
  }).filter(Boolean);
}

export function getRatingDistribution(stories) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  stories.forEach(story => {
    story.interactions?.forEach(i => {
      if (i.type === 'rating' && counts[i.score] !== undefined) {
        counts[i.score]++;
      }
    });
  });
  return Object. entries(counts).map(([star, count]) => ({
    star: Number(star), count
  }));
};

export function getStoryRatingDistribution(story) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  story.interactions?.forEach(i => {
    if (i. type === 'rating' && counts[i.score] !== undefined) {
      counts[i.score]++;
    }
  });
  return counts;
}

// 🔹 Helper: Create excerpt from content
function makeExcerpt(text = "", limit = 2) {
  const paragraphs = text
    .split(/\r?\n\s*\r?\n/g)
    . map(p => p.trim())
    .filter(Boolean);

  const excerptParas = paragraphs.slice(0, limit);
  const hasMore = paragraphs. length > limit;

  return {
    excerpt: excerptParas.join("\n\n"),
    hasMore,
  };
}

// 🔹 Component: RatedStoryList → Display User's Rated Stories
export function RatedStoryList({ 
  userId, 
  minScore = 1, 
  header,
  stories: storiesProp  // Optional: pass stories directly
}) {
  const router = useRouter();

  // Use passed stories or get from store
  const storeRatedStories = useStoryStore(s => s.ratedStories);
  const stories = storiesProp || storeRatedStories;

  // Filter stories with rating >= minScore (not just > minScore)
  const filtered = stories.filter(story => {
    const score = selectUserRating(story, userId);
    return score >= minScore;  // Changed from > to >=
  });

  const defaultHeader = `Masolo oyo opesaki koleka ${minScore} ⭐ (${filtered.length})`;

  return (
    <View>
      <Text style={styles. header}>{header || defaultHeader}</Text>

      {filtered.length > 0 ?  (
        filtered.map(story => {
          const score = selectUserRating(story, userId);
          const { excerpt, hasMore } = makeExcerpt(story.content, 1);
          const storyId = story. id || story._id;

          return (
            <Pressable
              key={storyId}
              style={styles.card}
              onPress={() => {
                const route = story.slug ? `/story/${story.slug}` : `/story/${storyId}`;
                router. push(route);
              }}
            >
              <Text style={styles.title}>{story.title}</Text>
              <Text style={styles.content}>
                {excerpt}
                {hasMore ?  "…" : ""}
              </Text>
              <Text style={styles.readMore}>Tanga lisusu →</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingMessage}>Motuya opesaki: </Text>
                <Text style={styles. ratingScore}>{"⭐". repeat(score)} ({score})</Text>
              </View>
            </Pressable>
          );
        })
      ) : (
        <Text style={styles.empty}>
          Ezali masolo moko te oyo opesaki motuya ya {minScore} to koleka.
        </Text>
      )}
    </View>
  );
}

// 🔹 Component: StoryScreens → Zustand Selectors Demo
export function StoryScreens() {
  const fetchAllStories = useStoryStore(s => s.fetchAllStories);
  const getMyRatedAbove = useStoryStore(s => s. getMyRatedAbove);
  const getPopularAbove = useStoryStore(s => s. getPopularAbove);
  const getRatingDist = useStoryStore(s => s.getRatingDistribution);

  React.useEffect(() => {
    fetchAllStories(1, 50);
  }, [fetchAllStories]);

  const mine = getMyRatedAbove(2);
  const popular = getPopularAbove(2);
  const distAll = getRatingDist('all');
  const distMine = getRatingDist('user');

  return (
    <View>
      <Text>Masolo na yo: {mine.length}</Text>
      <Text>Masolo ya bato nyonso: {popular.length}</Text>
      <Text>Distribusyo (bato nyonso): {JSON.stringify(distAll)}</Text>
      <Text>Distribusyo (na yo): {JSON.stringify(distMine)}</Text>
    </View>
  );
}

const styles = StyleSheet. create({
  header: { 
    fontSize: 19, 
    fontWeight: "700",
    marginBottom: 12, 
    textAlign: 'center', 
    color: '#141515', 
    padding: 8, 
    borderRadius: 8,
    textTransform: 'uppercase',
  },
  empty: { 
    fontSize: 14, 
    fontStyle: "italic", 
    color: "#666", 
    textAlign: 'center',
    paddingVertical: 20,
  },
  card: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#eee',
  },
  title: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 12,  
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  content: { 
    fontSize: 17, 
    fontWeight: "400",
    fontStyle: "italic", 
    marginVertical: 4, 
    lineHeight: 26,
    color: '#333',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  ratingMessage: { 
    fontSize: 14, 
    fontWeight: "600",
    color: '#555',
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: "700",
    color: '#FFB800',
  },
  readMore: {
    color: "#2a2b2b",
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
  }
});