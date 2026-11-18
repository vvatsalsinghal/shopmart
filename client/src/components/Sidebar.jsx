// =============================================================================
// FILE: client/src/components/Sidebar.jsx
// PURPOSE: Filter controls for Category selection and Stock Availability.
// REACT CONCEPT: Controlled Form Elements & State Lifting
// =============================================================================

import React from 'react';

export default function Sidebar({
  selectedCategory,
  onCategoryChange,
  stockFilters,
  onStockFilterChange,
  onResetFilters
}) {
  return (
    <aside className="catalogue-sidebar" aria-label="Product catalogue filters">
      <div className="sidebar-card">
        <div className="sidebar-header">
          <h3>Filter Catalogue</h3>
          <button type="button" className="btn-link" onClick={onResetFilters}>
            Reset
          </button>
        </div>

        {/* Filter Group: Category Dropdown */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="category-select">
            Product Category
          </label>
          {/* REACT CONCEPT: Controlled <select> */}
          {/* value={selectedCategory} keeps the dropdown synchronized with React state */}
          <select
            id="category-select"
            className="form-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="machinery">Industrial Machinery</option>
            <option value="safety">Safety & PPE</option>
            <option value="tools">Precision Tools</option>
            <option value="office">Office & Warehouse</option>
          </select>
        </div>

        {/* Filter Group: Stock Availability Checkboxes */}
        <div className="filter-group">
          <span className="filter-label">Availability Status</span>
          <div className="checkbox-group">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={stockFilters.inStock}
                onChange={(e) => onStockFilterChange('inStock', e.target.checked)}
              />
              <span>Ready in Stock</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={stockFilters.procurement}
                onChange={(e) => onStockFilterChange('procurement', e.target.checked)}
              />
              <span>Procurement on Order</span>
            </label>
          </div>
        </div>

        {/* Business Procurement Notice Banner */}
        <div className="procurement-notice">
          <span className="notice-icon">ℹ️</span>
          <p>
            <strong>Bulk Order Notice:</strong> Out-of-stock items can still be added to your quote.
            Our procurement desk will confirm custom production pricing and delivery timelines.
          </p>
        </div>
      </div>
    </aside>
  );
}
