/* ====================================
   PromptGallery — Admin Dashboard
   ==================================== */

const AdminDashboard = {
  async render() {
    if (!FireDB.isLoggedIn()) {
      Router.navigate('/admin/login');
      return;
    }

    const app = document.getElementById('app');
    app.innerHTML = `
      ${Header.render()}
      <main class="page-content">
        <div class="admin-layout">
          ${this.renderSidebar('dashboard')}
          <div class="admin-main">
            <div class="admin-header">
              <h1>Dashboard</h1>
              <button class="btn btn-primary" onclick="Router.navigate('/admin/upload')">
                ${Helpers.icon('upload', 18)} Upload Asset
              </button>
              <button class="btn btn-secondary" onclick="SitemapGenerator.download()">
                📄 Sitemap
              </button>
            </div>

            <!-- Stats -->
            <div class="stats-grid" id="adminStats">
              <div class="stat-card">
                <div class="stat-card-value skeleton" style="width:80px;height:2rem;" id="statTotalAssets">&nbsp;</div>
                <div class="stat-card-label">Total Assets</div>
              </div>
              <div class="stat-card">
                <div class="stat-card-value skeleton" style="width:80px;height:2rem;" id="statTotalViews">&nbsp;</div>
                <div class="stat-card-label">Total Views</div>
              </div>
              <div class="stat-card">
                <div class="stat-card-value skeleton" style="width:80px;height:2rem;" id="statTotalDownloads">&nbsp;</div>
                <div class="stat-card-label">Total Downloads</div>
              </div>
              <div class="stat-card">
                <div class="stat-card-value skeleton" style="width:80px;height:2rem;" id="statCategories">&nbsp;</div>
                <div class="stat-card-label">Categories</div>
              </div>
            </div>

            <!-- Assets Table -->
            <h2 style="font-size:var(--font-size-lg);margin-bottom:var(--space-md);">All Assets</h2>
            <div class="data-table-wrapper" id="assetsTable">
              <div style="padding:var(--space-2xl);text-align:center;">
                <div class="spinner" style="margin:0 auto;"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    `;
    Header.init();

    // Load data
    this.loadStats();
    this.loadAssets();
  },

  renderSidebar(active) {
    return `
    <aside class="admin-sidebar">
      <h3 style="margin-bottom:var(--space-lg);font-size:var(--font-size-base);">Admin Panel</h3>
      <nav class="admin-sidebar-nav">
        <a href="#/admin/dashboard" class="${active === 'dashboard' ? 'active' : ''}">
          ${Helpers.icon('chart', 18)} Dashboard
        </a>
        <a href="#/admin/upload" class="${active === 'upload' ? 'active' : ''}">
          ${Helpers.icon('upload', 18)} Upload Asset
        </a>
        <a href="#/" target="_blank">
          ${Helpers.icon('eye', 18)} View Site
        </a>
        <a href="javascript:void(0)" onclick="FireDB.logout().then(()=>Router.navigate('/admin/login'))">
          ${Helpers.icon('x', 18)} Logout
        </a>
      </nav>
    </aside>`;
  },

  async loadStats() {
    try {
      const stats = await FireDB.getStats();
      document.getElementById('statTotalAssets').textContent = Helpers.formatNumber(stats.totalPhotos);
      document.getElementById('statTotalAssets').classList.remove('skeleton');
      document.getElementById('statTotalViews').textContent = Helpers.formatNumber(stats.totalViews);
      document.getElementById('statTotalViews').classList.remove('skeleton');
      document.getElementById('statTotalDownloads').textContent = Helpers.formatNumber(stats.totalDownloads);
      document.getElementById('statTotalDownloads').classList.remove('skeleton');

      const cats = await FireDB.getCategories();
      document.getElementById('statCategories').textContent = cats.length || '16';
      document.getElementById('statCategories').classList.remove('skeleton');
    } catch (e) {
      console.warn('Stats load error:', e.message);
    }
  },

  async loadAssets() {
    try {
      const photos = await FireDB.getPhotos({ limit: 50 });
      const tableEl = document.getElementById('assetsTable');
      
      if (photos.length === 0) {
        tableEl.innerHTML = `
          <div style="padding:var(--space-2xl);text-align:center;color:var(--color-text-muted);">
            No assets yet. <a href="#/admin/upload">Upload your first asset</a>.
          </div>`;
        return;
      }

      tableEl.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Views</th>
              <th>Downloads</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${photos.map(photo => `
              <tr>
                <td><img src="${photo.thumbUrl || photo.imageUrl}" class="data-table-thumb" alt="" onerror="this.style.display='none'"></td>
                <td><strong>${Helpers.escapeHtml(Helpers.truncateText(photo.title, 40))}</strong></td>
                <td>${photo.category || '—'}</td>
                <td>${Helpers.formatNumber(photo.views)}</td>
                <td>${Helpers.formatNumber(photo.downloads)}</td>
                <td>${Helpers.formatDate(photo.uploadDate)}</td>
                <td>
                  <div style="display:flex;gap:var(--space-xs);">
                    <button class="btn btn-ghost btn-sm" onclick="Router.navigate('/admin/edit/${photo.id}')" title="Edit">
                      ${Helpers.icon('edit', 16)}
                    </button>
                    <button class="btn btn-ghost btn-sm" style="color:var(--color-error)" onclick="AdminDashboard.deleteAsset('${photo.id}','${Helpers.escapeHtml(photo.title)}')" title="Delete">
                      ${Helpers.icon('trash', 16)}
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>`;
    } catch (e) {
      console.warn('Assets load error:', e.message);
    }
  },

  async deleteAsset(id, title) {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      await FireDB.deletePhoto(id);
      Helpers.toast('Asset deleted successfully');
      this.loadAssets();
      this.loadStats();
    } catch (e) {
      Helpers.toast('Failed to delete asset', 'error');
    }
  }
};
