import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public;
  const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const db = getFirestore(app);

  return {
    provide: {
      firebase: {
        auth,
        db,
        signInWithEmailAndPassword,
        createUserWithEmailAndPassword,
        signOut,
        onAuthStateChanged,
        updateProfile,
        collection,
        getDoc,
        getDocs,
        addDoc,
        doc,
        setDoc,
        deleteDoc,
        updateDoc,
        orderBy,
        query,
        serverTimestamp,
        where,
      },
    },
  };
});
