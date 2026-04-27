# Quick Start Guide

Get NodePad running in 5 minutes!

## What You'll Build

A modern note-taking app with:
- Create, edit, delete notes
- Rich text editor
- Image uploads
- Search functionality
- Tags for organization

## Installation (2 minutes)

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies  
cd ../client
npm install
```

## Configuration (2 minutes)

### 1. Get Firebase Credentials
- Visit [Firebase Console](https://console.firebase.google.com/)
- Create project → Project Settings → Service Accounts
- Generate new private key

### 2. Get Cloudinary Credentials
- Visit [Cloudinary](https://cloudinary.com/)
- Sign up → Dashboard → Copy credentials

### 3. Create Environment Files

`server/.env`:
```env
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-email@project.iam.gserviceaccount.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

`client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## Run (1 minute)

### Terminal 1 - Backend
```bash
cd server
npm run dev
```

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

Open http://localhost:3000 🎉

## First Steps

1. Click "New Note"
2. Add a title
3. Write some content
4. Add tags (press Enter)
5. Upload an image (optional)
6. Click "Save Note"

## Understanding the Code

### Frontend Structure
```
client/src/
├── components/     # Reusable UI pieces
├── pages/         # Full page views
├── services/      # API calls
└── styles/        # CSS files
```

### Backend Structure
```
server/src/
├── config/        # Firebase, Cloudinary setup
├── controllers/   # Business logic
├── middleware/    # Request processing
└── routes/        # API endpoints
```

## Key Concepts

### 1. Component Architecture
Each UI piece is a separate component:
- `NoteCard` - Shows note preview
- `Header` - Top navigation
- `Layout` - Wraps all pages

### 2. API Service Layer
All API calls go through `services/api.js`:
```javascript
notesAPI.getAll()    // Get all notes
notesAPI.create()    // Create note
notesAPI.update()    // Update note
```

### 3. Express Routes
Backend routes handle requests:
```javascript
GET    /api/notes       // List notes
POST   /api/notes       // Create note
PUT    /api/notes/:id   // Update note
DELETE /api/notes/:id   // Delete note
```

### 4. Firebase Firestore
NoSQL database structure:
```
notes/
  ├── note-id-1/
  │   ├── title
  │   ├── content
  │   ├── tags[]
  │   └── images[]
  └── note-id-2/
```

## Common Tasks

### Add a New API Endpoint

1. Create controller function in `server/src/controllers/`
2. Add route in `server/src/routes/`
3. Add API call in `client/src/services/api.js`
4. Use in component

### Add a New Page

1. Create component in `client/src/pages/`
2. Add route in `client/src/App.jsx`
3. Add navigation link

### Style a Component

1. Create `.css` file next to component
2. Import in component
3. Use CSS variables from `index.css`

## Next Features to Build

1. **User Authentication**
   - Firebase Auth
   - Login/Signup pages
   - Protected routes

2. **Note Sharing**
   - Share links
   - Permissions
   - Collaboration

3. **Rich Features**
   - Markdown support
   - Code syntax highlighting
   - Export to PDF

4. **Mobile App**
   - React Native
   - Offline support
   - Push notifications

## Need Help?

- Check [SETUP.md](./SETUP.md) for detailed setup
- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for design decisions
- Review code comments for explanations

## Pro Tips

1. Use React DevTools to inspect components
2. Check Network tab for API calls
3. Use console.log() for debugging
4. Read error messages carefully
5. Test in small increments

Happy coding! 🚀