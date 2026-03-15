/* ====================================
   PromptGallery — Helper Utilities
   ==================================== */

const Helpers = {
  /**
   * Generate URL-friendly slug from text
   */
  generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 80);
  },

  /**
   * Format number with suffix (1.2k, 3.5M)
   */
  formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  },

  /**
   * Format date to readable string
   */
  formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  },

  /**
   * Truncate text to maxLength
   */
  truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength).trim() + '...';
  },

  /**
   * Debounce function
   */
  debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  /**
   * Create SVG icon element
   */
  icon(name, size = 20) {
    return `<svg width="${size}" height="${size}"><use href="#icon-${name}"/></svg>`;
  },

  /**
   * Show toast notification
   */
  toast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `${type === 'success' ? Helpers.icon('check', 16) : Helpers.icon('info', 16)} ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  /**
   * Escape HTML
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * Generate skeleton loaders for masonry grid
   */
  skeletonGrid(count = 18) {
    const heights = [200, 280, 220, 320, 250, 180, 300, 240, 260, 190, 310, 230];
    return Array.from({ length: count }, (_, i) =>
      `<div class="skeleton skeleton-card" style="height:${heights[i % heights.length]}px"></div>`
    ).join('');
  },

  /**
   * Parse query params from hash
   */
  parseQueryParams(hash) {
    const qi = hash.indexOf('?');
    if (qi === -1) return {};
    const params = new URLSearchParams(hash.substring(qi));
    const obj = {};
    params.forEach((v, k) => obj[k] = v);
    return obj;
  },

  /**
   * Get CDN image URL
   */
  cdnUrl(path) {
    return `${CDN_BASE}/${path}`;
  },

  /**
   * Get optimized image URL via free wsrv.nl proxy (Cloudflare)
   * Resizes large images to WebP thumbnails on the fly for fast loading
   */
  getOptimizedImageUrl(url, width = 600) {
    if (!url) return '';
    // If it's already an optimized or external icon URL, return as is
    if (url.includes('wsrv.nl') || url.includes('unsplash.com') || url.includes('picsum.photos')) return url;
    
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp&q=80`;
  },

  /**
   * Lazy load images with IntersectionObserver
   */
  initLazyLoad() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
    return observer;
  },

  /**
   * Get resolution badge (HD / 2K / 4K) based on image width
   * HD: >= 1280px, 2K: >= 2048px, 4K: >= 3840px
   */
  getResolutionBadge(width) {
    if (!width || width < 1280) return '';
    let label, bg, color;
    if (width >= 3840) { label = '4K'; bg = '#FFB300'; color = '#000'; }
    else if (width >= 2048) { label = '2K'; bg = '#FFCA28'; color = '#000'; }
    else { label = 'HD'; bg = '#212121'; color = '#FFF'; }
    return `<span style="position:absolute;top:8px;left:8px;background:${bg};color:${color};font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px;letter-spacing:0.5px;z-index:1;">${label}</span>`;
  },

  /**
   * Get resolution label text
   */
  getResolutionLabel(width) {
    if (!width || width < 1280) return 'SD';
    if (width >= 3840) return '4K';
    if (width >= 2048) return '2K';
    return 'HD';
  },

  /**
   * Check if image meets minimum HD requirement (>= 1280px width)
   */
  isHD(width) {
    return width && width >= 1280;
  },

  /**
   * Direct download file via fetch + blob
   */
  async downloadFile(url, filename) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
      return true;
    } catch (e) {
      // Fallback: open in new tab
      window.open(url, '_blank');
      return false;
    }
  },

  /**
   * Track uploaded assets in localStorage to prevent duplicates
   */
  uploadedAssets: {
    _key: 'pg_uploaded_assets',
    getAll() {
      return JSON.parse(localStorage.getItem(this._key) || '[]');
    },
    add(fileHash) {
      const list = this.getAll();
      if (!list.includes(fileHash)) {
        list.push(fileHash);
        localStorage.setItem(this._key, JSON.stringify(list));
      }
    },
    has(fileHash) {
      return this.getAll().includes(fileHash);
    },
    /**
     * Generate a simple hash from file name + size + lastModified
     */
    hash(file) {
      return `${file.name}_${file.size}_${file.lastModified}`;
    }
  }
};
