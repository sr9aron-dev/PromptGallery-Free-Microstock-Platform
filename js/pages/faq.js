/* ====================================
   PromptGallery — FAQ Page
   ==================================== */

const FAQPage = {
  render() {
    const faqs = [
      { q: 'Are all assets on PromptGallery really free?', a: 'Yes! Every asset on PromptGallery is 100% free to download and use for both personal and commercial projects. No hidden fees or subscriptions.' },
      { q: 'Do I need to give credit or attribution?', a: 'No, attribution is not required. However, if you\'d like to support our platform, a link back to PromptGallery is always appreciated but never mandatory.' },
      { q: 'Can I use these assets for commercial projects?', a: 'Absolutely! All assets are released under CC0 or equivalent permissive licenses, which means you can use them in any commercial project — websites, apps, marketing materials, products, and more.' },
      { q: 'What types of assets are available?', a: 'We offer high-quality stock photos, illustrations, vectors, and background images across 16+ categories including Nature, Business, Technology, People, and more.' },
      { q: 'Can I modify or edit the assets?', a: 'Yes, you are free to modify, adapt, and build upon any asset from our collection. Create something amazing!' },
      { q: 'What license do the assets use?', a: 'All assets are released under the CC0 (Creative Commons Zero) license or equivalent permissive licenses. See our <a href="#/license">License page</a> for full details.' },
      { q: 'How often do you add new assets?', a: 'We regularly add new high-quality assets to our collection. Check back often or search for the latest additions.' },
      { q: 'Can I redistribute the assets?', a: 'You may not redistribute unmodified assets on other stock photo platforms. However, you can use them as part of your own creative works and projects.' },
    ];

    const app = document.getElementById('app');
    app.innerHTML = `
      ${Header.render()}
      <main class="page-content">
        <div class="legal-page animate-fade-in">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to the most common questions about PromptGallery and our free stock assets.</p>
          
          ${faqs.map((faq, i) => `
            <h2>${faq.q}</h2>
            <p>${faq.a}</p>
          `).join('')}

          <h2>Still have questions?</h2>
          <p>If you can't find the answer you're looking for, feel free to contact us through our website.</p>
        </div>
      </main>
      ${Footer.render()}
    `;
    Header.init();
    SEO.update({ title: 'FAQ', description: 'Frequently asked questions about PromptGallery free stock assets.', url: 'https://promptgallery.fun/#/faq' });
  }
};
