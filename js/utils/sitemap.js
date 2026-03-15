/* ====================================
   PromptGallery — Dynamic Sitemap Generator
   Generates sitemap.xml from Firestore data
   ==================================== */

const SitemapGenerator = {
  BASE_URL: 'https://promptgallery.fun',

  async generate() {
    const urls = [];
    const now = new Date().toISOString().split('T')[0];

    // Static pages
    const staticPages = [
      { loc: '/', priority: '1.0', changefreq: 'daily' },
      { loc: '/#/categories', priority: '0.8', changefreq: 'weekly' },
      { loc: '/#/about', priority: '0.5', changefreq: 'monthly' },
      { loc: '/#/faq', priority: '0.5', changefreq: 'monthly' },
      { loc: '/#/license', priority: '0.5', changefreq: 'monthly' },
      { loc: '/#/terms', priority: '0.3', changefreq: 'yearly' },
      { loc: '/#/privacy', priority: '0.3', changefreq: 'yearly' },
      { loc: '/#/cookies', priority: '0.3', changefreq: 'yearly' },
    ];

    for (const page of staticPages) {
      urls.push(this.urlEntry(page.loc, now, page.changefreq, page.priority));
    }

    // Category pages
    const categories = [
      'Animals', 'Architecture', 'Business', 'Food', 'Nature', 'People',
      'Technology', 'Backgrounds', 'Objects', 'Travel', 'Lifestyle', 'Abstract',
      'Education', 'Health', 'Sports', 'Industry', 'Environment'
    ];
    for (const cat of categories) {
      const slug = cat.toLowerCase();
      urls.push(this.urlEntry(`/#/category/${slug}`, now, 'weekly', '0.7'));
    }

    // Photo pages from Firestore
    try {
      const photos = await FireDB.getPhotos({ limit: 500, orderBy: 'uploadDate' });
      for (const photo of photos) {
        const date = photo.uploadDate?.toDate
          ? photo.uploadDate.toDate().toISOString().split('T')[0]
          : now;
        urls.push(this.urlEntry(`/#/photo/${photo.slug}`, date, 'monthly', '0.6'));
      }
    } catch (e) {
      console.warn('Sitemap: could not load photos', e.message);
    }

    // Tag pages
    try {
      const tags = await FireDB.getPopularTags(50);
      for (const tag of tags) {
        urls.push(this.urlEntry(`/#/tag/${encodeURIComponent(tag.tag)}`, now, 'weekly', '0.5'));
      }
    } catch (e) {
      console.warn('Sitemap: could not load tags', e.message);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    return xml;
  },

  urlEntry(path, lastmod, changefreq, priority) {
    return `  <url>
    <loc>${this.BASE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  },

  /**
   * Download sitemap as XML file
   */
  async download() {
    Helpers.toast('Generating sitemap...');
    const xml = await this.generate();
    const blob = new Blob([xml], { type: 'application/xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    Helpers.toast('Sitemap downloaded!');
  }
};
