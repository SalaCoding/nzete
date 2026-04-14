import { useCommentsStore } from '../../library/commentsStore';

export const useCommentPosting = (storyId) => {
  return useCommentsStore(
    (state) => state.byStory[storyId]?.posting || false
  );
};
