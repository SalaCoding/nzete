export function formatViewCount(count) {
  if (count >= 1000000) {
    // 1,000,000 and above: "1M", "2M", etc.
    return `${Math.floor(count / 1000000)}M`;
  }
  if (count >= 1000) {
    // 1,000 to 999,999: "1k", "10k", "999k", etc.
    return `${Math.floor(count / 1000)}k`;
  }
  return String(count);
}