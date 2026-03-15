/* ====================================
   PromptGallery — Category Page
   ==================================== */

const CategoryPage = {
  async render(params) {
    const slug = params.slug || '';
    const name = slug.charAt(0).toUpperCase() + slug.slice(1);
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
      document.getElementById('categoryResults').innerHTML = PhotoGrid.render(photos);
      PhotoGrid.initLazy();
    } catch (e) {
      console.warn('Category load error:', e.message);
      document.getElementById('categoryResults').innerHTML = PhotoGrid.render([]);
    }
  }
};

/* ====================================
   Categories Index Page
   ==================================== */
const CategoriesPage = {
  render() {
    const categories = [
      'Animals', 'Architecture', 'Business', 'Food', 'Nature', 'People',
      'Technology', 'Backgrounds', 'Objects', 'Travel', 'Lifestyle', 'Abstract',
      'Education', 'Health', 'Sports', 'Industry', 'Environment'
    ];

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
            <div class="flex-grid flex-grid-4">
              ${categories.map(name => CategoryCard.render({ name, slug: Helpers.generateSlug(name) })).join('')}
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
  }
};
