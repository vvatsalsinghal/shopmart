// =============================================================================
// FILE: client/src/components/Header.jsx
// PURPOSE: Top Navigation Bar with Branding, Search Bar, and Quotation Badge.
// REACT CONCEPT: Functional Component & Props
// A component is a pure JavaScript function that receives "props" (inputs)
// and returns JSX describing what the HTML structure should look like.
// =============================================================================

import React from 'react';

// REACT CONCEPT: Destructuring Props in Function Signature
// Instead of writing (props) and props.quoteCount, we extract them directly!
export default function Header({ searchQuery, onSearchChange, quoteCount, onCartClick }) {
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
        {/* REACT CONCEPT: Controlled Input */}
        {/* The input's value is controlled by React state via the "searchQuery" prop */}
        <form className="search-form" role="search" onSubmit={(e) => e.preventDefault()}>
          <input
            type="search"
            id="product-search"
            className="search-input"
            placeholder="Search products by title, SKU, or category..."
            value={searchQuery}
            // REACT CONCEPT: Synthetic Event Handling
            // onChange fires on every keystroke, calling the parent's state updater function
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
          {/* REACT CONCEPT: Dynamic Expression Binding */}
          {/* {quoteCount} automatically updates whenever the parent component's cart changes! */}
          <span className="badge badge-counter" id="cart-counter">
            {quoteCount}
          </span>
        </button>
      </div>
    </header>
  );
}
