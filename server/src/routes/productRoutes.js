// =============================================================================
// FILE: server/src/routes/productRoutes.js
// PURPOSE: REST API Routes for Product Catalogue.
// EXPRESS CONCEPT: express.Router()
// Creates a modular, mountable route handler. Routes are isolated from server.js!
// =============================================================================

import express from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';

const router = express.Router();

// Maps HTTP GET /api/products -> getProducts controller
router.get('/', getProducts);

// Maps HTTP GET /api/products/:id -> getProductById controller
router.get('/:id', getProductById);

export default router;
