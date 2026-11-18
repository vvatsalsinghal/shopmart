// =============================================================================
// FILE: client/src/components/ProductCard.jsx
// PURPOSE: Reusable Card Component for an individual product in the catalogue.
// REACT CONCEPT: Consuming Context via Custom Hook (useQuoteCart)
// =============================================================================

import React from 'react';
import { useQuoteCart } from '../context/QuoteCartContext.jsx';

export default function ProductCard({ product }) {
  // REACT CONCEPT: Direct Context Consumption
  // No more prop drilling from App -> ProductGrid -> ProductCard!
  // This component connects directly to the global QuoteCartContext cloud.
  const { addToQuote } = useQuoteCart();

  const { title, sku, category, categoryLabel, description, price, unit, inStock, specs, icon } = product;

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
        {icon} <span>${categoryLabel}</span>
      </div>

      {/* Card Content Body */}
      <div className="product-card-body">
        <div className="product-category-tag">{categoryLabel}</div>
        <h3 className="product-title">{title}</h3>
        <p className="product-sku">SKU: {sku}</p>
        <p className="product-description">{description}</p>

        {/* Technical Specifications Tags */}
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

        {/* Action Button: Directly calls addToQuote from Context! */}
        <button
          className={`btn ${btnClass} btn-block add-to-quote-btn`}
          onClick={() => addToQuote(product)}
        >
          {btnText}
        </button>
      </div>
    </article>
  );
}
