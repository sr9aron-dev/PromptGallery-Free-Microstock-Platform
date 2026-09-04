import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  UploadCloud, 
  Image as ImageIcon, 
  Video, 
  Sparkles, 
  Cloud, 
  FileCode, 
  Loader2, 
  Trash2, 
  Check,
  Plus,
  Layers,
  X,
  FileText,
  Tag,
  Cpu
} from 'lucide-react';
import { DEFAULT_CATEGORIES, FRONTIER_AI_MODELS } from '../../data/mockData';
import { uploadToCloudinary, CLOUDINARY_CONFIG } from '../../services/cloudinary';

export default function CreateStoryboardPage({ 
  onBack, 
  onCreate,
  categories = DEFAULT_CATEGORIES,
  onAddCategory
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Cinematic');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');

  // Custom Category manual input state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // AI Model state: preset frontier model vs custom manual entry
  const [modelOption, setModelOption] = useState(FRONTIER_AI_MODELS[0] || 'Flux.1 Dev');
  const [customModel, setCustomModel] = useState('');

  // Upload source mode: 'file' (direct to Cloudinary) or 'url'
  const [uploadMode, setUploadMode] = useState('file');
  const [mediaType, setMediaType] = useState('image'); // 'image' | 'video'

  // Multi-media shots list
  // Each item: { id: string, file?: File, previewUrl: string, type: 'image'|'video', caption: string, name: string }
  const [shots, setShots] = useState([]);
  
  // URL mode single input or multi-line
  const [urlInput, setUrlInput] = useState('');

  // Cloudinary upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [overallProgress, setOverallProgress] = useState(0);

  const fileInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const activeCloudConfig = mediaType === 'video' ? CLOUDINARY_CONFIG.video : CLOUDINARY_CONFIG.image;

  // Handle files selection (supports multiple files!)
  const handleFilesSelected = (files) => {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const newShots = fileList.map((file, idx) => {
      const isVid = file.type.startsWith('video/');
      const previewUrl = URL.createObjectURL(file);
      return {
        id: `shot-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        file,
        previewUrl,
        type: isVid ? 'video' : 'image',
        caption: `Shot #${shots.length + idx + 1}`,
        name: file.name,
        size: file.size
      };
    });

    // Auto-detect dominant media type
    if (newShots.some(s => s.type === 'video')) {
      setMediaType('video');
    }

    setShots(prev => [...prev, ...newShots]);
    setError('');

    // Auto-fill title from first file if empty
    if (!title.trim() && newShots[0]) {
      const cleanName = newShots[0].name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  const handleRemoveShot = (idToRemove) => {
    setShots(prev => {
      const shot = prev.find(s => s.id === idToRemove);
      if (shot && shot.previewUrl && shot.file) {
        URL.revokeObjectURL(shot.previewUrl);
      }
      return prev.filter(s => s.id !== idToRemove);
    });
  };

  const handleUpdateShotCaption = (id, newCaption) => {
    setShots(prev => prev.map(s => s.id === id ? { ...s, caption: newCaption } : s));
  };

  // Handle manual category addition
  const handleSaveCustomCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (onAddCategory) {
      onAddCategory(trimmed);
    }
    setCategory(trimmed);
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a Storyboard Title.');
      return;
    }

    const finalModelName = modelOption === '__CUSTOM__' ? (customModel.trim() || 'Custom Model') : modelOption;

    let mediaItems = [];

    // FILE MODE (Direct upload to Cloudinary)
    if (uploadMode === 'file') {
      if (shots.length === 0) {
        setError('Please select at least one image or video for this storyboard.');
        return;
      }

      try {
        setIsUploading(true);
        setOverallProgress(5);

        for (let i = 0; i < shots.length; i++) {
          const shot = shots[i];
          setUploadProgressText(`Uploading shot ${i + 1} of ${shots.length} to Cloudinary...`);
          
          const uploaded = await uploadToCloudinary(
            shot.file, 
            shot.type, 
            (percent) => {
              const base = (i / shots.length) * 100;
              const step = (percent / shots.length);
              setOverallProgress(Math.min(95, Math.round(base + step)));
            }
          );

          mediaItems.push({
            id: `media-${Date.now()}-${i}`,
            url: uploaded.url,
            thumbnailUrl: uploaded.thumbnailUrl,
            type: shot.type,
            caption: shot.caption || `Shot #${i + 1}`
          });
        }
        setOverallProgress(100);
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        setError(err.message || 'Failed to upload media to Cloudinary. Check presets in .env.');
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    } else {
      // URL MODE
      const rawUrls = urlInput.split('\n').map(u => u.trim()).filter(Boolean);
      if (rawUrls.length === 0) {
        // Fallback sample
        const sampleUrl = mediaType === 'video'
          ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1800&q=90';
        mediaItems.push({
          id: `media-url-1`,
          url: sampleUrl,
          thumbnailUrl: mediaType === 'video' 
            ? 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=900&q=80' 
            : sampleUrl,
          type: mediaType,
          caption: 'Shot #1'
        });
      } else {
        mediaItems = rawUrls.map((url, idx) => ({
          id: `media-url-${idx + 1}`,
          url,
          thumbnailUrl: url,
          type: mediaType,
          caption: `Shot #${idx + 1}`
        }));
      }
    }

    const firstMedia = mediaItems[0];

    onCreate({
      title: title.trim(),
      description: description.trim(),
      type: firstMedia?.type || mediaType,
      category,
      thumbnail: firstMedia?.thumbnailUrl || firstMedia?.url,
      mediaUrl: firstMedia?.url,
      mediaItems,
      prompt: prompt.trim() || 'No prompt provided.',
      aspectRatio,
      createdAt: 'Baru Saja',
      isNew: true,
      author: 'sr7aron@gmail.com',
      authorRole: 'admin',
      parameters: { 
        model: finalModelName, 
        storage: `Cloudinary (${activeCloudConfig.cloudName})`,
        created: new Date().toLocaleTimeString(),
        author: 'sr7aron@gmail.com'
      }
    });

    onBack();
  };

  const handleQuickPublish = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    onCreate({
      title: `Cybernetic Recon: Autonomous Drone Unit #${randomNum}`,
      description: 'Urutan pengintaian visual sci-fi otonom melintasi koridor kota neon. Diposting langsung oleh Admin (sr7aron@gmail.com).',
      type: 'image',
      category: 'Cyberpunk',
      thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80',
      mediaUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1800&q=90',
      mediaItems: [
        {
          id: `media-quick-${Date.now()}-1`,
          url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1800&q=90',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80',
          type: 'image',
          caption: 'Shot 1: High-angle drone perspective'
        },
        {
          id: `media-quick-${Date.now()}-2`,
          url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1800&q=90',
          thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=80',
          type: 'image',
          caption: 'Shot 2: Neon volumetric mist scan'
        }
      ],
      prompt: 'Cyberpunk reconnaissance drone hovering silently above neon alleyway, infrared sensor beams reflecting on wet asphalt, volumetric mist, 8k render.',
      aspectRatio: '16:9',
      createdAt: 'Baru Saja (Just Now)',
      isNew: true,
      author: 'sr7aron@gmail.com',
      authorRole: 'admin',
      parameters: { 
        model: 'Flux.1 Pro', 
        storage: 'Cloudinary',
        author: 'sr7aron@gmail.com' 
      }
    });
    onBack();
  };

  const handleFillSample = () => {
    setTitle('Cybernetic Genesis: Neural Infiltration Sequence');
    setDescription('A high-concept sequence tracking an autonomous infiltration agent navigating the subterranean fiber ducts of the Central Megastructure. Cold fluorescent blues contrast with warning hazard strobes.');
    setCategory('Cyberpunk');
    setAspectRatio('16:9');
    setModelOption('Flux.1 Pro');
    setUploadMode('url');
    setUrlInput('https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1800&q=90\nhttps://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1800&q=90');
    setPrompt('Cinematic master shot of cybernetic infiltration agent crouched in glowing neon coolant duct, volumetric mist, iridescent fiber optics illuminating chrome chassis, raytraced reflection on polished carbon fiber, Hasselblad 80mm f/1.4, cinematic color grading, 8k.');
    setError('');
  };

  return (
    <div className="detail-page-container">
      {/* Top Navbar */}
      <div className="detail-page-navbar">
        <button className="btn-secondary" onClick={onBack} disabled={isUploading} style={{ gap: '0.5rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Storyboard</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Saving directly to <strong style={{ color: 'var(--text-primary)' }}>Cloudinary</strong>
          </span>
        </div>
      </div>

      <div className="detail-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Create New Storyboard Entry
            </h1>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Upload multiple shots or scenes, attach generative prompts, categorize, and specify frontier AI models.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={handleQuickPublish}
              disabled={isUploading}
              style={{ gap: '0.35rem', fontSize: '0.8125rem', backgroundColor: '#059669', borderColor: '#059669', color: '#ffffff' }}
            >
              <Sparkles size={14} />
              <span>⚡ Publish Cepat (1-Klik)</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleFillSample}
              disabled={isUploading}
              style={{ gap: '0.35rem', fontSize: '0.8125rem' }}
            >
              <Sparkles size={14} style={{ color: 'var(--amber)' }} />
              <span>Fill Sample Data</span>
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--rose-bg)', color: 'var(--rose-text)', fontSize: '0.875rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <X size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-page-layout">
          {/* Left Column: Media Uploader (Multi-media support) */}
          <div className="create-media-column">
            <div className="detail-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="detail-panel-header" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>1. Storyboard Media & Shots</span>
                </div>
                {shots.length > 0 && (
                  <span className="badge badge-cinematic" style={{ fontSize: '0.7rem' }}>
                    {shots.length} {shots.length === 1 ? 'Shot' : 'Shots'} Attached
                  </span>
                )}
              </div>

              {/* Mode Toggle & Type Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div className="type-filter-group">
                  <button
                    type="button"
                    className={`type-filter-btn ${uploadMode === 'file' ? 'active' : ''}`}
                    onClick={() => setUploadMode('file')}
                    disabled={isUploading}
                  >
                    <UploadCloud size={14} style={{ marginRight: '4px' }} />
                    Upload Files
                  </button>
                  <button
                    type="button"
                    className={`type-filter-btn ${uploadMode === 'url' ? 'active' : ''}`}
                    onClick={() => setUploadMode('url')}
                    disabled={isUploading}
                  >
                    Paste URL(s)
                  </button>
                </div>

                <div className="type-filter-group">
                  <button
                    type="button"
                    className={`type-filter-btn ${mediaType === 'image' ? 'active' : ''}`}
                    onClick={() => setMediaType('image')}
                    disabled={isUploading}
                  >
                    <ImageIcon size={14} style={{ marginRight: '4px' }} />
                    Images
                  </button>
                  <button
                    type="button"
                    className={`type-filter-btn ${mediaType === 'video' ? 'active' : ''}`}
                    onClick={() => setMediaType('video')}
                    disabled={isUploading}
                  >
                    <Video size={14} style={{ marginRight: '4px' }} />
                    Videos
                  </button>
                </div>
              </div>

              {/* Hidden multi-file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={mediaType === 'video' ? 'video/mp4,video/webm,video/quicktime' : 'image/jpeg,image/png,image/webp'}
                style={{ display: 'none' }}
                onChange={(e) => handleFilesSelected(e.target.files)}
              />

              {uploadMode === 'file' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Dropzone */}
                  <div
                    className="upload-dropzone"
                    style={{ minHeight: shots.length > 0 ? '130px' : '220px', cursor: 'pointer' }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files?.length) handleFilesSelected(e.dataTransfer.files);
                    }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)',
                      boxShadow: 'var(--shadow-md)'
                    }}>
                      <UploadCloud size={22} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', marginTop: '0.35rem' }}>
                      Click to choose or drag {mediaType === 'video' ? 'videos' : 'images'} here
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Supports multiple shots at once (Auto-uploads to Cloudinary {activeCloudConfig.cloudName})
                    </div>
                  </div>

                  {/* Multi-Shot Previews Strip */}
                  {shots.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                          Attached Shots ({shots.length})
                        </span>
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', gap: '4px' }}
                        >
                          <Plus size={13} />
                          <span>Add More Shots</span>
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                        {shots.map((shot, idx) => (
                          <div
                            key={shot.id}
                            style={{
                              backgroundColor: 'var(--bg-muted)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-lg)',
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column',
                              position: 'relative'
                            }}
                          >
                            <div style={{ height: '90px', backgroundColor: '#000', position: 'relative', overflow: 'hidden' }}>
                              {shot.type === 'video' ? (
                                <video src={shot.previewUrl} className="theater-video" style={{ height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <img src={shot.previewUrl} alt={shot.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              )}
                              <span style={{
                                position: 'absolute',
                                top: '4px',
                                left: '4px',
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                color: '#fff',
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                padding: '1px 5px',
                                borderRadius: '4px'
                              }}>
                                #{idx + 1}
                              </span>

                              {!isUploading && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveShot(shot.id)}
                                  title="Remove shot"
                                  style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(244,63,94,0.9)',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: 'none',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <X size={12} />
                                </button>
                              )}
                            </div>

                            <div style={{ padding: '0.5rem' }}>
                              <input
                                type="text"
                                className="form-input"
                                style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}
                                placeholder={`Caption for Shot #${idx + 1}`}
                                value={shot.caption}
                                onChange={(e) => handleUpdateShotCaption(shot.id, e.target.value)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Progress Bar */}
                  {isUploading && (
                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '6px' }}>
                        <span>{uploadProgressText || 'Uploading to Cloudinary...'}</span>
                        <span>{overallProgress}%</span>
                      </div>
                      <div className="upload-progress-container">
                        <div className="upload-progress-bar" style={{ width: `${overallProgress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* URL Mode */
                <div className="form-group">
                  <label className="form-label" htmlFor="page-sb-url">
                    Media URL(s) (One URL per line for multiple shots)
                  </label>
                  <textarea
                    id="page-sb-url"
                    className="form-textarea"
                    style={{ minHeight: '120px', fontFamily: 'monospace', fontSize: '0.8125rem' }}
                    placeholder={mediaType === 'image' 
                      ? "https://images.unsplash.com/photo-1...\nhttps://images.unsplash.com/photo-2..."
                      : "https://...video1.mp4\nhttps://...video2.mp4"}
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Paste multiple URLs (one per line) to create a multi-shot storyboard item.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Title, Description, Category, AI Model & Prompt */}
          <div className="create-form-column">
            <div className="detail-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="detail-panel-header">
                <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>2. Storyboard Details</span>
              </div>

              {/* Title */}
              <div className="form-group">
                <label className="form-label" htmlFor="page-sb-title">Storyboard Title *</label>
                <input
                  id="page-sb-title"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Neon Horizon: Highway Chase"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError('');
                  }}
                  autoFocus
                />
              </div>

              {/* Scene Description (New Requirement) */}
              <div className="form-group">
                <label className="form-label" htmlFor="page-sb-desc">
                  Scene Description & Context
                </label>
                <textarea
                  id="page-sb-desc"
                  className="form-textarea"
                  style={{ minHeight: '85px' }}
                  placeholder="Describe the storyboard scene context, mood, character actions, narrative breakdown, or directorial notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Category (Preset + Manual Add) */}
              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label className="form-label" style={{ margin: 0 }} htmlFor="page-sb-cat">Category</label>
                  {!isAddingCategory && (
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(true)}
                      style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      <Plus size={12} />
                      <span>+ Add New Category</span>
                    </button>
                  )}
                </div>

                {isAddingCategory ? (
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Type category name (e.g. Anime, Commercial, VFX)..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSaveCustomCategory();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={handleSaveCustomCategory}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setIsAddingCategory(false);
                        setNewCategoryName('');
                      }}
                      style={{ padding: '0.5rem 0.6rem' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <select
                    id="page-sb-cat"
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Aspect Ratio */}
              <div className="form-group">
                <label className="form-label" htmlFor="page-sb-ratio">Aspect Ratio</label>
                <select
                  id="page-sb-ratio"
                  className="form-select"
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                >
                  <option value="16:9">16:9 (Landscape / Cinema)</option>
                  <option value="9:16">9:16 (Vertical / Reels)</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="4:3">4:3 (Standard)</option>
                  <option value="21:9">21:9 (Ultrawide Anamorphic)</option>
                </select>
              </div>

              {/* AI Generator / Model (Frontier AI Model List + Manual Add) */}
              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label className="form-label" style={{ margin: 0 }} htmlFor="page-sb-model">
                    AI Generator / Model
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Frontier models or custom
                  </span>
                </div>

                <select
                  id="page-sb-model"
                  className="form-select"
                  value={modelOption}
                  onChange={(e) => setModelOption(e.target.value)}
                >
                  <optgroup label="Frontier AI Image & Video Models">
                    {FRONTIER_AI_MODELS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </optgroup>
                  <option value="__CUSTOM__">+ Custom AI Model / LoRA (Add Manual)...</option>
                </select>

                {modelOption === '__CUSTOM__' && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Type custom model name (e.g. Wan2.1, CogVideoX, Midjourney v7 Alpha, LoRA-v2)..."
                      value={customModel}
                      onChange={(e) => setCustomModel(e.target.value)}
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* Prompt Textarea */}
              <div className="form-group">
                <label className="form-label" htmlFor="page-sb-prompt">Generative AI Prompt</label>
                <textarea
                  id="page-sb-prompt"
                  className="form-textarea"
                  style={{ minHeight: '120px' }}
                  placeholder="Paste the generative AI prompt used to generate this sequence..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button type="button" className="btn-secondary" onClick={onBack} disabled={isUploading}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isUploading} style={{ padding: '0.65rem 1.25rem' }}>
                  {isUploading ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>{uploadProgressText || 'Uploading to Cloudinary...'}</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={16} />
                      <span>{uploadMode === 'file' && shots.length > 0 ? `Upload ${shots.length} Shots & Save` : 'Save Storyboard'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
