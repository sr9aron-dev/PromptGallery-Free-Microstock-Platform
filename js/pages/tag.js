/* ====================================
   PromptGallery — Tag Page
   ==================================== */

const TagPage = {
  async render(params) {
    const tag = params.tag || '';
    const app = document.getElementById('app');

    app.innerHTML = `
      ${Header.render()}
      <main class="page-content">
        <div class="page-banner">
          <div class="container">
            <h1>#${Helpers.escapeHtml(tag)}</h1>
            <p>Free stock assets tagged with "${Helpers.escapeHtml(tag)}"</p>
          </div>
        </div>
        <div class="container-wide">
          <div class="section">
            <div id="tagResults">
              ${PhotoGrid.render(null, true)}
            </div>
          </div>
        </div>
      </main>
      ${Footer.render()}
    `;
    Header.init();

    // SEO
    SEO.update({
      title: `Free "${tag}" Stock Photos & Images`,
      description: `Download free stock photos tagged with "${tag}". All assets are 100% free for personal and commercial use.`,
      url: `https://promptgallery.fun/#/tag/${encodeURIComponent(tag)}`
    });

    // Load photos
    try {
      const photos = await FireDB.getPhotosByTag(tag, 60);
      document.getElementById('tagResults').innerHTML = PhotoGrid.render(photos);
      PhotoGrid.initLazy();
    } catch (e) {
      console.warn('Tag load error:', e.message);
      document.getElementById('tagResults').innerHTML = PhotoGrid.render([]);
    }
  }
};
