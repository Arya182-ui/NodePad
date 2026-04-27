# NodePad — Presentation
> Render with [Marp](https://marp.app/) · Each `---` = new slide

---

<!-- SLIDE 1 — TITLE -->

# ✦ NodePad

### Notion-Style Note-Taking App

**React 18 · Node.js · Firebase · Cloudinary**

> A full-stack, production-grade workspace for your notes, ideas, and tasks.
> Built for speed. Designed for clarity.

---

<!-- SLIDE 2 — PROBLEM & SOLUTION -->

# Problem → Solution

### ❌ The Problem
- Existing note apps are either too simple or closed-source
- No single learning project covers **auth + real-time + security + testing**
- Developers need a **real codebase** — not a tutorial toy

### ✅ Our Solution — NodePad
- Fully functional Notion-inspired workspace
- Production patterns: auth, real-time sync, version history, offline support
- Clean architecture anyone can read, learn from, and extend

---

<!-- SLIDE 3 — TECH STACK -->

# Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | React 18 + Vite | Fast builds, lazy loading, component model |
| **Backend** | Node.js + Express | Lightweight REST API, huge ecosystem |
| **Database** | Firebase Firestore | Real-time listeners, auto-scaling NoSQL |
| **Auth** | Firebase Auth | Email/password + Google OAuth, zero config |
| **Storage** | Cloudinary CDN | Auto image optimization, global delivery |
| **Security** | Helmet · xss · DOMPurify · Rate Limit | Multi-layer XSS & abuse protection |
| **Testing** | Vitest + Jest | 28 tests — client & server |

---

<!-- SLIDE 4 — FEATURES -->

# What NodePad Can Do

### ✏️ Editor
- **12+ block types** — text, headings, lists, todos, code, tables, callouts, toggles
- **`/` slash commands** to insert any block · **`@`** to link notes inline
- **Syntax highlighting** in code blocks (12 languages) · drag & drop reorder

### 📋 Notes & Workspace
- **Auto-save** (1.5s) · **Offline draft cache** · **Version history** (last 20 saves)
- **6 templates** — Meeting, To-Do, Journal, Project Plan, README, Blank
- **Nested pages** · emoji icon · cover image · tags · duplicate

### 🏠 Home & Navigation
- **Real-time sync** across tabs/devices · **Cursor pagination** (50/page)
- **Server-side search** · **Bulk select** + batch delete · **Trash** with 30-day retention

---

<!-- SLIDE 5 — ARCHITECTURE -->

# System Architecture

```
┌──────────────────────────────────────┐
│         React 18  (Browser)          │
│  Pages · BlockEditor · Sidebar       │
│  Axios + Firebase Token Interceptor  │
│  onSnapshot → live notes (no poll)   │
└─────────────────┬────────────────────┘
                  │  HTTPS
                  ▼
┌──────────────────────────────────────┐
│       Express API  :5000             │
│  Helmet → CORS → Rate Limit          │
│  Auth MW → Validate → Sanitize (XSS) │
│  → Controller → Structured Logger    │
└──────────┬───────────────────────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
Firebase      Cloudinary
Firestore     Image CDN
+ Auth        + Cleanup
```

**Middleware chain:** every request passes through security → auth → validation → sanitization before hitting business logic.

---

<!-- SLIDE 6 — SECURITY & QUALITY -->

# Security & Code Quality

### 🔒 Security Layers
| What | How |
|---|---|
| Authentication | Firebase ID token verified on **every** request |
| XSS (server) | `xss` strips HTML from title, content, tags, blocks |
| XSS (client) | `DOMPurify` sanitizes highlight.js output before render |
| Rate limiting | 100 req / 15 min per IP |
| File uploads | Image types only · 5MB max · auth-protected |
| Headers | Helmet — CSP, X-Frame-Options, HSTS |

### 🧪 Testing — 28 Tests, All Passing ✅
```
Client (Vitest)  →  exportNote utility (9) · TableBlock component (5)
Server (Jest)    →  sanitize middleware (7) · errorHandler (4) · logger (3)
```

### ⚡ Performance
Lazy-loaded routes · cursor pagination · `onSnapshot` (no polling) · retry logic · error boundary

---

<!-- SLIDE 7 — DATA FLOW -->

# Data Flow — Key Scenarios

### 📝 Saving a Note
```
User types  →  updateNote()  →  saveDraft() [localStorage]
            →  1.5s debounce  →  PUT /api/notes/:id
            →  Auth · Validate · Sanitize  →  Firestore update
            →  Version snapshot (async)  →  clearDraft()
```

### 🔄 Real-Time Sync
```
Firestore onSnapshot  →  Layout.jsx  →  Outlet context
→  Sidebar + Home update instantly  (any tab, any device)
```

### 🌐 Offline Recovery
```
Network fails  →  draft stays in localStorage
Next load      →  API unreachable?  →  loadDraft()  →  restore content
               →  toast: "Restored from local draft"
```

### 🗑️ Permanent Delete
```
permanentDelete()  →  extract Cloudinary publicIds
→  deleteImage() for each  →  Firestore doc.delete()
```

---

<!-- SLIDE 8 — CONCLUSION -->

# NodePad — Summary

### What We Built
A **complete, deployable** Notion-style note-taking app — not a tutorial project.

### What It Demonstrates
| Area | Achievement |
|---|---|
| **Full-Stack** | React 18 frontend + Express backend + Firebase + Cloudinary |
| **Real-Time** | Firestore `onSnapshot` — live sync, zero polling |
| **Security** | Multi-layer XSS, auth on every route, rate limiting |
| **Reliability** | Offline drafts, version history, error boundary, retry logic |
| **Testing** | 28 automated tests — client + server |
| **Performance** | Code splitting, pagination, CDN, structured logging |

### Ready For
✅ Production deployment &nbsp;&nbsp; ✅ Portfolio showcase &nbsp;&nbsp; ✅ Team collaboration

---

# ✦ Thank You

**github · docs/SETUP.md · docs/ARCHITECTURE.md**
