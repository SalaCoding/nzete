// utils/comments-normalize.js

export function normalizeCommentsPayload(data) {
  const interactions = Array.isArray(data.interactions)
    ? data.interactions.map(i => ({
        ...i,
        comments: Array.isArray(i?.comments) ? i.comments : []
      }))
    : [];

  const comments = Array.isArray(data.comments)
    ? data.comments
    : interactions.flatMap(i => i.comments || []);

  return { interactions, comments };
}
