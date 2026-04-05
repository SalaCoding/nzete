// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqBPjLXdHrVSuFKyGTSdI8aEjGE2tFY9A",
  authDomain: "nzete-a6dac.firebaseapp.com",
  projectId: "nzete-a6dac",
  storageBucket: "nzete-a6dac.firebasestorage.app",
  messagingSenderId: "738262913454",
  appId: "1:738262913454:web:ff5ed2b43ff4bb7777b83f",
  measurementId: "G-DNYKVGN30K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };