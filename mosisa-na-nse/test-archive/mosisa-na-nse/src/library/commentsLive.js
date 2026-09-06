import { useEffect } from 'react';
import { useCommentsStore } from './commentsStore';
import { socket } from './socket';

// Update either a specific comment or story-level fields
const updateNestedState = (id, storyId, changes) =>
  useCommentsStore.setState((prev) => {
    const story = prev.byStory[storyId];
    if (!story) return prev;

    if (id === null) {
      // Story-level update
      return {
        byStory: {
          ...prev.byStory,
          [storyId]: {
            ...story,
            ...changes,
          },
        },
      };
    }

    if (!story.byId[id]) return prev;

    return {
      byStory: {
        ...prev.byStory,
        [storyId]: {
          ...story,
          byId: {
            ...story.byId,
            [id]: {
              ...story.byId[id],
              ...changes,
            },
          },
        },
      },
    };
  });

export function useLiveComments(storyId) {
  const { upsertOne, removeOne } = useCommentsStore();

  useEffect(() => {
    if (!storyId) return;
    socket.emit('join', `story:${storyId}`);
    return () => {
      socket.emit('leave', `story:${storyId}`);
    };
  }, [storyId]);

  useEffect(() => {
    if (!storyId) return;

    const onNew = (comment) => upsertOne(storyId, comment);
    const onEdit = (comment) => upsertOne(storyId, comment);
    const onDelete = ({ id }) => removeOne(storyId, id);
    const onCount = ({ total }) => updateNestedState(null, storyId, { count: total });

    const onLike = ({ commentId, likesCount, likedByUser }) =>
      updateNestedState(commentId, storyId, { likesCount, likedByUser });

    const onDislike = ({ commentId, dislikesCount, dislikedByUser }) =>
      updateNestedState(commentId, storyId, { dislikesCount, dislikedByUser });

    socket.on('comment:new', onNew);
    socket.on('comment:edit', onEdit);
    socket.on('comment:delete', onDelete);
    socket.on('comment:count', onCount);
    socket.on('comment:like', onLike);
    socket.on('comment:dislike', onDislike);

    useCommentsStore.getState().load(storyId, {
      since: useCommentsStore.getState().byStory[storyId]?.lastSyncAt,
    });

    return () => {
      socket.off('comment:new', onNew);
      socket.off('comment:edit', onEdit);
      socket.off('comment:delete', onDelete);
      socket.off('comment:count', onCount);
      socket.off('comment:like', onLike);
      socket.off('comment:dislike', onDislike);
    };
  }, [storyId, upsertOne, removeOne]);
}
