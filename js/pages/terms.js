/* ====================================
   PromptGallery — Terms of Service
   ==================================== */

const TermsPage = {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      ${Header.render()}
      <main class="page-content">
        <div class="legal-page animate-fade-in">
          <h1>Terms of Service</h1>
          <p><em>Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using PromptGallery ("the Website"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Website.</p>
          
          <h2>2. Description of Service</h2>
          <p>PromptGallery provides free stock photos, illustrations, vectors, and other digital assets ("Assets") for download and use. All Assets are provided under CC0 (Creative Commons Zero) or equivalent permissive licenses.</p>
          
          <h2>3. License Grant</h2>
          <p>Assets available on PromptGallery are free to use for both personal and commercial purposes. You may:</p>
          <ul>
            <li>Download and use Assets without payment</li>
            <li>Use Assets in personal and commercial projects</li>
            <li>Modify and adapt Assets for your needs</li>
          </ul>
          
          <h2>4. Restrictions</h2>
          <p>You may not:</p>
          <ul>
            <li>Redistribute unmodified Assets on competing stock media platforms</li>
            <li>Claim ownership or authorship of unmodified Assets</li>
            <li>Use Assets in a way that is unlawful, harmful, or offensive</li>
            <li>Use Assets depicting identifiable people in a manner that suggests endorsement</li>
          </ul>
          
          <h2>5. Disclaimer</h2>
          <p>Assets are provided "as is" without warranty of any kind. PromptGallery does not guarantee that Assets are free of third-party rights.</p>
          
          <h2>6. Limitation of Liability</h2>
          <p>PromptGallery shall not be liable for any damages arising from the use of Assets downloaded from the Website.</p>
          
          <h2>7. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the Website after changes constitutes acceptance of the revised terms.</p>
          
          <h2>8. Contact</h2>
          <p>For questions about these Terms, please visit <a href="https://promptgallery.fun">promptgallery.fun</a>.</p>
        </div>
      </main>
      ${Footer.render()}
    `;
    Header.init();
    SEO.update({ title: 'Terms of Service', description: 'Terms of Service for PromptGallery free stock assets platform.', url: 'https://promptgallery.fun/#/terms' });
  }
};
