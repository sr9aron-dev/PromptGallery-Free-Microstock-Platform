import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import WelcomeHero from './components/storyboard/WelcomeHero';
import StoryboardToolbar from './components/storyboard/StoryboardToolbar';
import MediaGrid from './components/storyboard/MediaGrid';
import StoryboardDetailPage from './components/storyboard/StoryboardDetailPage';
import CreateStoryboardPage from './components/storyboard/CreateStoryboardPage';
import AuthModal from './components/auth/AuthModal';
import LoginPage from './components/auth/LoginPage';
import BroadcastModal from './components/admin/BroadcastModal';
import { INITIAL_STORYBOARDS, DEFAULT_CATEGORIES } from './data/mockData';
import { getInitialUser, authenticateWithGmail, ADMIN_EMAIL } from './services/auth';
import { signOutFirebase, saveStoryboardToCloud, subscribeStoryboards, fetchCloudStoryboards } from './services/firebase';
import { Check, Download, Smartphone, X } from 'lucide-react';

const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('promptgallery_sync')
  : null;

export default function App() {
  // Theme state (system or saved preference, default dark)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('storyboard_theme') || 'dark';
  });

  // Storyboard items (all users can view items published by admin)
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('storyboard_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* ignore */ }
    }
    return INITIAL_STORYBOARDS;
  });

  // Dynamic Workspace Categories (persisted, allows manual additions)
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('promptgallery_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_CATEGORIES;
  });

  // Current authenticated user (Strict: only sr7aron@gmail.com is admin, all others are user)
  const [currentUser, setCurrentUser] = useState(() => getInitialUser());

  // Helper to isolate favorites per user account
  const getFavoritesStorageKey = (user) => {
    if (!user || !user.email) return 'promptgallery_favorites_none';
    return `promptgallery_favorites_${user.email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  };

  const loadUserFavorites = (user) => {
    if (!user || !user.email) return [];
    const key = getFavoritesStorageKey(user);
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  };

  // Favorites list strictly isolated per user
  const [favorites, setFavorites] = useState(() => loadUserFavorites(getInitialUser()));

  // Sync favorites whenever user changes (login / logout / switch user)
  useEffect(() => {
    setFavorites(loadUserFavorites(currentUser));
  }, [currentUser?.email]);

  // Persist favorites specifically to active user's key
  useEffect(() => {
    const key = getFavoritesStorageKey(currentUser);
    localStorage.setItem(key, JSON.stringify(favorites));
  }, [favorites, currentUser?.email]);

  // View routing: 'storyboard' | 'favorites' | 'detail' | 'create'
  const [currentView, setCurrentView] = useState('storyboard');
  const [previousView, setPreviousView] = useState('storyboard');
  const [selectedItem, setSelectedItem] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modals & Popovers
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Notifications state (persisted so "Mark all read" survives reload)
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(() => {
    const saved = localStorage.getItem('promptgallery_has_unread');
    if (saved !== null) return saved === 'true';
    return true;
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('promptgallery_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 1,
        title: 'Video Render Completed',
        desc: 'Celestial Drifter: Atmospheric Spaceship Descent is ready.',
        time: '12m ago',
        unread: true,
        isBroadcast: false
      },
      {
        id: 2,
        title: 'Promptgallery Announcement',
        desc: `Welcome to Promptgallery Studio Workspace. Exclusive admin posting for ${ADMIN_EMAIL}.`,
        time: '1h ago',
        unread: true,
        isBroadcast: true
      }
    ];
  });

  // Copied item ID tracking for inline button feedback
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState(null);

  // Synchronize theme with DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('storyboard_theme', theme);
  }, [theme]);

  // Persist items & categories & notifications
  useEffect(() => {
    localStorage.setItem('storyboard_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('promptgallery_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('promptgallery_has_unread', String(hasUnreadNotifications));
  }, [hasUnreadNotifications]);

  useEffect(() => {
    localStorage.setItem('promptgallery_categories', JSON.stringify(categories));
  }, [categories]);

  // Real-time synchronization across browser tabs and Firestore cloud
  useEffect(() => {
    // 1. Subscribe to Firestore cloud updates
    const unsubscribeCloud = subscribeStoryboards((cloudItems) => {
      if (Array.isArray(cloudItems) && cloudItems.length > 0) {
        setItems(prevItems => {
          // Cloud items are the source of truth — merge them with local-only items
          const cloudIds = new Set(cloudItems.map(c => c.id));
          // Keep local-only items (temp items created before cloud sync confirms)
          const localOnly = prevItems.filter(p => !cloudIds.has(p.id) && p.id.startsWith('sb-'));
          const merged = [...localOnly, ...cloudItems];
          localStorage.setItem('storyboard_items', JSON.stringify(merged));
          return merged;
        });
      }
    });

    // 2. BroadcastChannel for instant cross-tab sync in the same browser
    if (syncChannel) {
      syncChannel.onmessage = (event) => {
        if (event.data?.type === 'NEW_STORYBOARD' && event.data?.item) {
          const newItem = event.data.item;
          setItems(prev => {
            if (prev.some(i => i.id === newItem.id)) return prev;
            const next = [newItem, ...prev];
            localStorage.setItem('storyboard_items', JSON.stringify(next));
            return next;
          });
        }
      };
    }

    // 3. Fallback window storage event
    const handleStorage = (e) => {
      if (e.key === 'storyboard_items' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed);
          }
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      if (unsubscribeCloud) unsubscribeCloud();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Fetch real cloud storyboards from Firestore on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCloud() {
      const cloudData = await fetchCloudStoryboards(80);
      if (isMounted && cloudData && Array.isArray(cloudData) && cloudData.length > 0) {
        setItems(prevItems => {
          const cloudIds = new Set(cloudData.map(c => c.id));
          const localOnly = prevItems.filter(p => !cloudIds.has(p.id) && p.id.startsWith('sb-'));
          const merged = [...localOnly, ...cloudData];
          try {
            localStorage.setItem('storyboard_items', JSON.stringify(merged));
          } catch (e) {}
          return merged;
        });
      }
    }
    loadCloud();
    return () => { isMounted = false; };
  }, []);

  const handleAddCategory = (newCat) => {
    const trimmed = newCat.trim();
    if (!trimmed) return;
    setCategories(prev => {
      if (prev.includes(trimmed)) return prev;
      const next = [...prev, trimmed];
      showToast(`Category "${trimmed}" added! ✨`);
      return next;
    });
  };

  // PWA Android install prompt support (remember dismissal so it doesn't keep appearing)
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  const dismissInstallBanner = () => {
    setShowInstallBanner(false);
    sessionStorage.setItem('promptgallery_install_dismissed', 'true');
  };

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show if user hasn't dismissed it this session
      const dismissed = sessionStorage.getItem('promptgallery_install_dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      sessionStorage.setItem('promptgallery_install_dismissed', 'true');
      showToast('Promptgallery App installed on your device! 📱');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        dismissInstallBanner();
      }
      setDeferredPrompt(null);
    } else {
      showToast('Android: Tap Chrome menu (⋮) -> "Install App" or "Add to Home screen"');
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Toggle Favorite (saves strictly to the active user's account)
  const handleToggleFavorite = (id) => {
    setFavorites(prev => {
      const isFav = prev.includes(id);
      const next = isFav ? prev.filter(item => item !== id) : [...prev, id];
      showToast(isFav ? 'Removed from Favorites' : 'Saved to Favorites ❤️');
      return next;
    });
  };

  // Copy prompt handler
  const handleCopyPrompt = async (promptText, id) => {
    if (!promptText) return;
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedId(id);
      showToast('Prompt copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      showToast('Copied to clipboard');
    }
  };

  // Navigation handlers
  const handleSelectCard = (item) => {
    setSelectedItem(item);
    if (currentView !== 'detail') {
      setPreviousView(currentView);
    }
    setCurrentView('detail');
  };

  const handleBackToGrid = () => {
    setCurrentView(previousView === 'create' ? 'storyboard' : previousView);
    setSelectedItem(null);
  };

  const handleOpenCreate = () => {
    if (currentUser?.role !== 'admin') {
      showToast(`Only Admin (${ADMIN_EMAIL}) can publish storyboards`);
      return;
    }
    setPreviousView(currentView === 'detail' ? 'storyboard' : currentView);
    setCurrentView('create');
  };

  const handleTabChange = (tabId) => {
    setCurrentView(tabId);
    setSelectedItem(null);
  };

  // Create new storyboard item (Admin Only)
  const handleCreateStoryboard = async (newItem) => {
    if (currentUser?.role !== 'admin') {
      showToast(`Only Admin (${ADMIN_EMAIL}) can publish storyboards`);
      return;
    }
    const tempId = `sb-${Date.now()}`;
    const optimisticItem = {
      ...newItem,
      id: tempId,
      isNew: true,
      author: 'sr7aron@gmail.com',
      authorRole: 'admin',
      createdAt: 'Just now'
    };

    // 1. Immediately update local state & localStorage
    setItems(prev => {
      const updated = [optimisticItem, ...prev];
      try {
        localStorage.setItem('storyboard_items', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // 2. Broadcast immediately to any other open tabs in the browser
    if (syncChannel) {
      try {
        syncChannel.postMessage({ type: 'NEW_STORYBOARD', item: optimisticItem });
      } catch (e) {}
    }

    // 3. Reset view to storyboard so post is right at the top
    setCurrentView('storyboard');
    setSelectedItem(null);
    setSelectedCategory('All');
    setMediaTypeFilter('all');
    setSearchQuery('');

    // 4. Persist to real Firestore cloud database
    try {
      const savedResult = await saveStoryboardToCloud(optimisticItem);
      if (savedResult && savedResult.id) {
        setItems(prev => prev.map(item => item.id === tempId ? { ...item, id: savedResult.id } : item));
      }
      showToast(`Published "${newItem.title}" to global cloud! 🌐`);
    } catch (e) {
      showToast(`Published "${newItem.title}" locally`);
    }
  };

  // Login handler
  const handleLogin = (email, name = '', photoURL = '') => {
    try {
      const user = authenticateWithGmail(email, name, photoURL);
      setCurrentUser(user);

      // ALWAYS reset to storyboard tab so all admin posts are immediately visible!
      setCurrentView('storyboard');
      setSelectedItem(null);
      setSelectedCategory('All');
      setMediaTypeFilter('all');
      setSearchQuery('');

      // Reload latest items from localStorage cache
      const saved = localStorage.getItem('storyboard_items');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed);
          }
        } catch (e) {}
      }

      if (user.role === 'admin') {
        showToast(`Welcome Admin ${user.email}! 👑 Posting & studio controls unlocked.`);
      } else {
        showToast(`Welcome ${user.name}! ✨ Logged in as User.`);
      }
    } catch (e) {
      showToast(e.message || 'Login failed');
    }
  };

  // Sign out handler: clears user session and returns to login portal
  const handleSignOut = () => {
    localStorage.removeItem('promptgallery_user');
    signOutFirebase();
    setCurrentUser(null);
    setCurrentView('storyboard');
    setSelectedItem(null);
    showToast('Berhasil keluar dari workspace 👋');
  };

  // Broadcast Notification handler (Admin Only)
  const handleSendBroadcast = (newBroadcast) => {
    if (currentUser?.role !== 'admin') return;
    const broadcastEntry = {
      ...newBroadcast,
      id: Date.now(),
    };
    setNotifications([broadcastEntry, ...notifications]);
    setHasUnreadNotifications(true);
    showToast('Broadcast notification sent to all users! 📢');
  };

  // Filter items based on active tab, search, category, type
  const displayItems = useMemo(() => {
    let sourceList = items;
    if (currentView === 'favorites') {
      sourceList = items.filter(item => favorites.includes(item.id));
    }

    const filtered = sourceList.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Type filter
      if (mediaTypeFilter !== 'all' && item.type !== mediaTypeFilter) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(query);
        const matchesPrompt = item.prompt?.toLowerCase().includes(query);
        const matchesCategory = item.category?.toLowerCase().includes(query);
        return matchesTitle || matchesPrompt || matchesCategory;
      }
      return true;
    });

    // Sort
    const parseDate = (d) => {
      if (!d || d === 'Recently' || d === 'Just now') return Date.now();
      if (typeof d === 'string') {
        const ts = Date.parse(d);
        return isNaN(ts) ? 0 : ts;
      }
      return 0;
    };

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return parseDate(a.createdAt) - parseDate(b.createdAt);
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'newest':
        default:
          return parseDate(b.createdAt) - parseDate(a.createdAt);
      }
    });
  }, [items, favorites, currentView, selectedCategory, mediaTypeFilter, searchQuery, sortBy]);

  // If user is not authenticated, restrict access and display dedicated LoginPage portal
  if (!currentUser) {
    return (
      <>
        <LoginPage
          onLogin={handleLogin}
          theme={theme}
          onToggleTheme={toggleTheme}
          onInstallApp={handleInstallApp}
          canInstall={!!deferredPrompt}
        />
        {toast && (
          <div className="toast-notification">
            <Check size={16} />
            <span>{toast}</span>
          </div>
        )}
        {showInstallBanner && (
          <div className="pwa-install-banner">
            <div className="pwa-banner-left">
              <Smartphone size={20} className="pwa-banner-icon" />
              <div className="pwa-banner-text">
                <strong>Install Promptgallery App</strong>
                <span>Gunakan seperti aplikasi asli di Android & Desktop</span>
              </div>
            </div>
            <div className="pwa-banner-actions">
              <button className="btn-primary pwa-banner-btn" onClick={handleInstallApp}>
                <Download size={15} />
                <span>Install</span>
              </button>
              <button className="btn-icon pwa-banner-close" onClick={dismissInstallBanner} aria-label="Tutup">
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={currentView === 'detail' || currentView === 'create' ? previousView : currentView}
        setActiveTab={handleTabChange}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        profileMenuOpen={isProfileMenuOpen}
        setProfileMenuOpen={setIsProfileMenuOpen}
        itemCount={items.length}
        favoriteCount={favorites.length}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
        onOpenBroadcast={() => setIsBroadcastModalOpen(true)}
        onNavigateFavorites={() => handleTabChange('favorites')}
        theme={theme}
        onToggleTheme={toggleTheme}
        onInstallApp={handleInstallApp}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setMobileSidebarOpen(prev => !prev)}
          onOpenCreate={handleOpenCreate}
          onToggleNotifications={() => setIsNotificationOpen(prev => !prev)}
          onCloseNotifications={() => setIsNotificationOpen(false)}
          isNotificationOpen={isNotificationOpen}
          notifications={notifications}
          onClearAllNotifications={() => {
            setHasUnreadNotifications(false);
            setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
          }}
          hasUnreadNotifications={hasUnreadNotifications}
          theme={theme}
          onToggleTheme={toggleTheme}
          activeTab={currentView}
          currentUser={currentUser}
          onOpenBroadcast={() => setIsBroadcastModalOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* View Routing */}
        {currentView === 'detail' && selectedItem ? (
          <StoryboardDetailPage
            item={selectedItem}
            onBack={handleBackToGrid}
            isFavorite={favorites.includes(selectedItem.id)}
            onToggleFavorite={handleToggleFavorite}
            onCopyPrompt={handleCopyPrompt}
            isCopied={copiedId === selectedItem.id}
          />
        ) : currentView === 'create' ? (
          <CreateStoryboardPage
            onBack={handleBackToGrid}
            onCreate={handleCreateStoryboard}
            categories={categories}
            onAddCategory={handleAddCategory}
          />
        ) : (
          /* Grid View (Storyboard or Favorites) */
          <main className="workspace-content">
            {/* Home Welcome Hero Banner (Especially prominent for guests or when logging out) */}
            {currentView === 'storyboard' && (
              <WelcomeHero
                currentUser={currentUser}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onSignOut={handleSignOut}
                onOpenCreate={handleOpenCreate}
                favoriteCount={favorites.length}
              />
            )}

            <StoryboardToolbar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              mediaTypeFilter={mediaTypeFilter}
              setMediaTypeFilter={setMediaTypeFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              totalCount={currentView === 'favorites' ? favorites.length : items.length}
              filteredCount={displayItems.length}
              categories={categories}
              onAddCategory={handleAddCategory}
            />

            <MediaGrid
              items={displayItems}
              onSelect={handleSelectCard}
              onCopyPrompt={handleCopyPrompt}
              copiedId={copiedId}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              isFavoritesTab={currentView === 'favorites'}
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onResetFilters={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setMediaTypeFilter('all');
              }}
            />
          </main>
        )}
      </div>

      {/* Auth Modal (Google / Gmail Sign-In) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Broadcast Notification Modal (Admin only) */}
      <BroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        onSendBroadcast={handleSendBroadcast}
      />

      {/* PWA Android Install Banner */}
      {showInstallBanner && (
        <div className="pwa-install-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            <img src="/icon.png" alt="Promptgallery" style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Install Promptgallery App
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Add to your Android home screen
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={handleInstallApp} 
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8125rem', gap: '4px' }}
            >
              <Download size={14} />
              <span>Install</span>
            </button>
            <button 
              type="button" 
              className="btn-icon" 
              onClick={dismissInstallBanner} 
              style={{ width: '32px', height: '32px' }}
              aria-label="Close install banner"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toast && (
        <div className="toast">
          <Check size={16} color="var(--emerald)" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
