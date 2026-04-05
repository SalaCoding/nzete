// config/api.js
//const API_URL = process.env.API_URL
//export const baseUrl = API_URL

// constants/api.js
//export const API_URL = process.env.EXPO_PUBLIC_API_URL;


import Constants from 'expo-constants';
export const API_URL = Constants.expoConfig.extra.EXPO_PUBLIC_API_URL;
