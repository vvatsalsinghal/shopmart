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
