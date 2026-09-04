import React, { useState } from 'react';
import { X, Send, Megaphone, Sparkles, BellRing } from 'lucide-react';

export default function BroadcastModal({ isOpen, onClose, onSendBroadcast }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('Announcement');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Notification title is required');
      return;
    }
    if (!message.trim()) {
      setError('Notification message is required');
      return;
    }

    onSendBroadcast({
      title: title.trim(),
      desc: message.trim(),
      category,
      time: 'Just now',
      unread: true,
      isBroadcast: true
    });

    setTitle('');
    setMessage('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} aria-modal="true" role="dialog">
      <div className="modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--amber-bg)',
              color: 'var(--amber-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Megaphone size={18} />
            </div>
            <div>
              <h2 className="modal-title">Broadcast Notification</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Send global broadcast notification to all Promptgallery users
              </span>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ gap: '1.25rem' }}>
            {error && (
              <div style={{ padding: '0.625rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--rose-bg)', color: 'var(--rose-text)', fontSize: '0.8125rem' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="broadcast-category">Category / Tag</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {['Announcement', 'New Storyboard', 'Update'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`btn-secondary ${category === cat ? 'active' : ''}`}
                    style={{
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      borderColor: category === cat ? 'var(--primary)' : 'var(--border-subtle)',
                      backgroundColor: category === cat ? 'var(--primary-light)' : 'var(--bg-surface)',
                      color: category === cat ? 'var(--primary)' : 'var(--text-secondary)',
                      fontWeight: 600
                    }}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="broadcast-title">Notification Title *</label>
              <input
                id="broadcast-title"
                type="text"
                className="form-input"
                placeholder="e.g. New Studio Asset Drop: Cyberpunk Storyboard Vol. 2"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="broadcast-msg">Notification Message *</label>
              <textarea
                id="broadcast-msg"
                className="form-textarea"
                placeholder="Write your announcement or update for all users..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error) setError('');
                }}
                style={{ minHeight: '110px' }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ gap: '0.5rem' }}>
              <Send size={15} />
              <span>Broadcast to All Users</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
