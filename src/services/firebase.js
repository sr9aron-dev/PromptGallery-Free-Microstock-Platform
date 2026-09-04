/* ==========================================================================
   Promptgallery — Firebase Client Service
   Google OAuth Authentication & Client Initialization
   ========================================================================== */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  query 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDik8YnNaQRbKVP3W3Zs13JqndJlwZl5uw",
  authDomain: import.meta.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ai-prompt-gallery-2d437.firebaseapp.com",
  projectId: import.meta.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ai-prompt-gallery-2d437",
  storageBucket: import.meta.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ai-prompt-gallery-2d437.firebasestorage.app",
  messagingSenderId: import.meta.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "451666590366",
  appId: import.meta.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:451666590366:web:8ef2bceb9f688d3e2d998f",
  measurementId: import.meta.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-2QGFJY3XFC"
};

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ 
  prompt: 'select_account' 
});

/**
 * Sign in using Google popup account chooser
 * @returns {Promise<{ email: string, displayName: string, photoURL: string, uid: string }>}
 */
export async function signInWithGooglePopup() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  return {
    email: user.email,
    displayName: user.displayName || user.email?.split('@')[0],
    photoURL: user.photoURL,
    uid: user.uid
  };
}

/**
 * Sign out of Firebase
 */
export async function signOutFirebase() {
  try {
    await firebaseSignOut(auth);
  } catch (e) {
    console.warn('Firebase signout error:', e);
  }
}

/**
 * Save storyboard item to Firestore cloud
 * @param {Object} item 
 */
export async function saveStoryboardToCloud(item) {
  if (!item || !item.id) return;
  try {
    const docRef = doc(db, 'storyboards', item.id);
    await setDoc(docRef, {
      ...item,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore saveStoryboardToCloud error (local cache still saved):', err);
  }
}

/**
 * Subscribe to real-time storyboard updates from Firestore cloud
 * @param {Function} onUpdate 
 * @returns {Function} unsubscribe
 */
export function subscribeStoryboards(onUpdate) {
  try {
    const q = query(collection(db, 'storyboards'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const cloudItems = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        onUpdate(cloudItems);
      }
    }, (error) => {
      console.warn('Firestore subscription notice (using local data):', error.message);
    });
    return unsubscribe;
  } catch (e) {
    console.warn('Could not start Firestore listener:', e);
    return () => {};
  }
}
