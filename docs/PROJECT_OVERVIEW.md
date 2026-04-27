# NodePad — Project Overview

## What is NodePad?

NodePad is a full-stack, production-grade note-taking application inspired by Notion. It features a block-based editor, real-time sync, Firebase authentication, version history, offline draft caching, and a clean dark/light UI.

It is built to demonstrate real-world full-stack development practices — clean architecture, security, performance, testing, and scalability.

---

## Tech Stack

### Frontend — React 18 + Vite

| Package | Purpose |
|---|---|
| React 18 | UI framework |
| React Router 6 | Client-side routing |
| Axios | HTTP client with interceptors |
| Firebase JS SDK | Auth + Firestore real-time listener |
| highlight.js | Code block syntax highlighting |
| DOMPurify | Client-side XSS sanitization |
| Lucide React | Icon library |
| React Hot Toast | Toast notifications |
| Vitest + RTL | Unit & component testing |

### Backend — Node.js + Express

| Package | Purpose |
|---|---|
| Express | Web framework |
| Firebase Admin SDK | Firestore + Auth token verification |
| Cloudinary | Image upload, optimization, CDN |
| Multer | Multipart file handling |
| express-validator | Input validation |
| xss | Server-side HTML sanitization |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |
| Jest + Supertest | Server-side testing |

### Infrastructure

| Service | Purpose |
|---|---|
| Firebase Firestore | NoSQL database, real-time listeners |
| Firebase Auth | Email/password + Google OAuth |
| Cloudinary | Image storage + CDN |

---

## Application Features

### Editor
- **Block-based** — 12+ block types: text, H1/H2/H3, bullet list, numbered list, todo, quote, callout, toggle, code, table, divider, sub-page
- **Slash commands** — type `/` to insert any block
- **@mention** — type `@` to link to another note inline
- **Drag & drop** — reorder blocks by dragging the grip handle
- **Inline formatting** — select text to bold, italic, underline, code, or link
- **Code blocks** — language selector (12 languages) + syntax highlighting + copy button + Tab indentation
- **Table blocks** — add/remove rows and columns inline

### Notes
- **Auto-save** — 1.5s debounce, saves on every change
- **Offline drafts** — every keystroke saved to localStorage; restored automatically if API is unreachable
- **Version history** — every save snapshots the previous state; restore any of the last 20 versions
- **Templates** — 6 built-in templates: Meeting Notes, To-Do List, Daily Journal, Project Plan, README/Docs, Blank
- **Emoji icon** — per-note emoji picker
- **Cover image** — gradient or uploaded image cover
- **Tags** — add/remove inline tags, filterable
- **Nested pages** — `parentId` hierarchy with breadcrumb navigation
- **Duplicate** — clone any note

### Home & Navigation
- **Real-time sync** — Firestore `onSnapshot` listener; changes appear instantly across tabs/devices
- **Pagination** — cursor-based, 50 notes per page with "Load more"
- **Bulk operations** — checkbox select, batch delete
- **Search** — server-side: title prefix query + tag `array-contains` + content scan (capped at 200 docs)
- **Tag filter** — `?tag=` URL param filters by exact tag
- **Sidebar page tree** — nested pages with expand/collapse, add sub-page, delete

### Trash
- **Soft delete** — notes go to trash, not immediately deleted
- **30-day retention** — days-remaining badge, urgent warning at ≤3 days
- **Bulk restore / bulk delete** — checkbox select in trash
- **Permanent delete** — hard deletes Firestore doc + cleans up Cloudinary images

### Auth
- Email/password signup and login
- Google OAuth
- Firebase ID token verified on every API request
- Protected routes — unauthenticated users see the landing page

### Security & Quality
- XSS sanitization on server (`xss` package) and client (`DOMPurify`)
- Helmet security headers
- CORS with configurable origin
- Rate limiting (100 req / 15 min, configurable)
- Input validation via `express-validator`
- Auth middleware on all API routes including upload
- Structured JSON logging (dev: colored, prod: JSON lines)
- Error boundary — React crashes show a recovery screen instead of blank page
- Retry logic — API calls retry once on network errors / 5xx with 800ms back-off
- Lazy-loaded routes — each page is a separate JS chunk

### Testing
- **Client** — 14 tests (Vitest + React Testing Library)
  - `exportNote` utility: 9 unit tests
  - `TableBlock` component: 5 tests
- **Server** — 14 tests (Jest)
  - `sanitize` middleware: 7 tests
  - `errorHandler` middleware: 4 tests
  - `logger` utility: 3 tests

---

## Project Structure

```
nodepad/
├── client/                        # React frontend
│   └── src/
│       ├── components/
│       │   ├── Editor/            # BlockEditor, CodeBlock, TableBlock,
│       │   │                      #   SlashMenu, FormatToolbar, MentionMenu
│       │   ├── Layout/            # Layout wrapper with real-time listener
│       │   ├── Sidebar/           # Sidebar + PageTree
│       │   ├── NoteCard/          # Grid card with bulk selection
│       │   ├── NoteActions/       # Dropdown: duplicate, history, export, delete
│       │   ├── VersionHistory/    # Slide-in version history panel
│       │   ├── Templates/         # Template picker modal
│       │   ├── EmojiPicker/       # Emoji icon picker
│       │   ├── CoverImage/        # Cover gradient/image selector
│       │   ├── Search/            # Search modal with recent + results
│       │   ├── Shortcuts/         # Keyboard shortcuts reference
│       │   └── ErrorBoundary.jsx  # App-level error boundary
│       ├── pages/
│       │   ├── Landing.jsx        # Marketing landing page
│       │   ├── Login.jsx          # Email + Google auth
│       │   ├── Signup.jsx
│       │   ├── Home.jsx           # Notes grid with pagination + bulk ops
│       │   ├── NoteEditor.jsx     # Full editor page
│       │   ├── Trash.jsx          # Trash with bulk restore/delete
│       │   └── NotFound.jsx
│       ├── context/
│       │   ├── AuthContext.jsx    # Firebase Auth state
│       │   └── ThemeContext.jsx   # Dark/light theme
│       ├── services/
│       │   └── api.js             # Axios instance + all API methods
│       ├── utils/
│       │   ├── exportNote.js      # Markdown + text export
│       │   └── draftCache.js      # localStorage offline draft cache
│       ├── config/
│       │   └── firebase.js        # Firebase app + Auth + Firestore
│       └── test/                  # Vitest test files
│
└── server/                        # Express backend
    └── src/
        ├── config/
        │   ├── firebase.js        # Admin SDK init
        │   └── cloudinary.js      # Upload + delete helpers
        ├── controllers/
        │   └── notes.controller.js # All note operations + version history
        ├── middleware/
        │   ├── auth.middleware.js  # Firebase token verification
        │   ├── sanitize.js         # XSS sanitization
        │   ├── validateRequest.js  # express-validator result check
        │   ├── upload.js           # Multer config
        │   └── errorHandler.js     # Centralized error handler
        ├── routes/
        │   ├── notes.routes.js     # All note + version endpoints
        │   └── upload.routes.js    # Image upload (auth-protected)
        ├── utils/
        │   └── logger.js           # Structured logger
        ├── tests/                  # Jest test files
        └── app.js                  # Express app + server start
```

---

## Firestore Data Model

```
users/
  {uid}/
    notes/
      {noteId}/
        title:      string
        content:    string          # plain text join of blocks
        blocks:     Block[]         # block-based content
        tags:       string[]
        images:     { url, publicId }[]
        icon:       string          # emoji
        cover:      string          # gradient or URL
        parentId:   string | null   # nested pages
        deleted:    boolean
        deletedAt:  ISO string | null
        createdAt:  ISO string
        updatedAt:  ISO string

        versions/               # subcollection
          {versionId}/
            title:    string
            blocks:   Block[]
            content:  string
            savedAt:  ISO string
```

### Block Schema

```typescript
{
  id:       string       // random uid
  type:     'text' | 'heading1' | 'heading2' | 'heading3'
          | 'bulletList' | 'numberList' | 'todo'
          | 'quote' | 'callout' | 'toggle'
          | 'code' | 'table' | 'divider' | 'page'
  content:  string
  checked?: boolean      // todo blocks
  open?:    boolean      // toggle blocks
  language?: string      // code blocks
  table?:   {            // table blocks
    headers: string[]
    rows:    string[][]
  }
}
```
