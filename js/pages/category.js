/* ====================================
   PromptGallery — Category Page
   ==================================== */

// Map slugs back to proper category names
const CATEGORY_MAP = {
  'animals': 'Animals', 'architecture': 'Architecture', 'business': 'Business',
  'food': 'Food', 'nature': 'Nature', 'people': 'People',
  'technology': 'Technology', 'backgrounds': 'Backgrounds', 'objects': 'Objects',
  'travel': 'Travel', 'lifestyle': 'Lifestyle', 'abstract': 'Abstract',
  'education': 'Education', 'health': 'Health', 'sports': 'Sports',
  'industry': 'Industry', 'environment': 'Environment'
};

const ALL_CATEGORIES = Object.values(CATEGORY_MAP);

const CategoryPage = {
  async render(params) {
    const slug = params.slug || '';
    const name = CATEGORY_MAP[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
    const app = document.getElementById('app');

    app.innerHTML = `
      ${Header.render('/categories')}
      <main class="page-content">
        <div class="page-banner">
          <div class="container">
            <h1>${Helpers.escapeHtml(name)}</h1>
            <p>Free high-quality ${name.toLowerCase()} stock assets</p>
          </div>
        </div>
        <div class="container-wide">
          <div class="section">
            <div id="categoryCount" style="margin-bottom:var(--space-md);font-size:var(--font-size-sm);color:var(--color-text-muted);">Loading...</div>
            <div id="categoryResults">
              ${PhotoGrid.render(null, true)}
            </div>
          </div>
        </div>
      </main>
      ${Footer.render()}
    `;
    Header.init();

    // SEO
    SEO.update({
      title: `Free ${name} Stock Photos & Images`,
      description: `Download free ${name.toLowerCase()} stock photos, illustrations and vectors. All ${name.toLowerCase()} assets are 100% free for personal and commercial use.`,
      url: `https://promptgallery.fun/#/category/${slug}`
    });

    // Load photos
    try {
      const photos = await FireDB.getPhotosByCategory(name, 60);
      const countEl = document.getElementById('categoryCount');
      if (countEl) countEl.textContent = `${photos.length} asset${photos.length !== 1 ? 's' : ''} found`;
      document.getElementById('categoryResults').innerHTML = PhotoGrid.render(photos);
      PhotoGrid.initLazy();
    } catch (e) {
      console.warn('Category load error:', e.message);
      document.getElementById('categoryResults').innerHTML = PhotoGrid.render([]);
      const countEl = document.getElementById('categoryCount');
      if (countEl) countEl.textContent = '0 assets found';
    }
  }
};

/* ====================================
   Categories Index Page
   ==================================== */
const CategoriesPage = {
  async render() {
    const app = document.getElementById('app');

    app.innerHTML = `
      ${Header.render('/categories')}
      <main class="page-content">
        <div class="page-banner">
          <div class="container">
            <h1>Categories</h1>
            <p>Browse free stock assets by category</p>
          </div>
        </div>
        <div class="container">
          <div class="section">
            <div class="flex-grid flex-grid-4" id="categoriesGrid">
              ${ALL_CATEGORIES.map(name => CategoryCard.render({ name, slug: Helpers.generateSlug(name) })).join('')}
            </div>
          </div>
        </div>
      </main>
      ${Footer.render()}
    `;
    Header.init();

    SEO.update({
      title: 'All Categories — Free Stock Assets',
      description: 'Browse free stock photos by category. Nature, business, technology, people, and more.',
      url: 'https://promptgallery.fun/#/categories'
    });

    // Load asset counts per category
    this.loadCounts();
  },

  async loadCounts() {
    try {
      for (const name of ALL_CATEGORIES) {
        const photos = await FireDB.getPhotosByCategory(name, 1);
        // Update count on category card if exists
        const slug = Helpers.generateSlug(name);
        const countEl = document.querySelector(`[data-cat-count="${slug}"]`);
        if (countEl && photos.length > 0) {
          countEl.textContent = `${photos.length}+ assets`;
        }
      }
    } catch (e) {
      // silently fail
    }
  }
};
