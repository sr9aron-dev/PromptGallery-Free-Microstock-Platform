/* ====================================
   PromptGallery — Photo Detail Page
   ==================================== */

const PhotoPage = {
  async render(params) {
    const app = document.getElementById('app');
    const slug = params.slug;

    // Loading state
    app.innerHTML = `
      ${Header.render()}
      <main class="page-content">
        <div class="page-loading"><div class="spinner"></div></div>
      </main>
    `;
    Header.init();

    try {
      const photo = await FireDB.getPhotoBySlug(slug);
      if (!photo) {
        app.innerHTML = `
          ${Header.render()}
          <main class="page-content">
            <div class="empty-state">
              <div class="empty-state-icon">${Helpers.icon('image', 64)}</div>
              <h3>Asset not found</h3>
              <p>The asset you're looking for doesn't exist or has been removed.</p>
              <a href="#/" class="btn btn-primary mt-lg" style="margin-top:var(--space-lg);display:inline-flex;">Back to Home</a>
            </div>
          </main>
          ${Footer.render()}
        `;
        Header.init();
        return;
      }

      // Track view
      FireDB.incrementViews(photo.id);

      // SEO
      SEO.update({
        title: photo.title,
        description: Helpers.truncateText(photo.description, 160),
        image: photo.imageUrl,
        url: `https://promptgallery.fun/#/photo/${slug}`,
        type: 'article'
      });
      SEO.setPhotoStructuredData(photo);

      const keywords = photo.keywords || [];
      const relatedPhotos = keywords.length > 0 
        ? await FireDB.getPhotosByTag(keywords[0], 6)
        : [];

      app.innerHTML = `
        ${Header.render()}
        <main class="page-content">
          <div class="container" style="padding-top:var(--space-2xl);padding-bottom:var(--space-3xl);">
            <!-- Breadcrumb -->
            <div style="margin-bottom:var(--space-lg);font-size:var(--font-size-sm);color:var(--color-text-muted);">
              <a href="#/" style="color:var(--color-text-muted)">Home</a> / 
              ${photo.category ? `<a href="#/category/${Helpers.generateSlug(photo.category)}" style="color:var(--color-text-muted)">${photo.category}</a> / ` : ''}
              <span style="color:var(--color-text-secondary)">${Helpers.truncateText(photo.title, 40)}</span>
            </div>

            <div class="two-col">
              <!-- Image Preview -->
              <div>
                <div class="photo-preview">
                  <img src="${photo.imageUrl}" alt="${Helpers.escapeHtml(photo.title)}" style="width:100%;height:auto;">
                </div>

                <!-- Description -->
                <div class="photo-description">
                  <h3>About This Asset</h3>
                  <p>${photo.description || 'A high-quality free stock asset available for personal and commercial use.'}</p>
                </div>

                <!-- Keywords -->
                ${keywords.length > 0 ? `
                <div style="margin-top:var(--space-lg);">
                  <h4 style="margin-bottom:var(--space-md);font-size:var(--font-size-base);">Keywords</h4>
                  <div class="photo-keywords">
                    ${keywords.map(kw => `<a href="#/tag/${encodeURIComponent(kw)}" class="tag">${kw}</a>`).join('')}
                  </div>
                </div>` : ''}

                <!-- Usage Tips -->
                <div class="photo-description" style="margin-top:var(--space-lg);">
                  <h3>Usage Tips</h3>
                  <p>This asset is free to use for both personal and commercial projects. No attribution required. Perfect for websites, marketing materials, presentations, and social media.</p>
                </div>
              </div>

              <!-- Sidebar -->
              <div class="photo-sidebar">
                <div style="display:flex;flex-direction:column;gap:var(--space-md);">
                  <!-- Download Button -->
                  <button class="btn btn-accent btn-lg" style="width:100%" 
                          onclick="PhotoCard.download('${photo.id}','${photo.imageUrl}','${slug}')">
                    ${Helpers.icon('download', 20)} Free Download
                  </button>

                  <!-- Metadata -->
                  <div class="photo-meta">
                    <div class="photo-meta-row">
                      <span class="photo-meta-label">Dimensions</span>
                      <span class="photo-meta-value">${photo.width || '—'} × ${photo.height || '—'}</span>
                    </div>
                    <div class="photo-meta-row">
                      <span class="photo-meta-label">Orientation</span>
                      <span class="photo-meta-value">${photo.orientation || 'Landscape'}</span>
                    </div>
                    <div class="photo-meta-row">
                      <span class="photo-meta-label">Category</span>
                      <span class="photo-meta-value">
                        <a href="#/category/${Helpers.generateSlug(photo.category || '')}">${photo.category || '—'}</a>
                      </span>
                    </div>
                    <div class="photo-meta-row">
                      <span class="photo-meta-label">Views</span>
                      <span class="photo-meta-value">${Helpers.formatNumber(photo.views)}</span>
                    </div>
                    <div class="photo-meta-row">
                      <span class="photo-meta-label">Downloads</span>
                      <span class="photo-meta-value">${Helpers.formatNumber(photo.downloads)}</span>
                    </div>
                    <div class="photo-meta-row">
                      <span class="photo-meta-label">Uploaded</span>
                      <span class="photo-meta-value">${Helpers.formatDate(photo.uploadDate)}</span>
                    </div>
                    <div class="photo-meta-row">
                      <span class="photo-meta-label">License</span>
                      <span class="photo-meta-value"><a href="#/license">CC0 / Free</a></span>
                    </div>
                  </div>

                  <!-- License Info -->
                  <div style="padding:var(--space-md);background:rgba(0,206,201,0.08);border-radius:var(--radius-md);border:1px solid rgba(0,206,201,0.2);">
                    <p style="font-size:var(--font-size-sm);color:var(--color-accent);margin:0;">
                      ${Helpers.icon('check', 16)} Free for personal and commercial use. No attribution required.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Related Assets -->
            ${relatedPhotos.length > 0 ? `
            <section style="margin-top:var(--space-3xl);">
              <div class="section-header">
                <h2 class="section-title">Related Assets</h2>
              </div>
              ${PhotoGrid.render(relatedPhotos.filter(p => p.slug !== slug))}
            </section>` : ''}
          </div>
        </main>
        ${Footer.render()}
      `;
      Header.init();
      PhotoGrid.initLazy();
    } catch (e) {
      console.error('Photo page error:', e);
      app.innerHTML = `
        ${Header.render()}
        <main class="page-content">
          <div class="empty-state">
            <div class="empty-state-icon">${Helpers.icon('image', 64)}</div>
            <h3>Could not load asset</h3>
            <p>Please check your connection and try again.</p>
            <a href="#/" class="btn btn-primary" style="margin-top:var(--space-lg);display:inline-flex;">Back to Home</a>
          </div>
        </main>
        ${Footer.render()}
      `;
      Header.init();
    }
  }
};
