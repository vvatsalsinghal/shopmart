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

*(As we build through each layer, we will continually expand this dictionary with JavaScript array methods, React hooks, Express router methods, and Mongoose database operations!)*
