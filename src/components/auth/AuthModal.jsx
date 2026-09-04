import React, { useState } from 'react';
import { X, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { signInWithGooglePopup } from '../../services/firebase';

export default function AuthModal({ isOpen, onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your Gmail address');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    onLogin(email.trim());
    setEmail('');
    setError('');
    onClose();
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoadingGoogle(true);
      setError('');
      const googleUser = await signInWithGooglePopup();
      if (googleUser && googleUser.email) {
        onLogin(googleUser.email, googleUser.displayName, googleUser.photoURL);
        onClose();
      }
    } catch (err) {
      console.warn('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in window was closed.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Google Firebase requires localhost in Authorized Domains. You can type your Gmail directly below to sign in!');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Browser blocked the popup window. Please allow popups or type your Gmail below.');
      } else {
        setError(err.message || 'Google sign-in failed. Please type your Gmail directly below.');
      }
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} aria-modal="true" role="dialog">
      <div className="modal-card" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 className="modal-title">Sign in to Promptgallery</h2>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '1.75rem 1.5rem', gap: '1.25rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Sign in with your Google account to access your studio workspace, organize storyboards, and sync favorites.
          </p>

          {/* Real Google OAuth Account Chooser Button */}
          <button
            type="button"
            className="btn-secondary"
            onClick={handleGoogleSignIn}
            disabled={isLoadingGoogle}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.75rem',
              fontWeight: 600,
              fontSize: '0.9375rem',
              gap: '0.75rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {isLoadingGoogle ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.36 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.99 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.25rem 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>or sign in with email</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
          </div>

          {/* Direct Email Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && (
              <div style={{ padding: '0.625rem 0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--rose-bg)', color: 'var(--rose-text)', fontSize: '0.8125rem', lineHeight: 1.45 }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">Your Gmail Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-email"
                  type="email"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2.4rem' }}
                  placeholder="e.g. sr7aron@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  autoFocus
                />
                <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.7rem' }}>
              <span>Sign In</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
