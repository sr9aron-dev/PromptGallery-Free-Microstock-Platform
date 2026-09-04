import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import fs from 'fs';

function getAdminDb() {
  if (getApps().length > 0) {
    return getFirestore(getApps()[0]);
  }

  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const getEnv = (key) => {
      const match = envContent.match(new RegExp('^' + key + '=(.*)$', 'm'));
      if (!match) return '';
      let val = match[1].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      return val.replace(/\\n/g, '\n');
    };

    const projectId = getEnv('FIREBASE_PROJECT_ID');
    const clientEmail = getEnv('FIREBASE_CLIENT_EMAIL');
    const privateKey = getEnv('FIREBASE_PRIVATE_KEY');

    if (!projectId || !clientEmail || !privateKey) return null;

    const app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey
      })
    });
    return getFirestore(app);
  } catch (e) {
    console.warn('Could not initialize Firebase Admin in Vite:', e);
    return null;
  }
}

function firebaseApiPlugin() {
  return {
    name: 'firebase-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/publish' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const db = getAdminDb();
              if (!db) throw new Error('Firebase Admin database not initialized');
              const data = JSON.parse(body);

              const docData = {
                title: data.title ? data.title.trim() : 'Untitled',
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
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, id: docRef.id, item: { ...docData, id: docRef.id, createdAt: 'Just now' } }));
            } catch (err) {
              console.error('Server error on /api/publish:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (req.url?.startsWith('/api/storyboards') && req.method === 'GET') {
          try {
            const db = getAdminDb();
            if (!db) throw new Error('Firebase Admin database not initialized');
            const snap = await db.collection('photos')
              .orderBy('createdAt', 'desc')
              .limit(100)
              .get();

            const items = snap.docs.map(doc => {
              const d = doc.data();
              return {
                id: doc.id,
                ...d,
                createdAt: d.createdAt?._seconds ? new Date(d.createdAt._seconds * 1000).toISOString() : (d.createdAt || null)
              };
            });

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, items }));
          } catch (err) {
            console.error('Server error on /api/storyboards:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), firebaseApiPlugin()],
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  server: {
    port: 3000,
    open: false,
  }
});
