import React from 'react';
import { Play, Image as ImageIcon, Copy, Eye, Check, Heart, Layers, ShieldCheck, Sparkles } from 'lucide-react';

export default function MediaCard({ 
  item, 
  onSelect, 
  onCopyPrompt, 
  isCopied, 
  isFavorite, 
  onToggleFavorite 
}) {
  const isVideo = item.type === 'video';

  // Category badge color mapping
  const getBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'cinematic': return 'badge-cinematic';
      case 'animation': return 'badge-animation';
      case 'sci-fi': return 'badge-scifi';
      case 'character': return 'badge-character';
      case 'commercial': return 'badge-commercial';
      case 'concept': return 'badge-concept';
      default: return 'badge-default';
    }
  };

  const handleCardClick = (e) => {
    // If click was on an action button, don't trigger detail navigation
    if (e.target.closest('.card-action-btn')) return;
    onSelect(item);
  };

  return (
    <article 
      className="media-card"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label={`View ${item.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(item);
        }
      }}
    >
      {/* Media Preview Container */}
      <div className="media-preview-container">
        <img 
          src={item.thumbnail} 
          alt={item.title} 
          className="media-preview-image"
          loading="lazy"
        />

        {/* Favorite Heart Quick Toggle (Top Left) */}
        <button
          className="card-action-btn favorite-quick-btn"
          style={{
            position: 'absolute',
            top: '0.625rem',
            left: '0.625rem',
            width: '30px',
            height: '30px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: isFavorite ? 'rgba(244, 63, 94, 0.95)' : 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            zIndex: 10
          }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
          title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          aria-label="Toggle Favorite"
        >
          <Heart size={14} fill={isFavorite ? '#ffffff' : 'none'} />
        </button>

        {/* New Item Badge */}
        {item.isNew && (
          <div style={{
            position: 'absolute',
            top: '0.625rem',
            left: '3.1rem',
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--emerald)',
            color: '#064e3b',
            fontSize: '0.6875rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <Sparkles size={11} />
            <span>BARU</span>
          </div>
        )}

        {/* Type Badge */}
        <div className="media-type-badge">
          {isVideo ? (
            <>
              <Play size={10} fill="currentColor" />
              <span>VIDEO</span>
            </>
          ) : (
            <>
              <ImageIcon size={10} />
              <span>IMAGE</span>
            </>
          )}
        </div>

        {/* Multi-shots count badge */}
        {item.mediaItems && item.mediaItems.length > 1 && (
          <div className="media-shots-badge">
            <Layers size={11} />
            <span>{item.mediaItems.length} Shots</span>
          </div>
        )}

        {/* Play Icon Overlay for Videos */}
        {isVideo && (
          <div className="video-play-indicator" aria-hidden="true">
            <Play size={20} fill="#ffffff" style={{ marginLeft: '2px' }} />
          </div>
        )}
      </div>

      {/* Card Info Body */}
      <div className="media-card-body">
        <div className="media-card-header">
          <h2 className="media-card-title" title={item.title}>
            {item.title}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.72rem', color: 'var(--amber-text)', fontWeight: 500 }}>
            <ShieldCheck size={12} color="var(--amber)" />
            <span>Admin (sr7aron@gmail.com)</span>
          </div>
        </div>

        {/* Card Footer: Category badge & Actions */}
        <div className="media-card-footer">
          <span className={`badge ${getBadgeClass(item.category)}`}>
            {item.category}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {/* Quick Copy Prompt Button */}
            <button
              className="card-action-btn btn-icon"
              style={{ width: '30px', height: '30px', borderRadius: '6px' }}
              onClick={(e) => {
                e.stopPropagation();
                onCopyPrompt(item.prompt);
              }}
              title={isCopied ? 'Copied to clipboard!' : 'Copy Prompt'}
              aria-label="Copy Prompt"
            >
              {isCopied ? <Check size={14} color="var(--emerald)" /> : <Copy size={14} />}
            </button>

            {/* Quick View Button */}
            <button
              className="card-action-btn btn-icon"
              style={{ width: '30px', height: '30px', borderRadius: '6px' }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item);
              }}
              title="Open Full Detail Page"
              aria-label="Inspect Storyboard"
            >
              <Eye size={14} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
