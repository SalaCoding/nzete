import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { useCommentsStore } from '../../library/commentsStore';

export function CommentCountBadge({ storyId }) {
  const count = useCommentsStore((state) => state.byStory[storyId]?.count || 0);
  const refreshCount = useCommentsStore((state) => state.refreshCount);

  const scale = useRef(new Animated.Value(1)).current;

  // ✅ Fetch real count on mount
  useEffect(() => {
    if (storyId) {
      refreshCount(storyId);
    }
  }, [storyId, refreshCount]);

  // ✅ Animate when count changes
  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.15, useNativeDriver: true, friction: 5 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6 }),
    ]).start();
  }, [count, scale]);

  return (
    <Animated.View
      style={[styles.badge, { transform: [{ scale }] }]}
      accessible
      accessibilityLabel={`${count} ${count === 1 ? 'comment' : 'comments'}`}
    >
      <Text style={styles.text}>
        {count} {count === 1 ? 'comment' : 'comments'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    color: 'black',
    fontWeight: '700',
    textAlign: 'center',
    margin: 8,
  }
});
