// ../selectors/rating.js
export const selectUserRating = (story, userId) => {
  if (!story) return 0;

  if (Array.isArray(story.interactions)) {
    const rating = story.interactions.find(
      i => i.type === 'rating' && String(i.userId) === String(userId)
    );
    if (rating) return rating.score ?? 0;
  }

  if (Array.isArray(story.ratings)) {
    const rating = story.ratings.find(
      r => String(r.userId) === String(userId)
    );
    if (rating) return rating.score ?? 0;
  }

  return 0;
};
