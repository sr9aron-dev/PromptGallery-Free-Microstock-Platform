import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Heart, 
  Calendar, 
  Ratio, 
  Cpu, 
  Cloud, 
  Sparkles, 
  FileText,
  Film,
  Play,
  Layers
} from 'lucide-react';

export default function StoryboardDetailPage({ 
  item, 
  onBack, 
  isFavorite, 
  onToggleFavorite, 
  onCopyPrompt, 
  isCopied 
}) {
  const mediaList = (item?.mediaItems && item.mediaItems.length > 0)
    ? item.mediaItems
    : [{ 
        id: 'm-main', 
        url: item?.mediaUrl || item?.thumbnail, 
        thumbnailUrl: item?.thumbnail, 
        type: item?.type || 'image', 
        caption: item?.title 
      }];

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Scroll to top & reset active media index when detail item changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveMediaIndex(0);
  }, [item?.id]);

  if (!item) {
    return (
      <div className="workspace-content" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Storyboard not found</h2>
        <button className="btn-primary" onClick={onBack} style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Workspace</span>
        </button>
      </div>
    );
  }

  const currentMedia = mediaList[activeMediaIndex] || mediaList[0];
  const isCurrentVideo = currentMedia.type === 'video';

  const getBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'cinematic': return 'badge-cinematic';
      case 'animation': return 'badge-animation';
      case 'sci-fi': return 'badge-scifi';
      case 'character': return 'badge-character';
      case 'commercial': return 'badge-commercial';
      case 'concept': return 'badge-concept';
      case 'cyberpunk': return 'badge-scifi';
      default: return 'badge-default';
    }
  };

  return (
    <div className="detail-page-container">
      {/* Top Navigation Bar */}
      <div className="detail-page-navbar">
        <button className="btn-secondary" onClick={onBack} style={{ gap: '0.5rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Storyboard</span>
        </button>

        <div className="detail-navbar-actions">
          {/* Favorite Toggle Button */}
          <button
            className={`btn-secondary ${isFavorite ? 'active' : ''}`}
            onClick={() => onToggleFavorite(item.id)}
            style={{
              borderColor: isFavorite ? 'var(--rose)' : 'var(--border-subtle)',
              backgroundColor: isFavorite ? 'var(--rose-bg)' : 'var(--bg-surface)',
              color: isFavorite ? 'var(--rose-text)' : 'var(--text-secondary)',
              gap: '0.5rem',
              fontWeight: 600
            }}
          >
            <Heart size={16} fill={isFavorite ? 'var(--rose)' : 'none'} color={isFavorite ? 'var(--rose)' : 'currentColor'} />
            <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>

          {/* Copy Prompt Button */}
          <button
            className="btn-secondary"
            onClick={() => onCopyPrompt(item.prompt, item.id)}
            style={{ gap: '0.5rem' }}
          >
            {isCopied ? <Check size={16} color="var(--emerald)" /> : <Copy size={16} />}
            <span>{isCopied ? 'Prompt Copied!' : 'Copy Prompt'}</span>
          </button>
        </div>
      </div>

      {/* Main Detail Grid Layout */}
      <div className="detail-layout">
        {/* Left / Center Column: Theater Media Preview & Shots */}
        <div className="detail-media-column">
          <div className="theater-frame">
            {isCurrentVideo ? (
              <video
                key={currentMedia.url}
                src={currentMedia.url}
                controls
                autoPlay
                playsInline
                loop
                poster={currentMedia.thumbnailUrl || item.thumbnail}
                className="theater-video"
              />
            ) : (
              <img
                key={currentMedia.url}
                src={currentMedia.url || currentMedia.thumbnailUrl}
                alt={currentMedia.caption || item.title}
                className="theater-image"
              />
            )}
          </div>

          {/* Multi-Media Shot Selector (If storyboard has multiple media items) */}
          {mediaList.length > 1 && (
            <div className="detail-shot-selector">
              <div className="detail-shot-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  <Layers size={14} style={{ color: 'var(--primary)' }} />
                  <span>Storyboard Sequence ({mediaList.length} Shots)</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Viewing Shot {activeMediaIndex + 1} of {mediaList.length}
                </span>
              </div>

              <div className="detail-shot-strip">
                {mediaList.map((media, idx) => {
                  const isActive = idx === activeMediaIndex;
                  return (
                    <button
                      key={media.id || idx}
                      type="button"
                      className={`detail-shot-thumb ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveMediaIndex(idx)}
                      title={media.caption || `Shot ${idx + 1}`}
                      aria-label={`Select Shot ${idx + 1}`}
                    >
                      <img src={media.thumbnailUrl || media.url} alt={`Shot ${idx + 1}`} />
                      <div className="detail-shot-badge">#{idx + 1}</div>
                      {media.type === 'video' && (
                        <div className="detail-shot-play-icon">
                          <Play size={10} fill="#fff" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {currentMedia.caption && (
                <div className="detail-shot-caption">
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    Shot #{activeMediaIndex + 1}:
                  </span>{' '}
                  {currentMedia.caption}
                </div>
              )}
            </div>
          )}

          {/* Title & Metadata Header */}
          <div className="detail-title-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span className={`badge ${getBadgeClass(item.category)}`} style={{ fontSize: '0.8125rem', padding: '0.25rem 0.65rem' }}>
                {item.category}
              </span>
              <span className="badge badge-default" style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                {currentMedia.type || item.type}
              </span>
              {mediaList.length > 1 && (
                <span className="badge badge-cinematic" style={{ fontSize: '0.75rem' }}>
                  {mediaList.length} SHOTS
                </span>
              )}
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} />
                {item.createdAt || 'Recent'}
              </span>
            </div>

            <h1 className="detail-main-title">{item.title}</h1>
          </div>
        </div>

        {/* Right Column: Description, Prompt Breakdown & Technical Specs */}
        <div className="detail-sidebar-column">
          {/* Scene Description & Narrative Section */}
          <div className="detail-panel">
            <div className="detail-panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Scene Description & Context</span>
              </div>
            </div>

            <div className="detail-description-content">
              {item.description ? (
                <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
                  {item.description}
                </p>
              ) : (
                <p style={{ margin: 0, fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                  No scene narrative description provided.
                </p>
              )}
            </div>
          </div>

          {/* Prompt Box */}
          <div className="detail-panel">
            <div className="detail-panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Generative AI Prompt</span>
              </div>
              <button
                className="btn-icon"
                style={{ width: '30px', height: '30px' }}
                onClick={() => onCopyPrompt(item.prompt, item.id)}
                title="Copy Prompt"
              >
                {isCopied ? <Check size={14} color="var(--emerald)" /> : <Copy size={14} />}
              </button>
            </div>

            <div className="detail-prompt-content">
              {item.prompt || 'No prompt specified.'}
            </div>
          </div>

          {/* Technical Specifications Panel */}
          <div className="detail-panel">
            <div className="detail-panel-header">
              <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Generation Metadata</span>
            </div>

            <div className="meta-spec-list">
              <div className="meta-spec-item">
                <span className="meta-spec-label">
                  <Ratio size={14} /> Aspect Ratio
                </span>
                <span className="meta-spec-value">{item.aspectRatio || '16:9'}</span>
              </div>

              {item.parameters?.model && (
                <div className="meta-spec-item">
                  <span className="meta-spec-label">
                    <Cpu size={14} /> Model / Engine
                  </span>
                  <span className="meta-spec-value">{item.parameters.model}</span>
                </div>
              )}

              {item.parameters?.seed && (
                <div className="meta-spec-item">
                  <span className="meta-spec-label">Seed</span>
                  <span className="meta-spec-value" style={{ fontFamily: 'monospace' }}>
                    {item.parameters.seed}
                  </span>
                </div>
              )}

              <div className="meta-spec-item">
                <span className="meta-spec-label">
                  <Cloud size={14} /> Storage Engine
                </span>
                <span className="meta-spec-value">
                  {item.parameters?.storage || 'Cloudinary Storage'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
