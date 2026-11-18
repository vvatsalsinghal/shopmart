// =============================================================================
// FILE: client/src/App.jsx
// PURPOSE: Root Application Component for ShopMart Quotation System.
// DEMONSTRATES: React State Management (useState), Lifecycle Hooks (useEffect),
//               Component Composition, Data Flow (Props & Callbacks), and Immutability.
// =============================================================================

import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import ProductGrid from './components/ProductGrid.jsx';
import QuotationTable from './components/QuotationTable.jsx';
import QuotationForm from './components/QuotationForm.jsx';
import ConfirmationCard from './components/ConfirmationCard.jsx';
import { fetchProductsApi, submitQuotationApi } from './services/apiService.js';

export default function App() {
  // ===========================================================================
  // REACT CONCEPT: useState Hook
  // useState declares a reactive state variable and an updater function.
  // Whenever the updater function is called with new data, React automatically
  // schedules a re-render of this component and its children!
  // ===========================================================================

  // 1. Core Data & Network States
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Quotation Cart State
  const [quoteCart, setQuoteCart] = useState([]);

  // 3. Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilters, setStockFilters] = useState({
    inStock: true,
    procurement: true
  });

  // 4. Quotation Submission & Confirmation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  // ===========================================================================
  // REACT CONCEPT: useEffect Hook
  // Runs side effects (such as fetching data over HTTP) after component renders.
  // The empty dependency array [] means: "Run this effect ONCE when the component mounts."
  // ===========================================================================
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchProductsApi();
      setProducts(data);

      // Pre-seed 2 default quotation items so the user immediately sees sample data
      setQuoteCart([
        {
          productId: data[0].id,
          product: data[0],
          quantity: 2,
          customerNote: "Need 240V plug configuration"
        },
        {
          productId: data[1].id,
          product: data[1],
          quantity: 10,
          customerNote: "5 Large, 5 X-Large packs"
        }
      ]);
    } catch (err) {
      setError(err.message || "Failed to load products from API.");
    } finally {
      setIsLoading(false);
    }
  };

  // ===========================================================================
  // CART ACTIONS: Adding, Removing, Updating (Immutable State Updates)
  // ===========================================================================

  // ACTION 1: Add to Quote Request
  const handleAddToQuote = (productId) => {
    const productToAdd = products.find((p) => p.id === productId);
    if (!productToAdd) return;

    setQuoteCart((prevCart) => {
      const existing = prevCart.find((item) => item.productId === productId);
      if (existing) {
        // Increment quantity if already in quoteCart
        return prevCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // REACT CONCEPT: Immutability with Spread Operator
        // We create a new array with all previous items + the new quote item
        return [
          ...prevCart,
          {
            productId: productToAdd.id,
            product: productToAdd,
            quantity: 1,
            customerNote: ""
          }
        ];
      }
    });

    // Smooth scroll to quotation drawer
    const quotePanel = document.getElementById("quotation-panel");
    if (quotePanel) {
      quotePanel.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ACTION 2: Update Line Item Quantity
  const handleQuantityChange = (productId, newQty) => {
    const qtyNumber = parseInt(newQty, 10);
    if (isNaN(qtyNumber) || qtyNumber <= 0) {
      handleRemoveItem(productId);
      return;
    }

    setQuoteCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity: qtyNumber } : item
      )
    );
  };

  // ACTION 3: Update Customer Specification Note
  const handleNoteChange = (productId, note) => {
    setQuoteCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, customerNote: note } : item
      )
    );
  };

  // ACTION 4: Remove Line Item
  const handleRemoveItem = (productId) => {
    setQuoteCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
  };

  // ACTION 5: Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setStockFilters({ inStock: true, procurement: true });
  };

  const handleStockFilterChange = (key, value) => {
    setStockFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ACTION 6: Submit Quotation Enquiry to API
  const handleQuotationSubmit = async (customerData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        customer: customerData,
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

      const response = await submitQuotationApi(payload);
      setConfirmation(response);
      setQuoteCart([]); // Clear cart after successful submission
    } catch (err) {
      alert(`❌ Submission Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===========================================================================
  // COMPUTED VALUES (Derived State)
  // JAVASCRIPT CONCEPT: Array.reduce() & Array.filter()
  // Recalculated automatically on every render without needing separate state!
  // ===========================================================================
  const totalQuoteCount = quoteCart.reduce((total, item) => total + item.quantity, 0);

  const filteredProducts = products.filter((product) => {
    const cleanSearch = searchQuery.trim().toLowerCase();
    const matchesSearch =
      cleanSearch === '' ||
      product.title.toLowerCase().includes(cleanSearch) ||
      product.sku.toLowerCase().includes(cleanSearch) ||
      product.description.toLowerCase().includes(cleanSearch);

    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    const matchesStock =
      (product.inStock && stockFilters.inStock) ||
      (!product.inStock && stockFilters.procurement);

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="app-root">
      {/* 1. Header Component */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        quoteCount={totalQuoteCount}
        onCartClick={() => {
          document.getElementById('quotation-panel')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. Main Layout: Sidebar + Product Grid */}
      <main className="main-layout container">
        <Sidebar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          stockFilters={stockFilters}
          onStockFilterChange={handleStockFilterChange}
          onResetFilters={handleResetFilters}
        />

        <section className="catalogue-content" aria-labelledby="catalogue-heading">
          <div className="catalogue-toolbar">
            <div>
              <h2 id="catalogue-heading" class="section-title">Commercial Product Catalogue</h2>
              <p className="section-description">
                Select products to request bulk wholesale quotations with custom delivery schedules (React 18).
              </p>
            </div>
          </div>

          {/* Product Grid Component */}
          <ProductGrid
            products={filteredProducts}
            isLoading={isLoading}
            error={error}
            onAddToQuote={handleAddToQuote}
            onRetry={loadProducts}
          />
        </section>
      </main>

      {/* 3. Quotation Panel Drawer */}
      <section className="quotation-panel" id="quotation-panel" aria-labelledby="quote-panel-title">
        <div className="container quotation-panel-inner">
          <div className="panel-header">
            <div>
              <h2 id="quote-panel-title" className="panel-title">Active Quotation Request Form</h2>
              <p className="panel-subtitle">Review items, adjust quantities, specify required dates, and submit for wholesale pricing.</p>
            </div>
            <span className="badge badge-info">Step 1 of 2: Customer Enquiry</span>
          </div>

          {/* Itemized Table */}
          <QuotationTable
            items={quoteCart}
            onQuantityChange={handleQuantityChange}
            onNoteChange={handleNoteChange}
            onRemoveItem={handleRemoveItem}
          />

          {/* Customer Submission Form */}
          <QuotationForm
            onSubmit={handleQuotationSubmit}
            isSubmitting={isSubmitting}
            hasItems={quoteCart.length > 0}
          />

          {/* Server Confirmation Card (Rendered if quotation was submitted) */}
          <ConfirmationCard confirmation={confirmation} />
        </div>
      </section>

      {/* 4. Admin Preview Section */}
      <section className="admin-preview-section container" aria-label="Admin Quotation Response Demonstration">
        <div className="admin-card">
          <div className="admin-badge">Admin Workflow Preview</div>
          <h3>How the Admin Prepares the Quotation Response</h3>
          <p>Notice how our business model handles different product availability states. The admin enters custom pricing and distinct arrival dates for each product:</p>

          <div className="admin-response-simulation">
            <div className="admin-row">
              <span className="product-title">Variable-Speed Industrial Drill Press 1.5HP</span>
              <span className="admin-input-tag">Admin Price: <strong>$1,180.00 / unit</strong></span>
              <span className="admin-input-tag eta-ready">Estimated Arrival: <strong>Immediate (Nov 20, 2026)</strong></span>
            </div>
            <div className="admin-row">
              <span className="product-title">Kevlar Level-5 Gloves (Case of 100)</span>
              <span className="admin-input-tag">Admin Price: <strong>$295.00 / case</strong></span>
              <span className="admin-input-tag eta-procurement">Estimated Arrival: <strong>Factory Lead Time (Dec 05, 2026)</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="app-footer">
        <div className="container footer-content">
          <p>&copy; 2026 ShopMart B2B Quotation Management System. Built with React 18 & Vite.</p>
          <p className="footer-links">
            <span>Layer 4: React Component Architecture</span> • 
            <span>Declarative State Management</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
