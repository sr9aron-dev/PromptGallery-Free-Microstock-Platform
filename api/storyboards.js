import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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
  try {
    const db = getAdminDb();
    const limitNum = Math.min(100, parseInt(req.query?.limit || '60', 10));

    const snap = await db.collection('photos')
      .orderBy('createdAt', 'desc')
      .limit(limitNum)
      .get();

    const items = snap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?._seconds ? new Date(data.createdAt._seconds * 1000).toISOString() : (data.createdAt || null)
      };
    });

    return res.status(200).json({ success: true, items });
  } catch (error) {
    console.error('API /api/storyboards error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
