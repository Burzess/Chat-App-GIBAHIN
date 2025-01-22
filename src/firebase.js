import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6hylRfac1QdIJKqsWPzQ_a7OoHdMSu_o",
  authDomain: "chat-cfd4f.firebaseapp.com",
  projectId: "chat-cfd4f",
  storageBucket: "chat-cfd4f.firebasestorage.app",
  messagingSenderId: "838225156497",
  appId: "1:838225156497:web:437b1a043f0ab954b7e230",
  measurementId: "G-WMBGPXZNSH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
