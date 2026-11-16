// =============================================================================
// FILE: client/js/app.js
// PURPOSE: Primary Application Logic for ShopMart Catalogue & Quotation System.
// DEMONSTRATES: Core JavaScript (Arrays, Objects, Functions, Array Methods,
//               Destructuring, Spread/Rest, DOM Events, Immutability).
// =============================================================================

// JAVASCRIPT CONCEPT: ES Module Import
// In Layer 3, we import our Asynchronous Network Client instead of raw static data.
import { fetchProductsApi, submitQuotationApi } from './apiService.js';

// =============================================================================
// APPLICATION STATE (IN-MEMORY DATA STORE)
// PROGRAMMING CONCEPT: Asynchronous State Initialization
// Products start as an empty array []. They are populated ONLY AFTER the
// HTTP network request resolves. This teaches you how real-world React apps work!
// =============================================================================

let products = [];

// The customer's quotation enquiry cart (list of items requested for quote)
let quoteCart = [];

// Active filters state
let currentCategory = "all";
let currentSearch = "";
let allowedStockStatus = {
  inStock: true,
  procurement: true
};

// =============================================================================
// DOM ELEMENT REFERENCES
// JAVASCRIPT CONCEPT: DOM Querying
// "document.getElementById" and "document.querySelector" find elements in the HTML.
// Storing references in variables avoids querying the DOM repeatedly (performance).
// =============================================================================
const productGridEl = document.getElementById("product-grid");
const cartCounterEl = document.getElementById("cart-counter");
const quoteTableBodyEl = document.querySelector(".quote-table tbody");
const searchInputEl = document.getElementById("product-search");
const categorySelectEl = document.getElementById("category-select");
const resetFiltersBtnEl = document.getElementById("reset-filters");
const quoteFormEl = document.getElementById("quote-form");
const availabilityCheckboxes = document.querySelectorAll('input[name="availability"]');

// =============================================================================
// FUNCTION 1: renderProducts(itemsToDisplay)
// RESPONSIBILITY: Converts an array of product objects into HTML cards on screen.
// PARAMETERS: Array of product objects.
// RETURNS: void (updates the innerHTML of productGridEl directly).
// EXECUTES: On initial page load, and whenever the user filters or searches.
// =============================================================================
export function renderProducts(itemsToDisplay) {
  // Defensive check: If array is empty, show a user-friendly empty state
  if (!itemsToDisplay || itemsToDisplay.length === 0) {
    productGridEl.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #fff; border-radius: 8px;">
        <p style="font-size: 1.5rem; margin-bottom: 0.5rem;">🔍 No products match your filter criteria.</p>
        <p style="color: var(--text-muted); font-size: 0.875rem;">Try adjusting your search terms or clearing category filters.</p>
      </div>
    `;
    return;
  }

  // JAVASCRIPT CONCEPT: Array.map()
  // Array.map() takes every product in the array, runs a transformation function,
  // and returns a NEW array containing HTML strings.
  // In Layer 4 (React), this exact method is how components render lists of JSX!
  const productCardsHTML = itemsToDisplay.map((product) => {
    // JAVASCRIPT CONCEPT: Object Destructuring
    // Instead of writing product.id, product.title, product.price everywhere,
    // we extract properties directly into local variables in one clean line.
    const { id, title, sku, categoryLabel, description, price, unit, inStock, specs, icon } = product;

    // JAVASCRIPT CONCEPT: Ternary Operator (Condition ? ValueIfTrue : ValueIfFalse)
    // Used for conditional styling and labels based on inventory availability.
    const badgeClass = inStock ? "badge-success" : "badge-warning";
    const badgeText = inStock ? "In Stock" : "Procurement Required";
    const btnClass = inStock ? "btn-primary" : "btn-secondary";
    const btnText = inStock ? "+ Add to Quote Request" : "+ Request Custom Quote";

    // JAVASCRIPT CONCEPT: Template Literals (Backtick `` syntax with ${expression})
    // Allows multi-line HTML string interpolation with embedded JavaScript logic.
    return `
      <article class="product-card" data-category="${product.category}" data-product-id="${id}">
        <div class="product-card-badge-container">
          <span class="badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="product-image-placeholder" aria-hidden="true">
          ${icon} <span>${categoryLabel}</span>
        </div>
        <div class="product-card-body">
          <div class="product-category-tag">${categoryLabel}</div>
          <h3 class="product-title">${title}</h3>
          <p class="product-sku">SKU: ${sku}</p>
          <p class="product-description">${description}</p>
          <div class="product-specs">
            ${specs.map(spec => `<span class="spec-tag">${spec}</span>`).join("")}
          </div>
        </div>
        <div class="product-card-footer">
          <div class="price-estimate">
            <span class="price-label">Catalogue Estimate:</span>
            <span class="price-value">$${price.toFixed(2)} / ${unit}</span>
          </div>
          <!-- Action Button: Uses data-id attribute so event listener knows which item was clicked -->
          <button class="btn ${btnClass} btn-block add-to-quote-btn" data-id="${id}">
            ${btnText}
          </button>
        </div>
      </article>
    `;
  });

  // JAVASCRIPT CONCEPT: Array.join('')
  // productCardsHTML is an array of strings. .join('') glues them together
  // into one continuous HTML string ready for the DOM.
  productGridEl.innerHTML = productCardsHTML.join("");
}

// =============================================================================
// FUNCTION 2: filterCatalogue()
// RESPONSIBILITY: Evaluates all active filter criteria and updates product cards.
// USES: Array.filter() to narrow down the products array.
// EXECUTES: Whenever search input changes, category changes, or checkboxes toggle.
// =============================================================================
export function filterCatalogue() {
  // JAVASCRIPT CONCEPT: Array.filter()
  // Array.filter() returns a brand new array containing only elements that pass
  // the condition (where the callback returns true).
  const filtered = products.filter((product) => {
    // 1. Search Query Match (checks title, SKU, or description)
    const matchesSearch =
      currentSearch === "" ||
      product.title.toLowerCase().includes(currentSearch) ||
      product.sku.toLowerCase().includes(currentSearch) ||
      product.description.toLowerCase().includes(currentSearch);

    // 2. Category Match
    const matchesCategory =
      currentCategory === "all" || product.category === currentCategory;

    // 3. Stock Status Match
    // If product is inStock, check if allowedStockStatus.inStock is true
    // If product is NOT inStock (procurement), check allowedStockStatus.procurement
    const matchesStock =
      (product.inStock && allowedStockStatus.inStock) ||
      (!product.inStock && allowedStockStatus.procurement);

    // JAVASCRIPT CONCEPT: Logical AND (&&)
    // The product is kept only if ALL 3 criteria evaluate to true!
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Re-render the grid with the filtered subset
  renderProducts(filtered);
}

// =============================================================================
// FUNCTION 3: renderQuoteCart()
// RESPONSIBILITY: Re-renders the quotation table rows and updates the cart badge.
// DEMONSTRATES: Array.map(), Array.reduce(), Object Destructuring.
// EXECUTES: On page load, when items are added, removed, or quantities change.
// =============================================================================
export function renderQuoteCart() {
  // JAVASCRIPT CONCEPT: Array.reduce()
  // Aggregates an array into a single summary value.
  // Here: Calculates total number of items across all line items (summing quantities).
  const totalItemCount = quoteCart.reduce((total, item) => total + item.quantity, 0);

  // Update the cart counter badge in the header
  if (cartCounterEl) {
    cartCounterEl.textContent = totalItemCount;
  }

  // If cart is empty, show informative empty state in table
  if (quoteCart.length === 0) {
    quoteTableBodyEl.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
          Your quotation request is currently empty. Click "+ Add to Quote Request" on any product above.
        </td>
      </tr>
    `;
    return;
  }

  // Convert quotation line items into table rows
  const tableRowsHTML = quoteCart.map((cartItem) => {
    const { product, quantity, customerNote } = cartItem;
    const { id, title, sku, inStock } = product;

    const badgeClass = inStock ? "badge-success" : "badge-warning";
    const badgeText = inStock ? "In Stock (Warehouse A)" : "Procurement Required";

    return `
      <tr data-cart-item-id="${id}">
        <td>
          <div class="table-product-cell">
            <strong>${title}</strong>
            <span class="product-sku">SKU: ${sku}</span>
          </div>
        </td>
        <td>
          <span class="badge ${badgeClass}">${badgeText}</span>
        </td>
        <td class="text-center">
          <!-- Quantity Input: Fires updateQuantity on change -->
          <input 
            type="number" 
            class="qty-input" 
            data-id="${id}" 
            value="${quantity}" 
            min="1" 
            max="1000" 
            aria-label="Quantity for ${title}"
          >
        </td>
        <td>
          <!-- Note Input: Allows item-specific specifications -->
          <input 
            type="text" 
            class="form-input form-input-sm quote-item-note" 
            data-id="${id}" 
            placeholder="e.g., custom voltage, packaging specs" 
            value="${customerNote || ""}"
          >
        </td>
        <td class="text-right">
          <button 
            type="button" 
            class="btn-icon btn-danger remove-quote-item-btn" 
            data-id="${id}" 
            title="Remove ${title} from quote"
          >
            ✕
          </button>
        </td>
      </tr>
    `;
  });

  quoteTableBodyEl.innerHTML = tableRowsHTML.join("");
}

// =============================================================================
// FUNCTION 4: addToQuote(productId)
// RESPONSIBILITY: Adds a product to the quotation cart or increments its quantity.
// DEMONSTRATES: Array.find(), Immutability pattern, Spread operator (...).
// =============================================================================
export function addToQuote(productId) {
  // JAVASCRIPT CONCEPT: Array.find()
  // Returns the FIRST element in the array that matches the predicate function.
  // 1. Check if the product exists in the main catalogue
  const productToAdd = products.find(p => p.id === productId);
  if (!productToAdd) {
    console.error(`Product with ID "${productId}" not found.`);
    return;
  }

  // 2. Check if the product is ALREADY in the customer's quoteCart
  const existingCartItem = quoteCart.find(item => item.productId === productId);

  if (existingCartItem) {
    // If already in cart, increment quantity by 1
    existingCartItem.quantity += 1;
  } else {
    // JAVASCRIPT CONCEPT: Immutability & Spread Operator
    // Instead of quoteCart.push(), we create a new array with all existing items
    // plus the new item object. This is identical to how React state is updated!
    quoteCart = [
      ...quoteCart,
      {
        productId: productToAdd.id,
        product: productToAdd,
        quantity: 1,
        customerNote: ""
      }
    ];
  }

  // Refresh the quotation table and header badge
  renderQuoteCart();

  // Visual Feedback: Smoothly scroll down to the quotation panel
  const quotePanel = document.getElementById("quotation-panel");
  if (quotePanel) {
    quotePanel.scrollIntoView({ behavior: "smooth" });
  }
}

// =============================================================================
// FUNCTION 5: removeFromQuote(productId)
// RESPONSIBILITY: Removes a line item from the quotation cart.
// DEMONSTRATES: Array.filter() for deletion.
// =============================================================================
export function removeFromQuote(productId) {
  // JAVASCRIPT CONCEPT: Array.filter() for Deletion
  // Keep every item EXCEPT the one matching productId.
  quoteCart = quoteCart.filter(item => item.productId !== productId);
  renderQuoteCart();
}

// =============================================================================
// FUNCTION 6: updateItemQuantity(productId, newQty)
// RESPONSIBILITY: Updates quantity or removes if quantity becomes 0 or negative.
// =============================================================================
export function updateItemQuantity(productId, newQty) {
  const numericQty = parseInt(newQty, 10);
  
  // Defensive validation
  if (isNaN(numericQty) || numericQty <= 0) {
    removeFromQuote(productId);
    return;
  }

  const targetItem = quoteCart.find(item => item.productId === productId);
  if (targetItem) {
    targetItem.quantity = numericQty;
    // Update badge without re-rendering the whole table (preserves input focus)
    const totalCount = quoteCart.reduce((total, item) => total + item.quantity, 0);
    if (cartCounterEl) cartCounterEl.textContent = totalCount;
  }
}

// =============================================================================
// EVENT LISTENERS: CONNECTING USER ACTIONS TO JAVASCRIPT FUNCTIONS
// JAVASCRIPT CONCEPT: Event Delegation
// Instead of attaching 100 listeners to 100 buttons, we attach ONE listener to
// the parent container (#product-grid) and inspect event.target.
// =============================================================================

// 1. Delegated Click Listener on Product Grid for "Add to Quote" buttons
productGridEl.addEventListener("click", (event) => {
  const targetBtn = event.target.closest(".add-to-quote-btn");
  if (!targetBtn) return; // Click wasn't on our button

  const productId = targetBtn.dataset.id;
  if (productId) {
    addToQuote(productId);
  }
});

// 2. Delegated Click & Change Listeners on Quotation Table
quoteTableBodyEl.addEventListener("click", (event) => {
  const removeBtn = event.target.closest(".remove-quote-item-btn");
  if (removeBtn) {
    const productId = removeBtn.dataset.id;
    removeFromQuote(productId);
  }
});

quoteTableBodyEl.addEventListener("change", (event) => {
  // Quantity input change
  if (event.target.classList.contains("qty-input")) {
    const productId = event.target.dataset.id;
    updateItemQuantity(productId, event.target.value);
  }
  
  // Note input change
  if (event.target.classList.contains("quote-item-note")) {
    const productId = event.target.dataset.id;
    const item = quoteCart.find(i => i.productId === productId);
    if (item) {
      item.customerNote = event.target.value;
    }
  }
});

// 3. Search Filter: Listens to keystrokes on search input
searchInputEl.addEventListener("input", (event) => {
  // Trim and convert to lowercase for case-insensitive matching
  currentSearch = event.target.value.trim().toLowerCase();
  filterCatalogue();
});

// 4. Category Filter: Listens to dropdown selection
categorySelectEl.addEventListener("change", (event) => {
  currentCategory = event.target.value;
  filterCatalogue();
});

// 5. Stock Status Checkboxes: Listens to checkbox toggles
availabilityCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    // Update boolean state based on which checkbox is checked
    if (checkbox.value === "in-stock") {
      allowedStockStatus.inStock = checkbox.checked;
    } else if (checkbox.value === "procurement") {
      allowedStockStatus.procurement = checkbox.checked;
    }
    filterCatalogue();
  });
});

// 6. Reset Filters Button
resetFiltersBtnEl.addEventListener("click", () => {
  currentCategory = "all";
  currentSearch = "";
  allowedStockStatus = { inStock: true, procurement: true };

  // Reset HTML input values to match state
  categorySelectEl.value = "all";
  searchInputEl.value = "";
  availabilityCheckboxes.forEach(cb => { cb.checked = true; });

  filterCatalogue();
});

// 7. Quotation Cart Header Button (Smooth scroll down to form)
const quoteCartTrigger = document.getElementById("quote-cart-trigger");
if (quoteCartTrigger) {
  quoteCartTrigger.addEventListener("click", () => {
    const quotePanel = document.getElementById("quotation-panel");
    if (quotePanel) {
      quotePanel.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// 8. Quotation Form Submission Handler (ASYNCHRONOUS)
// JAVASCRIPT CONCEPT: async Event Listener Callback
// Marking the callback function with "async" allows us to use "await" inside it.
quoteFormEl.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevents default browser page reload

  // SECURITY CONCEPT: Client-side Form Validation
  if (quoteCart.length === 0) {
    alert("⚠️ Please add at least one product to your quotation request before submitting.");
    return;
  }

  const submitButton = quoteFormEl.querySelector("button[type='submit']");
  const originalButtonText = submitButton.innerHTML;

  // JAVASCRIPT CONCEPT: Collecting Form Values into an Object
  const quotationSubmission = {
    customer: {
      companyName: document.getElementById("company-name").value.trim(),
      email: document.getElementById("contact-email").value.trim(),
      phone: document.getElementById("contact-phone").value.trim(),
      desiredDeliveryDate: document.getElementById("target-delivery-date").value
    },
    items: quoteCart.map(item => ({
      productId: item.productId,
      title: item.product.title,
      sku: item.product.sku,
      quantity: item.quantity,
      customerNote: item.customerNote,
      inStock: item.product.inStock,
      cataloguePriceEstimate: item.product.price
    })),
    specialInstructions: document.getElementById("additional-notes").value.trim()
  };

  try {
    // UI FEEDBACK: Disable button & show loading state to prevent double submission
    submitButton.disabled = true;
    submitButton.innerHTML = "Submitting to Commercial Sales Desk... ⏳";

    // JAVASCRIPT CONCEPT: await Promise Resolution
    // Network call: Pauses execution here until server returns confirmation!
    const response = await submitQuotationApi(quotationSubmission);

    // Display Rich Confirmation Card on screen
    const quotePanel = document.getElementById("quotation-panel");
    const confirmationEl = document.createElement("div");
    confirmationEl.className = "quotation-confirmation-card";
    confirmationEl.innerHTML = `
      <div class="confirmation-header">
        <span style="font-size: 2rem;">🎉</span>
        <div>
          <h3>Quotation Registered Successfully!</h3>
          <p style="color: #94a3b8; font-size: 0.875rem;">Your enquiry has been received and custom ETAs calculated.</p>
        </div>
      </div>
      <div class="confirmation-details">
        <div class="confirmation-item">
          <span class="confirmation-label">Quotation ID</span>
          <span class="confirmation-value" style="color: #38bdf8;">${response.quotationId}</span>
        </div>
        <div class="confirmation-item">
          <span class="confirmation-label">Client</span>
          <span class="confirmation-value">${response.customer.companyName}</span>
        </div>
        <div class="confirmation-item">
          <span class="confirmation-label">Status</span>
          <span class="confirmation-value" style="color: #facc15;">Pending Sales Approval</span>
        </div>
      </div>
      <h4 style="font-size: 0.95rem; margin-top: 1rem; color: #cbd5e1;">Itemized Price & Delivery Schedule:</h4>
      <table class="confirmation-items-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Admin Unit Price</th>
            <th>Estimated Arrival Date (ETA)</th>
            <th>Logistics Route</th>
          </tr>
        </thead>
        <tbody>
          ${response.processedItems.map(item => `
            <tr>
              <td><strong>${item.title}</strong><br><span style="color: #94a3b8; font-size: 0.75rem;">${item.sku}</span></td>
              <td>${item.quantity}</td>
              <td style="color: #4ade80; font-weight: 600;">$${item.quotedUnitPrice}</td>
              <td><strong>${item.estimatedArrivalDate}</strong></td>
              <td><span class="badge ${item.procurementRoute.includes('Express') ? 'badge-success' : 'badge-warning'}">${item.procurementRoute}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    // Insert confirmation card right below the form
    quotePanel.appendChild(confirmationEl);
    confirmationEl.scrollIntoView({ behavior: "smooth" });

    // Clear form and cart after submission
    quoteCart = [];
    quoteFormEl.reset();
    renderQuoteCart();

  } catch (error) {
    // JAVASCRIPT CONCEPT: Asynchronous Error Handling
    alert(`❌ Submission Error: ${error.message}`);
    console.error("Quotation submission failed:", error);
  } finally {
    // JAVASCRIPT CONCEPT: try...catch...finally
    // "finally" executes regardless of whether the operation succeeded or failed.
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
});

// =============================================================================
// ASYNCHRONOUS INITIALIZATION (BOOTSTRAP)
// JAVASCRIPT CONCEPT: Async Function Execution on Page Load
// =============================================================================
async function loadCatalogue() {
  // 1. Show User-Friendly Loading Spinner
  productGridEl.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p class="loading-text">Connecting to ShopMart Commercial API...</p>
      <p class="loading-subtext">Fetching real-time wholesale pricing and warehouse inventory</p>
    </div>
  `;

  try {
    // 2. Fetch products asynchronously over our simulated network
    const data = await fetchProductsApi();
    products = data;

    // Seed 2 initial quote items from fetched data so the user sees sample data
    quoteCart = [
      {
        productId: products[0].id,
        product: products[0],
        quantity: 2,
        customerNote: "Need 240V plug configuration"
      },
      {
        productId: products[1].id,
        product: products[1],
        quantity: 10,
        customerNote: "5 Large, 5 X-Large packs"
      }
    ];

    // 3. Render products and cart once data lands safely
    renderProducts(products);
    renderQuoteCart();
    console.log("✅ [Layer 3] Asynchronous catalogue load complete.");

  } catch (error) {
    // 4. Handle Network Failures Gracefully
    productGridEl.innerHTML = `
      <div class="error-banner">
        <h4>⚠️ Network Connection Failed</h4>
        <p>${error.message}</p>
        <button class="btn btn-primary" onclick="window.location.reload()">Retry Connection</button>
      </div>
    `;
    console.error("Failed to load catalogue:", error);
  }
}

// Start the asynchronous loading sequence!
loadCatalogue();
