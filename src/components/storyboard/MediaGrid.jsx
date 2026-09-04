import React, { useState, useEffect } from 'react';
import MediaCard from './MediaCard';
import Pagination from './Pagination';
import { SearchX, Heart, LogIn } from 'lucide-react';

export default function MediaGrid({ 
  items, 
  onSelect, 
  onCopyPrompt, 
  copiedId, 
  onResetFilters,
  favorites = [],
  onToggleFavorite,
  isFavoritesTab = false,
  currentUser = null,
  onOpenAuth = null
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Reset page when items array changes (filter / search applied)
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  // Ensure current page is valid
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  if (items.length === 0) {
    if (isFavoritesTab) {
      return (
        <div className="empty-state">
          <div className="empty-icon" style={{ backgroundColor: 'var(--rose-bg)', color: 'var(--rose)' }}>
            <Heart size={24} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Belum ada storyboard favorit tersimpan
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '420px' }}>
            Koleksi favorit ini terisolasi khusus untuk akun <strong>{currentUser?.email || 'Anda'}</strong>. Klik ikon hati pada storyboard mana saja untuk menyimpannya ke sini!
          </p>
        </div>
      );
    }

    return (
      <div className="empty-state">
        <div className="empty-icon">
          <SearchX size={24} />
        </div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          No storyboards found
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '360px' }}>
          We couldn't find any storyboard items matching your current search or category filters.
        </p>
        <button 
          className="btn-secondary"
          onClick={onResetFilters}
          style={{ marginTop: '0.5rem' }}
        >
          Clear all filters
        </button>
      </div>
    );
  }

  const paginatedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Grid of Cards */}
      <div className="media-grid">
        {paginatedItems.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            onSelect={onSelect}
            onCopyPrompt={(prompt) => onCopyPrompt(prompt, item.id)}
            isCopied={copiedId === item.id}
            isFavorite={favorites.includes(item.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {/* Pagination Bar */}
      {items.length > 8 && (
        <Pagination
          currentPage={currentPage}
          totalItems={items.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
}
