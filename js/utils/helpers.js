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
  }
};
