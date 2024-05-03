// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhlvbHVwBCKEqL-TmlntoJdjhchfPDQ6g",
  authDomain: "dating-app-a15fa.firebaseapp.com",
  projectId: "dating-app-a15fa",
  storageBucket: "dating-app-a15fa.appspot.com",
  messagingSenderId: "928915178313",
  appId: "1:928915178313:web:7e53e8707f9966b8909098",
  measurementId: "G-PHX7KRD3BC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage();
export const db = getFirestore();