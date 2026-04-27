# NodePad

A production-grade, Notion-style note-taking app built with React, Node.js, and Firebase.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, React Router 6 |
| Backend | Node.js + Express |
| Database | Firebase Firestore (real-time) |
| Auth | Firebase Authentication |
| Storage | Cloudinary |
| Testing | Vitest (client) · Jest (server) |

## Features

- Block-based editor — text, headings, lists, todos, code, tables, callouts, toggles, dividers
- Slash command menu (`/`) to insert any block
- `@mention` to link to another note inline
- Syntax highlighting in code blocks (12 languages)
- Drag-and-drop block reordering
- Inline text formatting toolbar
- Note templates (Meeting, To-Do, Journal, Project Plan, README, Blank)
- Emoji icon picker per note
- Cover image / gradient per note
- Auto-save with 1.5s debounce
- Offline draft cache — edits survive network failures
- Version history — restore any of the last 20 saves
- Real-time sync via Firestore `onSnapshot`
- Server-side search (title prefix + tag filter + content scan)
- Cursor-based pagination (50 notes per page)
- Nested pages with breadcrumb navigation
- Bulk select, delete, and restore
- Soft delete with 30-day trash retention
- Cloudinary image cleanup on permanent delete
- Dark / light theme
- Keyboard shortcuts (`⌘K` search, `⌘N` new, `⌘/` shortcuts)
- Firebase Auth — email/password + Google OAuth
- XSS sanitization on server and client
- Rate limiting, Helmet security headers, CORS
- Structured JSON logging (production-ready)
- Lazy-loaded routes (code splitting)
- Error boundary — crashes show a recovery screen

## Quick Start

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Configure environment (see docs/SETUP.md)
cp server/.env.example server/.env
cp client/.env.example client/.env
# Fill in Firebase + Cloudinary credentials

# 3. Run
cd server && npm run dev    # Terminal 1 → http://localhost:5000
cd client && npm run dev    # Terminal 2 → http://localhost:3000
```

## API Reference

```
GET    /api/notes                          List notes (paginated)
GET    /api/notes/:id                      Get note
POST   /api/notes                          Create note
PUT    /api/notes/:id                      Update note (saves version snapshot)
DELETE /api/notes/:id                      Soft delete (trash)
POST   /api/notes/:id/restore              Restore from trash
DELETE /api/notes/:id/permanent            Hard delete + Cloudinary cleanup
POST   /api/notes/:id/duplicate            Duplicate note
GET    /api/notes/trash                    List trash
GET    /api/notes/search?q=&tag=           Search notes
GET    /api/notes/:id/versions             List version history
POST   /api/notes/:id/versions/:vid/restore Restore a version
POST   /api/upload                         Upload image to Cloudinary
GET    /health                             Health check
```

## Running Tests

```bash
# Client (Vitest) — 14 tests
cd client && npm test

# Server (Jest) — 14 tests
cd server && npm test
```

## Documentation

| Doc | Description |
|---|---|
| [docs/SETUP.md](docs/SETUP.md) | Full environment setup |
| [docs/QUICKSTART.md](docs/QUICKSTART.md) | Running in 5 minutes |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Project structure & design decisions |
| [docs/DATA_FLOW.md](docs/DATA_FLOW.md) | How data moves through the system |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Dev workflow, code style, testing |
| [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Common issues & fixes |
| [docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md) | Production deployment guide |

## License

MIT
