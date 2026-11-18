// =============================================================================
// FILE: client/src/services/apiService.js
// PURPOSE: Asynchronous API Service for React Components.
// DEMONSTRATES: Promises, async/await, REST payload simulation.
// =============================================================================

import { initialProducts } from '../data/productsData.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchProductsApi() {
  console.log("📡 [React API Service: GET /api/products] Requesting catalogue...");
  await delay(500); // 500ms network round-trip simulation
  return JSON.parse(JSON.stringify(initialProducts));
}

export async function submitQuotationApi(quotationPayload) {
  console.log("📡 [React API Service: POST /api/quotations] Submitting enquiry...");
  await delay(800);

  if (!quotationPayload.items || quotationPayload.items.length === 0) {
    throw new Error("HTTP 400: At least one product is required for quotation.");
  }

  const quotationId = "QUOTE-" + Math.floor(100000 + Math.random() * 900000);
  const now = new Date();

  const processedItems = quotationPayload.items.map((item) => {
    const isReadyInStock = item.inStock ?? true;
    const arrivalDate = new Date(now);
    arrivalDate.setDate(now.getDate() + (isReadyInStock ? 3 : 18));

    return {
      productId: item.productId,
      title: item.title,
      sku: item.sku,
      quantity: item.quantity,
      customerNote: item.customerNote,
      quotedUnitPrice: Number((item.cataloguePriceEstimate * 0.95).toFixed(2)),
      estimatedArrivalDate: arrivalDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      procurementRoute: isReadyInStock ? "Warehouse Express Dispatch" : "Factory Direct Sourcing"
    };
  });

  return {
    success: true,
    statusCode: 201,
    quotationId,
    status: "ENQUIRY_RECEIVED_PENDING_APPROVAL",
    submittedAt: now.toISOString(),
    customer: quotationPayload.customer,
    processedItems,
    message: `Quotation ${quotationId} registered successfully.`
  };
}
