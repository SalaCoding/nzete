import { Share } from 'react-native';

/**
 * Share a story with a clean, readable message.
 * - Includes title, description/content, and a link.
 * - Handles missing fields gracefully.
 */
async function onShareStory(story) {
  try {
    const title = story?.title || 'Untitled Story';
    const description = story?.description || story?.content || '';
    const id = story?._id || story?.id || '';
    const url = id ? `https://yourapp.com/story/${id}` : 'https://yourapp.com/';

    await Share.share({
      title,
      message: `${title}\n\n${description}\n\nRead more: ${url}`,
      url, // Some platforms use the url prop if available
    });
  } catch (error) {
    console.error('Error sharing story:', error);
  }
}

export default onShareStory;