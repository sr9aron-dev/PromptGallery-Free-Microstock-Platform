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
      const resLabel = Helpers.getResolutionLabel(photo.width);
      const resBadgeBg = photo.width >= 3840 ? '#FFB300' : photo.width >= 2048 ? '#FFCA28' : photo.width >= 1280 ? '#212121' : '#E0E0E0';
      const resBadgeColor = photo.width >= 2048 ? '#000' : '#FFF';
      // Fetch related photos
      const relatedPhotos = await FireDB.getRelatedPhotos(photo, 6);

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
                <div class="photo-preview" style="position:relative; overflow: hidden;">
                  <img src="${Helpers.getOptimizedImageUrl(photo.imageUrl, 1400)}" alt="${Helpers.escapeHtml(photo.title)}" style="width:100%;height:auto;">
                  <!-- Watermark Overlay -->
                  <div class="watermark-overlay">
                    <span class="watermark-text">PROMPTGALLERY.FUN</span>
                  </div>
                  <!-- Resolution Badge -->
                  ${photo.width >= 1280 ? `<span style="position:absolute;top:12px;left:12px;background:${resBadgeBg};color:${resBadgeColor};font-size:12px;font-weight:800;padding:4px 10px;border-radius:6px;letter-spacing:0.5px;">${resLabel}</span>` : ''}
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
                  <!-- Download Button (direct file download) -->
                  <button class="btn btn-accent btn-lg" style="width:100%" 
                          onclick="PhotoCard.download('${photo.id}','${photo.imageUrl}','${Helpers.escapeHtml(photo.title)}')">
                    ${Helpers.icon('download', 20)} Free Download
                  </button>

                  <!-- Metadata -->
                  <div class="photo-meta">
                    <div class="photo-meta-row" style="align-items:center;">
                      <span class="photo-meta-label">Type</span>
                      <span class="photo-meta-value" style="display:flex;align-items:center;gap:6px;">
                        ${photo.assetType === 'Illustration' ? Helpers.icon('image', 16) : photo.assetType === 'Vector' ? Helpers.icon('pen-tool', 16) : Helpers.icon('camera', 16)} 
                        ${photo.assetType || 'Photo'}
                      </span>
                    </div>
                    <div class="photo-meta-row" style="align-items:center;">
                      <span class="photo-meta-label">Resolution</span>
                      <span class="photo-meta-value">
                        <span style="background:${resBadgeBg};color:${resBadgeColor};font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;">${resLabel}</span>
                      </span>
                    </div>
                    <div class="photo-meta-row">
                      <span class="photo-meta-label">Dimensions</span>
                      <span class="photo-meta-value">${photo.width || '—'} × ${photo.height || '—'}</span>
                    </div>
                    <div class="photo-meta-row">
                      <span class="photo-meta-label">Format</span>
                      <span class="photo-meta-value">${photo.fileFormat || 'JPG'}</span>
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
              ${PhotoGrid.render(relatedPhotos)}
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
