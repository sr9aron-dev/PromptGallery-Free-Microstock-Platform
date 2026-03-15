/* ====================================
   PromptGallery — Footer Component
   ==================================== */

const Footer = {
  render() {
    return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="#/" class="header-logo">
              <div class="logo-icon">P</div>
              <span>PromptGallery</span>
            </a>
            <p>Free high-quality stock assets for everyone. All images are free for personal and commercial use under CC0 / Public Domain license.</p>
          </div>

          <div>
            <h4 class="footer-title">Explore</h4>
            <div class="footer-links">
              <a href="#/">Home</a>
              <a href="#/categories">Categories</a>
              <a href="#/search?q=popular">Popular</a>
              <a href="#/search?q=latest">Latest</a>
            </div>
          </div>

          <div>
            <h4 class="footer-title">Categories</h4>
            <div class="footer-links">
              <a href="#/category/nature">Nature</a>
              <a href="#/category/business">Business</a>
              <a href="#/category/technology">Technology</a>
              <a href="#/category/people">People</a>
              <a href="#/category/architecture">Architecture</a>
            </div>
          </div>

          <div>
            <h4 class="footer-title">Legal</h4>
            <div class="footer-links">
              <a href="#/about">About Us</a>
              <a href="#/faq">FAQ</a>
              <a href="#/license">License</a>
              <a href="#/terms">Terms of Service</a>
              <a href="#/privacy">Privacy Policy</a>
              <a href="#/cookies">Cookies Policy</a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <span>&copy; ${new Date().getFullYear()} PromptGallery. Free Creative Assets for Everyone.</span>
          <span>Built with ❤️</span>
        </div>
      </div>
    </footer>`;
  }
};
