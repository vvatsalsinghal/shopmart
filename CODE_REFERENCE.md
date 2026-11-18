# MERN Code & API Reference Dictionary

This reference catalogs every key function, hook, method, and library used throughout our project, explaining what it does and where it appears.

---

## Tooling & Package Reference

### npm Scripts
| Command / Script | Category | Purpose | Example / Where Used |
| :--- | :--- | :--- | :--- |
| `npm init -y` | CLI | Generates a default `package.json` manifest | Root, server, and client package setup |
| `npm install <pkg>` | CLI | Adds a production dependency | Installing `express`, `mongoose`, etc. |
| `npm install -D <pkg>` | CLI | Adds a development-only dependency | Installing `nodemon` |

### Git Commands
| Command | Category | Purpose |
| :--- | :--- | :--- |
| `git init` | Git Core | Initializes a new local Git repository |
| `git status` | Git Core | Checks modified, staged, and untracked files |
| `git add <file>` | Git Core | Stages files for the next snapshot/commit |
| `git commit -m "msg"` | Git Core | Saves a permanent snapshot of staged changes |

---

## HTML & CSS Layout Reference

### Semantic HTML5 Elements
| Tag | Semantic Meaning | Where Used in Project |
| :--- | :--- | :--- |
| `<header>` | Introductory header / navigation | Top navigation bar with logo and quotation counter |
| `<main>` | Primary body content of document | Wrapper containing sidebar and product catalogue |
| `<aside>` | Indirectly related sidebar content | Filter and category selection panel |
| `<section>` | Thematic grouping of content | Catalogue section, Quotation Enquiry panel |
| `<article>` | Independent self-contained card | Individual product card in catalogue |
| `<table>` | 2D tabular data | Itemized quotation table with quantities and specs |

### Modern CSS Patterns
| Technique / Property | Purpose | Example from Codebase |
| :--- | :--- | :--- |
| `repeat(auto-fill, minmax(280px, 1fr))` | Responsive grid without media queries | `.product-grid` |
| `display: flex; justify-content: space-between;` | 1D item distribution | `.app-header`, `.catalogue-toolbar` |
| `:root { --variable-name: value; }` | CSS Custom Properties (Design Tokens) | `--primary: #1e40af;` |
| `*, *::before, *::after { box-sizing: border-box; }` | Universal box model reset | Root stylesheet reset |
| `:focus-visible` | Keyboard accessible focus indicators | Focus ring for interactive buttons and inputs |

---

## JavaScript Core Methods & Operations

### Array Manipulation Methods
| Method | Type | Signature | Purpose & Project Usage |
| :--- | :--- | :--- | :--- |
| `Array.map()` | Pure Transformation | `arr.map(callback(item, index))` | Converts raw product objects into HTML strings in `renderProducts()` |
| `Array.filter()` | Pure Selection | `arr.filter(predicate(item))` | Filters products by search query, category, and stock status in `filterCatalogue()` |
| `Array.find()` | Search / Retrieval | `arr.find(predicate(item))` | Finds a product by its unique `id` when clicking "+ Add to Quote Request" |
| `Array.reduce()` | Aggregation | `arr.reduce((acc, curr) => acc + curr, initial)` | Calculates the total quantity of items in the quotation cart in `renderQuoteCart()` |
| `Array.join('')` | String Conversion | `arr.join(separator)` | Joins an array of HTML template strings into one continuous string for `.innerHTML` |

### Modern ES6+ Syntax
| Syntax Pattern | Name | Purpose & Project Usage |
| :--- | :--- | :--- |
| `const { id, title } = obj;` | Object Destructuring | Unpacks properties directly into variables in `renderProducts()` |
| `[...arr, newItem]` | Spread Operator | Immutably clones arrays and appends items in `addToQuote()` |
| `` `Hello ${name}` `` | Template Literals | Multi-line string interpolation for HTML generation |
| `export const / import { }` | ES Modules | Modularizes data models (`productsData.js`) and controllers (`app.js`) |

---

## Asynchronous JavaScript & Network API Operations

### Asynchronous Operations
| Pattern / Method | Mechanism | Purpose & Project Usage |
| :--- | :--- | :--- |
| `new Promise((resolve, reject) => ...)` | Asynchronous Primitive | Wraps deferred time-based network calls in `apiService.js` |
| `async function name() { ... }` | Async Declaration | Enables non-blocking `await` statements inside function body |
| `const result = await promise;` | Promise Resolution | Pauses async function until Promise settles without blocking thread |
| `try { ... } catch (err) { ... }` | Exception Handling | Catches network timeouts, 400/500 errors, and validation errors |
| `JSON.stringify(obj)` | Serialization | Converts in-memory JavaScript objects into wire-safe JSON strings |
| `JSON.parse(string)` | Deserialization | Converts incoming JSON HTTP response strings into native JS objects |
| `setTimeout(callback, ms)` | Timer / Web API | Simulates network round-trip latency in development |

---

## React Component & Hooks Reference

### React Hooks
| Hook | Signature | Purpose & Project Usage |
| :--- | :--- | :--- |
| `useState` | `const [state, setState] = useState(initial)` | Declares reactive state in `<App />` and `<QuotationForm />` |
| `useEffect` | `useEffect(callback, dependencies)` | Triggers asynchronous catalogue loading on component mount in `<App />` |

### Core React Architecture Patterns
| Pattern | How It Works | Where Used in Project |
| :--- | :--- | :--- |
| **Component Decomposition** | Splitting monolithic pages into small, focused files | `<Header>`, `<Sidebar>`, `<ProductGrid>`, `<ProductCard>`, `<QuotationTable>` |
| **Controlled Inputs** | React state drives the `<input value={...}>` and `onChange` | Search bar, category dropdown, customer details form |
| **Lifting State Up** | Common state stored in parent and shared via props | `quoteCart` state stored in `<App />` and passed to `<Header>` & `<QuotationTable>` |
| **List Rendering with Keys** | `array.map(item => <Component key={item.id} />)` | Rendering product cards in `<ProductGrid>` and line items in `<QuotationTable>` |
| **Conditional Rendering** | `isLoading ? <Spinner /> : <Grid />` | Switching between loading spinner, error banner, and catalogue |

---

*(As we build through each layer, we will continually expand this dictionary with JavaScript array methods, React hooks, Express router methods, and Mongoose database operations!)*
