import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

function getAdminDb() {
  if (getApps().length > 0) {
    return getFirestore(getApps()[0]);
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase Admin service account environment variables');
  }

  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  privateKey = privateKey.replace(/\\n/g, '\n');

  const app = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey
    })
  });

  return getFirestore(app);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!data.title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const db = getAdminDb();

    const docData = {
      title: data.title.trim(),
      description: data.description ? data.description.trim() : '',
      prompt: data.prompt ? data.prompt.trim() : 'No prompt provided.',
      imageUrl: data.mediaUrl || data.thumbnail || '',
      thumbnailUrl: data.thumbnail || data.mediaUrl || '',
      mediaUrl: data.mediaUrl || data.thumbnail || '',
      mediaItems: Array.isArray(data.mediaItems) ? data.mediaItems : [],
      aspectRatio: data.aspectRatio || '16:9',
      category: data.category || 'Cinematic',
      tags: Array.isArray(data.tags) ? data.tags : [data.category || 'Cinematic'],
      author: 'sr7aron@gmail.com',
      authorRole: 'admin',
      userName: 'Aron (Admin)',
      userId: 'OhQw5f3SVaR9o1lVRkB6gAGe4cO2',
      createdAt: FieldValue.serverTimestamp(),
      createdAtMs: Date.now(),
      isNew: true,
      likes: 0
    };

    const docRef = await db.collection('photos').add(docData);

    return res.status(200).json({
      success: true,
      id: docRef.id,
      item: {
        ...docData,
        id: docRef.id,
        createdAt: 'Just now'
      }
    });
  } catch (error) {
    console.error('API /api/publish error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
