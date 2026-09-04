import React, { useEffect, useRef } from 'react';
import { 
  User, 
  ShieldCheck, 
  Megaphone, 
  Heart, 
  Sun, 
  Moon, 
  LogIn, 
  LogOut, 
  Sparkles,
  Smartphone
} from 'lucide-react';

export default function ProfileContextMenu({ 
  isOpen, 
  onClose, 
  currentUser, 
  onOpenAuth, 
  onSignOut, 
  onOpenBroadcast,
  onNavigateFavorites,
  theme, 
  onToggleTheme,
  onInstallApp
}) {
  const menuRef = useRef(null);

  // Close on outside click or touch
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(e.target) && 
        !e.target.closest('.profile-button')
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="dropdown-menu profile-dropdown-menu" ref={menuRef}>
      {/* Profile Header */}
      <div className="dropdown-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
            {currentUser?.name || 'Guest User'}
          </div>
          {isAdmin ? (
            <span className="badge badge-cinematic" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.65rem' }}>
              <ShieldCheck size={11} />
              <span>ADMIN</span>
            </span>
          ) : (
            <span className="badge badge-default" style={{ fontSize: '0.65rem' }}>
              USER
            </span>
          )}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, marginTop: '2px' }}>
          {currentUser?.email || 'Not signed in'}
        </div>
      </div>

      {/* Menu Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        {/* Admin Broadcast Notification action (Admin only!) */}
        {isAdmin && (
          <button 
            className="dropdown-item"
            style={{ color: 'var(--amber-text)', backgroundColor: 'var(--amber-bg)', fontWeight: 600 }}
            onClick={() => {
              onOpenBroadcast();
              onClose();
            }}
          >
            <Megaphone size={16} />
            <span>Broadcast Notification</span>
          </button>
        )}

        {/* Favorites shortcut */}
        <button 
          className="dropdown-item"
          onClick={() => {
            onNavigateFavorites();
            onClose();
          }}
        >
          <Heart size={16} style={{ color: 'var(--rose)' }} />
          <span>My Favorites</span>
        </button>

        {/* Theme switcher */}
        <button className="dropdown-item" onClick={onToggleTheme}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
        </button>

        {/* Install Android App */}
        {onInstallApp && (
          <button 
            className="dropdown-item" 
            onClick={() => {
              onInstallApp();
              onClose();
            }}
            style={{ color: 'var(--primary-text)', fontWeight: 500 }}
          >
            <Smartphone size={16} style={{ color: 'var(--primary)' }} />
            <span>Install App on Android</span>
          </button>
        )}

        <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '0.35rem 0' }} />

        {/* Switch account / Sign in / Sign out */}
        <button 
          className="dropdown-item"
          onClick={() => {
            onOpenAuth();
            onClose();
          }}
        >
          <LogIn size={16} />
          <span>{currentUser ? 'Switch Google Account' : 'Sign in with Google'}</span>
        </button>

        {currentUser && (
          <button 
            className="dropdown-item" 
            style={{ color: 'var(--rose-text)' }}
            onClick={() => {
              onSignOut();
              onClose();
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
}
