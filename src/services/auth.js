/* ==========================================================================
   Promptgallery — Authentication & Role Service
   Strict Role Enforcement:
   - ONLY sr7aron@gmail.com is ADMIN
   - All other accounts are standard USERs
   ========================================================================== */

export const ADMIN_EMAIL = 'sr7aron@gmail.com';

/**
 * Strictly check if an email belongs to the Admin
 * Only sr7aron@gmail.com can be Admin
 * @param {string} email 
 * @returns {boolean}
 */
export function isEmailAdmin(email) {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

/**
 * Sign in using Google / Gmail account
 * Strictly assigns 'admin' only to sr7aron@gmail.com, and 'user' to everyone else
 * @param {string} email 
 * @param {string} [name] 
 * @param {string} [photoURL]
 * @returns {{ id: string, name: string, email: string, avatar: string, role: 'admin'|'user' }}
 */
export function authenticateWithGmail(email, name = '', photoURL = '') {
  if (!email) throw new Error('Email is required');
  const cleanEmail = email.trim().toLowerCase();
  
  const role = isEmailAdmin(cleanEmail) ? 'admin' : 'user';
  const displayName = name || cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // Real Google avatar if available, or fallback to deterministic avatar
  const avatar = photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`;

  const user = {
    id: `usr_${Date.now()}`,
    name: displayName,
    email: cleanEmail,
    avatar,
    role,
  };

  localStorage.setItem('promptgallery_user', JSON.stringify(user));
  return user;
}

/**
 * Get current stored user or null if logged out
 */
export function getInitialUser() {
  const saved = localStorage.getItem('promptgallery_user');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.email) {
        // Enforce role dynamically to guarantee strict admin check
        return {
          ...parsed,
          role: isEmailAdmin(parsed.email) ? 'admin' : 'user'
        };
      }
    } catch (e) {
      /* ignore */
    }
  }
  return null;
}
