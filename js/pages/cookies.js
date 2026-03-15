/* ====================================
   PromptGallery — Cookies Policy
   ==================================== */

const CookiesPage = {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      ${Header.render()}
      <main class="page-content">
        <div class="legal-page animate-fade-in">
          <h1>Cookies Policy</h1>
          <p><em>Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p>

          <h2>What Are Cookies?</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and improve your browsing experience.</p>

          <h2>How We Use Cookies</h2>
          <p>PromptGallery uses cookies for the following purposes:</p>
          <ul>
            <li><strong>Essential Cookies</strong> — Required for basic website functionality like navigation and authentication</li>
            <li><strong>Analytics Cookies</strong> — Help us understand how visitors use our Website (via Google Analytics)</li>
            <li><strong>Advertising Cookies</strong> — Used to display relevant advertisements (via Google AdSense)</li>
          </ul>

          <h2>Third-Party Cookies</h2>
          <p>Some cookies are set by third-party services we use:</p>
          <ul>
            <li>Google Analytics — For usage tracking and analysis</li>
            <li>Google AdSense — For personalized advertising</li>
            <li>Firebase — For authentication and data services</li>
          </ul>

          <h2>Managing Cookies</h2>
          <p>You can manage or disable cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of the Website.</p>
          <ul>
            <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
            <li><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
            <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
          </ul>

          <h2>Changes to This Policy</h2>
          <p>We may update this cookies policy periodically. Your continued use of the Website constitutes acceptance of any changes.</p>
        </div>
      </main>
      ${Footer.render()}
    `;
    Header.init();
    SEO.update({ title: 'Cookies Policy', description: 'Cookies Policy for PromptGallery — how we use cookies on our website.', url: 'https://promptgallery.fun/#/cookies' });
  }
};
