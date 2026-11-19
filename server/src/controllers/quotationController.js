// =============================================================================
// FILE: server/src/controllers/quotationController.js
// PURPOSE: Business logic controller for B2B Quotation Management.
// CORE BUSINESS REQUIREMENT:
//   - Customers submit enquiries (even for out-of-stock items).
//   - Backend registers quotation, calculates product-wise prices & arrival ETAs.
//   - Admin can view all enquiries and update quotation statuses!
// =============================================================================

// IN-MEMORY QUOTATION DATABASE
// In Layer 8, this will become the Quotation Mongoose model in MongoDB!
let quotationsStore = [];

// =============================================================================
// CONTROLLER 1: createQuotation(req, res, next)
// ROUTE: POST /api/quotations
// ACCESS: Public (Customer)
// EXPRESS CONCEPT: req.body (Parsed JSON Payload)
// Express automatically parses the incoming JSON request into req.body!
// =============================================================================
export const createQuotation = (req, res, next) => {
  try {
    const { customer, items, specialInstructions } = req.body;

    // SECURITY CONCEPT: Server-Side Input Validation
    // Never trust client data! Validate structure before processing.
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

      // In-stock items arrive in 3 days; procurement items take 18 days
      arrivalDate.setDate(now.getDate() + (isReadyInStock ? 3 : 18));

      const cataloguePrice = Number(item.cataloguePriceEstimate || 0);
      // Backend automatically applies a 5% commercial bulk discount
      const quotedUnitPrice = Number((cataloguePrice * 0.95).toFixed(2));
      const lineItemTotal = Number((quotedUnitPrice * (item.quantity || 1)).toFixed(2));

      return {
        productId: item.productId,
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

    // Calculate total estimated quotation value using Array.reduce()
    const totalQuotationValue = processedItems.reduce(
      (sum, item) => sum + item.lineItemTotal,
      0
    );

    const newQuotation = {
      id: quotationId,
      quotationId: quotationId,
      status: "PENDING_APPROVAL", // Initial status
      customer: {
        companyName: customer.companyName,
        email: customer.email,
        phone: customer.phone || "Not provided",
        desiredDeliveryDate: customer.desiredDeliveryDate || "Flexible"
      },
      items: processedItems,
      totalQuotationValue: Number(totalQuotationValue.toFixed(2)),
      specialInstructions: specialInstructions || "",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    // Save to our in-memory store
    quotationsStore.unshift(newQuotation);

    console.log(`✅ [Quotation Created] ID: ${quotationId} for ${customer.companyName}`);

    // HTTP STATUS 201: Created
    res.status(201).json({
      success: true,
      message: `Quotation ${quotationId} registered successfully. Our commercial sales desk will confirm final freight terms.`,
      data: newQuotation
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// CONTROLLER 2: getAllQuotations(req, res, next)
// ROUTE: GET /api/quotations
// ACCESS: Admin Only (Management Dashboard)
// =============================================================================
export const getAllQuotations = (req, res, next) => {
  try {
    const { status } = req.query;

    let result = [...quotationsStore];

    if (status) {
      result = result.filter((q) => q.status === status.toUpperCase());
    }

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// CONTROLLER 3: getQuotationById(req, res, next)
// ROUTE: GET /api/quotations/:id
// =============================================================================
export const getQuotationById = (req, res, next) => {
  try {
    const { id } = req.params;
    const quotation = quotationsStore.find(
      (q) => q.quotationId === id || q.id === id
    );

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
// ACCESS: Admin Only
// PURPOSE: Admin updates quotation status (e.g. APPROVED, IN_PROCUREMENT, REJECTED)
// =============================================================================
export const updateQuotationStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = [
      "PENDING_APPROVAL",
      "APPROVED",
      "IN_PROCUREMENT",
      "DISPATCHED",
      "REJECTED"
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Validation Error: Status must be one of: ${validStatuses.join(", ")}`
      });
    }

    const quotation = quotationsStore.find(
      (q) => q.quotationId === id || q.id === id
    );

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: `Quotation with ID "${id}" was not found.`
      });
    }

    // Update status and timestamp
    quotation.status = status;
    quotation.adminNotes = adminNotes || quotation.adminNotes;
    quotation.updatedAt = new Date().toISOString();

    console.log(`🔄 [Quotation Status Updated] ${id} -> ${status}`);

    res.status(200).json({
      success: true,
      message: `Quotation status updated to ${status}.`,
      data: quotation
    });
  } catch (error) {
    next(error);
  }
};
