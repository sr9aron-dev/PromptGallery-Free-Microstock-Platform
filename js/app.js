/* ====================================
   PromptGallery — Main App Entry
   ==================================== */

(function () {
  'use strict';

  // ── Register all routes ──
  Router.on('/', () => HomePage.render());
  Router.on('/photo/:slug', (params) => PhotoPage.render(params));
  Router.on('/search', (params) => SearchPage.render(params));
  Router.on('/category/:slug', (params) => CategoryPage.render(params));
  Router.on('/categories', () => CategoriesPage.render());
  Router.on('/tag/:tag', (params) => TagPage.render(params));

  // Legal pages
  Router.on('/about', () => AboutPage.render());
  Router.on('/faq', () => FAQPage.render());
  Router.on('/terms', () => TermsPage.render());
  Router.on('/privacy', () => PrivacyPage.render());
  Router.on('/license', () => LicensePage.render());
  Router.on('/cookies', () => CookiesPage.render());

  // Admin pages
  Router.on('/admin/login', () => AdminLoginPage.render());
  Router.on('/admin/dashboard', () => AdminDashboard.render());
  Router.on('/admin/upload', () => AdminUpload.render());
  Router.on('/admin/edit/:id', (params) => AdminEdit.render(params));

  // 404 fallback
  Router.on('*', () => {
    const app = document.getElementById('app');
    app.innerHTML = `
      ${Header.render()}
      <main class="page-content">
        <div class="empty-state" style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;">
          <div class="empty-state-icon" style="font-size:6rem;">404</div>
          <h3>Page Not Found</h3>
          <p>The page you're looking for doesn't exist.</p>
          <a href="#/" class="btn btn-primary" style="margin-top:var(--space-lg);">Go Home</a>
        </div>
      </main>
      ${Footer.render()}
    `;
    Header.init();
  });

  // ── Initialize Router ──
  Router.init();

  // ── Listen for auth state changes ──
  FireDB.onAuthChange((user) => {
    // Could update UI based on auth state if needed
    console.log('Auth state:', user ? 'logged in' : 'logged out');
  });

  console.log('%c✨ PromptGallery loaded', 'color: #6C5CE7; font-weight: bold; font-size: 14px;');
})();
