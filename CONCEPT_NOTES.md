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
