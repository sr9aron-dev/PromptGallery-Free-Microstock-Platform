/* ====================================
   PromptGallery — Homepage
   ==================================== */

const HomePage = {
  async render() {
    const app = document.getElementById('app');
    const categories = [
      'Animals', 'Architecture', 'Business', 'Food', 'Nature', 'People',
      'Technology', 'Backgrounds', 'Objects', 'Travel', 'Lifestyle', 'Abstract',
      'Education', 'Health', 'Sports', 'Industry'
    ];

    app.innerHTML = `
      ${Header.render('/')}
      <main class="page-content">
        <!-- Hero Section -->
        <section class="hero">
          <div class="hero-content animate-fade-in">
            <h1>Free Stock Assets</h1>
            <p>Thousands of high-quality AI-generated photos, illustrations, and vectors — 100% free for personal & commercial use.</p>
            ${SearchBar.render()}
            <div class="hero-stats">
              <div class="hero-stat">
                <div class="hero-stat-value" id="statPhotos">—</div>
                <div class="hero-stat-label">Free Assets</div>
              </div>
              <div class="hero-stat">
                <div class="hero-stat-value" id="statDownloads">—</div>
                <div class="hero-stat-label">Downloads</div>
              </div>
              <div class="hero-stat">
                <div class="hero-stat-value" id="statCategories">${categories.length}</div>
                <div class="hero-stat-label">Categories</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Latest Assets -->
        <section class="section">
          <div class="container-wide">
            <div class="section-header">
              <h2 class="section-title">Latest Assets</h2>
              <a href="#/search?q=latest" class="section-link">
                View all ${Helpers.icon('arrow-right', 16)}
              </a>
            </div>
            <div id="latestGrid">
              ${PhotoGrid.render(null, true)}
            </div>
          </div>
        </section>

        <!-- Categories -->
        <section class="section" style="background:var(--color-bg-secondary)">
          <div class="container">
            <div class="section-header">
              <h2 class="section-title">Browse Categories</h2>
            </div>
            <div class="flex-grid flex-grid-4">
              ${categories.slice(0, 8).map(name => CategoryCard.render({ name, slug: Helpers.generateSlug(name) })).join('')}
            </div>
          </div>
        </section>

        <!-- Popular Assets -->
        <section class="section">
          <div class="container-wide">
            <div class="section-header">
              <h2 class="section-title">Popular Assets</h2>
              <a href="#/search?q=popular" class="section-link">
                View all ${Helpers.icon('arrow-right', 16)}
              </a>
            </div>
            <div id="popularGrid">
              ${PhotoGrid.render(null, true)}
            </div>
          </div>
        </section>

        <!-- All Categories Grid -->
        <section class="section" style="background:var(--color-bg-secondary)">
          <div class="container">
            <div class="section-header">
              <h2 class="section-title">All Categories</h2>
            </div>
            <div class="flex-grid flex-grid-4">
              ${categories.map(name => CategoryCard.render({ name, slug: Helpers.generateSlug(name) })).join('')}
            </div>
          </div>
        </section>
      </main>
      ${Footer.render()}
    `;

    // Initialize
    Header.init();
    SearchBar.init();

    // SEO
    SEO.update({
      title: null,
      description: 'Download thousands of free high-quality stock photos, illustrations, and vectors. 100% free for personal and commercial use.',
      url: 'https://promptgallery.fun/'
    });
    SEO.setWebsiteStructuredData();

    // Load data
    this.loadData();
  },

  async loadData() {
    try {
      // Load latest photos
      const latest = await FireDB.getPhotos({ limit: 18, orderBy: 'uploadDate' });
      document.getElementById('latestGrid').innerHTML = PhotoGrid.render(latest);
      PhotoGrid.initLazy();

      // Load popular photos (by views)
      const popular = await FireDB.getPhotos({ limit: 18, orderBy: 'views' });
      document.getElementById('popularGrid').innerHTML = PhotoGrid.render(popular);
      PhotoGrid.initLazy();

      // Load stats
      const stats = await FireDB.getStats();
      const statPhotos = document.getElementById('statPhotos');
      const statDownloads = document.getElementById('statDownloads');
      if (statPhotos) statPhotos.textContent = Helpers.formatNumber(stats.totalPhotos);
      if (statDownloads) statDownloads.textContent = Helpers.formatNumber(stats.totalDownloads);
    } catch (e) {
      console.warn('Data load skipped (Firebase not configured):', e.message);
      // Show empty state if Firebase is not configured
      document.getElementById('latestGrid').innerHTML = PhotoGrid.render([]);
      document.getElementById('popularGrid').innerHTML = PhotoGrid.render([]);
    }
  }
};
