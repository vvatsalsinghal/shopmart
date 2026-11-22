// =============================================================================
// FILE: client/src/components/QuotationForm.jsx
// PURPOSE: Client contact & procurement logistics submission form.
// REACT CONCEPT: Combining Local Form State with Global Context (useQuoteCart)
// =============================================================================

import React, { useState } from 'react';
import { useQuoteCart } from '../context/QuoteCartContext.jsx';
import { submitQuotationApi } from '../services/apiService.js';

export default function QuotationForm({ onQuotationSuccess }) {
  // Grab quoteCart and clearCart directly from Context!
  const { quoteCart, clearCart } = useQuoteCart();

  // Local Form Input States
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [desiredDeliveryDate, setDesiredDeliveryDate] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (quoteCart.length === 0) {
      alert("⚠️ Please add at least one product to your quotation request before submitting.");
      return;
    }

    const payload = {
      customer: {
        companyName: companyName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        desiredDeliveryDate
      },
      specialInstructions: additionalNotes.trim(),
      items: quoteCart.map((item) => ({
        productId: item.productId,
        title: item.product.title,
        sku: item.product.sku,
        quantity: item.quantity,
        customerNote: item.customerNote,
        inStock: item.product.inStock,
        cataloguePriceEstimate: item.product.price
      }))
    };

    setIsSubmitting(true);
    try {
      const response = await submitQuotationApi(payload);
      onQuotationSuccess(response);
      clearCart(); // Empties the cart globally!
      
      // Reset local form fields
      setCompanyName('');
      setEmail('');
      setPhone('');
      setDesiredDeliveryDate('');
      setAdditionalNotes('');
    } catch (err) {
      alert(`❌ Submission Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="quote-submission-form" onSubmit={handleSubmit}>
      <h3 className="form-section-title">Client Details & Procurement Schedule</h3>

      <div className="form-grid">
        <div className="form-control">
          <label htmlFor="company-name" className="form-label">
            Company / Institution Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="company-name"
            className="form-input"
            placeholder="e.g., Apex Manufacturing Corp"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label htmlFor="contact-email" className="form-label">
            Procurement Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="contact-email"
            className="form-input"
            placeholder="procurement@apexcorp.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label htmlFor="contact-phone" className="form-label">
            Contact Phone
          </label>
          <input
            type="tel"
            id="contact-phone"
            className="form-input"
            placeholder="+1 (555) 019-2834"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label htmlFor="target-delivery-date" className="form-label">
            Desired Delivery By
          </label>
          <input
            type="date"
            id="target-delivery-date"
            className="form-input"
            value={desiredDeliveryDate}
            onChange={(e) => setDesiredDeliveryDate(e.target.value)}
          />
        </div>
      </div>

      <div className="form-control">
        <label htmlFor="additional-notes" className="form-label">
          Special Instructions / Logistics Notes
        </label>
        <textarea
          id="additional-notes"
          className="form-textarea"
          rows="3"
          placeholder="Specify dock requirements, liftgate needs, or certification documents required with shipment..."
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <p className="form-disclaimer">
          🔒 By submitting, our commercial sales team will review stock, negotiate factory lead times,
          and deliver an itemized quotation with firm product-wise prices and delivery dates to your email.
        </p>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting to Commercial Sales Desk... ⏳" : "Submit Quotation Enquiry 🚀"}
        </button>
      </div>
    </form>
  );
}
