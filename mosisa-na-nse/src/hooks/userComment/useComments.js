import { useMemo } from 'react';
import { useCommentsStore } from '../../library/commentsStore';

/**
 * Custom hook for comments actions.
 * Story "like" actions should go to the story handler, not here.
 * All comment-related actions are secured with argument validation.
 *
 * @param {string} storyId - The story ID.
 */
export function useComments(storyId) {
  const storyState = useCommentsStore((state) => state.byStory[storyId]);
  const {
    load,
    post,
    edit,
    remove,
    likeOne,
    dislikeOne,
    refreshCount,
  } = useCommentsStore();

  // Memoized tree (filters out deleted comments)
  const commentsTree = useMemo(() => {
    if (!storyState) return [];
    const renderNode = (id) => {
      const comment = storyState.byId[id];
      if (!comment || comment.deletedAt) return null;
      const children = (storyState.childrenByParent[id] || [])
        .map(renderNode)
        .filter(Boolean);
      return { ...comment, children };
    };
    return storyState.rootIds.map(renderNode).filter(Boolean);
  }, [storyState]);

  // Memoized flat list (filters out deleted comments)
  const flatComments = useMemo(() => {
    if (!storyState) return [];
    const flatten = (ids) => {
      let all = [];
      for (const id of ids) {
        const comment = storyState.byId[id];
        if (!comment || comment.deletedAt) continue;
        all.push(comment);
        const childIds = storyState.childrenByParent[id] || [];
        all = all.concat(flatten(childIds));
      }
      return all;
    };
    return flatten(storyState.rootIds);
  }, [storyState]);

  // Actions (all with argument validation for security)
  const reload = () => storyId && typeof storyId === 'string' && load(storyId);
  const addRoot = (text) => (
    storyId &&
    typeof storyId === 'string' &&
    typeof text === 'string' &&
    text.trim().length > 0 &&
    post(storyId, text, null)
  );
  const replyTo = (parentId, text) => (
    storyId &&
    typeof storyId === 'string' &&
    parentId &&
    typeof parentId === 'string' &&
    typeof text === 'string' &&
    text.trim().length > 0 &&
    post(storyId, text, parentId)
  );
  const editComment = (commentId, text) => (
    storyId &&
    typeof storyId === 'string' &&
    commentId &&
    typeof commentId === 'string' &&
    typeof text === 'string' &&
    text.trim().length > 0 &&
    edit(storyId, commentId, text)
  );
  const removeComment = (commentId) => (
    storyId &&
    typeof storyId === 'string' &&
    commentId &&
    typeof commentId === 'string' &&
    remove(storyId, commentId)
  );
  const likeComment = (commentId) => (
    storyId &&
    typeof storyId === 'string' &&
    commentId &&
    typeof commentId === 'string' &&
    likeOne(storyId, commentId)
  );
  const dislikeComment = (commentId) => (
    storyId &&
    typeof storyId === 'string' &&
    commentId &&
    typeof commentId === 'string' &&
    dislikeOne(storyId, commentId)
  );
  const refreshCommentCount = () => storyId && typeof storyId === 'string' && refreshCount(storyId);

  return {
    comments: flatComments,
    commentsTree,
    byId: storyState?.byId || {},
    loading: storyState?.loading || false,
    posting: storyState?.posting || false,
    error: storyState?.error || null,
    count: storyState?.count || 0,
    reload,
    addRoot,
    replyTo,
    edit: editComment,
    remove: removeComment,
    likeOne: likeComment,
    dislikeOne: dislikeComment,
    refreshCount: refreshCommentCount,
  };
}