import React, { useEffect } from 'react';
import { X, Copy, Check, ExternalLink, Calendar, Ratio, Cpu } from 'lucide-react';

export default function StoryboardDetail({ item, onClose, onCopyPrompt, isCopied }) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  return (
    <div className="modal-overlay" onClick={onClose} aria-modal="true" role="dialog">
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
            <span className="badge badge-default" style={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
              {item.type}
            </span>
            <h2 className="modal-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.title}
            </h2>
          </div>

          <button 
            className="btn-icon" 
            onClick={onClose} 
            aria-label="Close detail modal"
            style={{ flexShrink: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Media Player Frame */}
          <div className="detail-media-frame">
            {item.type === 'video' ? (
              <video 
                src={item.mediaUrl} 
                controls 
                autoPlay 
                playsInline
                loop
                poster={item.thumbnail}
                style={{ width: '100%', height: 'auto', maxHeight: '420px' }}
              />
            ) : (
              <img 
                src={item.mediaUrl || item.thumbnail} 
                alt={item.title} 
                style={{ width: '100%', height: 'auto', maxHeight: '420px', objectFit: 'contain' }}
              />
            )}
          </div>

          {/* Metadata Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
              <span>{item.createdAt || 'Recent'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Ratio size={14} style={{ color: 'var(--text-muted)' }} />
              <span>{item.aspectRatio || '16:9'}</span>
            </div>
            {item.parameters?.model && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Cpu size={14} style={{ color: 'var(--text-muted)' }} />
                <span>Model: {item.parameters.model}</span>
              </div>
            )}
            <div style={{ marginLeft: 'auto' }}>
              <span className="badge badge-cinematic" style={{ fontWeight: 600 }}>
                {item.category}
              </span>
            </div>
          </div>

          {/* Prompt Box */}
          <div className="prompt-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'space-between', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                Generation Prompt
              </span>
              <button 
                className="btn-secondary" 
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                onClick={() => onCopyPrompt(item.prompt, item.id)}
              >
                {isCopied ? (
                  <>
                    <Check size={14} color="var(--emerald)" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            </div>
            <p className="prompt-text">
              {item.prompt || 'No prompt specified.'}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <a 
            href={item.mediaUrl || item.thumbnail} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary"
            style={{ textDecoration: 'none' }}
          >
            <ExternalLink size={16} />
            <span>Open Source Media</span>
          </a>
        </div>
      </div>
    </div>
  );
}
