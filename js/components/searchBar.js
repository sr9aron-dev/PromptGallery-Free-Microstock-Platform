/* ====================================
   PromptGallery — Search Bar Component
   ==================================== */

const SearchBar = {
  render(placeholder = 'Search thousands of free stock assets...', large = true) {
    const sizeClass = large ? 'search-input' : 'search-input';
    return `
    <div class="search-input-wrapper" ${large ? 'style="max-width:680px"' : ''}>
      <svg class="search-input-icon" width="${large ? 22 : 18}" height="${large ? 22 : 18}"><use href="#icon-search"/></svg>
      <input type="text" class="${sizeClass}" id="heroSearchInput"
             placeholder="${placeholder}"
             aria-label="Search assets"
             ${large ? 'style="padding:1.1rem 1.5rem 1.1rem 3.5rem;font-size:1.1rem;"' : ''}>
    </div>`;
  },

  init() {
    const input = document.getElementById('heroSearchInput');
    if (!input) return;
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        Router.navigate(`/search?q=${encodeURIComponent(input.value.trim())}`);
      }
    });
  }
};
