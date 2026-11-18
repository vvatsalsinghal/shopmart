// =============================================================================
// FILE: client/js/apiService.js
// PURPOSE: Asynchronous API Service Layer (Network Client).
// DEMONSTRATES: Asynchronous JavaScript (Promises, async/await, setTimeout,
//               JSON serialization, Simulated HTTP Network Latency, Error Handling).
// In Layer 7 & 9, the dummy delays will be replaced by real "fetch('http://localhost:5000/api/...')".
// =============================================================================

// JAVASCRIPT CONCEPT: ES Module Import
import { initialProducts } from './productsData.js';

// =============================================================================
// HELPER FUNCTION: delay(ms)
// JAVASCRIPT CONCEPT: Promise
// A Promise represents an operation that hasn't completed yet, but will in the future.
// It has 3 states:
//   1. Pending: Still working (waiting for the timer / network).
//   2. Fulfilled (Resolved): Completed successfully.
//   3. Rejected: Failed with an error.
// =============================================================================
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// =============================================================================
// API 1: fetchProductsApi()
// API CONCEPT: HTTP GET Request Simulation
// PURPOSE: Retrieves the list of commercial products from the server.
// RETURNS: A Promise that resolves to an array of product objects after 600ms.
// =============================================================================
export async function fetchProductsApi() {
  console.log("📡 [API GET /api/products] Sending network request to server...");

  // JAVASCRIPT CONCEPT: async / await
  // "await" pauses execution of this async function until the Promise finishes.
  // CRITICAL: It DOES NOT freeze the browser tab! The user can still scroll and click.
  // We simulate a 600ms round-trip network trip across the internet.
  await delay(600);

  // PROGRAMMING CONCEPT: Defensive Programming & Error Simulation
  // In real life, servers can crash or Wi-Fi can drop. We simulate a 99% success rate.
  const isNetworkHealthy = true; // Set to false to test error handling!
  
  if (!isNetworkHealthy) {
    // JAVASCRIPT CONCEPT: Throwing Errors
    // If something went wrong on the server, we throw an Error object.
    throw new Error("HTTP 500: Server unavailable or database connection failed.");
  }

  console.log("✅ [API GET /api/products] Response received (200 OK): 6 products loaded.");
  
  // Return a fresh cloned copy of the products array (Immutability)
  return JSON.parse(JSON.stringify(initialProducts));
}

// =============================================================================
// API 2: submitQuotationApi(payload)
// API CONCEPT: HTTP POST Request Simulation
// PURPOSE: Submits a customer's quotation enquiry payload to the backend server.
// PARAMETERS: quotationPayload (Object with customer info and items array).
// RETURNS: A Promise that resolves to a server confirmation object after 800ms.
// =============================================================================
export async function submitQuotationApi(quotationPayload) {
  console.log("📡 [API POST /api/quotations] Submitting quotation enquiry payload...");
  
  // API CONCEPT: JSON (JavaScript Object Notation)
  // When data travels across the internet over HTTP, it cannot travel as a live JS object.
  // It must be converted into a string (serialized) using JSON.stringify().
  const jsonPayloadString = JSON.stringify(quotationPayload);
  console.log("📦 Transmitted Wire Bytes (JSON String):", jsonPayloadString);

  // Simulate 800ms server processing time (DB write, validation, email notification)
  await delay(800);

  // SECURITY CONCEPT: Server-side Validation Simulation
  // Even if frontend validates, the backend MUST validate again before writing to DB.
  if (!quotationPayload.items || quotationPayload.items.length === 0) {
    throw new Error("HTTP 400 Bad Request: Cannot create quotation with zero items.");
  }

  // PROGRAMMING CONCEPT: Unique Identifier Generation
  // Simulates a MongoDB ObjectId and human-readable Quotation Reference Code.
  const simulatedQuotationId = "QUOTE-" + Math.floor(100000 + Math.random() * 900000);
  const now = new Date();

  // BUSINESS LOGIC: Simulated Admin Quotation Response
  // Notice our core business rule:
  // Each product receives an item-specific price and an item-specific Estimated Arrival Date!
  const processedItems = quotationPayload.items.map((item) => {
    // In-stock items arrive within 3 days; procurement items take 14-21 days
    const isReadyInStock = item.inStock ?? true;
    const arrivalDate = new Date(now);
    arrivalDate.setDate(now.getDate() + (isReadyInStock ? 3 : 18));

    return {
      productId: item.productId,
      title: item.title,
      sku: item.sku,
      quantity: item.quantity,
      customerNote: item.customerNote,
      // Admin discounts catalogue estimate by 5% for bulk enquiries
      quotedUnitPrice: Number((item.cataloguePriceEstimate * 0.95).toFixed(2)),
      estimatedArrivalDate: arrivalDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      procurementRoute: isReadyInStock ? "Warehouse Express Dispatch" : "Factory Direct Sourcing"
    };
  });

  // Server response object
  const serverResponse = {
    success: true,
    statusCode: 201, // 201 = Created (Standard REST API status code)
    quotationId: simulatedQuotationId,
    status: "ENQUIRY_RECEIVED_PENDING_APPROVAL",
    submittedAt: now.toISOString(),
    customer: quotationPayload.customer,
    processedItems: processedItems,
    message: `Quotation ${simulatedQuotationId} registered successfully. Our commercial sales desk will confirm final freight terms.`
  };

  console.log("✅ [API POST /api/quotations] Response received (201 Created):", serverResponse);
  return serverResponse;
}
