// =============================================================================
// FILE: server/src/controllers/quotationController.js
// PURPOSE: Business logic controller for B2B Quotation Management.
// MONGOOSE & BUSINESS LOGIC:
//   - Quotation.create(): Saves new quotation document to MongoDB Atlas.
//   - Quotation.find(): Queries all stored quotations with sorting.
//   - Quotation.findOneAndUpdate(): Updates quotation workflow status.
// =============================================================================

import Quotation from '../models/Quotation.js';
import Product from '../models/Product.js';

// =============================================================================
// CONTROLLER 1: createQuotation(req, res, next)
// ROUTE: POST /api/quotations
// ACCESS: Public (Customer)
// =============================================================================
export const createQuotation = async (req, res, next) => {
  try {
    const { customer, items, specialInstructions } = req.body;

    // SECURITY CONCEPT: Server-Side Input Validation
    if (!customer || !customer.companyName || !customer.email) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: Company name and email are strictly required."
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: At least one product is required for quotation enquiry."
      });
    }

    // BUSINESS RULE: Calculate Item-wise Prices and Distinct Delivery ETAs
    const now = new Date();
    const quotationId = "QUOTE-" + Math.floor(100000 + Math.random() * 900000);

    const processedItems = items.map((item) => {
      const isReadyInStock = item.inStock ?? true;
      const arrivalDate = new Date(now);

      // In-stock items arrive in 3 days; out-of-stock items require 18 days for factory procurement
      arrivalDate.setDate(now.getDate() + (isReadyInStock ? 3 : 18));

      const cataloguePrice = Number(item.cataloguePriceEstimate || item.price || 0);
      // Commercial discount: 5% off list price for quotation enquiries
      const quotedUnitPrice = Number((cataloguePrice * 0.95).toFixed(2));
      const lineItemTotal = Number((quotedUnitPrice * (item.quantity || 1)).toFixed(2));

      return {
        productId: item.productId || item.id,
        title: item.title,
        sku: item.sku,
        quantity: item.quantity || 1,
        customerNote: item.customerNote || "",
        quotedUnitPrice,
        lineItemTotal,
        estimatedArrivalDate: arrivalDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        }),
        procurementRoute: isReadyInStock
          ? "Warehouse Express Dispatch"
          : "Factory Direct Sourcing"
      };
    });

    // Calculate total quotation value using Array.reduce()
    const totalQuotationValue = Number(
      processedItems.reduce((sum, item) => sum + item.lineItemTotal, 0).toFixed(2)
    );

    // MONGOOSE CONCEPT: Quotation.create()
    // Permanently persists the quotation document into MongoDB Atlas!
    const newQuotation = await Quotation.create({
      quotationId,
      status: "PENDING_APPROVAL",
      customer: {
        companyName: customer.companyName,
        email: customer.email,
        phone: customer.phone || "Not provided",
        desiredDeliveryDate: customer.desiredDeliveryDate || "Flexible"
      },
      items: processedItems,
      totalQuotationValue,
      specialInstructions: specialInstructions || ""
    });

    console.log(`✅ [MongoDB Saved] Quotation ID: ${quotationId} for ${customer.companyName} ($${totalQuotationValue})`);

    // HTTP STATUS 201: Created
    res.status(201).json({
      success: true,
      message: `Quotation ${quotationId} registered and saved to MongoDB. Our commercial sales desk will confirm final freight terms.`,
      data: newQuotation
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// CONTROLLER 2: getAllQuotations(req, res, next)
// ROUTE: GET /api/quotations
// ACCESS: Admin
// =============================================================================
export const getAllQuotations = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status: status.toUpperCase() } : {};

    // MONGOOSE CONCEPT: .find().sort({ createdAt: -1 })
    // Returns newest quotations first!
    const quotations = await Quotation.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quotations.length,
      data: quotations
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// CONTROLLER 3: getQuotationById(req, res, next)
// ROUTE: GET /api/quotations/:id
// ACCESS: Public / Customer & Admin
// =============================================================================
export const getQuotationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // MONGOOSE CONCEPT: Quotation.findOne()
    const quotation = await Quotation.findOne({ quotationId: id });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: `Quotation with ID "${id}" was not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: quotation
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// CONTROLLER 4: updateQuotationStatus(req, res, next)
// ROUTE: PATCH /api/quotations/:id/status
// ACCESS: Admin
// =============================================================================
export const updateQuotationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING_APPROVAL', 'REVIEWED', 'APPROVED', 'REJECTED'];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status "${status}". Allowed values: ${validStatuses.join(', ')}`
      });
    }

    // MONGOOSE CONCEPT: Quotation.findOneAndUpdate()
    // { new: true } returns the updated document rather than the original
    const updatedQuotation = await Quotation.findOneAndUpdate(
      { quotationId: id },
      { status: status.toUpperCase() },
      { new: true, runValidators: true }
    );

    if (!updatedQuotation) {
      return res.status(404).json({
        success: false,
        message: `Quotation "${id}" was not found.`
      });
    }

    console.log(`🔄 [Quotation Status Updated] ${id} -> ${updatedQuotation.status}`);

    res.status(200).json({
      success: true,
      message: `Quotation status updated to ${updatedQuotation.status}`,
      data: updatedQuotation
    });
  } catch (error) {
    next(error);
  }
};
