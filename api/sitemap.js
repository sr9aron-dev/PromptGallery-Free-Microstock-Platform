const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

const db = admin.firestore();
const BASE_URL = 'https://promptgallery.fun';

module.exports = async (req, res) => {
  const urls = [];
  const now = new Date().toISOString().split('T')[0];

  // 1. Static Pages
  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/categories', priority: '0.8', changefreq: 'weekly' },
    { loc: '/about', priority: '0.5', changefreq: 'monthly' },
    { loc: '/faq', priority: '0.5', changefreq: 'monthly' },
    { loc: '/license', priority: '0.5', changefreq: 'monthly' },
    { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
    { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { loc: '/cookies', priority: '0.3', changefreq: 'yearly' },
  ];

  for (const page of staticPages) {
    urls.push(urlEntry(page.loc, now, page.changefreq, page.priority));
  }

  // 2. Category Pages
  try {
    const categories = [
      'Animals', 'Architecture', 'Business', 'Food', 'Nature', 'People',
      'Technology', 'Backgrounds', 'Objects', 'Travel', 'Lifestyle', 'Abstract',
      'Education', 'Health', 'Sports', 'Industry', 'Environment'
    ];
    for (const cat of categories) {
      const slug = cat.toLowerCase();
      urls.push(urlEntry(`/category/${slug}`, now, 'weekly', '0.7'));
    }
  } catch (e) {
    console.error('Sitemap Error (Categories):', e);
  }

  // 3. Photo Pages from Firestore
  try {
    const photosSnap = await db.collection('photos').orderBy('uploadDate', 'desc').limit(1000).get();
    photosSnap.forEach(doc => {
      const photo = doc.data();
      const date = photo.uploadDate ? photo.uploadDate.toDate().toISOString().split('T')[0] : now;
      urls.push(urlEntry(`/photo/${photo.slug}`, date, 'monthly', '0.6'));
    });
  } catch (e) {
    console.error('Sitemap Error (Photos):', e);
  }

  // 4. Tag Pages from Firestore
  try {
    const tagsSnap = await db.collection('tags').orderBy('count', 'desc').limit(100).get();
    tagsSnap.forEach(doc => {
      const tag = doc.data();
      if (tag.tag) {
        urls.push(urlEntry(`/tag/${encodeURIComponent(tag.tag)}`, now, 'weekly', '0.5'));
      }
    });
  } catch (e) {
    console.error('Sitemap Error (Tags):', e);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate'); // Cache for 24 hours
  res.status(200).send(xml);
};

function urlEntry(path, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}
