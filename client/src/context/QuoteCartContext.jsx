// =============================================================================
// FILE: client/src/context/QuoteCartContext.jsx
// PURPOSE: Global State Management for the Quotation Cart.
// REACT CONCEPT: React Context API & Custom Hook Pattern
// ELIMINATES: "Prop Drilling" (passing cart props down through 4 levels of components).
// =============================================================================

import React, { createContext, useContext, useState } from 'react';

// =============================================================================
// STEP 1: CREATE THE CONTEXT (The "Cloud")
// REACT CONCEPT: createContext()
// Creates a Context object. When React renders a component that subscribes to this
// Context, it will read the current value from the closest matching Provider above.
// =============================================================================
const QuoteCartContext = createContext(null);

// =============================================================================
// STEP 2: CREATE THE PROVIDER COMPONENT (The "Wi-Fi Router")
// REACT CONCEPT: Provider Pattern & { children } Prop
// Wraps the application tree and supplies the cart state + action functions
// to ANY child component that asks for it.
// =============================================================================
export function QuoteCartProvider({ children }) {
  // REACT CONCEPT: Encapsulated State
  // This state now lives in the Provider, completely freeing App.jsx from managing it!
  const [quoteCart, setQuoteCart] = useState([]);

  // ===========================================================================
  // CART ACTIONS (Clean, self-contained business logic)
  // ===========================================================================

  // ACTION 1: Add a product to the quote cart (or increment quantity)
  const addToQuote = (product) => {
    if (!product) return;

    setQuoteCart((prevCart) => {
      const existing = prevCart.find((item) => item.productId === product.id);

      if (existing) {
        // Increment quantity if already in cart
        return prevCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Append new item immutably using the Spread Operator (...)
        return [
          ...prevCart,
          {
            productId: product.id,
            product: product,
            quantity: 1,
            customerNote: ""
          }
        ];
      }
    });

    // Smooth scroll down to quotation drawer for visual feedback
    const quotePanel = document.getElementById("quotation-panel");
    if (quotePanel) {
      quotePanel.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ACTION 2: Update quantity of a specific item
  const updateQuantity = (productId, newQty) => {
    const qtyNumber = parseInt(newQty, 10);
    if (isNaN(qtyNumber) || qtyNumber <= 0) {
      removeFromQuote(productId);
      return;
    }

    setQuoteCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity: qtyNumber } : item
      )
    );
  };

  // ACTION 3: Update item-specific customer note (e.g. voltage, packaging)
  const updateNote = (productId, note) => {
    setQuoteCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, customerNote: note } : item
      )
    );
  };

  // ACTION 4: Remove a product from the quote cart
  const removeFromQuote = (productId) => {
    setQuoteCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
  };

  // ACTION 5: Clear the entire cart after successful submission
  const clearCart = () => {
    setQuoteCart([]);
  };

  // ===========================================================================
  // DERIVED STATE: Total item count across all quote line items
  // JAVASCRIPT CONCEPT: Array.reduce()
  // ===========================================================================
  const totalItemCount = quoteCart.reduce((total, item) => total + item.quantity, 0);

  // Bundle state and functions together into one shared "value" object
  const value = {
    quoteCart,
    totalItemCount,
    addToQuote,
    updateQuantity,
    updateNote,
    removeFromQuote,
    clearCart
  };

  return (
    <QuoteCartContext.Provider value={value}>
      {children}
    </QuoteCartContext.Provider>
  );
}

// =============================================================================
// STEP 3: CREATE THE CUSTOM HOOK (The "Antenna")
// REACT CONCEPT: Custom Hook Pattern
// Components can simply call "useQuoteCart()" instead of useContext(QuoteCartContext).
// Includes defensive error checking if a component calls it outside the Provider.
// =============================================================================
export function useQuoteCart() {
  const context = useContext(QuoteCartContext);

  if (!context) {
    throw new Error("useQuoteCart must be used within a <QuoteCartProvider>.");
  }

  return context;
}
