//import Constants from 'expo-constants';
// src/utils/constants.ts
export const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://nzete.onrender.com";
//export const FRONTEND_URL = process.env.EXPO_PUBLIC_FRONTEND_URL || "https://nzete.onrender.com/reset-password";

console.log("Connecting to:", API_URL);