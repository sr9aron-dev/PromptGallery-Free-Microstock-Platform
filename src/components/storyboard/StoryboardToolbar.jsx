import React, { useState } from 'react';
import { Search, Image as ImageIcon, Video, Layers, X, Plus } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../../data/mockData';

export default function StoryboardToolbar({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory,
  mediaTypeFilter,
  setMediaTypeFilter,
  totalCount,
  filteredCount,
  categories = DEFAULT_CATEGORIES,
  onAddCategory
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCat, setNewCat] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const trimmed = newCat.trim();
    if (trimmed && onAddCategory) {
      onAddCategory(trimmed);
      setSelectedCategory(trimmed);
    }
    setNewCat('');
    setIsAdding(false);
  };

  const allCategoryPills = ['All', ...categories];

  return (
    <div className="toolbar">
      {/* Top row: Search & Type Toggle */}
      <div className="toolbar-row">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text"
            className="search-input"
            placeholder="Search storyboards by title, prompt keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Type Toggle: All / Images / Videos */}
        <div className="type-filter-group">
          <button 
            className={`type-filter-btn ${mediaTypeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setMediaTypeFilter('all')}
          >
            <Layers size={14} style={{ display: 'inline', marginRight: '4px' }} />
            All Media
          </button>
          <button 
            className={`type-filter-btn ${mediaTypeFilter === 'image' ? 'active' : ''}`}
            onClick={() => setMediaTypeFilter('image')}
          >
            <ImageIcon size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Images
          </button>
          <button 
            className={`type-filter-btn ${mediaTypeFilter === 'video' ? 'active' : ''}`}
            onClick={() => setMediaTypeFilter('video')}
          >
            <Video size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Videos
          </button>
        </div>
      </div>

      {/* Bottom row: Category Pills */}
      <div className="category-pills" style={{ alignItems: 'center' }}>
        {allCategoryPills.map((category) => (
          <button
            key={category}
            className={`pill-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}

        {/* Inline Add Category in Toolbar */}
        {isAdding ? (
          <form onSubmit={handleAddSubmit} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="text"
              className="form-input"
              style={{ padding: '0.2rem 0.5rem', height: '28px', fontSize: '0.75rem', width: '130px' }}
              placeholder="New Category..."
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn-primary" style={{ height: '28px', padding: '0 0.5rem', fontSize: '0.75rem' }}>
              Add
            </button>
            <button
              type="button"
              onClick={() => { setIsAdding(false); setNewCat(''); }}
              style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
            >
              <X size={14} />
            </button>
          </form>
        ) : (
          <button
            type="button"
            className="pill-btn"
            style={{ borderStyle: 'dashed', display: 'inline-flex', alignItems: 'center', gap: '3px', color: 'var(--primary)' }}
            onClick={() => setIsAdding(true)}
            title="Add a custom category"
          >
            <Plus size={12} />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {/* Workspace Status Bar */}
      <div className="workspace-meta">
        <span>
          Showing <strong>{filteredCount}</strong> of {totalCount} storyboard items
        </span>
        {(searchQuery || selectedCategory !== 'All' || mediaTypeFilter !== 'all') && (
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setMediaTypeFilter('all');
            }}
            style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.8125rem' }}
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
