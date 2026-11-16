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

*(As we build through each layer, we will continually expand this dictionary with JavaScript array methods, React hooks, Express router methods, and Mongoose database operations!)*
