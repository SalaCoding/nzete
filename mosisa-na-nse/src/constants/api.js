import Constants from 'expo-constants';
export const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || "https://nzete.onrender.com";
export const FRONTEND_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_FRONTEND_URL || "https://nzete.onrender.com/reset-password";
//const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

console.log("Connecting to:", API_URL);