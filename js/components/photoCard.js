/* ====================================
   PromptGallery — Photo Card Component
   ==================================== */

const PhotoCard = {
  render(photo) {
    const title = Helpers.escapeHtml(photo.title || 'Untitled');
    const rawUrl = photo.thumbUrl || photo.imageUrl || '';
    const optimizedThumbUrl = Helpers.getOptimizedImageUrl(rawUrl, 600);
    const slug = photo.slug || photo.id;
    const resBadge = Helpers.getResolutionBadge(photo.width);
    const typeIcon = photo.assetType === 'Illustration' ? Helpers.icon('image', 12) : photo.assetType === 'Vector' ? Helpers.icon('pen-tool', 12) : Helpers.icon('camera', 12);
    const typeLabel = photo.assetType || 'Photo';

    return `
    <div class="photo-card" onclick="Router.navigate('/photo/${slug}')" 
         role="link" tabindex="0" aria-label="${title}"
         style="aspect-ratio: ${photo.width && photo.height ? photo.width/photo.height : '4/3'};">
      <div class="skeleton-card" style="position:absolute;inset:0;z-index:-1;"></div>
      ${resBadge}
      <img data-src="${optimizedThumbUrl}" 
           alt="${Helpers.escapeHtml(title)}" 
           loading="lazy"
           src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%231E1E28' width='400' height='300'/%3E%3C/svg%3E"
           onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%231E1E28%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%22200%22 y=%22158%22 text-anchor=%22middle%22 fill=%22%236B6B80%22 font-family=%22sans-serif%22 font-size=%2216%22%3EImage%3C/text%3E%3C/svg%3E'"
           >
      <div class="photo-card-overlay">
        <div class="photo-card-info" style="display:flex;align-items:center;gap:6px;">
          ${photo.author ? `<span class="author">${Helpers.escapeHtml(photo.author.name)}</span>` : ''}
          <span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;color:rgba(255,255,255,0.8);">${typeIcon} ${typeLabel}</span>
        </div>
        <div class="photo-card-actions">
          <button class="btn-icon" onclick="event.stopPropagation();Helpers.toast('Lihat detail foto untuk download.')" title="View Details" aria-label="View Details">
            ${Helpers.icon('eye', 18)}
          </button>
        </div>
      </div>
    </div>`;
  },

  async download(id, url, filename) {
    try {
      Helpers.toast('Downloading...');
      // Generate clean filename
      const ext = url.split('.').pop().split('?')[0] || 'jpg';
      const cleanName = (filename || 'promptgallery-asset').replace(/[^a-zA-Z0-9-_ ]/g, '') + '.' + ext;
      
      await Helpers.downloadFile(url, cleanName);
      // Track download count
      if (id) await FireDB.incrementDownloads(id);
      Helpers.toast('Download complete!');
    } catch (e) {
      console.error('Download error:', e);
      Helpers.toast('Download failed', 'error');
    }
  }
};
