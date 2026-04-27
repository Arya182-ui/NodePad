# NodePad - Quick Reference

Fast reference for common tasks and commands.

## 🚀 Quick Start

```bash
# Setup (first time only)
./setup.sh          # Mac/Linux
setup.bat           # Windows

# Start backend
cd server && npm run dev

# Start frontend (new terminal)
cd client && npm run dev

# Open browser
http://localhost:3000
```

## 📁 Project Structure

```
nodepad/
├── client/         # React frontend
│   └── src/
│       ├── components/    # UI components
│       ├── pages/         # Page views
│       ├── services/      # API calls
│       └── styles/        # CSS files
│
├── server/         # Express backend
│   └── src/
│       ├── config/        # Firebase, Cloudinary
│       ├── controllers/   # Business logic
│       ├── middleware/    # Express middleware
│       └── routes/        # API endpoints
│
└── docs/          # Documentation
```

## 🔌 API Endpoints

```
GET    /api/notes              # Get all notes
GET    /api/notes/:id          # Get single note
POST   /api/notes              # Create note
PUT    /api/notes/:id          # Update note
DELETE /api/notes/:id          # Delete note
GET    /api/notes/search?q=    # Search notes
POST   /api/upload             # Upload image
GET    /health                 # Health check
```

## 💻 Common Commands

### Development
```bash
# Backend
cd server
npm install          # Install dependencies
npm run dev          # Start with nodemon
npm start            # Start production

# Frontend
cd client
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Testing
```bash
# Test API endpoint
curl http://localhost:5000/api/notes

# Test with data
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Content"}'
```

### Troubleshooting
```bash
# Kill process on port
lsof -i :5000        # Mac/Linux
kill -9 <PID>

netstat -ano | findstr :5000  # Windows
taskkill /PID <PID> /F

# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check versions
node -v
npm -v
```

## 🔧 Environment Variables

### Server (.env)
```env
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-key"
FIREBASE_CLIENT_EMAIL=your-email
CLOUDINARY_CLOUD_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📝 Code Snippets

### Create API Call
```javascript
// client/src/services/api.js
export const myAPI = {
  getData: () => api.get('/endpoint'),
  postData: (data) => api.post('/endpoint', data),
};
```

### Create Component
```javascript
// client/src/components/MyComponent.jsx
import './MyComponent.css';

function MyComponent({ prop }) {
  return (
    <div className="my-component">
      {prop}
    </div>
  );
}

export default MyComponent;
```

### Create API Endpoint
```javascript
// server/src/routes/my.routes.js
const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    // Logic here
    res.json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

### Create Controller
```javascript
// server/src/controllers/my.controller.js
const { getFirestore } = require('../config/firebase');
const db = getFirestore();

const getData = async (req, res, next) => {
  try {
    const snapshot = await db.collection('items').get();
    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

module.exports = { getData };
```

## 🎨 CSS Variables

```css
/* Available in all components */
var(--primary)          /* #6366f1 */
var(--primary-dark)     /* #4f46e5 */
var(--background)       /* #0f172a */
var(--surface)          /* #1e293b */
var(--surface-light)    /* #334155 */
var(--text)             /* #f1f5f9 */
var(--text-secondary)   /* #94a3b8 */
var(--border)           /* #334155 */
var(--success)          /* #10b981 */
var(--error)            /* #ef4444 */
```

## 🔍 Debugging

### Frontend
```javascript
// Console logging
console.log('State:', state);
console.error('Error:', error);

// React DevTools
// Install extension, inspect components

// Network tab
// Check API calls, status codes
```

### Backend
```javascript
// Console logging
console.log('Request:', req.body);
console.error('Error:', error.message);

// Test with curl/Postman
curl http://localhost:5000/api/notes
```

## 📚 File Locations

### Add New Page
```
client/src/pages/MyPage.jsx
client/src/pages/MyPage.css
client/src/App.jsx (add route)
```

### Add New Component
```
client/src/components/MyComponent/MyComponent.jsx
client/src/components/MyComponent/MyComponent.css
```

### Add New API Endpoint
```
server/src/routes/my.routes.js
server/src/controllers/my.controller.js
server/src/app.js (mount route)
```

### Add Middleware
```
server/src/middleware/myMiddleware.js
server/src/app.js (use middleware)
```

## 🔐 Security Checklist

- [ ] Environment variables set
- [ ] .env not in Git
- [ ] Rate limiting enabled
- [ ] Input validation added
- [ ] CORS configured
- [ ] Helmet enabled
- [ ] HTTPS in production

## 🚢 Deployment Quick Steps

1. Build frontend: `cd client && npm run build`
2. Set environment variables on hosting
3. Deploy backend to Render/Railway
4. Deploy frontend to Vercel/Netlify
5. Update API URL in client
6. Test production site

## 📖 Documentation Links

- [Project Overview](docs/PROJECT_OVERVIEW.md)
- [Quick Start](docs/QUICKSTART.md)
- [Setup Guide](docs/SETUP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Development](docs/DEVELOPMENT.md)
- [Data Flow](docs/DATA_FLOW.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Deployment](docs/DEPLOYMENT_CHECKLIST.md)

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Port in use | Kill process or change port |
| Firebase error | Check credentials in .env |
| CORS error | Verify CLIENT_URL in server .env |
| Module not found | Run `npm install` |
| Build fails | Clear cache, reinstall |

## 💡 Pro Tips

1. Use React DevTools for debugging
2. Check Network tab for API issues
3. Read error messages carefully
4. Test in small increments
5. Keep dependencies updated
6. Use Git for version control
7. Document as you code

## 🎯 Next Steps

1. ✅ Set up project
2. ✅ Configure environment
3. ✅ Start servers
4. ✅ Create first note
5. 🔜 Add authentication
6. 🔜 Deploy to production

## 📞 Quick Help

- Setup issues? → [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- How it works? → [DATA_FLOW.md](docs/DATA_FLOW.md)
- Adding features? → [DEVELOPMENT.md](docs/DEVELOPMENT.md)
- Deploying? → [DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md)

---

Keep this file handy for quick reference! 📌