
import { initializeApp, getApps } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// 安全獲取環境變數
const firebaseConfigStr = typeof process !== 'undefined' ? process.env.FIREBASE_CONFIG : undefined;

if (firebaseConfigStr && firebaseConfigStr !== "undefined") {
  try {
    const config = JSON.parse(firebaseConfigStr);
    if (getApps().length === 0) {
      app = initializeApp(config);
    } else {
      app = getApps()[0];
    }
    
    if (app) {
      auth = getAuth(app);
      db = getFirestore(app);
    }
  } catch (error) {
    console.error("Firebase 配置解析失敗:", error);
  }
} else {
  console.warn("未偵測到 FIREBASE_CONFIG 環境變數，系統將進入離線/展示模式。");
}

export { auth, db };
