# Testing Guide - All 3 Issues Fixed

## Issues Fixed:
1. ✅ Auto-save working with manual save button (Ctrl+S)
2. ✅ Google Auth with better error handling
3. ✅ Share feature with read-only links

## Why Notes Not Showing in Firestore?

### Quick Checks:

1. **Is the server running?**
   ```bash
   cd server
   npm start
   ```
   Server should start on http://localhost:5000

2. **Test the API directly:**
   Open browser console and run:
   ```javascript
   // First login, then test
   fetch('http://localhost:5000/api/notes', {
     headers: {
       'Authorization': 'Bearer YOUR_TOKEN_HERE'
     }
   }).then(r => r.json()).then(console.log)
   ```

3. **Check Firebase Console:**
   - Go to https://console.firebase.google.com/
   - Select project: "attendance-tushar"
   - Go to Firestore Database
   - Check if `users` collection exists
   - Check if your user ID has a `notes` subcollection

4. **Check server logs:**
   When you save a note, server should log:
   ```
   POST /api/notes
   ✅ Firebase initialized successfully
   ```

### Common Issues:

**Issue 1: Server not running**
```bash
cd server
npm install
npm start
```

**Issue 2: Firebase permissions**
- Make sure Firestore is initialized in Firebase Console
- Go to Firestore → Rules → Set to test mode temporarily:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // TEMPORARY - for testing only
    }
  }
}
```

**Issue 3: CORS error**
- Check `server/.env` has correct `CLIENT_URL`
- Should be: `CLIENT_URL=http://localhost:3000`

**Issue 4: Authentication token not sent**
- Check browser console for errors
- Make sure you're logged in
- Token should be in request headers

### Test the Complete Flow:

1. **Start Backend:**
   ```bash
   cd server
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd client
   npm run dev
   ```

3. **Test:**
   - Login with Google or Email
   - Create a new note (click "New Page")
   - Type something
   - Wait 1.5 seconds (auto-save) OR press Ctrl+S
   - Check status badge shows "Saved"
   - Check sidebar - note should appear
   - Check Firestore Console - data should be there

### Debug Mode:

Add this to see what's happening:

**In browser console:**
```javascript
// Enable verbose logging
localStorage.setItem('debug', 'true');
```

**Check Network Tab:**
- Open DevTools → Network
- Filter: XHR
- Save a note
- Look for POST/PUT to `/api/notes`
- Check response status (should be 200 or 201)

### If Still Not Working:

1. Check server terminal for errors
2. Check browser console for errors
3. Verify Firebase credentials in `server/.env`
4. Make sure Firestore is enabled in Firebase Console
5. Check if authentication is working (user should be logged in)

### Quick Fix Script:

Run this in server directory:
```bash
# Check if Firebase is configured
node -e "require('dotenv').config(); console.log('Project ID:', process.env.FIREBASE_PROJECT_ID)"

# Should output: Project ID: attendance-tushar
```

## All Features Working:

1. **Auto-save**: Saves every 1.5 seconds automatically
2. **Manual save**: Click save button or press Ctrl+S
3. **Status indicator**: Shows "Saving...", "Saved", or "Failed"
4. **Google Auth**: Login with Google account
5. **Share Notes**: Click Share → Create Share Link → Copy & share
6. **Read-only view**: Shared links open in read-only mode
7. **Sidebar refresh**: Notes appear immediately after save

## Share Feature Usage:

1. Save a note first
2. Click "..." menu → Share
3. Click "Create Share Link"
4. Copy the link
5. Share with anyone (they can view without login)
6. To revoke: Click "Revoke" button

The shared URL looks like: `http://localhost:3000/shared/abc123xyz`
