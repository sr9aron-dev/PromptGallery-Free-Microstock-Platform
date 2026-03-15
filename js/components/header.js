/* ====================================
   PromptGallery — Header Component
   ==================================== */

const Header = {
  render(activeRoute = '') {
    return `
    <header class="site-header" id="siteHeader">
      <div class="header-inner">
        <a href="#/" class="header-logo">
          <div class="logo-icon">P</div>
          <span>PromptGallery</span>
        </a>

        <div class="header-search search-input-wrapper">
          <svg class="search-input-icon" width="18" height="18"><use href="#icon-search"/></svg>
          <input type="text" class="search-input" id="headerSearchInput" 
                 placeholder="Search free stock assets..." 
                 aria-label="Search assets">
        </div>

        <nav class="header-nav" id="headerNav">
          <a href="#/" class="${activeRoute === '/' ? 'active' : ''}">Home</a>
          <a href="#/categories" class="${activeRoute === '/categories' ? 'active' : ''}">Categories</a>
          <a href="#/about" class="${activeRoute === '/about' ? 'active' : ''}">About</a>
        </nav>

        <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>`;
  },

  init() {
    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const header = document.getElementById('siteHeader');
      if (!header) return;
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = window.scrollY;
    });

    // Header search
    const searchInput = document.getElementById('headerSearchInput');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim()) {
          Router.navigate(`/search?q=${encodeURIComponent(searchInput.value.trim())}`);
          searchInput.blur();
        }
      });
    }

    // Mobile menu
    const menuBtn = document.getElementById('mobileMenuBtn');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        document.querySelector('.site-header').classList.toggle('mobile-menu-open');
      });
    }
  }
};
