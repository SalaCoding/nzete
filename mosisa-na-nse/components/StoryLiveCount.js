import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCountViewLive  } from '../library/countViewLive';
import { socket } from '../library/socket';
import { formatViewCount } from '../utils/formatViewCount';

export function StoryLiveCount({ storyId, userId }) {
  const { recordView, updateViewsFromSocket, stories } = useCountViewLive();
  const liveStory = stories[storyId] || {};

  useEffect(() => {
    if (storyId && userId) {
      recordView(storyId, userId);
      socket.emit('join', `story:${storyId}`);
      socket.on('story:viewed', ({ storyId: viewedId, totalViews }) => {
        if (viewedId === storyId) {
          updateViewsFromSocket(storyId, totalViews);
        }
      });
      return () => {
        socket.emit('leave', `story:${storyId}`);
        socket.off('story:viewed');
      };
    }
  }, [storyId, userId, updateViewsFromSocket, recordView]);

  // Defensive fallback to 0
  const totalViews = typeof liveStory.totalViews === 'number' ? liveStory.totalViews : 0;
  const userViewCount = typeof liveStory.userViewCount === 'number' ? liveStory.userViewCount : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Batu batangi: {formatViewCount(totalViews)}</Text>
      <Text style={styles.text}>Mbala boni otangi: {formatViewCount(userViewCount)}</Text>
    </View>
  );
}

export default StoryLiveCount;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    padding: 10,
  }, 
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: '#848383ff',
  },
});