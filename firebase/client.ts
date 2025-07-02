// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to 

const firebaseConfig = {
  apiKey: "AIzaSyD4IQEFFXtVLna_n8SU0C-vXxX5ZfTFs00",
  authDomain: "prepwise-3a798.firebaseapp.com",
  databaseURL: "https://prepwise-3a798-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "prepwise-3a798",
  storageBucket: "prepwise-3a798.firebasestorage.app",
  messagingSenderId: "655934372342",
  appId: "1:655934372342:web:b1b7f331540a1a8f34efd7",
  measurementId: "G-583M9P403H"
};


// Initialize Firebase
const app = !getApp.length ? initializeApp(firebaseConfig):getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

