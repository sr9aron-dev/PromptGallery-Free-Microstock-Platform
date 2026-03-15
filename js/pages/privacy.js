/* ====================================
   PromptGallery — Privacy Policy
   ==================================== */

const PrivacyPage = {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      ${Header.render()}
      <main class="page-content">
        <div class="legal-page animate-fade-in">
          <h1>Privacy Policy</h1>
          <p><em>Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p>

          <h2>1. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul>
            <li><strong>Usage Data</strong> — Pages visited, search queries, download counts, and other usage statistics</li>
            <li><strong>Device Data</strong> — Browser type, operating system, screen resolution</li>
            <li><strong>Cookies</strong> — Small data files stored on your device for functionality and analytics</li>
          </ul>

          <h2>2. How We Use Information</h2>
          <p>We use collected information to:</p>
          <ul>
            <li>Improve and optimize the Website</li>
            <li>Understand user behavior and preferences</li>
            <li>Display relevant advertisements (Google AdSense)</li>
            <li>Maintain Website security</li>
          </ul>

          <h2>3. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li><strong>Google AdSense</strong> — For displaying advertisements</li>
            <li><strong>Google Analytics</strong> — For usage analytics</li>
            <li><strong>Firebase</strong> — For data storage and authentication</li>
            <li><strong>jsDelivr CDN</strong> — For content delivery</li>
          </ul>

          <h2>4. Data Retention</h2>
          <p>We retain usage data for a reasonable period to analyze trends and improve our services. You may request deletion of your data by contacting us.</p>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request correction or deletion of your data</li>
            <li>Opt out of tracking via browser settings</li>
            <li>Disable cookies through your browser</li>
          </ul>

          <h2>6. Changes to This Policy</h2>
          <p>We may update this privacy policy from time to time. Updates will be posted on this page with a revised date.</p>

          <h2>7. Contact</h2>
          <p>For privacy-related questions, please visit <a href="https://promptgallery.fun">promptgallery.fun</a>.</p>
        </div>
      </main>
      ${Footer.render()}
    `;
    Header.init();
    SEO.update({ title: 'Privacy Policy', description: 'Privacy Policy for PromptGallery — how we handle your data.', url: 'https://promptgallery.fun/#/privacy' });
  }
};
