// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to 

const firebaseConfig = {
  apiKey: "AIzaSyAcK6NFfoOJHdE41BVmLDbf1vEu-UJ_8u8",
  authDomain: "prepwise-25d78.firebaseapp.com",
  projectId: "prepwise-25d78",
  storageBucket: "prepwise-25d78.firebasestorage.app",
  messagingSenderId: "276049053690",
  appId: "1:276049053690:web:18491e895fbbf8d8b10643",
  measurementId: "G-CG12E3M7CH"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);

