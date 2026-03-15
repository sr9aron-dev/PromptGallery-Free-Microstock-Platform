/* ====================================
   PromptGallery — Edit Asset (Admin)
   ==================================== */

const AdminEdit = {
  async render(params) {
    if (!FireDB.isLoggedIn()) {
      Router.navigate('/admin/login');
      return;
    }

    const id = params.id;
    const app = document.getElementById('app');

    app.innerHTML = `
      ${Header.render()}
      <main class="page-content">
        <div class="admin-layout">
          ${AdminDashboard.renderSidebar('')}
          <div class="admin-main">
            <div class="admin-header">
              <h1>Edit Asset</h1>
              <a href="#/admin/dashboard" class="btn btn-ghost">← Back to Dashboard</a>
            </div>
            <div class="page-loading"><div class="spinner"></div></div>
          </div>
        </div>
      </main>
    `;
    Header.init();

    try {
      // Get photo data
      const snap = await db.collection('photos').doc(id).get();
      if (!snap.exists) {
        Helpers.toast('Asset not found', 'error');
        Router.navigate('/admin/dashboard');
        return;
      }

      const photo = { id: snap.id, ...snap.data() };
      const categories = [
        'Animals', 'Architecture', 'Business', 'Food', 'Nature', 'People',
        'Technology', 'Backgrounds', 'Objects', 'Travel', 'Lifestyle', 'Abstract',
        'Education', 'Health', 'Sports', 'Industry', 'Environment'
      ];

      document.querySelector('.admin-main').innerHTML = `
        <div class="admin-header">
          <h1>Edit Asset</h1>
          <a href="#/admin/dashboard" class="btn btn-ghost">← Back to Dashboard</a>
        </div>

        <form id="editForm" class="upload-form">
          <div class="form-group">
            <label class="form-label">Image URL</label>
            <input type="url" class="form-input" id="editImageUrl" value="${photo.imageUrl || ''}" required>
          </div>

          <div class="form-group">
            <label class="form-label">Thumbnail URL</label>
            <input type="url" class="form-input" id="editThumbUrl" value="${photo.thumbUrl || ''}">
          </div>

          ${photo.imageUrl ? `<div style="margin-bottom:var(--space-lg);"><img src="${photo.imageUrl}" style="max-height:200px;border-radius:var(--radius-md);"></div>` : ''}

          <div class="form-group">
            <label class="form-label">Title</label>
            <input type="text" class="form-input" id="editTitle" value="${Helpers.escapeHtml(photo.title || '')}" required>
          </div>

          <div class="form-group">
            <label class="form-label">Slug</label>
            <input type="text" class="form-input" id="editSlug" value="${photo.slug || ''}">
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-textarea" id="editDescription" rows="6" required>${photo.description || ''}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Keywords (comma separated)</label>
            <input type="text" class="form-input" id="editKeywords" value="${(photo.keywords || []).join(', ')}">
          </div>

          <div class="form-group">
            <label class="form-label">Category</label>
            <select class="form-select" id="editCategory">
              ${categories.map(c => `<option value="${c}" ${c === photo.category ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Asset Type</label>
            <select class="form-select" id="editAssetType">
              <option value="Photo" ${photo.assetType === 'Photo' || !photo.assetType ? 'selected' : ''}>📷 Photo</option>
              <option value="Illustration" ${photo.assetType === 'Illustration' ? 'selected' : ''}>🎨 Illustration</option>
              <option value="Vector" ${photo.assetType === 'Vector' ? 'selected' : ''}>✏️ Vector</option>
            </select>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-md);">
            <div class="form-group">
              <label class="form-label">Width</label>
              <input type="number" class="form-input" id="editWidth" value="${photo.width || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Height</label>
              <input type="number" class="form-input" id="editHeight" value="${photo.height || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Orientation</label>
              <select class="form-select" id="editOrientation">
                <option value="landscape" ${photo.orientation === 'landscape' ? 'selected' : ''}>Landscape</option>
                <option value="portrait" ${photo.orientation === 'portrait' ? 'selected' : ''}>Portrait</option>
                <option value="square" ${photo.orientation === 'square' ? 'selected' : ''}>Square</option>
              </select>
            </div>
          </div>

          <div style="display:flex;gap:var(--space-md);margin-top:var(--space-lg);">
            <button type="submit" class="btn btn-primary btn-lg" id="editBtn">
              ${Helpers.icon('check', 18)} Save Changes
            </button>
            <button type="button" class="btn btn-secondary btn-lg" style="color:var(--color-error)" 
                    onclick="AdminEdit.delete('${id}','${Helpers.escapeHtml(photo.title)}')">
              ${Helpers.icon('trash', 18)} Delete
            </button>
          </div>
        </form>
      `;

      // Form submit
      document.getElementById('editForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('editBtn');
        btn.disabled = true;
        btn.textContent = 'Saving...';

        try {
          const data = {
            title: document.getElementById('editTitle').value.trim(),
            slug: document.getElementById('editSlug').value.trim(),
            description: document.getElementById('editDescription').value.trim(),
            keywords: document.getElementById('editKeywords').value.split(',').map(k => k.trim().toLowerCase()).filter(k => k),
            category: document.getElementById('editCategory').value,
            assetType: document.getElementById('editAssetType').value,
            imageUrl: document.getElementById('editImageUrl').value.trim(),
            thumbUrl: document.getElementById('editThumbUrl').value.trim(),
            width: parseInt(document.getElementById('editWidth').value) || null,
            height: parseInt(document.getElementById('editHeight').value) || null,
            orientation: document.getElementById('editOrientation').value,
          };

          await FireDB.updatePhoto(id, data);
          Helpers.toast('Asset updated successfully!');
          Router.navigate('/admin/dashboard');
        } catch (err) {
          Helpers.toast('Failed to save: ' + err.message, 'error');
          btn.disabled = false;
          btn.textContent = 'Save Changes';
        }
      });
    } catch (e) {
      Helpers.toast('Failed to load asset', 'error');
      Router.navigate('/admin/dashboard');
    }
  },

  async delete(id, title) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await FireDB.deletePhoto(id);
      Helpers.toast('Asset deleted');
      Router.navigate('/admin/dashboard');
    } catch (e) {
      Helpers.toast('Failed to delete', 'error');
    }
  }
};
