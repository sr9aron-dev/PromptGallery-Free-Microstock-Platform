/* ====================================
   PromptGallery — License Page
   ==================================== */

const LicensePage = {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      ${Header.render()}
      <main class="page-content">
        <div class="legal-page animate-fade-in">
          <h1>License — Free to Use</h1>
          <p>All assets on PromptGallery are released under permissive licenses that allow free use.</p>

          <h2>CC0 — Creative Commons Zero</h2>
          <p>The majority of assets on PromptGallery are released under the <strong>CC0 1.0 Universal</strong> (Public Domain Dedication). This means:</p>
          <ul>
            <li>✅ <strong>Free for commercial use</strong> — Use in any commercial project</li>
            <li>✅ <strong>Free for personal use</strong> — Use in personal projects, blogs, websites</li>
            <li>✅ <strong>No attribution required</strong> — Credit is appreciated but not mandatory</li>
            <li>✅ <strong>Modification allowed</strong> — Edit, crop, resize, and transform freely</li>
            <li>✅ <strong>No sign-up required</strong> — Download instantly without registration</li>
          </ul>

          <h2>What You CAN Do</h2>
          <ul>
            <li>Use assets in websites, apps, presentations, and videos</li>
            <li>Use assets in marketing and advertising materials</li>
            <li>Use assets in print media (books, magazines, posters)</li>
            <li>Modify and create derivative works</li>
            <li>Use assets in templates and products for sale</li>
          </ul>

          <h2>What You CANNOT Do</h2>
          <ul>
            <li>❌ Redistribute unmodified assets on other stock platforms</li>
            <li>❌ Claim you are the original creator of unmodified assets</li>
            <li>❌ Use assets with identifiable people in misleading contexts</li>
            <li>❌ Use assets in illegal, defamatory, or harmful content</li>
          </ul>

          <h2>Disclaimer</h2>
          <p>While we strive to ensure all assets are properly licensed, PromptGallery does not provide legal advice. Users are responsible for ensuring their use complies with applicable laws. Some assets may depict trademarks, brands, or identifiable individuals — additional permissions may be needed for commercial use in such cases.</p>

          <p>For questions about licensing, please visit <a href="https://promptgallery.fun">promptgallery.fun</a>.</p>
        </div>
      </main>
      ${Footer.render()}
    `;
    Header.init();
    SEO.update({ title: 'License Information', description: 'License details for PromptGallery assets. All images are free for personal and commercial use under CC0.', url: 'https://promptgallery.fun/#/license' });
  }
};
