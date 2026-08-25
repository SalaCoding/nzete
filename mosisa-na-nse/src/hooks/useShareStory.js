import { API_URL } from '../constants/api';
import { Share } from 'react-native';
import { useCallback } from 'react';

export function useShareStory(baseUrl = `${API_URL}/api/blog/story/`) {
  return useCallback(async (story) => {
    try {
      const title = story?.title || 'Untitled Story';
      const content = story?.content || '';
      const id = story?._id || story?.id || '';
      const url = id ? `${baseUrl}${id}` : baseUrl;

      // ⭐ Take exactly 6 lines of content
      const preview = content
        .split('\n')
        .slice(0, 6)
        .join('\n')
        .trim();

      await Share.share({
        title,
        message: `${title}\n\n${preview}\n\nRead more: ${url}`,
        url,
      });
    } catch (error) {
      console.error('Error sharing story:', error);
    }
  }, [baseUrl]);
}

export default useShareStory;
