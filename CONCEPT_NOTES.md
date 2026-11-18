# MERN Stack Conceptual Notes & Interview Handbook

This living document contains detailed explanations, mental models, code snippets, common pitfalls, and interview questions accumulated across our project build.

---

## Layer 0: Development Environment & Core Tooling

### 1. What is Node.js?
- **Concept**: Node.js is an open-source, cross-platform JavaScript runtime environment built on Google Chrome's V8 JavaScript engine.
- **Mental Model**: Traditionally, JavaScript lived only inside web browsers (interacting with web pages). Node.js takes the V8 engine out of the browser and embeds it into a C++ program, allowing JavaScript to run directly on your operating system (accessing files, handling network requests, and querying databases).
- **Why we need it**: It enables us to build our backend server using JavaScript, creating a unified full-stack language ecosystem (MERN: MongoDB, Express, React, Node).

### 2. What is npm (Node Package Manager)?
- **Concept**: npm consists of two things:
  1. An online registry where developers share open-source JavaScript packages (libraries).
  2. A CLI (Command Line Interface) tool that installs, updates, and manages these libraries in your project.
- **Key Files**:
  - `package.json`: The manifest containing project metadata, configuration, scripts, and list of required dependencies with version ranges.
  - `package-lock.json`: An exact snapshot of the entire dependency tree (including nested sub-dependencies) ensuring identical installations across all machines.
  - `node_modules/`: The directory where the actual source code of installed dependencies is stored. **Never commit this to Git!**

### 3. What is Git & Why does `.gitignore` matter?
- **Concept**: Git is a distributed version control system that tracks changes to files over time.
- **Why `.gitignore` is crucial**:
  - `node_modules/` can contain tens of thousands of files and hundreds of megabytes. Committing them bloats repositories and causes severe synchronization issues.
  - `.env` files contain sensitive secrets (database passwords, JWT secret keys, API tokens). Committing secrets to GitHub is a major security vulnerability.

### 4. Common Developer Mistakes in Layer 0
- ❌ **Mistake**: Manually editing `package-lock.json`.  
  *Fix*: Always let `npm install` manage this file automatically.
- ❌ **Mistake**: Forgetting to add `.env` or `node_modules/` to `.gitignore` before making the initial Git commit.  
  *Fix*: Create and configure `.gitignore` as the very first file in the repository.
- ❌ **Mistake**: Confusing global npm packages (`npm install -g`) with local project dependencies (`npm install`).  
  *Fix*: Always install project libraries locally so the project is portable and self-contained.

### 5. Interview Questions: Layer 0
1. **Q: What is the difference between `dependencies` and `devDependencies` in `package.json`?**  
   *Answer*: `dependencies` are packages required for the application to run in production (e.g., `express`, `mongoose`, `react`). `devDependencies` are packages needed only during local development and testing (e.g., `nodemon`, `vite`, `eslint`). When deployed to production, `npm install --production` skips `devDependencies`, saving build time and disk space.
2. **Q: What is the purpose of `package-lock.json`? Why should you commit it to Git?**  
   *Answer*: In `package.json`, versions typically use caret (`^`) or tilde (`~`) prefixes, which allow automatic minor or patch updates. Without `package-lock.json`, two developers running `npm install` on different days might get slightly different dependency versions, leading to "works on my machine" bugs. `package-lock.json` pins exact versions and integrity hashes for absolute reproducibility.

---

## Layer 1: HTML5 Semantics, Modern CSS & Layout Systems

### 1. Semantic HTML5: Meaning Over Generic Containers
- **Concept**: Semantic tags convey structural meaning to browsers, screen readers (accessibility), and search engines (SEO), rather than generic `<div>` soup.
- **Key Elements**:
  - `<header>`: Introductory branding, search bar, and cart triggers.
  - `<main>`: The dominant, non-repeated content of the page.
  - `<section>`: Thematic grouping of content (e.g., Catalogue section, Quotation Form section).
  - `<article>`: Self-contained, independently distributable entity (e.g., a single Product Card).
  - `<aside>`: Complementary navigation or contextual sidebar (e.g., category filters).
  - `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`: Structured tabular data for quotation line items.

### 2. Modern Layouts: Flexbox vs CSS Grid
- **Flexbox (1-Dimensional)**:
  - Best for aligning items along a single axis (either row OR column).
  - Used in: Header (aligning logo, search, cart), Product Card footers (aligning price and button), and form button rows.
  - Key properties: `display: flex; justify-content: space-between; align-items: center; gap: 1rem;`.
- **CSS Grid (2-Dimensional)**:
  - Best for laying out items simultaneously across rows AND columns.
  - Used in: Product Grid.
  - The Golden Grid Pattern:
    ```css
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    ```
  - **Why this is revolutionary**: Without writing media queries for every screen size, the browser automatically computes how many 280px cards fit across the available width, wrapping and stretching (`1fr`) evenly.

### 3. The CSS Box Model & `box-sizing: border-box`
- By default, CSS uses `box-sizing: content-box`, where padding and borders are added *outside* the defined width/height (causing elements to exceed parent containers).
- With `*, *::before, *::after { box-sizing: border-box; }`, padding and borders are calculated *inside* the width, eliminating unexpected scrollbars and overflow.

### 4. CSS Custom Properties (Variables)
- Defined on `:root` to provide global scope.
- Example: `--primary: #1e40af; background-color: var(--primary);`.
- In enterprise applications, changing themes (e.g. Dark Mode) simply requires reassigning variables on a parent selector without touching individual components.

### 5. Interview Questions: Layer 1
1. **Q: When would you choose CSS Grid over Flexbox?**  
   *Answer*: Use Flexbox for 1-dimensional layouts where items need to align in a single direction (row or column) with content-driven sizing (e.g., navbars, button groups, badge lists). Use CSS Grid for 2-dimensional layouts where items must align across both rows and columns simultaneously, or for responsive repeating layouts like product catalogues (`grid-template-columns: repeat(auto-fill, minmax(...))`).
2. **Q: Why should you avoid using only `<div>` elements for building a user interface?**  
   *Answer*: Generic `<div>` tags provide no semantic meaning. Using semantic HTML5 elements (`<header>`, `<main>`, `<article>`, `<aside>`, `<nav>`) is critical for: (1) **Accessibility (a11y)**: screen readers can jump directly to landmark sections; (2) **SEO**: search engine web crawlers prioritize headers and articles; (3) **Maintainability**: other developers can immediately grasp component hierarchy.

---

## Layer 2: Core JavaScript Fundamentals & Data Modeling

### 1. In-Memory Data Modeling (Array of Objects)
- **Concept**: Data is represented as a collection of records. Each record is a JavaScript Object `{ key: value }`, and the collection is an Array `[ {...}, {...} ]`.
- **Why this connects to MERN**:
  - In MongoDB: This is a **Collection** of **Documents**.
  - In Express: This is the **JSON response** returned by an API route.
  - In React: This is the **state array** passed into components.

### 2. The Big 4 Array Methods (Must-Know for React & Placements)

| Method | What it Does | Does it Mutate Original? | What it Returns | Used in Project For |
| :--- | :--- | :--- | :--- | :--- |
| **`map()`** | Runs a function on every item | ❌ No | **New array** of same length with transformed values | Turning product data objects into HTML card markup |
| **`filter()`** | Evaluates a boolean condition on every item | ❌ No | **New array** containing only items that returned `true` | Search by keyword, filter by category & stock status |
| **`find()`** | Searches for the first matching item | ❌ No | The **single matching element**, or `undefined` | Finding product details when "+ Add to Quote" is clicked |
| **`reduce()`** | Accumulates all items into a single result | ❌ No | A **single accumulated value** (number, object, etc.) | Calculating total item count and quotation estimates |

### 3. Destructuring & The Spread Operator (`...`)
- **Object Destructuring**:
  ```javascript
  // Instead of: const title = product.title; const price = product.price;
  const { title, price, inStock } = product;
  ```
- **The Spread Operator (`...`) for Immutability**:
  ```javascript
  // Adding an item to an array WITHOUT mutating the original:
  const updatedCart = [...quoteCart, newItem];
  ```
  *Why immutability matters*: In React, state updates rely on reference equality checks. If you mutate an array using `.push()`, React might not detect the change and will fail to re-render the screen. The spread operator creates a new reference.

### 4. Event Delegation Pattern
- **Problem**: Attaching `addEventListener('click')` to every single button consumes memory and fails when new cards are added dynamically.
- **Solution**: Attach **one single event listener** to the parent container (`#product-grid`), and use `event.target.closest('.add-to-quote-btn')` to catch clicks as they bubble up the DOM.

### 5. Interview Questions: Layer 2
1. **Q: What is the difference between `map()` and `forEach()`?**  
   *Answer*: Both iterate over an array. However, `map()` transforms each element and returns a **brand new array**, leaving the original array untouched. `forEach()` simply executes a callback for side effects and returns `undefined`. In React, we use `map()` to render JSX lists because we need the returned array of elements.
2. **Q: Why should we prefer `const` and `let` over `var`?**  
   *Answer*: `var` is function-scoped and undergoes hoisting with initialization to `undefined`, frequently causing subtle scoping bugs. `const` and `let` are block-scoped (confined to `{ }`), do not attach to the global `window` object, and reside in a "Temporal Dead Zone" before declaration, preventing accidental use before initialization. `const` also guarantees reference reassignment safety.

---

## Layer 3: Advanced Asynchronous JavaScript & HTTP APIs

### 1. The Asynchronous Problem & The Single Thread
- **Concept**: JavaScript has a **single Call Stack**. It executes one operation at a time.
- **The Problem**: Network requests across the internet (e.g. querying products or saving quotations) take time (200ms - 2000ms). If JavaScript paused synchronously, the entire browser would freeze: animations stop, clicks don't register, and the page becomes unresponsive.
- **The Solution**: Asynchronous non-blocking architecture using **Web APIs**, **Promises**, and the **Event Loop**.

### 2. The JavaScript Event Loop Architecture
```
┌────────────────────────────────────────────────────────┐
│ 1. CALL STACK: Executes synchronous code line by line  │
└────────────────────────────────────────────────────────┘
                           │
       (Asynchronous task encountered, e.g. fetch/setTimeout)
                           ▼
┌────────────────────────────────────────────────────────┐
│ 2. WEB APIs: Browser background threads handle network │
└────────────────────────────────────────────────────────┘
                           │
                 (Task finishes / data arrives)
                           ▼
┌────────────────────────────────────────────────────────┐
│ 3. MICROTASK QUEUE: Holds resolved Promises (.then)    │
│    TASK QUEUE: Holds timer callbacks (setTimeout)      │
└────────────────────────────────────────────────────────┘
                           │
         (Call Stack becomes completely empty)
                           ▼
┌────────────────────────────────────────────────────────┐
│ 4. THE EVENT LOOP: Pushes queued callbacks onto Stack  │
└────────────────────────────────────────────────────────┘
```

### 3. Evolution of Async Code: Callbacks -> Promises -> async/await
- **Callbacks (Legacy)**: Passing functions as arguments (`getData(function(err, data) { ... })`). Led to nested "Callback Hell".
- **Promises (ES6)**: Objects representing future completion:
  ```javascript
  fetchProductsApi()
    .then(data => renderProducts(data))
    .catch(error => console.error(error));
  ```
- **`async` / `await` (ES8 / Modern Standard)**:
  Syntactic sugar over Promises that makes asynchronous code read like clean synchronous code:
  ```javascript
  try {
    const data = await fetchProductsApi();
    renderProducts(data);
  } catch (error) {
    console.error("Network failed:", error);
  }
  ```

### 4. HTTP Fundamentals & Status Codes
- **HTTP Methods**:
  - `GET`: Retrieve data without modifying server state (e.g., loading product catalogue).
  - `POST`: Submit new data to create a resource (e.g., submitting a quotation request).
  - `PUT` / `PATCH`: Update an existing resource (e.g., Admin assigning a price and arrival date).
  - `DELETE`: Remove a resource.
- **Standard HTTP Status Codes**:
  - `200 OK`: Successful retrieval.
  - `201 Created`: Resource successfully created (used on quotation submission).
  - `400 Bad Request`: Client validation error (e.g., missing email or empty items).
  - `404 Not Found`: Target resource does not exist.
  - `500 Internal Server Error`: Backend crash or database failure.

### 5. Interview Questions: Layer 3
1. **Q: What is the difference between the Microtask Queue and the Macrotask (Callback) Queue?**  
   *Answer*: Both queues hold asynchronous callbacks waiting to run on the Call Stack. However, the Event Loop gives **higher priority to the Microtask Queue** (which handles Promises, `queueMicrotask`, and MutationObserver). All microtasks must be completely cleared before the Event Loop executes even one single macrotask (such as `setTimeout` or `setInterval`).
2. **Q: Why does `await` not freeze the browser tab?**  
   *Answer*: `await` pauses the execution of only the *current `async` function*, temporarily yielding control back to the Event Loop. The JavaScript runtime continues processing other events, user scrolls, button clicks, and paint updates on the Call Stack. When the awaited Promise settles, the remainder of the async function is pushed to the Microtask Queue to resume execution seamlessly.

---

## Layer 4: React Fundamentals & Component Architecture

### 1. What is React & The Virtual DOM?
- **Concept**: React is a declarative, component-based library for building user interfaces.
- **The Problem with Vanilla JS DOM Manipulation**: Direct DOM manipulation (`innerHTML`, `appendChild`) is slow, expensive, and error-prone when managing complex state across dozens of elements.
- **How React Solves It (The Virtual DOM & Reconciliation)**:
  1. When state changes, React creates a lightweight virtual JavaScript representation of the new UI tree.
  2. React runs a **"Diffing Algorithm"** comparing the previous Virtual DOM snapshot with the new one.
  3. React computes the minimal set of real DOM mutations needed and updates the browser DOM in a single batched operation.

### 2. JSX (JavaScript XML) Rules
- JSX is an extension that allows writing HTML-like markup inside JavaScript files.
- **3 Fundamental Rules**:
  1. Must return a **single root element** (or a Fragment `<> ... </>`).
  2. Tags must be **explicitly closed** (e.g., `<input />`, `<br />`).
  3. Attributes use **camelCase** (e.g., `className` instead of `class`, `htmlFor` instead of `for`, `onClick` instead of `onclick`).

### 3. Props vs State (The Golden Distinction)

| Concept | What It Is | Can It Be Mutated? | Ownership |
| :--- | :--- | :--- | :--- |
| **Props** | Inputs passed down from parent to child | ❌ Read-Only (Immutable) | Owned by the parent component |
| **State** | Internal data that changes over time | ❌ Mutated directly; ✅ Updated via setter function | Owned and managed inside the component |

### 4. The Core React Hooks

#### `useState`
```javascript
const [quoteCart, setQuoteCart] = useState([]);
```
- Returns a 2-element array: `[currentValue, updaterFunction]`.
- **Always update state immutably**:
  ```javascript
  // ❌ WRONG (Direct mutation):
  quoteCart.push(newItem); setQuoteCart(quoteCart);
  
  // ✅ RIGHT (New array reference):
  setQuoteCart(prev => [...prev, newItem]);
  ```

#### `useEffect`
```javascript
useEffect(() => {
  // Side effect: runs after component paints on screen
  loadProducts();
}, []); // Empty dependency array: runs ONCE on mount
```
- Handles HTTP requests, event subscriptions, or timers.
- The **Dependency Array**:
  - `[]`: Runs once when component mounts.
  - `[category]`: Runs when component mounts AND whenever `category` changes.
  - Omitted: Runs after *every single render* (danger: infinite loops!).

### 5. Interview Questions: Layer 4
1. **Q: Why does React require a unique `key` prop when rendering lists with `.map()`?**  
   *Answer*: During reconciliation, React's diffing algorithm uses the `key` to identify which items have changed, been added, or been removed. Without stable unique keys (or when using array indices on dynamic lists), React may re-render or incorrectly reuse DOM nodes and form inputs, causing UI glitches and severe performance degradation.
2. **Q: What is "Lifting State Up" in React?**  
   *Answer*: When two or more sibling components need access to the same data (e.g., `<Header>` needing the cart count and `<QuotationTable>` needing the cart items), we "lift" the shared state up to their closest common ancestor (`<App />`). The ancestor manages the state and passes it down via props, along with callback functions to update it.
