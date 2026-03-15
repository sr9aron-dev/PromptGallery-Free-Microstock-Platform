/* ====================================
   PromptGallery — Photo Card Component
   ==================================== */

const PhotoCard = {
  render(photo) {
    const title = Helpers.escapeHtml(photo.title || 'Untitled');
    const thumbUrl = photo.thumbUrl || photo.imageUrl || '';
    const slug = photo.slug || photo.id;

    return `
    <div class="photo-card" onclick="Router.navigate('/photo/${slug}')" 
         role="link" tabindex="0" aria-label="${title}">
      <img data-src="${thumbUrl}" 
           alt="${title}" 
           loading="lazy"
           src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%231E1E28' width='400' height='300'/%3E%3C/svg%3E"
           onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%231E1E28%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%22200%22 y=%22158%22 text-anchor=%22middle%22 fill=%22%236B6B80%22 font-family=%22sans-serif%22 font-size=%2216%22%3EImage%3C/text%3E%3C/svg%3E'"
           >
      <div class="photo-card-overlay">
        <div class="photo-card-info">
          <span class="author">${title}</span>
        </div>
        <div class="photo-card-actions">
          <button class="btn-icon" onclick="event.stopPropagation();PhotoCard.download('${photo.id}','${thumbUrl}','${slug}')" 
                  title="Download">
            ${Helpers.icon('download', 18)}
          </button>
        </div>
      </div>
    </div>`;
  },

  async download(id, url, slug) {
    try {
      // Open image in new tab for download
      window.open(url, '_blank');
      // Track download count
      if (id) await FireDB.incrementDownloads(id);
      Helpers.toast('Download started!');
    } catch (e) {
      console.error('Download error:', e);
    }
  }
};
