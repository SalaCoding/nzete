import Constants from 'expo-constants';
export const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;

console.log("Connecting to:", API_URL);