/**
 * Extracts data for a specific feature from an API payload, with robust
 * handling for different data structures and potential nesting issues.
 *
 * @param {object} payload The raw API response data.
 * @param {string} key The key for the feature to extract (e.g., 'comments').
 * @param {*} defaultValue The default value to return if the data is not found.
 * @returns {*} The extracted feature data or the default value.
 */
export function extractFeatureData(payload, key, defaultValue) {
  // Attempt to get the data directly from the payload using the provided key.
  const data = payload?.[key];

  // Logic for handling array-based data structures.
  if (Array.isArray(defaultValue)) {
    // If the data is already a valid array, return it directly.
    if (Array.isArray(data)) return data;

    // Handle a specific case of accidental nesting, e.g., `{ comments: { comments: [...] } }`.
    // This unwraps the nested `comments` array.
    if (typeof data === 'object' && data !== null && Array.isArray(data.comments)) {
      return data.comments;
    }

    // Handle an even deeper accidental nesting at the payload level,
    // e.g., `{ comments: { comments: [...], interactions: [...] } }`
    if (key === 'comments' && typeof payload?.comments === 'object' && Array.isArray(payload?.comments?.comments)) {
      return payload.comments.comments;
    }
    
    // If none of the above matches, return the default array value.
    return defaultValue;
  }

  // Logic for handling object-based data structures.
  if (defaultValue && typeof defaultValue === 'object') {
    // If data is a valid object, return it; otherwise, return the default object.
    return (data && typeof data === 'object') ? data : defaultValue;
  }

  // Fallback: Use the nullish coalescing operator to return data if it exists,
  // otherwise return the default value for primitive types.
  return data ?? defaultValue;
}
