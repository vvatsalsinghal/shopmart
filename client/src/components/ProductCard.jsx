// =============================================================================
// FILE: client/src/components/ProductCard.jsx
// PURPOSE: Reusable Card Component for an individual product in the catalogue.
// REACT CONCEPT: Presentational / Pure Component
// Renders UI based strictly on props passed down from the parent.
// =============================================================================

import React from 'react';

export default function ProductCard({ product, onAddToQuote }) {
  // JAVASCRIPT CONCEPT: Destructuring Object Properties
  const { id, title, sku, category, categoryLabel, description, price, unit, inStock, specs, icon } = product;

  // REACT CONCEPT: Conditional Class Names & Labels
  const badgeClass = inStock ? "badge-success" : "badge-warning";
  const badgeText = inStock ? "In Stock" : "Procurement Required";
  const btnClass = inStock ? "btn-primary" : "btn-secondary";
  const btnText = inStock ? "+ Add to Quote Request" : "+ Request Custom Quote";

  return (
    <article className="product-card" data-category={category}>
      {/* Availability Status Badge */}
      <div className="product-card-badge-container">
        <span className={`badge ${badgeClass}`}>{badgeText}</span>
      </div>

      {/* Visual Placeholder */}
      <div className="product-image-placeholder" aria-hidden="true">
        {icon} <span>{categoryLabel}</span>
      </div>

      {/* Card Content Body */}
      <div className="product-card-body">
        <div className="product-category-tag">{categoryLabel}</div>
        <h3 className="product-title">{title}</h3>
        <p className="product-sku">SKU: {sku}</p>
        <p className="product-description">{description}</p>

        {/* Technical Specifications Tags */}
        {/* REACT CONCEPT: Array.map() inside JSX with unique "key" prop */}
        <div className="product-specs">
          {specs.map((spec, index) => (
            <span key={index} className="spec-tag">
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="product-card-footer">
        <div className="price-estimate">
          <span className="price-label">Catalogue Estimate:</span>
          <span className="price-value">${price.toFixed(2)} / {unit}</span>
        </div>

        {/* Action Button: Fires parent callback passing this product's ID */}
        <button
          className={`btn ${btnClass} btn-block add-to-quote-btn`}
          onClick={() => onAddToQuote(id)}
        >
          {btnText}
        </button>
      </div>
    </article>
  );
}
