// =============================================================================
// FILE: client/src/App.jsx
// PURPOSE: Root Application Component for ShopMart Quotation System.
// LAYER 5 REFACTOR: Simplified with Context API & Custom Hooks!
// ZERO PROP DRILLING: QuoteCartContext manages all cart logic globally.
// =============================================================================

import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import ProductGrid from './components/ProductGrid.jsx';
import QuotationTable from './components/QuotationTable.jsx';
import QuotationForm from './components/QuotationForm.jsx';
import ConfirmationCard from './components/ConfirmationCard.jsx';
import { QuoteCartProvider } from './context/QuoteCartContext.jsx';
import { fetchProductsApi } from './services/apiService.js';

export default function App() {
  // 1. Catalogue Data & Network State
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilters, setStockFilters] = useState({
    inStock: true,
    procurement: true
  });

  // 3. Server Quotation Response State
  const [confirmation, setConfirmation] = useState(null);

  // ===========================================================================
  // LIFECYCLE: Fetch catalogue from API on initial mount
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
    } catch (err) {
      setError(err.message || "Failed to load products from API.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter Handlers
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setStockFilters({ inStock: true, procurement: true });
  };

  const handleStockFilterChange = (key, value) => {
    setStockFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ===========================================================================
  // DERIVED STATE: Filtered Products
  // ===========================================================================
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
    // REACT CONCEPT: Context Provider Wrapper
    // <QuoteCartProvider> wraps the tree, providing cart state to all children!
    <QuoteCartProvider>
      <div className="app-root">
        {/* 1. Header: Reads cart count directly from Context */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
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
                <h2 id="catalogue-heading" className="section-title">Commercial Product Catalogue</h2>
                <p className="section-description">
                  Select products to request bulk wholesale quotations with custom delivery schedules (Layer 5 Context).
                </p>
              </div>
            </div>

            {/* Product Grid: Zero cart props drilled! */}
            <ProductGrid
              products={filteredProducts}
              isLoading={isLoading}
              error={error}
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

            {/* Quotation Table: Connected directly to QuoteCartContext */}
            <QuotationTable />

            {/* Quotation Form: Connected directly to QuoteCartContext */}
            <QuotationForm onQuotationSuccess={(response) => setConfirmation(response)} />

            {/* Server Confirmation Card */}
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
            <p>&copy; 2026 ShopMart B2B Quotation Management System. Powered by React 18 Context API.</p>
            <p className="footer-links">
              <span>Layer 5: Global State & Custom Hooks</span> • 
              <span>Zero Prop Drilling Architecture</span>
            </p>
          </div>
        </footer>
      </div>
    </QuoteCartProvider>
  );
}
