// =============================================================================
// FILE: client/src/components/Header.jsx
// PURPOSE: Top Navigation Bar with Branding, Search Bar, and Quotation Badge.
// REACT CONCEPT: Subscribing to Global Context via Custom Hook
// =============================================================================

import React from 'react';
import { useQuoteCart } from '../context/QuoteCartContext.jsx';

// Notice: quoteCount prop is GONE! Header reads it directly from the Context cloud.
export default function Header({ searchQuery, onSearchChange, onCartClick }) {
  const { totalItemCount } = useQuoteCart();

  return (
    <header className="app-header">
      <div className="header-container container">
        {/* Brand identity */}
        <div className="brand">
          <span className="brand-icon">📦</span>
          <div>
            <h1 className="brand-title">ShopMart <span>B2B</span></h1>
            <p className="brand-subtitle">Commercial Equipment & Bulk Quotations (React 18)</p>
          </div>
        </div>

        {/* Search Bar */}
        <form className="search-form" role="search" onSubmit={(e) => e.preventDefault()}>
          <input
            type="search"
            id="product-search"
            className="search-input"
            placeholder="Search products by title, SKU, or category..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search products in catalogue"
          />
          <button type="button" className="btn btn-search" aria-label="Submit search">
            🔍 Search
          </button>
        </form>

        {/* Quotation Cart Button with Reactive Counter Badge */}
        <button className="quote-cart-btn" onClick={onCartClick} aria-haspopup="dialog">
          <span className="cart-icon">📋</span>
          <span className="cart-text">Quote Request</span>
          {/* Automatically updates from QuoteCartContext! */}
          <span className="badge badge-counter" id="cart-counter">
            {totalItemCount}
          </span>
        </button>
      </div>
    </header>
  );
}
