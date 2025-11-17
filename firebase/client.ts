import { initializeApp, getApp, getApps } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBIYm7wgv6cyDp9PJ-hwmObbdcWlpWCaY8",
  authDomain: "prepedge-bd5b7.firebaseapp.com",
  projectId: "prepedge-bd5b7",
  storageBucket: "prepedge-bd5b7.firebasestorage.app",
  messagingSenderId: "508386085948",
  appId: "1:508386085948:web:28e87d59af270fc0d3c739",
  measurementId: "G-ENVV3YS0K1"
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
