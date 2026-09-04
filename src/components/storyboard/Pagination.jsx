import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(totalItems, currentPage * itemsPerPage);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('dots-1');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('dots-2');
      }
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="pagination-container">
      {/* Items Range Info */}
      <div className="pagination-info">
        <span>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{startItem}–{endItem}</strong> of{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{totalItems}</strong> items
        </span>

        {/* Items per page selector */}
        <div className="pagination-page-size">
          <label htmlFor="items-per-page" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Per page:
          </label>
          <select
            id="items-per-page"
            className="pagination-select"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            aria-label="Items per page"
          >
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        {/* First Page */}
        <button
          type="button"
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          title="First Page"
          aria-label="First page"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          title="Previous Page"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page Numbers */}
        <div className="pagination-pages">
          {getPageNumbers().map((p, idx) => {
            if (typeof p === 'string') {
              return (
                <span key={`dots-${idx}`} className="pagination-ellipsis">
                  •••
                </span>
              );
            }
            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                className={`pagination-page-number ${isActive ? 'active' : ''}`}
                onClick={() => onPageChange(p)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Page ${p}`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          title="Next Page"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>

        {/* Last Page */}
        <button
          type="button"
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          title="Last Page"
          aria-label="Last page"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}
