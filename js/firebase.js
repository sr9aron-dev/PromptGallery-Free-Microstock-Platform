/* ====================================
   PromptGallery — Firebase Configuration
   ==================================== */

const firebaseConfig = {
  apiKey: "AIzaSyDik8YnNaQRbKVP3W3Zs13JqndJlwZl5uw",
  authDomain: "ai-prompt-gallery-2d437.firebaseapp.com",
  projectId: "ai-prompt-gallery-2d437",
  storageBucket: "ai-prompt-gallery-2d437.firebasestorage.app",
  messagingSenderId: "451666590366",
  appId: "1:451666590366:web:8ef2bceb9f688d3e2d998f",
  measurementId: "G-2QGFJY3XFC"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/sr9aron-dev/promptgallery-images@main/images';

/* ── Firestore Helpers ── */
const FireDB = {
  // Get paginated photos
  async getPhotos({ limit = 30, startAfter = null, orderBy = 'uploadDate', direction = 'desc' } = {}) {
    let query = db.collection('photos')
      .orderBy(orderBy, direction)
      .limit(limit);
    if (startAfter) query = query.startAfter(startAfter);
    const snap = await query.get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data(), _doc: doc }));
  },

  // Get single photo by slug
  async getPhotoBySlug(slug) {
    const snap = await db.collection('photos').where('slug', '==', slug).limit(1).get();
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  },

  // Search photos by keywords array
  async searchPhotos(query, limit = 30) {
    const q = query.toLowerCase().trim();
    const snap = await db.collection('photos')
      .where('keywords', 'array-contains', q)
      .limit(limit)
      .get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get photos by category
  async getPhotosByCategory(category, limit = 30) {
    const snap = await db.collection('photos')
      .where('category', '==', category)
      .orderBy('uploadDate', 'desc')
      .limit(limit)
      .get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get photos by tag
  async getPhotosByTag(tag, limit = 30) {
    const snap = await db.collection('photos')
      .where('keywords', 'array-contains', tag.toLowerCase())
      .limit(limit)
      .get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get categories
  async getCategories() {
    const snap = await db.collection('categories').orderBy('name').get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get popular tags
  async getPopularTags(limit = 20) {
    const snap = await db.collection('tags')
      .orderBy('count', 'desc')
      .limit(limit)
      .get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Increment view count
  async incrementViews(photoId) {
    await db.collection('photos').doc(photoId).update({
      views: firebase.firestore.FieldValue.increment(1)
    });
  },

  // Increment download count
  async incrementDownloads(photoId) {
    await db.collection('photos').doc(photoId).update({
      downloads: firebase.firestore.FieldValue.increment(1)
    });
  },

  // Add photo (admin)
  async addPhoto(data) {
    const docRef = await db.collection('photos').add({
      ...data,
      uploadDate: firebase.firestore.FieldValue.serverTimestamp(),
      views: 0,
      downloads: 0
    });
    // Update tag counts
    if (data.keywords && data.keywords.length) {
      for (const kw of data.keywords) {
        const tagRef = db.collection('tags').doc(kw);
        await tagRef.set({ tag: kw, count: firebase.firestore.FieldValue.increment(1) }, { merge: true });
      }
    }
    return docRef.id;
  },

  // Update photo (admin)
  async updatePhoto(id, data) {
    await db.collection('photos').doc(id).update(data);
  },

  // Delete photo (admin)
  async deletePhoto(id) {
    await db.collection('photos').doc(id).delete();
  },

  // Get total counts for dashboard stats
  async getStats() {
    const photosSnap = await db.collection('photos').get();
    let totalViews = 0, totalDownloads = 0;
    photosSnap.docs.forEach(doc => {
      const d = doc.data();
      totalViews += d.views || 0;
      totalDownloads += d.downloads || 0;
    });
    return {
      totalPhotos: photosSnap.size,
      totalViews,
      totalDownloads
    };
  },

  // Auth
  async login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  },

  logout() {
    return auth.signOut();
  },

  onAuthChange(callback) {
    return auth.onAuthStateChanged(callback);
  },

  isLoggedIn() {
    return !!auth.currentUser;
  }
};
