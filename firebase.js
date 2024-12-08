// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEOVKVarHdtViTNTQTSu8-ot1HJ1bt_is",
  authDomain: "event-planning-website-7f3dc.firebaseapp.com",
  databaseURL: "https://event-planning-website-7f3dc-default-rtdb.firebaseio.com",
  projectId: "event-planning-website-7f3dc",
  storageBucket: "event-planning-website-7f3dc.firebasestorage.app",
  messagingSenderId: "812120530827",
  appId: "1:812120530827:web:d0ff96ad4dba4c649f998e",
  measurementId: "G-YR6M0S6D9Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export { firestore, auth, analytics, googleProvider };