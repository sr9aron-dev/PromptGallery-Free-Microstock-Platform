import React, { useEffect, useRef } from 'react';
import { Bell, Megaphone, Sparkles, Film, Clock, CheckCheck } from 'lucide-react';

export default function NotificationDropdown({ 
  isOpen, 
  onClose, 
  notifications = [], 
  onClearAll, 
  currentUser, 
  onOpenBroadcast 
}) {
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !e.target.closest('[aria-label="Notifications"]')) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="dropdown-menu" ref={dropdownRef}>
      <div className="dropdown-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={15} />
          <span>Notifications</span>
        </div>
        <button 
          onClick={onClearAll}
          style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}
        >
          Mark all read
        </button>
      </div>

      {/* Admin Broadcast Quick Action */}
      {isAdmin && (
        <button
          onClick={() => {
            onOpenBroadcast();
            onClose();
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            padding: '0.5rem',
            marginBottom: '0.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--amber-bg)',
            color: 'var(--amber-text)',
            fontSize: '0.75rem',
            fontWeight: 700
          }}
        >
          <Megaphone size={13} />
          <span>Send Broadcast to All Users</span>
        </button>
      )}

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '320px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            No notifications right now
          </div>
        ) : (
          notifications.map((item) => {
            return (
              <div 
                key={item.id}
                className="dropdown-item"
                style={{ alignItems: 'flex-start', position: 'relative' }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: item.isBroadcast ? 'var(--amber-bg)' : 'var(--bg-muted)',
                  color: item.isBroadcast ? 'var(--amber-text)' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  {item.isBroadcast ? <Megaphone size={14} /> : <Sparkles size={14} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ fontWeight: item.unread ? 700 : 500, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                      {item.title}
                    </div>
                    {item.unread && (
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--rose)', flexShrink: 0 }} />
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.35 }}>
                    {item.desc}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={10} />
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
