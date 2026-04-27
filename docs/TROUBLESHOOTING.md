# Troubleshooting Guide

Common issues and solutions for NodePad.

## Installation Issues

### npm install fails

**Problem:** Dependencies won't install

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
npm install

# Try with legacy peer deps
npm install --legacy-peer-deps

# Update npm
npm install -g npm@latest
```

### Node version mismatch

**Problem:** "Unsupported engine" error

**Solution:**
```bash
# Check your Node version
node --version

# Should be v16 or higher
# Install nvm (Node Version Manager)
# Then install correct version
nvm install 16
nvm use 16
```

## Server Issues

### Port already in use

**Problem:** "EADDRINUSE: address already in use :::5000"

**Solutions:**

**Option 1: Kill the process**
```bash
# Mac/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Option 2: Change port**
```env
# server/.env
PORT=5001
```

### Firebase connection error

**Problem:** "Firebase initialization error"

**Solutions:**

1. **Check credentials**
```env
# Verify these are correct in server/.env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-email@project.iam.gserviceaccount.com
```

2. **Fix private key format**
```env
# Private key needs \n for line breaks
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"
```

3. **Enable Firestore**
- Go to Firebase Console
- Select your project
- Navigate to Firestore Database
- Click "Create Database"

4. **Check service account**
- Firebase Console → Project Settings
- Service Accounts tab
- Generate new private key if needed

### Cloudinary upload fails

**Problem:** "Image upload failed"

**Solutions:**

1. **Verify credentials**
```env
# Check server/.env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

2. **Check file size**
- Max size is 5MB
- Reduce image size if larger

3. **Verify file type**
- Only images allowed (jpeg, jpg, png, gif, webp)
- Check file extension

4. **Test Cloudinary account**
- Log into Cloudinary dashboard
- Verify account is active
- Check upload quota

### CORS error

**Problem:** "Access-Control-Allow-Origin" error

**Solutions:**

1. **Check CLIENT_URL**
```env
# server/.env
CLIENT_URL=http://localhost:3000
```

2. **Verify CORS config**
```javascript
// server/src/app.js
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
```

3. **Check ports match**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Update .env if different

### Rate limit error

**Problem:** "Too many requests"

**Solutions:**

1. **Increase limits**
```env
# server/.env
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=200  # Increase from 100
```

2. **Wait and retry**
- Rate limit resets after window expires
- Default: 100 requests per 15 minutes

## Client Issues

### Vite server won't start

**Problem:** "Failed to start dev server"

**Solutions:**

1. **Check port 3000**
```bash
# Kill process on port 3000
lsof -i :3000  # Mac/Linux
kill -9 <PID>
```

2. **Clear Vite cache**
```bash
cd client
rm -rf node_modules/.vite
npm run dev
```

3. **Change port**
```javascript
// client/vite.config.js
export default defineConfig({
  server: {
    port: 3001  // Change port
  }
});
```

### API calls fail

**Problem:** "Network Error" or 404

**Solutions:**

1. **Check API URL**
```env
# client/.env
VITE_API_URL=http://localhost:5000/api
```

2. **Verify backend is running**
```bash
# Test health endpoint
curl http://localhost:5000/health
```

3. **Check browser console**
- Open DevTools (F12)
- Check Network tab
- Look for failed requests
- Verify request URL

### React Quill not loading

**Problem:** Editor doesn't appear

**Solutions:**

1. **Import CSS**
```javascript
// Already in NoteEditor.jsx
import 'react-quill/dist/quill.snow.css';
```

2. **Reinstall package**
```bash
cd client
npm uninstall react-quill
npm install react-quill@latest
```

### Images not displaying

**Problem:** Uploaded images don't show

**Solutions:**

1. **Check image URL**
- Open browser DevTools
- Check image src attribute
- Verify Cloudinary URL is valid

2. **Check CORS**
- Cloudinary images should work cross-origin
- Verify image URL is accessible

3. **Check network**
- Network tab in DevTools
- Look for failed image requests

## Database Issues

### Notes not saving

**Problem:** Create/update fails

**Solutions:**

1. **Check Firestore rules**
```javascript
// Firebase Console → Firestore → Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // For development
    }
  }
}
```

2. **Check Firebase connection**
```bash
# Server logs should show:
# ✅ Firebase initialized successfully
```

3. **Verify collection name**
```javascript
// server/src/controllers/notes.controller.js
const notesCollection = db.collection('notes');
```

### Notes not loading

**Problem:** Empty list or loading forever

**Solutions:**

1. **Check browser console**
- Look for error messages
- Check Network tab for API calls

2. **Test API directly**
```bash
curl http://localhost:5000/api/notes
```

3. **Check Firestore**
- Firebase Console → Firestore
- Verify 'notes' collection exists
- Check if documents are there

### Search not working

**Problem:** Search returns no results

**Solutions:**

1. **Check search query**
- Must be at least 1 character
- Case-insensitive search

2. **Verify search endpoint**
```bash
curl "http://localhost:5000/api/notes/search?q=test"
```

3. **Check controller logic**
```javascript
// server/src/controllers/notes.controller.js
// Search checks title, content, and tags
```

## Build Issues

### Frontend build fails

**Problem:** `npm run build` errors

**Solutions:**

1. **Fix ESLint errors**
```bash
# Check for errors
npm run dev

# Fix common issues
# - Unused variables
# - Missing dependencies
# - Import errors
```

2. **Clear cache and rebuild**
```bash
rm -rf node_modules/.vite dist
npm run build
```

3. **Check for console.logs**
- Remove debug console.logs
- Or disable ESLint rule

### Backend won't start in production

**Problem:** `npm start` fails

**Solutions:**

1. **Check environment variables**
```bash
# Verify all required vars are set
cat .env
```

2. **Check Node version**
```bash
node --version  # Should be v16+
```

3. **Install production dependencies**
```bash
npm install --production
```

## Performance Issues

### Slow page load

**Solutions:**

1. **Check network**
- Slow internet connection
- Large images

2. **Optimize images**
- Cloudinary auto-optimizes
- Check image sizes

3. **Check API response time**
- Network tab in DevTools
- Look for slow endpoints

### High memory usage

**Solutions:**

1. **Restart servers**
```bash
# Stop and restart both servers
```

2. **Check for memory leaks**
- Close unused browser tabs
- Clear browser cache

3. **Optimize queries**
- Add pagination
- Limit results

## Common Errors

### "Cannot find module"

**Solution:**
```bash
# Reinstall dependencies
npm install

# Check import path
# Should be relative: './component'
# Not absolute: 'component'
```

### "Unexpected token"

**Solution:**
- Syntax error in code
- Check for missing brackets, commas
- Use VS Code syntax highlighting

### "ENOENT: no such file or directory"

**Solution:**
- File path is wrong
- Check file exists
- Verify working directory

### "Failed to fetch"

**Solution:**
- Backend not running
- Wrong API URL
- CORS issue
- Network problem

## Getting More Help

### Debug Steps

1. **Check console**
   - Browser console (F12)
   - Server terminal
   - Look for error messages

2. **Check network**
   - Network tab in DevTools
   - Verify API calls
   - Check status codes

3. **Isolate the problem**
   - Does it work in Postman?
   - Does backend work alone?
   - Does frontend work with mock data?

4. **Search the error**
   - Copy exact error message
   - Search on Google
   - Check Stack Overflow

### Useful Commands

```bash
# Check if port is in use
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Test API endpoint
curl http://localhost:5000/api/notes

# Check Node/npm versions
node --version
npm --version

# Clear all caches
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Check environment variables
cat .env  # Mac/Linux
type .env  # Windows
```

### Still Stuck?

1. Read error message carefully
2. Check documentation
3. Review similar code that works
4. Try minimal reproduction
5. Ask for help with:
   - Exact error message
   - What you tried
   - Your environment (OS, Node version)
   - Steps to reproduce

## Prevention Tips

1. **Always check .env files**
   - Copy from .env.example
   - Fill in all values
   - Don't commit to Git

2. **Keep dependencies updated**
   ```bash
   npm outdated
   npm update
   ```

3. **Use version control**
   ```bash
   git commit -m "Working state"
   # Now safe to experiment
   ```

4. **Test incrementally**
   - Make small changes
   - Test after each change
   - Easier to find issues

5. **Read error messages**
   - They usually tell you what's wrong
   - Note the file and line number
   - Google the error if unclear

---

If you encounter an issue not listed here, please document it and the solution!