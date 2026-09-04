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
 * Map Firestore doc to our UI storyboard item
 */
export function mapFirestoreDocToStoryboard(docId, data) {
  const thumbnail = data.imageUrl || data.thumbnailUrl || data.thumbnail || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=80';
  const mediaUrl = data.mediaUrl || data.imageUrl || thumbnail;
  
  let aspectRatio = data.aspectRatio || '16:9';
  if (data.prompt) {
    const match = data.prompt.match(/--ar\s+(\d+:\d+)/i);
    if (match) aspectRatio = match[1];
  }

  const tags = Array.isArray(data.tags) ? data.tags : [];
  const category = data.category || (tags.length > 0 ? tags[0].charAt(0).toUpperCase() + tags[0].slice(1) : 'Cinematic');

  let mediaItems = Array.isArray(data.mediaItems) && data.mediaItems.length > 0
    ? data.mediaItems
    : [{ id: `${docId}-m1`, url: mediaUrl, thumbnailUrl: thumbnail, type: data.type || 'image', caption: data.title || 'Master Shot' }];

  let createdAtFormatted = 'Recently';
  if (data.createdAt) {
    if (typeof data.createdAt === 'string') {
      createdAtFormatted = data.createdAt;
    } else if (data.createdAt._seconds) {
      createdAtFormatted = new Date(data.createdAt._seconds * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    } else if (data.createdAt.seconds) {
      createdAtFormatted = new Date(data.createdAt.seconds * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }

  return {
    id: docId,
    title: data.title || 'Untitled Storyboard',
    description: data.description || data.notes || '',
    type: data.type || (mediaUrl.endsWith('.mp4') ? 'video' : 'image'),
    thumbnail,
    mediaUrl,
    mediaItems,
    prompt: data.prompt || 'No prompt provided.',
    category,
    aspectRatio,
    tags,
    author: data.author || (data.userName ? `${data.userName} (Admin)` : 'sr7aron@gmail.com'),
    authorRole: 'admin',
    createdAt: createdAtFormatted,
    parameters: data.parameters || { model: 'Frontier AI' },
    isNew: data.isNew || false
  };
}

/**
 * Fetch real storyboards from Cloud API
 */
export async function fetchCloudStoryboards(limit = 60) {
  try {
    const res = await fetch(`/api/storyboards?limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    if (json.items && Array.isArray(json.items)) {
      return json.items.map(item => mapFirestoreDocToStoryboard(item.id, item));
    }
  } catch (err) {
    console.warn('fetchCloudStoryboards notice (fallback to direct/cache):', err.message);
  }
  return null;
}

/**
 * Save storyboard item to Firestore cloud via backend API
 * @param {Object} item 
 */
export async function saveStoryboardToCloud(item) {
  if (!item) return null;
  try {
    const res = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json.item || item;
  } catch (err) {
    console.warn('saveStoryboardToCloud notice (local cache saved):', err.message);
    return item;
  }
}

/**
 * Subscribe to real-time storyboard updates from Firestore cloud collection 'photos'
 * @param {Function} onUpdate 
 * @returns {Function} unsubscribe
 */
export function subscribeStoryboards(onUpdate) {
  try {
    const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const cloudItems = snapshot.docs.map(d => mapFirestoreDocToStoryboard(d.id, d.data()));
        onUpdate(cloudItems);
      }
    }, (error) => {
      console.warn('Firestore subscription notice (using API fallback):', error.message);
    });
    return unsubscribe;
  } catch (e) {
    console.warn('Could not start Firestore listener:', e);
    return () => {};
  }
}

