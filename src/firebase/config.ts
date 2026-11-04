import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
    apiKey: "AIzaSyAUqqFAS9cKK0Cp3celFc8tTxPnn9PiutE",
    authDomain: "next-ffca0.firebaseapp.com",
    projectId: "next-ffca0",
    storageBucket: "next-ffca0.firebasestorage.app",
    messagingSenderId: "780721368727",
    appId: "1:780721368727:web:ee41bcbd14d740de0843d2",
    measurementId: "G-R6X2EMV9DX"
};

// Initialize Firebase safely for SSR
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const initAnalytics = async () => {
    if (typeof window !== "undefined" && await isSupported()) {
        return getAnalytics(app);
    }
    return null;
};