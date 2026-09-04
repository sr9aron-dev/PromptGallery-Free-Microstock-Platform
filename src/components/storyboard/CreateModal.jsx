import React, { useState, useRef } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Video, 
  Sparkles, 
  UploadCloud, 
  Cloud, 
  Link as LinkIcon, 
  FileCode, 
  Loader2, 
  Trash2 
} from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';
import { uploadToCloudinary, CLOUDINARY_CONFIG } from '../../services/cloudinary';

export default function CreateModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('image');
  const [category, setCategory] = useState('Cinematic');
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');

  // Upload source mode: 'file' (direct to Cloudinary) or 'url'
  const [uploadMode, setUploadMode] = useState('file');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [mediaUrl, setMediaUrl] = useState('');

  // Cloudinary upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const availableCategories = CATEGORIES.filter(c => c !== 'All');
  const activeCloudConfig = type === 'video' ? CLOUDINARY_CONFIG.video : CLOUDINARY_CONFIG.image;

  // Handle file selection
  const handleFileChange = (file) => {
    if (!file) return;

    // Detect format
    const isVideoFile = file.type.startsWith('video/');
    if (isVideoFile) {
      setType('video');
    } else if (file.type.startsWith('image/')) {
      setType('image');
    }

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);
    setError('');

    // Auto-fill title if empty
    if (!title.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    let finalMediaUrl = mediaUrl.trim();
    let finalThumbnail = mediaUrl.trim();

    // Direct Cloudinary Upload Flow
    if (uploadMode === 'file' && selectedFile) {
      try {
        setIsUploading(true);
        setUploadProgress(10);

        const uploadResult = await uploadToCloudinary(
          selectedFile, 
          type, 
          (progress) => setUploadProgress(progress)
        );

        finalMediaUrl = uploadResult.url;
        finalThumbnail = uploadResult.thumbnailUrl;
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        setError(err.message || 'Failed to upload media to Cloudinary. Check presets in .env.');
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    } else if (!finalMediaUrl) {
      // Fallback curated media if no file and no URL entered
      finalThumbnail = type === 'video'
        ? 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=900&q=80'
        : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80';
      finalMediaUrl = type === 'video'
        ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        : finalThumbnail;
    }

    onCreate({
      title: title.trim(),
      type,
      category,
      thumbnail: finalThumbnail,
      mediaUrl: finalMediaUrl,
      prompt: prompt.trim() || 'No prompt provided.',
      aspectRatio: '16:9',
      createdAt: 'Just now',
      parameters: { 
        model: 'Flux.1 / Midjourney', 
        storage: `Cloudinary (${activeCloudConfig.cloudName})`,
        uploaded: new Date().toLocaleTimeString() 
      }
    });

    // Reset state & close
    handleRemoveFile();
    setTitle('');
    setMediaUrl('');
    setPrompt('');
    setError('');
    setIsUploading(false);
    setUploadProgress(0);
    onClose();
  };

  const handleFillSample = () => {
    setTitle('Cybernetic Flora: Bio-mechanical Garden');
    setType('image');
    setCategory('Sci-Fi');
    setUploadMode('url');
    setMediaUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');
    setPrompt('Macro photography of miniature bioluminescent cyber-lotus flowers with translucent fiber-optic petals, pulsing emerald circuitry, ambient neon fog, studio macro lighting, 8k, Unreal Engine 5 aesthetic.');
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={() => !isUploading && onClose()} aria-modal="true" role="dialog">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <h2 className="modal-title">New Storyboard Item</h2>
          </div>
          <button 
            className="btn-icon" 
            onClick={onClose} 
            disabled={isUploading}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--rose-bg)', color: 'var(--rose-text)', fontSize: '0.8125rem' }}>
                {error}
              </div>
            )}

            {/* Cloudinary Storage Indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-muted)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Cloud size={14} style={{ color: 'var(--cyan)' }} />
                <span>Storage target: <strong>Cloudinary ({activeCloudConfig.cloudName})</strong></span>
              </div>
              <span className="badge badge-scifi" style={{ fontSize: '0.65rem' }}>
                preset: {activeCloudConfig.uploadPreset}
              </span>
            </div>

            {/* Media Format Picker (Image / Video) */}
            <div className="form-group">
              <label className="form-label">Media Format</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  className={`btn-secondary ${type === 'image' ? 'active' : ''}`}
                  style={{
                    borderColor: type === 'image' ? 'var(--primary)' : 'var(--border-subtle)',
                    backgroundColor: type === 'image' ? 'var(--primary-light)' : 'var(--bg-surface)',
                    color: type === 'image' ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    justifyContent: 'center'
                  }}
                  onClick={() => setType('image')}
                  disabled={isUploading}
                >
                  <ImageIcon size={16} />
                  <span>Image Preview</span>
                </button>

                <button
                  type="button"
                  className={`btn-secondary ${type === 'video' ? 'active' : ''}`}
                  style={{
                    borderColor: type === 'video' ? 'var(--primary)' : 'var(--border-subtle)',
                    backgroundColor: type === 'video' ? 'var(--primary-light)' : 'var(--bg-surface)',
                    color: type === 'video' ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    justifyContent: 'center'
                  }}
                  onClick={() => setType('video')}
                  disabled={isUploading}
                >
                  <Video size={16} />
                  <span>Video Clip</span>
                </button>
              </div>
            </div>

            {/* Upload Source Mode Toggle (Cloudinary File Upload vs URL) */}
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label className="form-label">Media Source</label>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    type="button"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: uploadMode === 'file' ? 600 : 400,
                      color: uploadMode === 'file' ? 'var(--primary)' : 'var(--text-muted)'
                    }}
                    onClick={() => setUploadMode('file')}
                  >
                    Direct Upload
                  </button>
                  <span style={{ color: 'var(--border-strong)', fontSize: '0.75rem' }}>|</span>
                  <button
                    type="button"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: uploadMode === 'url' ? 600 : 400,
                      color: uploadMode === 'url' ? 'var(--primary)' : 'var(--text-muted)'
                    }}
                    onClick={() => setUploadMode('url')}
                  >
                    Paste URL
                  </button>
                </div>
              </div>

              {uploadMode === 'file' ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={type === 'video' ? 'video/mp4,video/webm,video/quicktime' : 'image/jpeg,image/png,image/webp,image/gif'}
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e.target.files[0])}
                    disabled={isUploading}
                  />

                  {selectedFile ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {/* Preview Box */}
                      <div className="upload-preview-box">
                        {type === 'video' ? (
                          <video 
                            src={filePreview} 
                            controls 
                            className="upload-preview-media"
                          />
                        ) : (
                          <img 
                            src={filePreview} 
                            alt="Upload preview" 
                            className="upload-preview-media"
                          />
                        )}
                      </div>

                      {/* File details & Remove button */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflow: 'hidden' }}>
                          <FileCode size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
                            {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        {!isUploading && (
                          <button 
                            type="button" 
                            onClick={handleRemoveFile}
                            style={{ color: 'var(--rose)', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem' }}
                          >
                            <Trash2 size={12} />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      {/* Upload Progress Bar */}
                      {isUploading && (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <span>Uploading to Cloudinary...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="upload-progress-container">
                            <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div 
                      className="upload-dropzone"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--bg-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        <UploadCloud size={20} />
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                        Click to browse or drag {type} here
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {type === 'video' ? 'Supports MP4, WebM, MOV (Max 50MB)' : 'Supports JPG, PNG, WebP (Max 10MB)'}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    className="form-input"
                    placeholder={type === 'image' ? 'https://images.unsplash.com/...' : 'https://...video.mp4'}
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    Or click "Fill Sample Data" below to test.
                  </span>
                </div>
              )}
            </div>

            {/* Title Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="sb-title">Storyboard Title *</label>
              <input
                id="sb-title"
                type="text"
                className="form-input"
                placeholder="e.g. Neon Horizon: Highway Chase"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                disabled={isUploading}
              />
            </div>

            {/* Category Select */}
            <div className="form-group">
              <label className="form-label" htmlFor="sb-cat">Category</label>
              <select
                id="sb-cat"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isUploading}
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Prompt Input */}
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label className="form-label" htmlFor="sb-prompt">Generation Prompt</label>
                <button
                  type="button"
                  onClick={handleFillSample}
                  disabled={isUploading}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600 }}
                >
                  <Sparkles size={12} />
                  <span>Fill Sample Data</span>
                </button>
              </div>
              <textarea
                id="sb-prompt"
                className="form-textarea"
                placeholder="Paste the generative AI prompt used to create this media..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Uploading {uploadProgress}%...</span>
                </>
              ) : (
                <>
                  <UploadCloud size={16} />
                  <span>{selectedFile ? 'Upload & Save Storyboard' : 'Save Storyboard'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
