
import { initializeApp, getApps } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

// 請在此處貼上您的 Firebase 配置
// 您可以從 Firebase Console -> 專案設定 -> 一般 -> 您的應用程式中找到這段代碼
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Initialize Firebase with fallback for development/demo modes
try {
  // Check if any app is already initialized to avoid duplicate initialization errors
  const existingApps = getApps();
  if (existingApps.length === 0) {
    // Only initialize if the user has replaced the placeholder API key
    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
      app = initializeApp(firebaseConfig);
    }
  } else {
    app = existingApps[0];
  }
  
  if (app) {
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.error("Firebase 初始化失敗:", error);
}

// Export auth and db for use throughout the application
export { auth, db };
