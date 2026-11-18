// =============================================================================
// FILE: client/src/components/ConfirmationCard.jsx
// PURPOSE: Displays the confirmed quotation response with reference ID and ETAs.
// REACT CONCEPT: Pure Presentational Component
// =============================================================================

import React from 'react';

export default function ConfirmationCard({ confirmation }) {
  if (!confirmation) return null;

  const { quotationId, customer, processedItems, message } = confirmation;

  return (
    <div className="quotation-confirmation-card">
      <div className="confirmation-header">
        <span style={{ fontSize: '2rem' }}>🎉</span>
        <div>
          <h3>Quotation Registered Successfully!</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{message}</p>
        </div>
      </div>

      <div className="confirmation-details">
        <div className="confirmation-item">
          <span className="confirmation-label">Quotation ID</span>
          <span className="confirmation-value" style={{ color: '#38bdf8' }}>{quotationId}</span>
        </div>
        <div className="confirmation-item">
          <span className="confirmation-label">Client</span>
          <span className="confirmation-value">{customer.companyName}</span>
        </div>
        <div className="confirmation-item">
          <span className="confirmation-label">Status</span>
          <span className="confirmation-value" style={{ color: '#facc15' }}>Pending Sales Approval</span>
        </div>
      </div>

      <h4 style={{ fontSize: '0.95rem', marginTop: '1rem', color: '#cbd5e1' }}>
        Itemized Price & Delivery Schedule (Admin Response):
      </h4>
      <table className="confirmation-items-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Admin Unit Price</th>
            <th>Estimated Arrival Date (ETA)</th>
            <th>Logistics Route</th>
          </tr>
        </thead>
        <tbody>
          {processedItems.map((item) => (
            <tr key={item.productId}>
              <td>
                <strong>{item.title}</strong>
                <br />
                <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{item.sku}</span>
              </td>
              <td>{item.quantity}</td>
              <td style={{ color: '#4ade80', fontWeight: '600' }}>${item.quotedUnitPrice.toFixed(2)}</td>
              <td><strong>{item.estimatedArrivalDate}</strong></td>
              <td>
                <span className={`badge ${item.procurementRoute.includes('Express') ? 'badge-success' : 'badge-warning'}`}>
                  {item.procurementRoute}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
