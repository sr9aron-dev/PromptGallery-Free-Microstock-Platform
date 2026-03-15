/* ====================================
   PromptGallery — Upload Page (Admin)
   ==================================== */

const AdminUpload = {
  render() {
    if (!FireDB.isLoggedIn()) {
      Router.navigate('/admin/login');
      return;
    }

    const categories = [
      'Animals', 'Architecture', 'Business', 'Food', 'Nature', 'People',
      'Technology', 'Backgrounds', 'Objects', 'Travel', 'Lifestyle', 'Abstract',
      'Education', 'Health', 'Sports', 'Industry', 'Environment'
    ];

    const app = document.getElementById('app');
    app.innerHTML = `
      ${Header.render()}
      <main class="page-content">
        <div class="admin-layout">
          ${AdminDashboard.renderSidebar('upload')}
          <div class="admin-main">
            <div class="admin-header">
              <h1>Upload New Asset</h1>
              <a href="#/admin/dashboard" class="btn btn-ghost">← Back to Dashboard</a>
            </div>

            <form id="uploadForm" class="upload-form">
              <!-- Image URL -->
              <div class="form-group">
                <label class="form-label">Image URL (jsDelivr CDN)</label>
                <input type="url" class="form-input" id="uploadImageUrl" 
                       placeholder="https://cdn.jsdelivr.net/gh/user/repo@main/images/photo.jpg" required>
                <small style="color:var(--color-text-muted);font-size:var(--font-size-xs);margin-top:4px;display:block;">
                  Upload your image to GitHub first, then paste the jsDelivr CDN URL here.
                </small>
              </div>

              <!-- Thumbnail URL (optional) -->
              <div class="form-group">
                <label class="form-label">Thumbnail URL (optional)</label>
                <input type="url" class="form-input" id="uploadThumbUrl" 
                       placeholder="Leave empty to use the main image">
              </div>

              <!-- Preview -->
              <div id="imagePreview" style="margin-bottom:var(--space-lg);display:none;">
                <img id="previewImg" style="max-height:200px;border-radius:var(--radius-md);border:1px solid var(--color-border);">
              </div>

              <!-- Title -->
              <div class="form-group">
                <label class="form-label">Title</label>
                <input type="text" class="form-input" id="uploadTitle" placeholder="e.g. Beautiful Mountain Sunset Landscape" required>
              </div>

              <!-- Description -->
              <div class="form-group">
                <label class="form-label">Description (200-400 words for SEO)</label>
                <textarea class="form-textarea" id="uploadDescription" rows="6" 
                          placeholder="Write a detailed description of this asset. Include context about what is shown, where it can be used, and style details..." required></textarea>
                <small style="color:var(--color-text-muted);font-size:var(--font-size-xs);margin-top:4px;display:block;">
                  Word count: <span id="wordCount">0</span> / 400
                </small>
              </div>

              <!-- Keywords -->
              <div class="form-group">
                <label class="form-label">Keywords (comma separated)</label>
                <input type="text" class="form-input" id="uploadKeywords" 
                       placeholder="mountain, sunset, landscape, nature, sky, golden hour" required>
              </div>

              <!-- Category -->
              <div class="form-group">
                <label class="form-label">Category</label>
                <select class="form-select" id="uploadCategory" required>
                  <option value="">Select a category</option>
                  ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
              </div>

              <!-- Dimensions -->
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-md);">
                <div class="form-group">
                  <label class="form-label">Width (px)</label>
                  <input type="number" class="form-input" id="uploadWidth" placeholder="4000">
                </div>
                <div class="form-group">
                  <label class="form-label">Height (px)</label>
                  <input type="number" class="form-input" id="uploadHeight" placeholder="3000">
                </div>
                <div class="form-group">
                  <label class="form-label">Orientation</label>
                  <select class="form-select" id="uploadOrientation">
                    <option value="landscape">Landscape</option>
                    <option value="portrait">Portrait</option>
                    <option value="square">Square</option>
                  </select>
                </div>
              </div>

              <!-- Submit -->
              <div style="display:flex;gap:var(--space-md);margin-top:var(--space-lg);">
                <button type="submit" class="btn btn-primary btn-lg" id="uploadBtn">
                  ${Helpers.icon('upload', 18)} Publish Asset
                </button>
                <button type="button" class="btn btn-secondary btn-lg" onclick="document.getElementById('uploadForm').reset()">
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    `;
    Header.init();

    // Image URL preview
    const urlInput = document.getElementById('uploadImageUrl');
    urlInput.addEventListener('change', () => {
      const previewDiv = document.getElementById('imagePreview');
      const previewImg = document.getElementById('previewImg');
      if (urlInput.value) {
        previewImg.src = urlInput.value;
        previewDiv.style.display = 'block';
      } else {
        previewDiv.style.display = 'none';
      }
    });

    // Word count
    const descInput = document.getElementById('uploadDescription');
    descInput.addEventListener('input', () => {
      const words = descInput.value.trim().split(/\s+/).filter(w => w.length > 0).length;
      document.getElementById('wordCount').textContent = words;
    });

    // Form submit
    document.getElementById('uploadForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('uploadBtn');
      btn.disabled = true;
      btn.textContent = 'Publishing...';

      try {
        const title = document.getElementById('uploadTitle').value.trim();
        const keywords = document.getElementById('uploadKeywords').value
          .split(',')
          .map(k => k.trim().toLowerCase())
          .filter(k => k.length > 0);

        const data = {
          title,
          slug: Helpers.generateSlug(title),
          description: document.getElementById('uploadDescription').value.trim(),
          keywords,
          category: document.getElementById('uploadCategory').value,
          imageUrl: document.getElementById('uploadImageUrl').value.trim(),
          thumbUrl: document.getElementById('uploadThumbUrl').value.trim() || document.getElementById('uploadImageUrl').value.trim(),
          width: parseInt(document.getElementById('uploadWidth').value) || null,
          height: parseInt(document.getElementById('uploadHeight').value) || null,
          orientation: document.getElementById('uploadOrientation').value,
        };

        await FireDB.addPhoto(data);
        Helpers.toast('Asset published successfully!');
        Router.navigate('/admin/dashboard');
      } catch (err) {
        Helpers.toast('Failed to publish: ' + err.message, 'error');
        btn.disabled = false;
        btn.textContent = 'Publish Asset';
      }
    });
  }
};
