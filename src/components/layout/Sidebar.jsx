import React from 'react';
import { 
  LayoutGrid, 
  Heart, 
  FolderKanban, 
  Sparkles, 
  X, 
  ChevronUp, 
  ShieldCheck 
} from 'lucide-react';
import ProfileContextMenu from '../ui/ProfileContextMenu';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  mobileOpen, 
  setMobileOpen,
  profileMenuOpen,
  setProfileMenuOpen,
  itemCount,
  favoriteCount,
  currentUser,
  onOpenAuth,
  onSignOut,
  onOpenBroadcast,
  onNavigateFavorites,
  theme,
  onToggleTheme,
  onInstallApp
}) {
  const navItems = [
    { id: 'storyboard', label: 'Storyboard', icon: LayoutGrid, count: itemCount },
    { id: 'favorites', label: 'Favorites', icon: Heart, count: favoriteCount, highlight: true },
    { id: 'prompts', label: 'Prompt Library', icon: Sparkles, badge: 'Soon' },
    { id: 'collections', label: 'Collections', icon: FolderKanban, badge: 'Soon' },
  ];

  const handleNavClick = (id) => {
    if (id === 'storyboard' || id === 'favorites') {
      setActiveTab(id);
      if (window.innerWidth <= 1024) {
        setMobileOpen(false);
      }
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div 
        className={`sidebar-backdrop ${mobileOpen ? 'mobile-open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Header: Brand Name Promptgallery */}
        <div className="sidebar-header">
          <div className="brand-logo" onClick={() => handleNavClick('storyboard')} style={{ cursor: 'pointer' }}>
            <img src="/icon.png" alt="Promptgallery" className="brand-icon" />
            <span>Promptgallery</span>
          </div>

          {/* Close button on mobile drawer */}
          <button 
            className="btn-icon hamburger-btn"
            style={{ display: mobileOpen ? 'flex' : 'none' }}
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">Studio Library</div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon 
                  size={18} 
                  color={item.id === 'favorites' && isActive ? 'var(--rose)' : 'currentColor'}
                  fill={item.id === 'favorites' && isActive ? 'var(--rose)' : 'none'}
                />
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span className="nav-badge" style={{
                    backgroundColor: item.id === 'favorites' && item.count > 0 ? 'var(--rose-bg)' : undefined,
                    color: item.id === 'favorites' && item.count > 0 ? 'var(--rose-text)' : undefined,
                    borderColor: item.id === 'favorites' && item.count > 0 ? 'var(--rose)' : undefined,
                  }}>
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span className="nav-badge" style={{ opacity: 0.6, fontSize: '0.65rem' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: Profile Context Menu & Button */}
        <div className="sidebar-footer">
          {/* Profile Context Menu placed strictly inside sidebar footer */}
          <ProfileContextMenu
            isOpen={profileMenuOpen}
            onClose={() => setProfileMenuOpen(false)}
            currentUser={currentUser}
            onOpenAuth={onOpenAuth}
            onSignOut={onSignOut}
            onOpenBroadcast={onOpenBroadcast}
            onNavigateFavorites={() => {
              handleNavClick('favorites');
              setProfileMenuOpen(false);
            }}
            theme={theme}
            onToggleTheme={onToggleTheme}
            onInstallApp={onInstallApp}
          />

          <button 
            className={`profile-button ${profileMenuOpen ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setProfileMenuOpen(prev => !prev);
            }}
            aria-label="User Profile"
            aria-expanded={profileMenuOpen}
          >
            <img 
              src={currentUser?.avatar || '/icon.png'} 
              alt={currentUser?.name || 'Guest'} 
              className="avatar"
              style={{ objectFit: 'cover' }}
            />
            <div className="profile-info">
              <div className="profile-name" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>{currentUser?.name || 'Sign In / Account'}</span>
                {isAdmin && <ShieldCheck size={13} color="var(--amber)" />}
              </div>
              <div className="profile-role" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.05em', fontWeight: 600, color: isAdmin ? 'var(--amber)' : (currentUser ? 'var(--text-muted)' : 'var(--primary)') }}>
                  {currentUser ? currentUser.role : 'Guest'}
                </span>
                <span>•</span>
                <span style={{ fontSize: '0.6875rem' }}>{currentUser?.email ? currentUser.email.split('@')[0] : 'Click to login'}</span>
              </div>
            </div>
            <ChevronUp size={16} style={{ 
              color: 'var(--text-muted)',
              transform: profileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform var(--transition-fast)'
            }} />
          </button>
        </div>
      </aside>
    </>
  );
}
