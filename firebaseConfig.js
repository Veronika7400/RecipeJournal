
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyASx1r96xL2rjKj1x-qryTQOdQEWYBkwi0",
  authDomain: "recipejournal-89fb1.firebaseapp.com",
  projectId: "recipejournal-89fb1",
  storageBucket: "recipejournal-89fb1.appspot.com",
  messagingSenderId: "510373938442",
  appId: "1:510373938442:web:c697d248ec2cc3b58426f3"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);

export const storage = getStorage(app, 'gs://recipejournal-89fb1.firebasestorage.app');
