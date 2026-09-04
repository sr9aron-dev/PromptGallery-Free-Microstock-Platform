import React from 'react';
import { Sparkles, ShieldCheck, Heart, User, LogIn, LogOut, Plus, Check } from 'lucide-react';
import { ADMIN_EMAIL } from '../../services/auth';

export default function WelcomeHero({ 
  currentUser, 
  onOpenAuth, 
  onSignOut,
  onOpenCreate,
  favoriteCount = 0
}) {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="welcome-hero-card">
      <div className="welcome-hero-content">
        {/* Left / Mascot Icon */}
        <div className="welcome-hero-mascot-wrapper">
          <img 
            src="/icon.png" 
            alt="Promptgallery AI Mascot" 
            className="welcome-hero-mascot"
          />
        </div>

        {/* Center / Text Info */}
        <div className="welcome-hero-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
            <span className="badge badge-cinematic" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}>
              <Sparkles size={11} />
              <span>Promptgallery Studio</span>
            </span>

            {currentUser ? (
              isAdmin ? (
                <span className="badge" style={{ backgroundColor: 'var(--amber-bg)', color: 'var(--amber-text)', borderColor: 'var(--amber)', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={12} />
                  <span>ADMIN ACTIVE ({ADMIN_EMAIL})</span>
                </span>
              ) : (
                <span className="badge badge-default" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <User size={11} />
                  <span>USER MODE ({currentUser.email})</span>
                </span>
              )
            ) : (
              <span className="badge badge-default" style={{ fontSize: '0.7rem' }}>
                VISITOR MODE
              </span>
            )}
          </div>

          <h2 className="welcome-hero-title">
            {currentUser 
              ? `Welcome back, ${currentUser.name || 'Creator'}!`
              : 'Welcome to Promptgallery Workspace'}
          </h2>

          <p className="welcome-hero-desc">
            {isAdmin ? (
              <>
                You are logged in as <strong>{ADMIN_EMAIL}</strong>. You have exclusive posting rights to publish multi-shot storyboards and broadcast studio announcements.
              </>
            ) : currentUser ? (
              <>
                Explore storyboards published by Admin. You have your own private <strong>Favorites</strong> collection ({favoriteCount} saved) and full prompt copy access.
              </>
            ) : (
              <>
                Explore frontier AI storyboards published by Admin (<strong>{ADMIN_EMAIL}</strong>). Sign in with your Google account to save your own personal favorites!
              </>
            )}
          </p>
        </div>

        {/* Right / Action Buttons */}
        <div className="welcome-hero-actions">
          {currentUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', maxWidth: '200px' }}>
              {isAdmin && (
                <button 
                  type="button" 
                  className="btn-primary"
                  onClick={onOpenCreate}
                  style={{ justifyContent: 'center', gap: '0.4rem', padding: '0.55rem 1rem' }}
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span>New Storyboard</span>
                </button>
              )}
              <button 
                type="button" 
                className="btn-secondary"
                onClick={onSignOut}
                style={{ justifyContent: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%', maxWidth: '220px' }}>
              <button 
                type="button" 
                className="btn-primary"
                onClick={onOpenAuth}
                style={{ 
                  justifyContent: 'center', 
                  gap: '0.5rem', 
                  padding: '0.65rem 1.1rem',
                  fontSize: '0.875rem',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)'
                }}
              >
                <LogIn size={16} />
                <span>Sign In with Google</span>
              </button>
              <div style={{ fontSize: '0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Admin: {ADMIN_EMAIL}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
