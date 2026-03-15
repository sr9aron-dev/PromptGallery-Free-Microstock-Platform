/* ====================================
   PromptGallery — Batch Upload (Admin)
   AI Metadata via Groq + GitHub Upload
   ==================================== */

const GITHUB_REPO = 'sr9aron-dev/promptgallery-images';
const GITHUB_BRANCH = 'main';
const GROQ_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

const AdminUpload = {
  files: [],          // Array of { file, preview, metadata, status, cdnUrl }
  selectedIndex: -1,
  groqKeys: [],       // Array of API keys
  groqKeyIndex: 0,    // Current key index for rotation

  render() {
    if (!FireDB.isLoggedIn()) {
      Router.navigate('/admin/login');
      return;
    }

    // Load saved keys
    this.groqKeys = JSON.parse(localStorage.getItem('groq_keys') || '[]');
    this.groqKeyIndex = 0;
    this.files = [];
    this.selectedIndex = -1;

    const ghToken = localStorage.getItem('gh_token') || '';

    const app = document.getElementById('app');
    app.innerHTML = `
      ${Header.render()}
      <main class="page-content">
        <div class="admin-layout">
          ${AdminDashboard.renderSidebar('upload')}
          <div class="admin-main" style="padding:0;display:flex;flex-direction:column;height:calc(100vh - var(--header-height));">
            
            <!-- Top Bar -->
            <div style="padding:var(--space-lg) var(--space-xl);border-bottom:1px solid var(--color-border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;flex-wrap:wrap;gap:var(--space-sm);">
              <div style="display:flex;align-items:center;gap:var(--space-md);">
                <h1 style="font-size:var(--font-size-lg);margin:0;">Batch Upload</h1>
                <span id="fileCount" class="badge">0 files</span>
              </div>
              <div style="display:flex;gap:var(--space-sm);flex-wrap:wrap;">
                <button class="btn btn-ghost btn-sm" onclick="AdminUpload.showSettings()">⚙️ Settings</button>
                <button class="btn btn-secondary btn-sm" onclick="AdminUpload.aiGenerateAll()" id="aiAllBtn">🤖 AI Fill All</button>
                <button class="btn btn-primary btn-sm" onclick="AdminUpload.uploadAll()" id="uploadAllBtn">
                  ${Helpers.icon('upload', 16)} Upload All
                </button>
              </div>
            </div>

            <!-- Main Content: Grid + Sidebar -->
            <div style="display:flex;flex:1;overflow:hidden;">
              
              <!-- Left: Thumbnail Grid -->
              <div style="flex:1;overflow-y:auto;padding:var(--space-lg);" id="gridPanel">
                <!-- Dropzone -->
                <div class="upload-dropzone" id="dropzone" onclick="document.getElementById('fileInput').click()" 
                     style="min-height:200px;margin-bottom:var(--space-lg);">
                  <div class="upload-dropzone-icon">${Helpers.icon('image', 48)}</div>
                  <p style="color:var(--color-text-secondary);font-weight:500;">Click or drag & drop images here</p>
                  <p style="color:var(--color-text-muted);font-size:var(--font-size-xs);margin-top:4px;">Select multiple files • JPG, PNG, WebP • Max 20MB each</p>
                  <input type="file" id="fileInput" accept="image/jpeg,image/png,image/webp" multiple style="display:none">
                </div>
                
                <!-- Thumbnails Grid -->
                <div id="thumbnailGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:var(--space-sm);"></div>
                
                <!-- Batch Progress -->
                <div id="batchProgress" style="display:none;margin-top:var(--space-lg);padding:var(--space-lg);background:var(--color-bg-card);border:1px solid var(--color-border);border-radius:var(--radius-md);">
                  <div style="display:flex;justify-content:space-between;font-size:var(--font-size-sm);margin-bottom:var(--space-sm);">
                    <span id="batchLabel">Processing...</span>
                    <span id="batchPercent">0%</span>
                  </div>
                  <div style="width:100%;height:6px;background:var(--color-bg-tertiary);border-radius:var(--radius-full);overflow:hidden;">
                    <div id="batchBar" style="width:0%;height:100%;background:var(--gradient-hero);border-radius:var(--radius-full);transition:width 0.3s ease;"></div>
                  </div>
                </div>
              </div>

              <!-- Right: Metadata Sidebar -->
              <div id="metaSidebar" style="width:380px;border-left:1px solid var(--color-border);overflow-y:auto;background:var(--color-bg-secondary);flex-shrink:0;display:none;">
                <div id="metaContent" style="padding:var(--space-lg);"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Settings Modal -->
      <div id="settingsModal" class="modal-backdrop" style="display:none;">
        <div class="modal" style="max-width:550px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg);">
            <h2 class="modal-title" style="margin:0;">Settings</h2>
            <button class="btn-icon btn btn-ghost" onclick="AdminUpload.hideSettings()">${Helpers.icon('x', 20)}</button>
          </div>
          
          <!-- GitHub Token -->
          <div class="form-group">
            <label class="form-label">🔑 GitHub Token</label>
            <input type="password" class="form-input" id="settingsGhToken" value="${ghToken}" placeholder="ghp_xxxxxxxxxxxx">
            <small style="color:var(--color-text-muted);font-size:var(--font-size-xs);margin-top:4px;display:block;">
              <a href="https://github.com/settings/tokens/new?scopes=repo&description=PromptGallery" target="_blank" style="color:var(--color-primary-light);">Generate classic token with repo scope →</a>
            </small>
          </div>

          <!-- Groq API Keys (bulk) -->
          <div class="form-group">
            <label class="form-label">🤖 Groq API Keys (one per line)</label>
            <textarea class="form-textarea" id="settingsGroqKeys" rows="5" 
                      placeholder="gsk_xxxxxxxxxxxx&#10;gsk_yyyyyyyyyyyy&#10;gsk_zzzzzzzzzzzz">${this.groqKeys.join('\n')}</textarea>
            <small style="color:var(--color-text-muted);font-size:var(--font-size-xs);margin-top:4px;display:block;">
              Add multiple keys for rotation. If one fails, the next will be used automatically.
              <a href="https://console.groq.com/keys" target="_blank" style="color:var(--color-primary-light);">Get Groq API keys →</a>
            </small>
          </div>

          <div style="display:flex;gap:var(--space-sm);justify-content:flex-end;">
            <button class="btn btn-ghost" onclick="AdminUpload.hideSettings()">Cancel</button>
            <button class="btn btn-primary" onclick="AdminUpload.saveSettings()">Save Settings</button>
          </div>
        </div>
      </div>
    `;

    Header.init();
    this.initDropzone();
  },

  /* ─── Settings ─── */
  showSettings() {
    document.getElementById('settingsModal').style.display = 'flex';
  },
  hideSettings() {
    document.getElementById('settingsModal').style.display = 'none';
  },
  saveSettings() {
    const ghToken = document.getElementById('settingsGhToken').value.trim();
    if (ghToken) localStorage.setItem('gh_token', ghToken);

    const keysText = document.getElementById('settingsGroqKeys').value.trim();
    this.groqKeys = keysText.split('\n').map(k => k.trim()).filter(k => k.length > 0);
    localStorage.setItem('groq_keys', JSON.stringify(this.groqKeys));
    this.groqKeyIndex = 0;

    Helpers.toast(`Saved! ${this.groqKeys.length} Groq key(s) configured.`);
    this.hideSettings();
  },

  /* ─── Dropzone ─── */
  initDropzone() {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');

    ['dragenter', 'dragover'].forEach(evt => {
      dropzone.addEventListener(evt, e => { e.preventDefault(); dropzone.classList.add('dragover'); });
    });
    ['dragleave', 'drop'].forEach(evt => {
      dropzone.addEventListener(evt, e => { e.preventDefault(); dropzone.classList.remove('dragover'); });
    });
    dropzone.addEventListener('drop', e => {
      const files = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/'));
      this.addFiles(files);
    });
    fileInput.addEventListener('change', () => {
      this.addFiles([...fileInput.files]);
      fileInput.value = '';
    });
  },

  /* ─── Add Files ─── */
  addFiles(fileList) {
    let skippedDup = 0, skippedSD = 0;
    for (const file of fileList) {
      if (file.size > 20 * 1024 * 1024) continue;
      // Skip if already in current batch
      if (this.files.find(f => f.file.name === file.name && f.file.size === file.size)) continue;
      // Skip if already uploaded before (localStorage)
      const fileHash = Helpers.uploadedAssets.hash(file);
      if (Helpers.uploadedAssets.has(fileHash)) {
        skippedDup++;
        continue;
      }

      const entry = {
        file,
        fileHash,
        preview: null,
        metadata: { title: '', description: '', keywords: '', category: '', assetType: 'Photo', fileFormat: '', width: 0, height: 0, orientation: 'landscape' },
        status: 'pending', // pending, ai-loading, ready, uploading, done, error
        cdnUrl: null,
        errorMsg: null,
      };

      // Generate preview & check resolution
      const reader = new FileReader();
      reader.onload = (e) => {
        entry.preview = e.target.result;
        const img = new Image();
        img.onload = () => {
          entry.metadata.width = img.naturalWidth;
          entry.metadata.height = img.naturalHeight;
          entry.metadata.orientation = img.naturalWidth > img.naturalHeight ? 'landscape' : img.naturalHeight > img.naturalWidth ? 'portrait' : 'square';
          entry.metadata.fileFormat = (file.name.split('.').pop() || 'jpg').toUpperCase();
          // Reject non-HD (< 1280px width)
          if (!Helpers.isHD(img.naturalWidth)) {
            const idx = this.files.indexOf(entry);
            if (idx > -1) this.files.splice(idx, 1);
            skippedSD++;
            this.updateCount();
            this.renderGrid();
            Helpers.toast(`Skipped "${file.name}" — resolution too low (${img.naturalWidth}px). Minimum: 1280px (HD)`, 'error');
            return;
          }
          this.renderGrid();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      this.files.push(entry);
    }
    if (skippedDup > 0) Helpers.toast(`${skippedDup} file(s) skipped — already uploaded`, 'error');
    this.updateCount();
    this.renderGrid();
  },

  updateCount() {
    const el = document.getElementById('fileCount');
    if (el) el.textContent = `${this.files.length} file${this.files.length !== 1 ? 's' : ''}`;
  },

  /* ─── Thumbnail Grid ─── */
  renderGrid() {
    const grid = document.getElementById('thumbnailGrid');
    if (!grid) return;

    grid.innerHTML = this.files.map((entry, i) => {
      const isSelected = i === this.selectedIndex;
      const statusIcon = {
        'pending': '',
        'ai-loading': '<div class="spinner" style="width:20px;height:20px;border-width:2px;"></div>',
        'ready': `<span style="color:var(--color-success);">${Helpers.icon('check', 16)}</span>`,
        'uploading': '<div class="spinner" style="width:20px;height:20px;border-width:2px;"></div>',
        'done': `<span style="color:var(--color-success);font-size:var(--font-size-lg);">✅</span>`,
        'error': `<span style="color:var(--color-error);">⚠️</span>`,
      }[entry.status] || '';

      const hasTitle = entry.metadata.title ? 'border-color:var(--color-success);' : '';
      const resLabel = Helpers.getResolutionLabel(entry.metadata.width);

      return `
        <div onclick="AdminUpload.selectFile(${i})" 
             style="position:relative;border-radius:var(--radius-sm);overflow:hidden;cursor:pointer;
                    border:2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'};
                    ${hasTitle}aspect-ratio:1;background:var(--color-bg-tertiary);transition:all var(--transition-fast);">
          ${entry.preview 
            ? `<img src="${entry.preview}" style="width:100%;height:100%;object-fit:cover;" alt="">` 
            : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">${Helpers.icon('image', 24)}</div>`
          }
          <!-- Resolution badge -->
          ${entry.metadata.width ? `<span style="position:absolute;top:4px;left:28px;background:${entry.metadata.width >= 3840 ? '#FFD700' : entry.metadata.width >= 2048 ? '#00CEC9' : '#6C5CE7'};color:#000;font-size:9px;font-weight:800;padding:1px 5px;border-radius:3px;">${resLabel}</span>` : ''}
          <!-- Status badge -->
          <div style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.6);border-radius:var(--radius-xs);padding:2px 4px;display:flex;align-items:center;">
            ${statusIcon}
          </div>
          <!-- Remove button -->
          <button onclick="event.stopPropagation();AdminUpload.removeFile(${i})" 
                  style="position:absolute;top:4px;left:4px;background:rgba(0,0,0,0.6);border:none;color:white;border-radius:var(--radius-xs);width:22px;height:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;"
                  title="Remove">✕</button>
          <!-- Index -->
          <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.6);padding:2px 6px;font-size:10px;color:var(--color-text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${entry.metadata.title || entry.file.name}
          </div>
        </div>`;
    }).join('');
  },

  removeFile(index) {
    this.files.splice(index, 1);
    if (this.selectedIndex === index) { this.selectedIndex = -1; this.renderMeta(); }
    else if (this.selectedIndex > index) this.selectedIndex--;
    this.updateCount();
    this.renderGrid();
  },

  /* ─── Select & Metadata Sidebar ─── */
  selectFile(index) {
    this.saveCurrentMeta(); // save before switching
    this.selectedIndex = index;
    this.renderGrid();
    this.renderMeta();
  },

  saveCurrentMeta() {
    if (this.selectedIndex < 0 || this.selectedIndex >= this.files.length) return;
    const entry = this.files[this.selectedIndex];
    const t = id => { const el = document.getElementById(id); return el ? el.value : ''; };
    entry.metadata.title = t('metaTitle');
    entry.metadata.description = t('metaDesc');
    entry.metadata.keywords = t('metaKeywords');
    entry.metadata.category = t('metaCategory');
    entry.metadata.assetType = t('metaAssetType');
  },

  renderMeta() {
    const sidebar = document.getElementById('metaSidebar');
    const content = document.getElementById('metaContent');
    if (this.selectedIndex < 0 || !this.files[this.selectedIndex]) {
      sidebar.style.display = 'none';
      return;
    }

    sidebar.style.display = 'block';
    const entry = this.files[this.selectedIndex];
    const m = entry.metadata;
    const categories = [
      'Animals', 'Architecture', 'Business', 'Food', 'Nature', 'People',
      'Technology', 'Backgrounds', 'Objects', 'Travel', 'Lifestyle', 'Abstract',
      'Education', 'Health', 'Sports', 'Industry', 'Environment'
    ];

    content.innerHTML = `
      <!-- Preview -->
      <div style="border-radius:var(--radius-sm);overflow:hidden;margin-bottom:var(--space-md);max-height:200px;">
        ${entry.preview ? `<img src="${entry.preview}" style="width:100%;height:200px;object-fit:cover;">` : ''}
      </div>
      <div style="font-size:var(--font-size-xs);color:var(--color-text-muted);margin-bottom:var(--space-md);">
        ${entry.file.name} • ${m.width}×${m.height} • ${(entry.file.size/1024/1024).toFixed(1)}MB
      </div>

      ${entry.status === 'done' ? `<div style="padding:var(--space-sm);background:rgba(0,184,148,0.1);border:1px solid rgba(0,184,148,0.3);border-radius:var(--radius-sm);color:var(--color-success);font-size:var(--font-size-sm);margin-bottom:var(--space-md);">✅ Uploaded & Published</div>` : ''}
      ${entry.status === 'error' ? `<div style="padding:var(--space-sm);background:rgba(255,107,107,0.1);border:1px solid rgba(255,107,107,0.3);border-radius:var(--radius-sm);color:var(--color-error);font-size:var(--font-size-sm);margin-bottom:var(--space-md);">⚠️ ${entry.errorMsg || 'Upload failed'}</div>` : ''}

      <!-- AI Button -->
      <button class="btn btn-secondary btn-sm" style="width:100%;margin-bottom:var(--space-lg);" 
              onclick="AdminUpload.aiGenerateSingle(${this.selectedIndex})" id="aiSingleBtn"
              ${entry.status === 'ai-loading' ? 'disabled' : ''}>
        ${entry.status === 'ai-loading' ? '⏳ Generating...' : '🤖 AI Generate Metadata'}
      </button>

      <!-- Title -->
      <div class="form-group">
        <label class="form-label">Title</label>
        <input type="text" class="form-input" id="metaTitle" value="${this.escAttr(m.title)}" placeholder="e.g. Mountain Sunset">
      </div>

      <!-- Description -->
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-textarea" id="metaDesc" rows="5" placeholder="200-400 words for SEO...">${m.description || ''}</textarea>
        <small style="color:var(--color-text-muted);font-size:var(--font-size-xs);margin-top:2px;display:block;">
          Words: <span id="metaWordCount">${(m.description || '').trim().split(/\s+/).filter(w=>w).length}</span>
        </small>
      </div>

      <!-- Keywords -->
      <div class="form-group">
        <label class="form-label">Keywords</label>
        <input type="text" class="form-input" id="metaKeywords" value="${this.escAttr(m.keywords)}" placeholder="sunset, mountain, nature">
      </div>

      <!-- Category -->
      <div class="form-group">
        <label class="form-label">Category</label>
        <select class="form-select" id="metaCategory">
          <option value="">Select</option>
          ${categories.map(c => `<option value="${c}" ${c === m.category ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </div>

      <!-- Asset Type -->
      <div class="form-group">
        <label class="form-label">Asset Type</label>
        <select class="form-select" id="metaAssetType">
          <option value="Photo" ${m.assetType === 'Photo' ? 'selected' : ''}>📷 Photo</option>
          <option value="Illustration" ${m.assetType === 'Illustration' ? 'selected' : ''}>🎨 Illustration</option>
          <option value="Vector" ${m.assetType === 'Vector' ? 'selected' : ''}>✏️ Vector</option>
        </select>
      </div>

      <!-- Dimensions (read-only) -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-sm);font-size:var(--font-size-sm);color:var(--color-text-muted);margin-top:var(--space-sm);">
        <div>${m.width}×${m.height}px</div>
        <div>${m.orientation}</div>
        <div>${m.fileFormat || 'JPG'}</div>
      </div>
    `;

    // Live word count
    const descEl = document.getElementById('metaDesc');
    if (descEl) {
      descEl.addEventListener('input', () => {
        const wc = descEl.value.trim().split(/\s+/).filter(w => w).length;
        document.getElementById('metaWordCount').textContent = wc;
      });
    }
  },

  escAttr(str) {
    return (str || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  },

  /* ─── Groq AI: Rotate Keys ─── */
  getNextGroqKey() {
    if (this.groqKeys.length === 0) return null;
    const key = this.groqKeys[this.groqKeyIndex % this.groqKeys.length];
    return key;
  },
  rotateKey() {
    this.groqKeyIndex = (this.groqKeyIndex + 1) % this.groqKeys.length;
  },

  /**
   * Resize image for AI (save tokens: max 512px)
   */
  async resizeForAI(dataUrl, maxSize = 512) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > h) { if (w > maxSize) { h = h * maxSize / w; w = maxSize; } }
        else { if (h > maxSize) { w = w * maxSize / h; h = maxSize; } }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.src = dataUrl;
    });
  },

  /**
   * Call Groq API with key rotation
   */
  async callGroq(imageBase64, retries = 0) {
    const key = this.getNextGroqKey();
    if (!key) throw new Error('No Groq API keys configured. Go to Settings.');

    const maxRetries = Math.min(this.groqKeys.length, 5);

    try {
      const res = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You generate metadata for stock images. Reply ONLY valid JSON: {"title":"...(max 10 words)","description":"...(200-300 words, SEO)","keywords":"...(15-20 comma separated)","category":"...(one of: Animals,Architecture,Business,Food,Nature,People,Technology,Backgrounds,Objects,Travel,Lifestyle,Abstract,Education,Health,Sports,Industry,Environment)","assetType":"...(one of: Photo,Illustration,Vector)"}'
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Generate stock photo metadata for this image. JSON only.' },
                { type: 'image_url', image_url: { url: imageBase64 } }
              ]
            }
          ],
          temperature: 0.3,
          max_completion_tokens: 512,
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        // Rate limit or auth error → rotate key
        if ((res.status === 429 || res.status === 401 || res.status === 403) && retries < maxRetries) {
          console.warn(`Groq key ${this.groqKeyIndex} failed (${res.status}), rotating...`);
          this.rotateKey();
          return this.callGroq(imageBase64, retries + 1);
        }
        throw new Error(err.error?.message || `Groq API error ${res.status}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || '';
      
      // Parse JSON from response (handle possible markdown wrapping)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('AI returned invalid format');
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Rotate key for next call (distribute load)
      this.rotateKey();
      return parsed;
    } catch (e) {
      if (retries < maxRetries && (e.message.includes('rate') || e.message.includes('limit') || e.message.includes('429'))) {
        this.rotateKey();
        return this.callGroq(imageBase64, retries + 1);
      }
      throw e;
    }
  },

  /* ─── AI Single ─── */
  async aiGenerateSingle(index) {
    const entry = this.files[index];
    if (!entry || !entry.preview) return;
    if (this.groqKeys.length === 0) {
      Helpers.toast('Add Groq API keys in Settings first', 'error');
      this.showSettings();
      return;
    }

    entry.status = 'ai-loading';
    this.renderGrid();
    this.renderMeta();

    try {
      const smallImage = await this.resizeForAI(entry.preview);
      const result = await this.callGroq(smallImage);

      entry.metadata.title = result.title || '';
      entry.metadata.description = result.description || '';
      entry.metadata.keywords = result.keywords || '';
      entry.metadata.category = result.category || '';
      entry.metadata.assetType = result.assetType || 'Photo';
      entry.status = 'ready';

      Helpers.toast(`AI metadata generated for "${entry.file.name}"`);
    } catch (e) {
      console.error('AI error:', e);
      entry.status = 'pending';
      Helpers.toast('AI failed: ' + e.message, 'error');
    }

    this.renderGrid();
    if (this.selectedIndex === index) this.renderMeta();
  },

  /* ─── AI All ─── */
  async aiGenerateAll() {
    if (this.groqKeys.length === 0) {
      Helpers.toast('Add Groq API keys in Settings first', 'error');
      this.showSettings();
      return;
    }

    const pending = this.files.filter(f => !f.metadata.title && f.status !== 'done');
    if (pending.length === 0) {
      Helpers.toast('All files already have metadata');
      return;
    }

    const btn = document.getElementById('aiAllBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Generating...';

    this.showBatchProgress('Generating AI metadata...', 0);
    let done = 0;

    for (const entry of pending) {
      if (!entry.preview) continue;
      
      entry.status = 'ai-loading';
      this.renderGrid();

      try {
        const smallImage = await this.resizeForAI(entry.preview);
        const result = await this.callGroq(smallImage);

        entry.metadata.title = result.title || '';
        entry.metadata.description = result.description || '';
        entry.metadata.keywords = result.keywords || '';
        entry.metadata.category = result.category || '';
        entry.status = 'ready';
      } catch (e) {
        console.error('AI error for', entry.file.name, e);
        entry.status = 'pending';
      }

      done++;
      this.showBatchProgress(`AI: ${done}/${pending.length}`, Math.round(done / pending.length * 100));
      this.renderGrid();
      if (this.selectedIndex >= 0) this.renderMeta();

      // Small delay between requests to avoid rate limiting
      if (done < pending.length) await new Promise(r => setTimeout(r, 300));
    }

    btn.disabled = false;
    btn.textContent = '🤖 AI Fill All';
    this.hideBatchProgress();
    Helpers.toast(`AI metadata generated for ${done} files!`);
  },

  /* ─── Upload All to GitHub + Firestore ─── */
  async uploadAll() {
    const token = localStorage.getItem('gh_token');
    if (!token) {
      Helpers.toast('Set GitHub token in Settings first', 'error');
      this.showSettings();
      return;
    }

    // Save current meta
    this.saveCurrentMeta();

    const toUpload = this.files.filter(f => f.status !== 'done' && f.metadata.title && f.metadata.category);
    if (toUpload.length === 0) {
      Helpers.toast('No files ready to upload. Add titles and pick a category first.', 'error');
      return;
    }

    const btn = document.getElementById('uploadAllBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Uploading...';

    this.showBatchProgress('Uploading...', 0);
    let done = 0;

    for (const entry of toUpload) {
      entry.status = 'uploading';
      this.renderGrid();

      try {
        // 1. Upload to GitHub
        this.showBatchProgress(`Uploading ${done + 1}/${toUpload.length}: ${entry.file.name}`, Math.round(done / toUpload.length * 100));
        
        const base64 = await this.fileToBase64(entry.file);
        const ext = entry.file.name.split('.').pop().toLowerCase();
        const slug = Helpers.generateSlug(entry.file.name.replace(/\.[^.]+$/, ''));
        const catFolder = Helpers.generateSlug(entry.metadata.category || 'uncategorized');
        const filePath = `images/${catFolder}/${Date.now()}-${slug}.${ext}`;

        const ghRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Upload: ${entry.metadata.title}`,
            content: base64,
            branch: GITHUB_BRANCH,
          })
        });

        if (!ghRes.ok) {
          const err = await ghRes.json().catch(() => ({}));
          throw new Error(err.message || `GitHub error ${ghRes.status}`);
        }

        const cdnUrl = `https://cdn.jsdelivr.net/gh/${GITHUB_REPO}@${GITHUB_BRANCH}/${filePath}`;
        entry.cdnUrl = cdnUrl;

        // 2. Save to Firestore
        const keywords = (entry.metadata.keywords || '')
          .split(',')
          .map(k => k.trim().toLowerCase())
          .filter(k => k.length > 0);

        await FireDB.addPhoto({
          title: entry.metadata.title,
          slug: Helpers.generateSlug(entry.metadata.title),
          description: entry.metadata.description,
          keywords,
          category: entry.metadata.category,
          assetType: entry.metadata.assetType || 'Photo',
          fileFormat: entry.metadata.fileFormat || 'JPG',
          imageUrl: cdnUrl,
          thumbUrl: cdnUrl,
          width: entry.metadata.width || null,
          height: entry.metadata.height || null,
          orientation: entry.metadata.orientation,
        });

        entry.status = 'done';
        // Track in localStorage to prevent re-upload
        if (entry.fileHash) Helpers.uploadedAssets.add(entry.fileHash);
      } catch (e) {
        console.error('Upload error:', entry.file.name, e);
        entry.status = 'error';
        entry.errorMsg = e.message;
      }

      done++;
      this.showBatchProgress(`Uploaded ${done}/${toUpload.length}`, Math.round(done / toUpload.length * 100));
      this.renderGrid();
      if (this.selectedIndex >= 0) this.renderMeta();
    }

    // Remove successfully uploaded files from grid
    const successCount = toUpload.filter(f => f.status === 'done').length;
    this.files = this.files.filter(f => f.status !== 'done');
    this.selectedIndex = -1;
    this.updateCount();
    this.renderGrid();
    this.renderMeta();

    btn.disabled = false;
    btn.innerHTML = `${Helpers.icon('upload', 16)} Upload All`;
    this.showBatchProgress(`Done! ${successCount}/${toUpload.length} uploaded`, 100);
    Helpers.toast(`${successCount} assets uploaded & published! 🎉`);
  },

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  /* ─── Progress ─── */
  showBatchProgress(label, percent) {
    const el = document.getElementById('batchProgress');
    if (el) {
      el.style.display = 'block';
      document.getElementById('batchLabel').textContent = label;
      document.getElementById('batchPercent').textContent = percent + '%';
      document.getElementById('batchBar').style.width = percent + '%';
    }
  },
  hideBatchProgress() {
    const el = document.getElementById('batchProgress');
    if (el) setTimeout(() => { el.style.display = 'none'; }, 2000);
  },
};
