import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Layers, 
  ArrowRight, 
  Mail, 
  Loader2, 
  Sun, 
  Moon, 
  Lock, 
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { signInWithGooglePopup } from '../../services/firebase';
import { ADMIN_EMAIL } from '../../services/auth';

export default function LoginPage({ 
  onLogin, 
  theme, 
  onToggleTheme,
  onInstallApp,
  canInstall
}) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

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
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoadingGoogle(true);
      setError('');
      const googleUser = await signInWithGooglePopup();
      if (googleUser && googleUser.email) {
        onLogin(googleUser.email, googleUser.displayName, googleUser.photoURL);
      }
    } catch (err) {
      console.warn('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in window was closed.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Firebase domain authorization pending. You can type your Gmail directly below to sign in!');
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
    <div className="login-portal-wrapper">
      {/* Ambient background glows */}
      <div className="login-ambient-glow login-glow-1" />
      <div className="login-ambient-glow login-glow-2" />

      {/* Top Bar */}
      <header className="login-portal-header">
        <div className="login-brand">
          <img 
            src="/icon.png" 
            alt="Promptgallery Mascot" 
            className="login-brand-icon"
          />
          <div className="login-brand-info">
            <span className="login-brand-name">Promptgallery</span>
            <span className="login-brand-tag">Studio Workspace</span>
          </div>
        </div>

        <div className="login-header-actions">
          {canInstall && onInstallApp && (
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onInstallApp}
              style={{ gap: '0.4rem', fontSize: '0.8125rem', padding: '0.45rem 0.85rem' }}
            >
              <Smartphone size={15} />
              <span>Install App</span>
            </button>
          )}

          <button 
            type="button" 
            className="btn-icon" 
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="login-portal-main">
        <div className="login-grid-layout">
          {/* Left Column: Hero & Workspace Info */}
          <div className="login-hero-pane">
            <div className="login-hero-badge">
              <Sparkles size={14} />
              <span>Restricted Studio Workspace</span>
            </div>

            <h1 className="login-hero-title">
              AI Storyboard Workspace & Prompt Engine
            </h1>

            <p className="login-hero-desc">
              Koleksi storyboard visual dan prompt AI berstandar tinggi (Midjourney, Flux, Kling, Hailuo). 
              Akses ruang kerja tertutup khusus untuk pengguna terautentikasi.
            </p>

            {/* Feature Highlights */}
            <div className="login-features-list">
              <div className="login-feature-item">
                <div className="login-feature-icon-box" style={{ backgroundColor: 'var(--amber-bg)', color: 'var(--amber)' }}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="login-feature-heading">Kurasi Eksklusif Admin</h4>
                  <p className="login-feature-sub">
                    Semua posting storyboard dikurasi langsung oleh Admin (<code>{ADMIN_EMAIL}</code>).
                  </p>
                </div>
              </div>

              <div className="login-feature-item">
                <div className="login-feature-icon-box" style={{ backgroundColor: 'var(--rose-bg)', color: 'var(--rose)' }}>
                  <Heart size={18} />
                </div>
                <div>
                  <h4 className="login-feature-heading">Koleksi Favorit Pribadi</h4>
                  <p className="login-feature-sub">
                    Setiap user memiliki penyimpanan favorit terisolasi yang tersinkron otomatis ke akun Anda.
                  </p>
                </div>
              </div>

              <div className="login-feature-item">
                <div className="login-feature-icon-box" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <Layers size={18} />
                </div>
                <div>
                  <h4 className="login-feature-heading">Multi-Shot & Prompt Metadata</h4>
                  <p className="login-feature-sub">
                    Lihat detail resolusi, seed, ratio, media multi-shot, dan salin prompt sekali klik.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="login-card-pane">
            <div className="login-glass-card">
              <div className="login-card-top">
                <div className="login-mascot-avatar">
                  <img src="/icon.png" alt="Robot Mascot" />
                </div>
                <h2 className="login-card-title">Masuk ke Promptgallery</h2>
                <p className="login-card-subtitle">
                  Masuk menggunakan akun Google Anda untuk mengakses storyboard.
                </p>
              </div>

              {error && (
                <div className="login-error-banner">
                  {error}
                </div>
              )}

              {/* Google OAuth Button */}
              <button
                type="button"
                className="login-google-btn"
                onClick={handleGoogleSignIn}
                disabled={isLoadingGoogle}
              >
                {isLoadingGoogle ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Menghubungkan ke Google...</span>
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.36 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.99 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              <div className="login-divider">
                <span>atau masukkan alamat Gmail</span>
              </div>

              {/* Direct Gmail Input Form */}
              <form onSubmit={handleSubmit} className="login-email-form">
                <div className="form-group">
                  <div style={{ position: 'relative' }}>
                    <input
                      id="login-gmail-input"
                      type="email"
                      className="form-input"
                      style={{ paddingLeft: '2.5rem', width: '100%' }}
                      placeholder="contoh: sr7aron@gmail.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                    />
                    <Mail 
                      size={17} 
                      style={{ 
                        position: 'absolute', 
                        left: '0.875rem', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        color: 'var(--text-muted)' 
                      }} 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                >
                  <span>Masuk ke Workspace</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Roles Clarity Information */}
              <div className="login-role-notice">
                <div className="login-role-pill">
                  <ShieldCheck size={14} color="var(--amber)" />
                  <span><strong>{ADMIN_EMAIL}</strong> &rarr; Akses Admin (Posting & Broadcast)</span>
                </div>
                <div className="login-role-pill">
                  <CheckCircle2 size={14} color="var(--primary)" />
                  <span><strong>Gmail Lain</strong> &rarr; Akses User (Lihat Item & Koleksi Favorit)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="login-portal-footer">
        <span>&copy; {new Date().getFullYear()} Promptgallery Workspace. All rights reserved.</span>
      </footer>
    </div>
  );
}
