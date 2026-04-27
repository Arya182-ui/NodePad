# NodePad 📝

A production-grade, Notion-style note-taking app with real-time collaboration features, built with React, Node.js, and Firebase.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)

## ✨ Features

### 📝 Rich Text Editor
- **Block-based editing** — text, headings, lists, todos, code, tables, callouts, toggles, dividers
- **Slash commands** (`/`) to insert any block type
- **@mentions** to link to other notes inline
- **Syntax highlighting** in code blocks (12 languages)
- **Drag-and-drop** block reordering
- **Inline formatting** toolbar (bold, italic, code, link)
- **Auto-save** with 1.5s debounce + manual save (Ctrl+S)
- **Offline draft cache** — edits survive network failures

### 🎨 Customization
- **Emoji icons** for each note
- **Cover images** with gradient presets
- **Dark/Light theme** toggle
- **Note templates** (Meeting, To-Do, Journal, Project Plan, README, Blank)

### 🔄 Collaboration & Sharing
- **Share notes** with read-only public links
- **Version history** — restore any of the last 20 saves
- **Real-time sync** via Firestore
- **Nested pages** with breadcrumb navigation

### 🔍 Organization
- **Full-text search** (title, content, tags)
- **Tag system** for categorization
- **Sidebar navigation** with page tree
- **Trash bin** with 30-day retention
- **Bulk operations** (select, delete, restore)

### 🔐 Security & Performance
- **Firebase Authentication** — email/password + Google OAuth
- **XSS sanitization** on server and client
- **Rate limiting** and security headers
- **Lazy-loaded routes** for faster initial load
- **Error boundaries** for graceful error handling
- **Cloudinary integration** for image storage

### 📱 Mobile Responsive
- **Touch-friendly** interface
- **Slide-in sidebar** on mobile
- **Responsive modals** and dialogs
- **Optimized for all screen sizes**

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/nodepad.git
cd nodepad

# 2. Install dependencies
cd server && npm install
cd ../client && npm install

# 3. Configure environment
cp server/.env.example server/.env
cp client/.env.example client/.env
# Edit .env files with your Firebase + Cloudinary credentials

# 4. Start the servers
# Terminal 1 - Backend
cd server && npm start    # → http://localhost:5000

# Terminal 2 - Frontend  
cd client && npm run dev  # → http://localhost:3000
```

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router 6 |
| **Backend** | Node.js, Express |
| **Database** | Firebase Firestore (real-time) |
| **Authentication** | Firebase Auth (Email + Google OAuth) |
| **Storage** | Cloudinary (images) |
| **Testing** | Vitest (client), Jest (server) |
| **Styling** | CSS Modules, CSS Variables |

## 📚 Documentation

### Getting Started
- 📖 [**Setup Guide**](docs/SETUP.md) — Complete environment setup
- ⚡ [**Quick Start**](docs/QUICKSTART.md) — Running in 5 minutes
- 🔧 [**Troubleshooting**](docs/TROUBLESHOOTING.md) — Common issues & fixes

### Development
- 🏗️ [**Architecture**](docs/ARCHITECTURE.md) — Project structure & design decisions
- 🔄 [**Data Flow**](docs/DATA_FLOW.md) — How data moves through the system
- 💻 [**Development Guide**](docs/DEVELOPMENT.md) — Dev workflow, code style, testing

### Deployment
- 🚀 [**Deployment Checklist**](docs/DEPLOYMENT_CHECKLIST.md) — Production deployment guide
- 📋 [**Project Overview**](docs/PROJECT_OVERVIEW.md) — High-level project summary

### Additional Resources
- ✅ [**Fixes Completed**](FIXES_COMPLETED.md) — Recent bug fixes and improvements
- 🧪 [**Test Guide**](TEST_FIXES.md) — Testing all features
- 🐛 [**Debug Steps**](DEBUG_STEPS.md) — Debugging common issues

## 🔌 API Reference

### Notes
```
GET    /api/notes                           List notes (paginated)
GET    /api/notes/:id                       Get note by ID
POST   /api/notes                           Create new note
PUT    /api/notes/:id                       Update note (auto-saves version)
DELETE /api/notes/:id                       Soft delete (move to trash)
POST   /api/notes/:id/restore               Restore from trash
DELETE /api/notes/:id/permanent             Hard delete + cleanup
POST   /api/notes/:id/duplicate             Duplicate note
GET    /api/notes/trash                     List trashed notes
GET    /api/notes/search?q=&tag=            Search notes
```

### Versions
```
GET    /api/notes/:id/versions              List version history
POST   /api/notes/:id/versions/:vid/restore Restore specific version
```

### Sharing
```
POST   /api/notes/:id/share                 Create share link
DELETE /api/notes/:id/share                 Revoke share link
GET    /api/notes/shared/:shareId           Get shared note (public)
```

### Upload
```
POST   /api/upload                          Upload image to Cloudinary
```

### Health
```
GET    /health                              Health check endpoint
```

## 🧪 Running Tests

```bash
# Client tests (Vitest)
cd client
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report

# Server tests (Jest)
cd server
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 🎯 Key Features Explained

### Auto-Save
Notes automatically save every 1.5 seconds while you type. You can also manually save with `Ctrl+S` (or `Cmd+S` on Mac). The status indicator shows:
- 💾 **Saving...** — Currently saving
- ✅ **Saved** — Successfully saved
- ❌ **Failed** — Save failed (cached locally)

### Share Notes
1. Save your note first
2. Click the "..." menu → **Share**
3. Click **Create Share Link**
4. Copy and share the link
5. Anyone can view without login (read-only)
6. Revoke access anytime

### Version History
Every save creates a version snapshot (keeps last 20). To restore:
1. Click "..." menu → **Version history**
2. Browse previous versions
3. Click **Restore** on any version

### Keyboard Shortcuts
- `Ctrl+S` / `Cmd+S` — Manual save
- `Ctrl+K` / `Cmd+K` — Search notes
- `Ctrl+N` / `Cmd+N` — New note
- `Ctrl+/` / `Cmd+/` — Show shortcuts
- `/` — Slash command menu
- `@` — Mention another note

## 🌐 Browser Support

- ✅ Chrome/Edge (Chromium) — Latest
- ✅ Firefox — Latest
- ✅ Safari — Latest
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Features

- **Responsive design** for all screen sizes
- **Touch-friendly** buttons and interactions
- **Slide-in sidebar** on mobile devices
- **Optimized modals** for small screens
- **No horizontal scroll** on any device

## 🔒 Security Features

- **Firebase Authentication** with email/password and Google OAuth
- **XSS sanitization** on both client and server
- **Rate limiting** to prevent abuse
- **Helmet security headers** for Express
- **CORS configuration** for API security
- **Input validation** with express-validator
- **Secure token handling** with Firebase Admin SDK

## 🚀 Performance Optimizations

- **Lazy-loaded routes** for faster initial load
- **Code splitting** with React.lazy
- **Debounced auto-save** to reduce API calls
- **Cursor-based pagination** for efficient data loading
- **Optimistic UI updates** for better UX
- **Local draft cache** for offline resilience

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Notion](https://notion.so)
- Built with [React](https://reactjs.org/)
- Powered by [Firebase](https://firebase.google.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
2. Review [Debug Steps](DEBUG_STEPS.md)
3. Open an issue on GitHub
4. Check existing documentation in the `docs/` folder

---

Made with ❤️ by Ayush Gangwar
