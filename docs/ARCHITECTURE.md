# NodePad — Architecture

## High-Level Overview

```
┌──────────────────────────────────────────────────────────────┐
│                        BROWSER                               │
│                                                              │
│   React 18 + Vite                                            │
│   ┌────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│   │   Pages    │  │  Components  │  │  Context / State   │  │
│   │ Home       │  │ BlockEditor  │  │ AuthContext        │  │
│   │ NoteEditor │  │ Sidebar      │  │ ThemeContext       │  │
│   │ Trash      │  │ NoteCard     │  │                    │  │
│   │ Auth       │  │ VersionHist. │  │                    │  │
│   └─────┬──────┘  └──────────────┘  └────────────────────┘  │
│         │                                                    │
│   services/api.js (Axios + Firebase token interceptor)       │
└─────────┼────────────────────────────────────────────────────┘
          │ HTTP/HTTPS
          ▼
┌──────────────────────────────────────────────────────────────┐
│                   EXPRESS BACKEND :5000                      │
│                                                              │
│  Helmet → CORS → Rate Limit → Body Parser → Request Logger   │
│                      │                                       │
│              ┌───────┴────────┐                              │
│              │    Routes      │                              │
│              │ /api/notes     │                              │
│              │ /api/upload    │                              │
│              └───────┬────────┘                              │
│                      │                                       │
│         Auth MW → Validate → Sanitize → Controller           │
│                      │                                       │
│              ┌───────┴────────┐                              │
│              │  Controllers   │                              │
│              │ notes.ctrl     │                              │
│              └───────┬────────┘                              │
└──────────────────────┼───────────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
┌──────────────────┐     ┌──────────────────┐
│ Firebase         │     │ Cloudinary       │
│ Firestore        │     │ Image Storage    │
│ Auth (token ver) │     │ CDN              │
└──────────────────┘     └──────────────────┘
```

---

## Frontend Architecture

### Routing & Code Splitting

All page components are lazy-loaded via `React.lazy` + `Suspense`. Each page becomes its own JS chunk, reducing the initial bundle size.

```
App.jsx
├── /login          → lazy(Login)
├── /signup         → lazy(Signup)
├── /landing        → lazy(Landing)
└── / (ProtectedRoute → Layout)
    ├── /           → lazy(Home)
    ├── /note/:id   → lazy(NoteEditor)
    ├── /note/new   → lazy(NoteEditor)
    └── /trash      → lazy(Trash)
```

### Real-time Data Layer

`Layout.jsx` owns the Firestore `onSnapshot` listener. It subscribes to the user's notes collection on mount and pushes live updates to all child routes via `Outlet context`. This means any change — from another tab, device, or the server — appears instantly without polling.

```
Layout (onSnapshot listener)
  └── Outlet context: { notes, refreshNotes }
        ├── Home (reads notes from context for sidebar count)
        └── Sidebar (renders PageTree from live notes)
```

### State Architecture

| Scope | Mechanism | Used for |
|---|---|---|
| Global auth | `AuthContext` (Firebase `onAuthStateChanged`) | User object, login/logout |
| Global theme | `ThemeContext` (localStorage) | Dark/light toggle |
| Live notes list | Firestore `onSnapshot` in Layout | Sidebar + Home |
| Page-local | `useState` | Editor content, modals, loading |
| Offline drafts | `localStorage` via `draftCache.js` | Survive network failures |

### API Service Layer

`services/api.js` is the single point of contact with the backend:
- Axios instance with `baseURL` from `VITE_API_URL`
- Request interceptor: attaches Firebase ID token to every request
- Response interceptor: unwraps `res.data`, retries once on network errors / 5xx

---

## Backend Architecture

### Middleware Chain

Every request passes through this chain in order:

```
Request
  → Helmet          (security headers)
  → CORS            (origin check)
  → Rate Limiter    (100 req / 15 min per IP)
  → Body Parser     (JSON, 10MB limit)
  → Request Logger  (structured log)
  → Route Match
      → authenticate   (Firebase token → req.user)
      → noteValidation (express-validator)
      → validateRequest (check validation result)
      → sanitizeNote   (xss strip on title/content/tags/blocks)
      → Controller
  → errorHandler    (catch-all, structured log + JSON response)
```

### Controller Responsibilities

`notes.controller.js` handles all note operations:

| Function | Description |
|---|---|
| `getAllNotes` | Cursor-based pagination, filters deleted |
| `getNoteById` | Single doc fetch |
| `createNote` | Add with timestamps |
| `updateNote` | Partial update + version snapshot (fire-and-forget, capped at 20) |
| `deleteNote` | Soft delete (sets `deleted: true`) |
| `restoreNote` | Clears `deleted` flag |
| `permanentDelete` | Hard delete + Cloudinary image cleanup |
| `getTrash` | Deleted notes ordered by `deletedAt` |
| `duplicateNote` | Clone without image references |
| `searchNotes` | Title prefix range query + tag `array-contains` + content scan |
| `getVersions` | List version subcollection |
| `restoreVersion` | Overwrite note with version snapshot |

### Version History

On every `updateNote`, the previous state is snapshotted into a `versions` subcollection (fire-and-forget — doesn't block the response). A background prune keeps only the latest 20 versions per note.

```
notes/{id}/versions/{versionId}
  title, blocks, content, savedAt
```

### Cloudinary Cleanup

`permanentDelete` extracts all `publicId` values from the note's `images` array and block-level image fields, then calls `deleteImage()` for each before deleting the Firestore document. This prevents orphaned images accumulating in Cloudinary.

---

## Security Architecture

| Layer | Mechanism |
|---|---|
| Transport | HTTPS in production |
| Auth | Firebase ID token verified on every request |
| Input validation | `express-validator` — max lengths, type checks |
| XSS (server) | `xss` package strips all HTML from text fields |
| XSS (client) | `DOMPurify` sanitizes highlight.js output before `innerHTML` |
| Rate limiting | 100 req / 15 min per IP (configurable) |
| Security headers | Helmet (X-Frame-Options, CSP, etc.) |
| CORS | Configurable `CLIENT_URL` origin |
| File uploads | Multer: image types only, 5MB max |
| Upload auth | Auth middleware on `/api/upload` |
| Error messages | Stack traces hidden in production |

---

## Performance Architecture

| Concern | Solution |
|---|---|
| Initial bundle size | Lazy-loaded routes (code splitting) |
| Notes list scalability | Cursor-based pagination (50/page) |
| Search scalability | Firestore range query (not full scan) |
| Real-time updates | `onSnapshot` (no polling) |
| Image delivery | Cloudinary CDN + auto-optimization |
| Failed saves | Offline draft cache (localStorage) |
| API reliability | Retry once on network errors / 5xx |
| React crashes | Error boundary with recovery screen |

---

## Testing Architecture

```
client/src/test/
  exportNote.test.js    — 9 unit tests for Markdown export utility
  TableBlock.test.jsx   — 5 component tests (render, interactions)
  setup.js              — @testing-library/jest-dom setup

server/src/tests/
  sanitize.test.js      — 7 middleware unit tests
  errorHandler.test.js  — 4 middleware unit tests
  logger.test.js        — 3 utility unit tests
```

Run with:
```bash
cd client && npm test   # Vitest
cd server && npm test   # Jest
```
