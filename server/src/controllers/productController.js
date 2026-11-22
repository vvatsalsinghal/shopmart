// =============================================================================
// FILE: server/src/controllers/productController.js
// PURPOSE: Business logic controller for Product Catalogue operations.
// MONGOOSE & EXPRESS CONCEPTS:
//   - Product.find(): Queries MongoDB documents matching criteria.
//   - Product.findOne(): Retrieves a single document by custom ID or query.
//   - req.query: Parses URL parameters (?search=...&category=...).
//   - req.params: Parses route parameters (/:id).
// =============================================================================

import Product from '../models/Product.js';

// =============================================================================
// CONTROLLER 1: getProducts(req, res, next)
// ROUTE: GET /api/products
// ACCESS: Public (Customers & Admins)
// =============================================================================
export const getProducts = async (req, res, next) => {
  try {
    const { search, category, inStock } = req.query;
    const query = {};

    // 1. Search Filter: Case-insensitive regex across title, SKU, or description
    if (search) {
      const cleanSearch = search.trim();
      query.$or = [
        { title: { $regex: cleanSearch, $options: 'i' } },
        { sku: { $regex: cleanSearch, $options: 'i' } },
        { description: { $regex: cleanSearch, $options: 'i' } }
      ];
    }

    // 2. Category Filter
    if (category && category !== 'all') {
      query.category = category.toLowerCase();
    }

    // 3. Stock Status Filter
    if (inStock !== undefined) {
      query.inStock = inStock === 'true';
    }

    // MONGOOSE CONCEPT: Product.find(query)
    // Executes query against MongoDB Atlas collection 'products'
    const products = await Product.find(query).sort({ title: 1 });

    // HTTP STATUS 200: OK
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// CONTROLLER 2: getProductById(req, res, next)
// ROUTE: GET /api/products/:id
// ACCESS: Public
// =============================================================================
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // MONGOOSE CONCEPT: Product.findOne()
    // Searches by custom business ID (e.g. 'prod-001')
    const product = await Product.findOne({ id });

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
