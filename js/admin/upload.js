/* ====================================
   PromptGallery — Upload Page (Admin)
   Auto-upload to GitHub + Firestore
   ==================================== */

const GITHUB_REPO = 'sr9aron-dev/promptgallery-images';
const GITHUB_BRANCH = 'main';

const AdminUpload = {
  selectedFile: null,

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

    // Check if token is saved
    const savedToken = localStorage.getItem('gh_token') || '';

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

            <!-- GitHub Token (one-time setup) -->
            <div id="tokenSection" style="margin-bottom:var(--space-xl);padding:var(--space-lg);background:var(--color-bg-card);border:1px solid var(--color-border);border-radius:var(--radius-md);${savedToken ? 'display:none' : ''}">
              <h3 style="font-size:var(--font-size-base);margin-bottom:var(--space-sm);">🔑 GitHub Token (one-time setup)</h3>
              <p style="font-size:var(--font-size-sm);color:var(--color-text-muted);margin-bottom:var(--space-md);">
                Needed to auto-upload images to your GitHub repo. 
                <a href="https://github.com/settings/tokens/new?scopes=repo&description=PromptGallery" target="_blank" style="color:var(--color-primary-light);">Get token here →</a>
              </p>
              <div style="display:flex;gap:var(--space-sm);">
                <input type="password" class="form-input" id="ghTokenInput" placeholder="ghp_xxxxxxxxxxxx" value="${savedToken}" style="flex:1;">
                <button type="button" class="btn btn-primary" onclick="AdminUpload.saveToken()">Save Token</button>
              </div>
            </div>
            ${savedToken ? `<div style="margin-bottom:var(--space-lg);font-size:var(--font-size-sm);color:var(--color-text-muted);">✅ GitHub token saved. <a href="javascript:void(0)" onclick="document.getElementById('tokenSection').style.display='block'" style="color:var(--color-primary-light);">Change</a></div>` : ''}

            <form id="uploadForm" class="upload-form">
              <!-- Drag & Drop Upload -->
              <div class="form-group">
                <label class="form-label">Image File</label>
                <div class="upload-dropzone" id="dropzone" onclick="document.getElementById('fileInput').click()">
                  <div class="upload-dropzone-icon">${Helpers.icon('image', 48)}</div>
                  <p style="color:var(--color-text-secondary);font-weight:500;">Click to select or drag & drop image here</p>
                  <p style="color:var(--color-text-muted);font-size:var(--font-size-xs);margin-top:var(--space-xs);">JPG, PNG, WebP — Max 20MB</p>
                  <input type="file" id="fileInput" accept="image/jpeg,image/png,image/webp" style="display:none">
                </div>
                <!-- Preview -->
                <div id="imagePreview" style="display:none;margin-top:var(--space-md);position:relative;">
                  <img id="previewImg" style="max-height:250px;border-radius:var(--radius-md);border:1px solid var(--color-border);">
                  <div id="previewInfo" style="margin-top:var(--space-sm);font-size:var(--font-size-sm);color:var(--color-text-muted);"></div>
                  <button type="button" style="position:absolute;top:8px;right:8px;" class="btn-icon btn btn-ghost" onclick="AdminUpload.clearFile()">
                    ${Helpers.icon('x', 18)}
                  </button>
                </div>
              </div>

              <!-- Upload progress -->
              <div id="uploadProgress" style="display:none;margin-bottom:var(--space-lg);">
                <div style="display:flex;justify-content:space-between;font-size:var(--font-size-sm);margin-bottom:var(--space-xs);">
                  <span id="progressLabel">Uploading to GitHub...</span>
                  <span id="progressPercent">0%</span>
                </div>
                <div style="width:100%;height:6px;background:var(--color-bg-tertiary);border-radius:var(--radius-full);overflow:hidden;">
                  <div id="progressBar" style="width:0%;height:100%;background:var(--gradient-hero);border-radius:var(--radius-full);transition:width 0.3s ease;"></div>
                </div>
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
                          placeholder="Write a detailed description of this asset..." required></textarea>
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

              <!-- Dimensions (auto-detected) -->
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-md);">
                <div class="form-group">
                  <label class="form-label">Width (px) <span style="color:var(--color-text-muted);font-size:var(--font-size-xs);">auto</span></label>
                  <input type="number" class="form-input" id="uploadWidth" placeholder="auto-detected">
                </div>
                <div class="form-group">
                  <label class="form-label">Height (px) <span style="color:var(--color-text-muted);font-size:var(--font-size-xs);">auto</span></label>
                  <input type="number" class="form-input" id="uploadHeight" placeholder="auto-detected">
                </div>
                <div class="form-group">
                  <label class="form-label">Orientation <span style="color:var(--color-text-muted);font-size:var(--font-size-xs);">auto</span></label>
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
                  ${Helpers.icon('upload', 18)} Upload & Publish
                </button>
                <button type="button" class="btn btn-secondary btn-lg" onclick="AdminUpload.clearForm()">
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    `;
    Header.init();
    this.selectedFile = null;
    this.initDropzone();
    this.initForm();
  },

  saveToken() {
    const token = document.getElementById('ghTokenInput').value.trim();
    if (!token) {
      Helpers.toast('Please enter a valid token', 'error');
      return;
    }
    localStorage.setItem('gh_token', token);
    Helpers.toast('GitHub token saved!');
    document.getElementById('tokenSection').style.display = 'none';
    // Re-render to show "token saved" message
    this.render();
  },

  initDropzone() {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');

    // Drag & drop
    ['dragenter', 'dragover'].forEach(evt => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
    });
    ['dragleave', 'drop'].forEach(evt => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      });
    });
    dropzone.addEventListener('drop', (e) => {
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) this.handleFile(file);
    });

    // File input
    fileInput.addEventListener('change', () => {
      if (fileInput.files[0]) this.handleFile(fileInput.files[0]);
    });
  },

  handleFile(file) {
    if (file.size > 20 * 1024 * 1024) {
      Helpers.toast('File too large. Max 20MB.', 'error');
      return;
    }

    this.selectedFile = file;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewDiv = document.getElementById('imagePreview');
      const previewImg = document.getElementById('previewImg');
      const previewInfo = document.getElementById('previewInfo');
      previewImg.src = e.target.result;
      previewDiv.style.display = 'block';



      // Auto-detect dimensions
      const img = new Image();
      img.onload = () => {
        document.getElementById('uploadWidth').value = img.naturalWidth;
        document.getElementById('uploadHeight').value = img.naturalHeight;
        
        // Auto-set orientation
        const orient = document.getElementById('uploadOrientation');
        if (img.naturalWidth > img.naturalHeight) orient.value = 'landscape';
        else if (img.naturalHeight > img.naturalWidth) orient.value = 'portrait';
        else orient.value = 'square';

        previewInfo.textContent = `${file.name} — ${img.naturalWidth}×${img.naturalHeight} — ${(file.size / 1024 / 1024).toFixed(2)} MB`;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);

    // Update dropzone text
    document.getElementById('dropzone').style.display = 'none';
  },

  clearFile() {
    this.selectedFile = null;
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('dropzone').style.display = '';
    document.getElementById('fileInput').value = '';
    document.getElementById('uploadWidth').value = '';
    document.getElementById('uploadHeight').value = '';
  },

  clearForm() {
    document.getElementById('uploadForm').reset();
    this.clearFile();
    document.getElementById('wordCount').textContent = '0';
  },

  initForm() {
    // Word count
    const descInput = document.getElementById('uploadDescription');
    descInput.addEventListener('input', () => {
      const words = descInput.value.trim().split(/\s+/).filter(w => w.length > 0).length;
      document.getElementById('wordCount').textContent = words;
    });

    // Form submit
    document.getElementById('uploadForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const token = localStorage.getItem('gh_token');
      if (!token) {
        Helpers.toast('Please set your GitHub token first', 'error');
        document.getElementById('tokenSection').style.display = 'block';
        return;
      }

      if (!this.selectedFile) {
        Helpers.toast('Please select an image file', 'error');
        return;
      }

      const btn = document.getElementById('uploadBtn');
      btn.disabled = true;
      btn.textContent = 'Uploading...';

      try {
        // Step 1: Upload to GitHub
        this.showProgress('Uploading image to GitHub...', 10);
        const category = document.getElementById('uploadCategory').value;
        const cdnUrl = await this.uploadToGitHub(this.selectedFile, category, token);
        
        this.showProgress('Image uploaded! Saving metadata...', 70);

        // Step 2: Save metadata to Firestore
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
          category,
          imageUrl: cdnUrl,
          thumbUrl: cdnUrl,
          width: parseInt(document.getElementById('uploadWidth').value) || null,
          height: parseInt(document.getElementById('uploadHeight').value) || null,
          orientation: document.getElementById('uploadOrientation').value,
        };

        await FireDB.addPhoto(data);
        
        this.showProgress('Published!', 100);
        Helpers.toast('Asset uploaded & published successfully! 🎉');
        
        setTimeout(() => Router.navigate('/admin/dashboard'), 1000);
      } catch (err) {
        console.error('Upload error:', err);
        Helpers.toast('Upload failed: ' + err.message, 'error');
        btn.disabled = false;
        btn.innerHTML = `${Helpers.icon('upload', 18)} Upload & Publish`;
        document.getElementById('uploadProgress').style.display = 'none';
      }
    });
  },

  showProgress(label, percent) {
    const el = document.getElementById('uploadProgress');
    el.style.display = 'block';
    document.getElementById('progressLabel').textContent = label;
    document.getElementById('progressPercent').textContent = percent + '%';
    document.getElementById('progressBar').style.width = percent + '%';
  },

  /**
   * Upload file to GitHub via API and return jsDelivr CDN URL
   */
  async uploadToGitHub(file, category, token) {
    // Read file as base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Generate filename: category/timestamp-slugified-name.ext
    const ext = file.name.split('.').pop().toLowerCase();
    const slug = Helpers.generateSlug(file.name.replace(/\.[^.]+$/, ''));
    const timestamp = Date.now();
    const catFolder = Helpers.generateSlug(category || 'uncategorized');
    const filePath = `images/${catFolder}/${timestamp}-${slug}.${ext}`;

    this.showProgress('Pushing to GitHub...', 30);

    // GitHub API: Create or update file
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: `Upload: ${file.name}`,
        content: base64,
        branch: GITHUB_BRANCH,
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || `GitHub API error: ${response.status}`);
    }

    this.showProgress('Generating CDN URL...', 60);

    // Return jsDelivr CDN URL
    const cdnUrl = `https://cdn.jsdelivr.net/gh/${GITHUB_REPO}@${GITHUB_BRANCH}/${filePath}`;
    return cdnUrl;
  }
};
