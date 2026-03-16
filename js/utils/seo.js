/* ====================================
   PromptGallery — SEO Utilities
   ==================================== */

const SEO = {
  /**
   * Update page meta tags dynamically
   */
  update({ title, description, url, image, type = 'website' }) {
    // Title: Aim for 50-60 characters
    const suffix = ' — PromptGallery Free High-Quality Stock Assets';
    document.title = title 
      ? `${title}${suffix}`.substring(0, 60) 
      : 'Free High-Quality Stock Photos & Assets — PromptGallery';

    // Meta description
    this._setMeta('description', description || 'Download thousands of free high-quality stock photos, illustrations, and vectors. 100% free for personal and commercial use.');

    // Open Graph
    this._setMeta('og:title', document.title, 'property');
    this._setMeta('og:description', description || '', 'property');
    this._setMeta('og:type', type, 'property');
    this._setMeta('og:url', url || window.location.href, 'property');
    if (image) this._setMeta('og:image', image, 'property');

    // Twitter
    this._setMeta('twitter:card', image ? 'summary_large_image' : 'summary');
    this._setMeta('twitter:title', document.title);
    this._setMeta('twitter:description', description || '');

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url || window.location.href;
  },

  /**
   * Add JSON-LD structured data for a photo
   */
  setPhotoStructuredData(photo) {
    this._removeStructuredData();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ImageObject",
      "name": photo.title,
      "description": photo.description,
      "contentUrl": photo.imageUrl,
      "thumbnailUrl": photo.thumbUrl || photo.imageUrl,
      "width": photo.width,
      "height": photo.height,
      "uploadDate": photo.uploadDate ? new Date(photo.uploadDate.seconds * 1000).toISOString() : undefined,
      "license": "https://creativecommons.org/publicdomain/zero/1.0/",
      "acquireLicensePage": "https://promptgallery.fun/#/license",
      "creator": {
        "@type": "Organization",
        "name": "PromptGallery"
      }
    });
    document.head.appendChild(script);
  },

  /**
   * Add JSON-LD for website
   */
  setWebsiteStructuredData() {
    this._removeStructuredData();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "PromptGallery",
      "url": "https://promptgallery.fun/",
      "description": "Free high-quality stock photos, illustrations, and vectors for everyone.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://promptgallery.fun/#/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    });
    document.head.appendChild(script);
  },

  _setMeta(name, content, attr = 'name') {
    let meta = document.querySelector(`meta[${attr}="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attr, name);
      document.head.appendChild(meta);
    }
    meta.content = content;
  },

  _removeStructuredData() {
    const el = document.getElementById('structured-data');
    if (el) el.remove();
  }
};
