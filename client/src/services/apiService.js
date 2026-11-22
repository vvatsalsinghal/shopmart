// =============================================================================
// FILE: client/src/services/apiService.js
// PURPOSE: Full-Stack Client HTTP Service (Layer 9 Integration).
// ARCHITECTURAL CONCEPT: REST API Client
// Connects React on http://localhost:5173 to Express + MongoDB on http://localhost:5000!
// =============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * fetchProductsApi:
 * Makes a real HTTP GET request to our Express backend: /api/products
 * Queries live catalogue documents stored in MongoDB Atlas!
 *
 * @param {Object} filters - Optional { search, category, inStock }
 * @returns {Promise<Array>} Array of product documents
 */
export async function fetchProductsApi(filters = {}) {
  try {
    let url = `${API_BASE_URL}/api/products`;
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.inStock !== undefined && filters.inStock !== null) {
      params.append('inStock', String(filters.inStock));
    }

    if ([...params].length > 0) {
      url += `?${params.toString()}`;
    }

    console.log(`🌐 [Full-Stack Fetch] GET -> ${url}`);

    // HTTP CONCEPT: Native Browser fetch()
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}: Failed to load products.`);
    }

    console.log(`✅ [Full-Stack Success] Received ${result.count} products from MongoDB Atlas!`);
    return result.data;
  } catch (error) {
    console.error('❌ [API Service Error] fetchProductsApi failed:', error.message);
    throw error;
  }
}

/**
 * submitQuotationApi:
 * Makes a real HTTP POST request to our Express backend: /api/quotations
 * Permanently saves the quotation into MongoDB Atlas!
 *
 * @param {Object} quotationPayload - { customer, items, specialInstructions }
 * @returns {Promise<Object>} Processed quotation details including quote ID and ETAs
 */
export async function submitQuotationApi(quotationPayload) {
  try {
    const url = `${API_BASE_URL}/api/quotations`;
    console.log(`🌐 [Full-Stack Submit] POST -> ${url}`, quotationPayload);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(quotationPayload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}: Quotation submission failed.`);
    }

    const savedQuote = result.data;
    console.log(`🎉 [Quotation Persisted in Atlas] ID: ${savedQuote.quotationId}`);

    // Normalize response for frontend UI (<ConfirmationCard />)
    return {
      success: true,
      quotationId: savedQuote.quotationId,
      status: savedQuote.status,
      customer: savedQuote.customer,
      processedItems: savedQuote.items,
      totalQuotationValue: savedQuote.totalQuotationValue,
      specialInstructions: savedQuote.specialInstructions,
      message: result.message
    };
  } catch (error) {
    console.error('❌ [API Service Error] submitQuotationApi failed:', error.message);
    throw error;
  }
}
