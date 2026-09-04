import React from 'react';
import { Menu, Bell, Plus, Moon, Sun, LogIn } from 'lucide-react';
import NotificationDropdown from '../ui/NotificationDropdown';

export default function Header({ 
  onToggleSidebar, 
  onOpenCreate, 
  onToggleNotifications, 
  onCloseNotifications,
  isNotificationOpen,
  notifications = [],
  onClearAllNotifications,
  hasUnreadNotifications,
  theme,
  onToggleTheme,
  activeTab,
  currentUser,
  onOpenBroadcast,
  onOpenAuth
}) {
  const isAdmin = currentUser?.role === 'admin';
  const pageTitle = activeTab === 'favorites' ? 'Favorites' : 'Storyboard';

  return (
    <header className="header">
      {/* Left side: Hamburger + Title */}
      <div className="header-left">
        <button 
          className="btn-icon hamburger-btn"
          onClick={onToggleSidebar}
          aria-label="Open navigation sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="header-title-group">
          <h1 className="header-title">{pageTitle}</h1>
          <span className="header-tag">{activeTab === 'favorites' ? 'Curated' : 'Workspace'}</span>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="header-right">
        {/* Theme Switcher */}
        <button 
          className="btn-icon" 
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Sign In Button for Guests */}
        {!currentUser && (
          <button 
            type="button" 
            className="btn-primary" 
            onClick={onOpenAuth}
            style={{ gap: '0.4rem', fontSize: '0.8125rem', padding: '0.45rem 0.85rem' }}
          >
            <LogIn size={14} />
            <span>Sign In</span>
          </button>
        )}

        {/* Notification Bell with anchored Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn-icon" 
            onClick={onToggleNotifications}
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {hasUnreadNotifications && <span className="notification-badge" />}
          </button>

          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={onCloseNotifications}
            notifications={notifications}
            onClearAll={onClearAllNotifications}
            currentUser={currentUser}
            onOpenBroadcast={onOpenBroadcast}
          />
        </div>

        {/* Plus / Add Storyboard Button (Icon Only & Admin Mode Only!) */}
        {isAdmin && (
          <button 
            className="btn-primary"
            style={{ width: '38px', height: '38px', padding: 0, justifyContent: 'center', borderRadius: 'var(--radius-lg)' }}
            onClick={onOpenCreate}
            title="New Storyboard Item"
            aria-label="New Storyboard Item"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </header>
  );
}
