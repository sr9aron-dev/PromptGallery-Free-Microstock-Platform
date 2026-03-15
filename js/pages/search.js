/* ====================================
   PromptGallery — Search Results Page
   ==================================== */

const SearchPage = {
  async render(params) {
    const query = params.q || '';
    const app = document.getElementById('app');

    app.innerHTML = `
      ${Header.render()}
      <main class="page-content">
        <div class="search-page-header">
          <div class="container">
            <h1>Search Results</h1>
            <p>${query ? `Showing results for "<strong>${Helpers.escapeHtml(query)}</strong>"` : 'Browse all free stock assets'}</p>
          </div>
        </div>

        <div class="container-wide">
          <div class="search-filters">
            <div class="filter-tabs">
              <span class="filter-tab active" data-sort="relevant">Relevant</span>
              <span class="filter-tab" data-sort="latest">Latest</span>
              <span class="filter-tab" data-sort="popular">Popular</span>
            </div>
            <span id="resultCount" style="font-size:var(--font-size-sm);color:var(--color-text-muted);">Loading...</span>
          </div>
          <div id="searchResults">
            ${PhotoGrid.render(null, true)}
          </div>
        </div>
      </main>
      ${Footer.render()}
    `;

    Header.init();
    
    // Pre-fill header search
    const headerSearch = document.getElementById('headerSearchInput');
    if (headerSearch && query) headerSearch.value = query;

    // SEO
    SEO.update({
      title: query ? `"${query}" Free Stock Assets` : 'Search Free Stock Assets',
      description: query 
        ? `Download free ${query} stock photos, illustrations and vectors. All assets are free for personal and commercial use.`
        : 'Search thousands of free stock photos, illustrations, and vectors.',
      url: `https://promptgallery.fun/#/search?q=${encodeURIComponent(query)}`
    });

    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', async () => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const sort = tab.dataset.sort;
        await this.loadResults(query, sort);
      });
    });

    // Load results
    await this.loadResults(query, 'relevant');
  },

  async loadResults(query, sort = 'relevant') {
    const resultsEl = document.getElementById('searchResults');
    const countEl = document.getElementById('resultCount');
    
    resultsEl.innerHTML = PhotoGrid.render(null, true);

    try {
      let photos = [];
      
      if (query) {
        photos = await FireDB.searchPhotos(query, 60);
      } else {
        const orderBy = sort === 'popular' ? 'views' : 'uploadDate';
        photos = await FireDB.getPhotos({ limit: 60, orderBy });
      }

      // Client-side sort
      if (sort === 'latest') {
        photos.sort((a, b) => {
          const da = a.uploadDate?.seconds || 0;
          const db = b.uploadDate?.seconds || 0;
          return db - da;
        });
      } else if (sort === 'popular') {
        photos.sort((a, b) => (b.views || 0) - (a.views || 0));
      }

      countEl.textContent = `${photos.length} result${photos.length !== 1 ? 's' : ''} found`;
      resultsEl.innerHTML = PhotoGrid.render(photos);
      PhotoGrid.initLazy();
    } catch (e) {
      console.warn('Search error:', e.message);
      countEl.textContent = '0 results found';
      resultsEl.innerHTML = PhotoGrid.render([]);
    }
  }
};
