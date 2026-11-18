// =============================================================================
// FILE: client/src/components/ProductGrid.jsx
// PURPOSE: Catalogue container handling Loading, Error, Empty, and List states.
// REACT CONCEPT: Clean Component Architecture (Zero Prop Drilling!)
// =============================================================================

import React from 'react';
import ProductCard from './ProductCard.jsx';

// Notice: onAddToQuote is GONE! ProductGrid doesn't have to carry props it doesn't use.
export default function ProductGrid({ products, isLoading, error, onRetry }) {
  // STATE 1: ASYNC LOADING STATE
  if (isLoading) {
    return (
      <div className="product-grid">
        <div className="loading-state">
          <div className="spinner"></div>
          <p className="loading-text">Connecting to ShopMart Commercial API (React)...</p>
          <p className="loading-subtext">Fetching real-time wholesale pricing and warehouse inventory</p>
        </div>
      </div>
    );
  }

  // STATE 2: ERROR STATE
  if (error) {
    return (
      <div className="product-grid">
        <div className="error-banner">
          <h4>⚠️ Network Connection Failed</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={onRetry}>
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // STATE 3: EMPTY RESULTS (Search / Filter found nothing)
  if (!products || products.length === 0) {
    return (
      <div className="product-grid">
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '8px' }}>
          <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔍 No products match your filter criteria.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Try adjusting your search terms or clearing category filters.</p>
        </div>
      </div>
    );
  }

  // STATE 4: SUCCESS LIST RENDERING
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}
