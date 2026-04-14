import { API_URL } from '../constants/api';
import { Share } from 'react-native';
import { useCallback } from 'react';

/**
 * useShareStory hook
 * Returns a shareStory function that can be used anywhere in your app.
 * Usage:
 *   const shareStory = useShareStory();
 *   shareStory(story);
 */
export function useShareStory(baseUrl = `${API_URL}/api/blog/story/`) {
  return useCallback(async (story) => {
    try {
      const title = story?.title || 'Untitled Story';
      const description = story?.description || story?.content || '';
      const id = story?._id || story?.id || '';
      const url = id ? `${baseUrl}${id}` : baseUrl;

      await Share.share({
        title,
        message: `${title}\n\n${description}\n\nRead more: ${url}`,
        url,
      });
    } catch (error) {
      console.error('Error sharing story:', error);
    }
  }, [baseUrl]);
}

export default useShareStory;