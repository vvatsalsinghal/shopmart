// =============================================================================
// FILE: server/src/routes/quotationRoutes.js
// PURPOSE: REST API Routes for Quotations Management.
// EXPRESS CONCEPT: RESTful API Conventions
//   POST   /api/quotations           -> Create a new quotation enquiry
//   GET    /api/quotations           -> List all quotations (Admin)
//   GET    /api/quotations/:id       -> Fetch specific quotation details
//   PATCH  /api/quotations/:id/status-> Update quotation status (Admin)
// =============================================================================

import express from 'express';
import {
  createQuotation,
  getAllQuotations,
  getQuotationById,
  updateQuotationStatus
} from '../controllers/quotationController.js';

const router = express.Router();

router.post('/', createQuotation);
router.get('/', getAllQuotations);
router.get('/:id', getQuotationById);
router.patch('/:id/status', updateQuotationStatus);

export default router;
