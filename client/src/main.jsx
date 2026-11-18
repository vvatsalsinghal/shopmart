// =============================================================================
// FILE: client/src/main.jsx
// PURPOSE: Root entry point for our React Single Page Application (SPA).
// REACT CONCEPT: createRoot & DOM Mount Point
// React takes over the <div id="root"> element in index.html and dynamically
// renders our component hierarchy into it.
// =============================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Reuses our complete Layer 1 & 3 CSS design system!

// REACT CONCEPT: React 18 createRoot API
// Replaces the legacy ReactDOM.render() with the modern Concurrent Mode root.
const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  // REACT CONCEPT: React.StrictMode
  // A development-only wrapper that checks for outdated patterns, side effects,
  // and deprecated APIs. It does not render any visible HTML elements itself.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
