/* ====================================
   PromptGallery — Hash Router
   ==================================== */

const Router = {
  routes: {},
  currentRoute: null,

  /**
   * Register a route
   */
  on(pattern, handler) {
    this.routes[pattern] = handler;
  },

  /**
   * Initialize router and listen for hash changes
   */
  init() {
    window.addEventListener('hashchange', () => this.resolve());
    this.resolve();
  },

  /**
   * Navigate to a hash route
   */
  navigate(path) {
    window.location.hash = path;
  },

  /**
   * Resolve current path/hash to a route handler
   */
  resolve() {
    // Priority: 1. Hash (local/legacy), 2. Pathname (Vercel clean URLs)
    const hash = window.location.hash.slice(1);
    const pathname = window.location.pathname;
    
    let fullPath = hash || pathname || '/';
    if (fullPath.includes('?')) fullPath = fullPath.split('?')[0];
    
    // Normalize path (ensure it starts with /)
    const path = fullPath.startsWith('/') ? fullPath : '/' + fullPath;
    const params = Helpers.parseQueryParams(window.location.hash || window.location.search);

    // Try exact match first
    if (this.routes[path]) {
      this.currentRoute = path;
      this.routes[path](params);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Try dynamic routes (e.g. /photo/:slug)
    for (const [pattern, handler] of Object.entries(this.routes)) {
      if (pattern === '*') continue; // skip wildcard in dynamic matching
      const regex = this._patternToRegex(pattern);
      const match = path.match(regex);
      if (match) {
        this.currentRoute = pattern;
        const routeParams = this._extractParams(pattern, match);
        handler({ ...params, ...routeParams });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // 404 fallback
    if (this.routes['*']) {
      this.routes['*'](params);
    }
  },

  /**
   * Convert route pattern to regex
   * /photo/:slug → /photo/([^/]+)
   */
  _patternToRegex(pattern) {
    const regexStr = pattern
      .replace(/:[^/]+/g, '([^/]+)')
      .replace(/\//g, '\\/');
    return new RegExp(`^${regexStr}$`);
  },

  /**
   * Extract named params from match
   */
  _extractParams(pattern, match) {
    const keys = (pattern.match(/:[^/]+/g) || []).map(k => k.slice(1));
    const params = {};
    keys.forEach((key, i) => {
      params[key] = decodeURIComponent(match[i + 1]);
    });
    return params;
  }
};
