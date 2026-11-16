# MERN Stack Master Learning Roadmap

**Project**: Business Product Catalogue & Quotation Management System (`ShopMart Quotations`)  
**Target Goal**: Software Engineering Internships (Jan 2027) & Full-Time Placements (June 2027)  
**Methodology**: Code-First Learning, Progressive Layer-by-Layer Architecture, Deep Conceptual Explanations

---

## Roadmap Layers Overview

```
[Layer 0: Dev Environment, Git, Node.js & npm]
                      │
                      ▼
[Layer 1: HTML, CSS & Responsive Frontend Foundations]
                      │
                      ▼
[Layer 2: Core JavaScript Fundamentals & Data Modeling]
                      │
                      ▼
[Layer 3: Advanced Asynchronous JavaScript & HTTP / APIs]
                      │
                      ▼
[Layer 4: React.js Fundamentals (Components, Props, State, Forms)]
                      │
                      ▼
[Layer 5: Advanced React (Context API, Custom Hooks, Routing)]
                      │
                      ▼
[Layer 6: Node.js Runtime Fundamentals & File System]
                      │
                      ▼
[Layer 7: Express.js REST API Server Architecture]
                      │
                      ▼
[Layer 8: MongoDB & Mongoose Database Modeling]
                      │
                      ▼
[Layer 9: Full-Stack Integration (Client <-> Server Flow)]
                      │
                      ▼
[Layer 10: Authentication, Authorization & Security (JWT, bcrypt)]
                      │
                      ▼
[Layer 11: Production Readiness, Optimization & Interview Mastery]
```

---

## Detailed Layer Syllabus

### Layer 0: Development Environment & Tooling
- Directory architecture for full-stack monorepos (`client/` + `server/`).
- Version control with Git: initialization, commits, status, branch basics, `.gitignore` mechanics.
- Node.js runtime verification and `npm` package ecosystem fundamentals.

### Layer 1: HTML, CSS & Layout Foundations
- Semantic HTML5 structure (catalogues, quote inquiry forms, status badges).
- Modern CSS layout engines: Flexbox (navbars, item cards, toolbars) and CSS Grid (responsive catalogue layouts).
- Mobile-first responsive design, CSS variables, utility vs custom styling.

### Layer 2: JavaScript Fundamentals & In-Memory Data Modeling
- Variables and types: `let`, `const`, primitives vs reference types (objects & arrays).
- Pure functions and arrow functions: parameter passing, explicit vs implicit return.
- Array operations: `map()` (transforming items), `filter()` (search & category filtering), `find()` (item selection), `reduce()` (quotation total calculations).
- Object destructuring, spread (`...`) and rest syntax.
- ES Modules: `import` / `export` syntax and encapsulation.
- Robust error handling: `try...catch` and defensive checks.

### Layer 3: Advanced Asynchronous JavaScript & Web APIs
- Execution context, Scope chains, and Closures.
- The JavaScript Event Loop, Call Stack, Microtask queue (Promises), and Macrotask queue.
- Asynchronous programming: Callbacks vs Promises vs `async/await`.
- The Fetch API: HTTP methods (`GET`, `POST`, `PUT`, `DELETE`), headers, and JSON serialization.

### Layer 4: React Fundamentals
- JSX syntax rules and the Virtual DOM.
- Component-driven architecture: Smart/Container vs Presentational/Dumb components.
- Props: unidirectional data flow, immutability, prop types.
- State: `useState` hook, state batching, pure updates.
- Controlled forms: input bindings, event handlers (`onChange`, `onSubmit`).
- Conditional rendering: ternary operators, short-circuit evaluation (`&&`).
- Lists & Keys: why unique keys matter in React reconciliation.
- Multi-page navigation with React Router (`<Routes>`, `<Route>`, `<Link>`, `useNavigate`, `useParams`).

### Layer 5: Advanced React Architecture
- Global state management without external bloat: React Context API (`createContext`, `useContext`, Provider pattern).
- Custom Hooks: extracting reusable logic (`useFetch`, `useQuoteCart`, `useDebounce`).
- Component composition & design systems: Reusable UI cards, tables, status pills, and modals.
- Handling asynchronous UI states: loading skeletons, empty states, error boundaries.

### Layer 6: Node.js Runtime & Server Fundamentals
- The V8 engine and libuv (event-driven, non-blocking I/O).
- Node.js module systems: ES Modules (`import/export`) in modern Node.
- The `process` object and environment variables (`dotenv`).
- NPM script automation and project manifests (`package.json`, `package-lock.json`).

### Layer 7: Express.js Backend Architecture
- The HTTP request-response cycle.
- Express application instance, routing patterns, and RESTful resource conventions.
- Middleware architecture: `express.json()`, custom logging middleware, auth guards, 404 handlers, and centralized error middleware.
- Request parsing: Route parameters (`req.params`), Query strings (`req.query`), and JSON bodies (`req.body`).
- HTTP Status codes: `200`, `201`, `400`, `401`, `403`, `404`, `500`.

### Layer 8: MongoDB & Mongoose Database Modeling
- NoSQL document database concepts vs Relational (SQL) databases.
- Mongoose schemas, types, validations, defaults, and timestamps.
- Data relationships in MongoDB: Embedding vs Referencing (`ObjectId` + `ref`).
- Population (`.populate()`): linking products inside quotation items.
- CRUD operations: `create()`, `find()`, `findById()`, `findByIdAndUpdate()`, `deleteOne()`.

### Layer 9: Full-Stack Integration
- Cross-Origin Resource Sharing (CORS): why browsers block it and how backend enables it.
- Client-side API service layer: creating structured API client utilities.
- Synchronizing UI state with server data.
- Handling network latency, optimistic updates, and graceful error alerts.

### Layer 10: Authentication, Authorization & Security
- User identity: Registration, validation, and storage.
- Password hashing with `bcrypt` (salting rounds, timing attack resistance).
- Stateless authentication with JSON Web Tokens (JWT): signing, payload, verification, and expiry.
- Role-Based Access Control (RBAC): protecting Admin routes from standard Customers.
- Security best practices: environment secrets, CORS whitelisting, HTTP header safety.

### Layer 11: Production, Deployment & Interview Mastery
- Structuring environment configs for development vs production.
- Building frontend bundles (`vite build`) and serving static assets.
- Deployment architectures (e.g., Render, Vercel, Railway, Atlas).
- Interview drill: Explaining architectural trade-offs, debugging complex scenarios, and live coding.
