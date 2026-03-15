/* ====================================
   PromptGallery — Photo Grid Component
   ==================================== */

const PhotoGrid = {
  render(photos, loading = false) {
    if (loading) {
      return `<div class="masonry-grid">${Helpers.skeletonGrid(18)}</div>`;
    }

    if (!photos || photos.length === 0) {
      return `
      <div class="empty-state">
        <div class="empty-state-icon">${Helpers.icon('image', 64)}</div>
        <h3>No assets found</h3>
        <p>Try a different search or browse our categories.</p>
      </div>`;
    }

    const cards = photos.map(p => PhotoCard.render(p)).join('');
    return `<div class="masonry-grid">${cards}</div>`;
  },

  /**
   * Initialize lazy loading after grid is rendered
   */
  initLazy() {
    setTimeout(() => Helpers.initLazyLoad(), 100);
  }
};
