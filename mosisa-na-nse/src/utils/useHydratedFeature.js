// hooks/useHydratedFeature.js
import { useMemo } from 'react';
import { extractFeatureData } from './extractFeatureData';

export function useHydratedFeature(payload, key, defaultValue) {
  // One job: normalize the value from payload for consumers
  return useMemo(() => extractFeatureData(payload, key, defaultValue), [payload, key, defaultValue]);
}
