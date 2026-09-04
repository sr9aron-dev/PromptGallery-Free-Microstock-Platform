import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Service Worker for Android PWA installation & offline capability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[Promptgallery PWA] Service Worker registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.warn('[Promptgallery PWA] Service Worker registration failed:', err);
      });
  });
}
