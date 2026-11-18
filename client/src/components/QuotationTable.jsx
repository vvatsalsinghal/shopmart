// =============================================================================
// FILE: client/src/components/QuotationTable.jsx
// PURPOSE: Itemized quotation table displaying selected items, quantities, and notes.
// REACT CONCEPT: Controlled Form Rows & Dynamic List Operations
// =============================================================================

import React from 'react';

export default function QuotationTable({ items, onQuantityChange, onNoteChange, onRemoveItem }) {
  if (items.length === 0) {
    return (
      <div className="table-responsive">
        <table className="quote-table">
          <tbody>
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                Your quotation request is currently empty. Click "+ Add to Quote Request" on any product above.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="quote-table">
        <thead>
          <tr>
            <th scope="col">Product Description</th>
            <th scope="col">Inventory State</th>
            <th scope="col" className="text-center">Requested Quantity</th>
            <th scope="col">Customer Notes / Specifications</th>
            <th scope="col" className="text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((cartItem) => {
            const { product, quantity, customerNote } = cartItem;
            const isReady = product.inStock;
            const badgeClass = isReady ? 'badge-success' : 'badge-warning';
            const badgeText = isReady ? 'In Stock (Warehouse A)' : 'Procurement Required';

            return (
              <tr key={cartItem.productId}>
                {/* Product title & SKU */}
                <td>
                  <div className="table-product-cell">
                    <strong>{product.title}</strong>
                    <span className="product-sku">SKU: {product.sku}</span>
                  </div>
                </td>

                {/* Stock status pill */}
                <td>
                  <span className={`badge ${badgeClass}`}>{badgeText}</span>
                </td>

                {/* Controlled Quantity Input */}
                <td className="text-center">
                  <input
                    type="number"
                    className="qty-input"
                    value={quantity}
                    min="1"
                    max="1000"
                    onChange={(e) => onQuantityChange(cartItem.productId, e.target.value)}
                    aria-label={`Quantity for ${product.title}`}
                  />
                </td>

                {/* Controlled Note Input */}
                <td>
                  <input
                    type="text"
                    className="form-input form-input-sm"
                    placeholder="e.g., custom voltage, packaging specs"
                    value={customerNote || ''}
                    onChange={(e) => onNoteChange(cartItem.productId, e.target.value)}
                  />
                </td>

                {/* Remove button */}
                <td className="text-right">
                  <button
                    type="button"
                    className="btn-icon btn-danger"
                    title={`Remove ${product.title} from quote`}
                    onClick={() => onRemoveItem(cartItem.productId)}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
