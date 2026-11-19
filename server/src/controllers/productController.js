// =============================================================================
// FILE: server/src/controllers/productController.js
// PURPOSE: Business logic controller for Product Catalogue operations.
// EXPRESS CONCEPT: Controllers
// A controller function receives (req, res, next) and handles the actual business
// rules, queries data, and returns formatted JSON HTTP responses.
// =============================================================================

import { products } from '../data/products.js';

// =============================================================================
// CONTROLLER 1: getProducts(req, res, next)
// ROUTE: GET /api/products
// ACCESS: Public (Customers & Admins)
// EXPRESS CONCEPT: req.query (Query Strings)
// Reads optional filter parameters from the URL: /api/products?search=glove&category=safety
// =============================================================================
export const getProducts = (req, res, next) => {
  try {
    const { search, category, inStock } = req.query;

    let result = [...products];

    // 1. Search Query Filter (checks title, SKU, or description)
    if (search) {
      const cleanSearch = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(cleanSearch) ||
          p.sku.toLowerCase().includes(cleanSearch) ||
          p.description.toLowerCase().includes(cleanSearch)
      );
    }

    // 2. Category Filter
    if (category && category !== 'all') {
      result = result.filter((p) => p.category === category);
    }

    // 3. Stock Status Filter
    if (inStock !== undefined) {
      const stockBool = inStock === 'true';
      result = result.filter((p) => p.inStock === stockBool);
    }

    // HTTP STATUS 200: OK
    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    // EXPRESS CONCEPT: Error Forwarding with next(error)
    // Passes any unexpected exception down to our centralized error middleware!
    next(error);
  }
};

// =============================================================================
// CONTROLLER 2: getProductById(req, res, next)
// ROUTE: GET /api/products/:id
// ACCESS: Public
// EXPRESS CONCEPT: req.params (Route Parameters)
// Express extracts dynamic URL segments into req.params (e.g. :id -> req.params.id).
// =============================================================================
export const getProductById = (req, res, next) => {
  try {
    const { id } = req.params;
    const product = products.find((p) => p.id === id);

    if (!product) {
      // HTTP STATUS 404: Not Found
      return res.status(404).json({
        success: false,
        message: `Product with ID "${id}" was not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};
