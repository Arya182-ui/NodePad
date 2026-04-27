# Data Flow Documentation

Visual guide to understand how data flows through NodePad.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
│                      (Browser)                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   REACT FRONTEND                             │
│                  (localhost:3000)                            │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Pages     │  │  Components  │  │   Services   │     │
│  │              │  │              │  │              │     │
│  │ - Home       │  │ - Header     │  │ - api.js     │     │
│  │ - Editor     │  │ - NoteCard   │  │ - Axios      │     │
│  │ - NotFound   │  │ - Layout     │  │              │     │
│  └──────────────┘  └──────────────┘  └──────┬───────┘     │
│                                              │              │
└──────────────────────────────────────────────┼──────────────┘
                                               │
                                               │ HTTP/HTTPS
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   EXPRESS BACKEND                            │
│                  (localhost:5000)                            │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Routes     │  │ Controllers  │  │  Middleware  │     │
│  │              │  │              │  │              │     │
│  │ - notes      │  │ - CRUD ops   │  │ - Validation │     │
│  │ - upload     │  │ - Search     │  │ - Error      │     │
│  │              │  │              │  │ - Upload     │     │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘     │
│         │                  │                                │
└─────────┼──────────────────┼────────────────────────────────┘
          │                  │
          │                  ▼
          │         ┌─────────────────┐
          │         │   FIREBASE      │
          │         │   FIRESTORE     │
          │         │                 │
          │         │  - Store notes  │
          │         │  - Query data   │
          │         └─────────────────┘
          │
          ▼
┌─────────────────┐
│   CLOUDINARY    │
│                 │
│ - Store images  │
│ - Optimize      │
│ - Serve via CDN │
└─────────────────┘
```

## Creating a Note - Detailed Flow

### Step 1: User Action
```
User clicks "New Note" button
         │
         ▼
React Router navigates to /note/new
         │
         ▼
NoteEditor component loads
```

### Step 2: User Input
```
User types in editor
         │
         ▼
React state updates (useState)
         │
         ├─ title: "My Note"
         ├─ content: "<p>Content here</p>"
         ├─ tags: ["work", "important"]
         └─ images: []
```

### Step 3: Image Upload (Optional)
```
User selects image file
         │
         ▼
File sent to uploadAPI.uploadImage()
         │
         ▼
POST /api/upload
         │
         ▼
Multer middleware processes file
         │
         ├─ Validates file type
         ├─ Checks file size
         └─ Converts to buffer
         │
         ▼
Cloudinary.upload()
         │
         ├─ Uploads to cloud
         ├─ Optimizes image
         └─ Returns URL
         │
         ▼
URL added to note.images[]
```

### Step 4: Save Note
```
User clicks "Save Note"
         │
         ▼
notesAPI.create(noteData)
         │
         ▼
POST /api/notes
         │
         ▼
Express receives request
         │
         ▼
Middleware chain:
  1. Helmet (security headers)
  2. CORS (check origin)
  3. Rate limiter (check limits)
  4. Body parser (parse JSON)
  5. Validator (validate input)
         │
         ▼
notes.routes.js
         │
         ▼
notes.controller.createNote()
         │
         ├─ Validate data
         ├─ Add timestamps
         └─ Create note object
         │
         ▼
Firestore.collection('notes').add()
         │
         ▼
Note saved to database
         │
         ▼
Response sent back
         │
         ▼
Frontend receives response
         │
         ├─ Show success toast
         ├─ Navigate to note view
         └─ Update UI
```

## Reading Notes - Detailed Flow

### Loading All Notes
```
User visits homepage (/)
         │
         ▼
Home component mounts
         │
         ▼
useEffect runs
         │
         ▼
notesAPI.getAll()
         │
         ▼
GET /api/notes
         │
         ▼
notes.controller.getAllNotes()
         │
         ▼
Firestore query:
  collection('notes')
    .orderBy('updatedAt', 'desc')
    .get()
         │
         ▼
Notes array returned
         │
         ▼
Response sent to frontend
         │
         ▼
setNotes(response.data)
         │
         ▼
UI re-renders with notes
         │
         ▼
NoteCard components display
```

## Searching Notes - Detailed Flow

```
User types in search bar
         │
         ▼
Input captured in Header
         │
         ▼
User presses Enter
         │
         ▼
Navigate to /?search=query
         │
         ▼
Home component detects search param
         │
         ▼
notesAPI.search(query)
         │
         ▼
GET /api/notes/search?q=query
         │
         ▼
notes.controller.searchNotes()
         │
         ▼
Firestore.collection('notes').get()
         │
         ▼
Filter in memory:
  - Check title.includes(query)
  - Check content.includes(query)
  - Check tags.includes(query)
         │
         ▼
Filtered notes returned
         │
         ▼
Display search results
```

## Updating a Note - Detailed Flow

```
User clicks note card
         │
         ▼
Navigate to /note/:id
         │
         ▼
NoteEditor loads with id
         │
         ▼
Fetch existing note:
  GET /api/notes/:id
         │
         ▼
Firestore.doc(id).get()
         │
         ▼
Note data loaded into state
         │
         ▼
User edits content
         │
         ▼
State updates in real-time
         │
         ▼
User clicks "Save"
         │
         ▼
notesAPI.update(id, data)
         │
         ▼
PUT /api/notes/:id
         │
         ▼
notes.controller.updateNote()
         │
         ▼
Firestore.doc(id).update()
         │
         ├─ Update fields
         └─ Update timestamp
         │
         ▼
Success response
         │
         ▼
Show success toast
```

## Deleting a Note - Detailed Flow

```
User clicks delete button
         │
         ▼
Confirmation dialog
         │
         ▼
User confirms
         │
         ▼
notesAPI.delete(id)
         │
         ▼
DELETE /api/notes/:id
         │
         ▼
notes.controller.deleteNote()
         │
         ▼
Check if note exists
         │
         ▼
Firestore.doc(id).delete()
         │
         ▼
Note removed from database
         │
         ▼
Success response
         │
         ▼
Remove from UI state
         │
         ▼
Show success toast
```

## Error Handling Flow

```
Error occurs anywhere
         │
         ▼
Try-catch block catches error
         │
         ▼
Backend: next(error)
         │
         ▼
errorHandler middleware
         │
         ├─ Log error
         ├─ Format response
         └─ Send to client
         │
         ▼
Frontend: catch block
         │
         ├─ Extract error message
         └─ Show error toast
         │
         ▼
User sees friendly error message
```

## State Management Flow

### Component State (useState)
```
Initial State
     │
     ▼
User Action
     │
     ▼
setState() called
     │
     ▼
React schedules update
     │
     ▼
Component re-renders
     │
     ▼
UI updates
```

### API State Flow
```
Component mounts
     │
     ▼
Set loading = true
     │
     ▼
Make API call
     │
     ▼
Wait for response
     │
     ├─ Success
     │  ├─ Set data
     │  └─ Set loading = false
     │
     └─ Error
        ├─ Set error
        └─ Set loading = false
     │
     ▼
Component re-renders with new state
```

## Request/Response Cycle

### Typical Request
```javascript
// Frontend
const response = await axios.post('/api/notes', {
  title: 'My Note',
  content: 'Content here',
  tags: ['work']
});

// Travels through network
// ↓

// Backend receives
app.post('/api/notes', async (req, res) => {
  // req.body = { title, content, tags }
  
  // Process request
  const note = await createNote(req.body);
  
  // Send response
  res.json({
    success: true,
    data: note
  });
});

// Travels back through network
// ↓

// Frontend receives
// response.data = { success: true, data: {...} }
```

## Data Transformation

### Note Object Through System

**Frontend Input:**
```javascript
{
  title: "My Note",
  content: "<p>Rich text content</p>",
  tags: ["work", "important"],
  images: []
}
```

**Backend Processing:**
```javascript
{
  title: "My Note",
  content: "<p>Rich text content</p>",
  tags: ["work", "important"],
  images: [],
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z"
}
```

**Firestore Storage:**
```javascript
{
  title: "My Note",
  content: "<p>Rich text content</p>",
  tags: ["work", "important"],
  images: [],
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z"
}
```

**Backend Response:**
```javascript
{
  success: true,
  data: {
    id: "abc123",
    title: "My Note",
    content: "<p>Rich text content</p>",
    tags: ["work", "important"],
    images: [],
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z"
  }
}
```

**Frontend Display:**
```javascript
// NoteCard shows:
// - Title: "My Note"
// - Preview: "Rich text content" (HTML stripped)
// - Tags: ["work", "important"]
// - Date: "Jan 15, 2024"
```

## Middleware Chain Detail

```
Request arrives
     │
     ▼
1. Helmet
   - Adds security headers
   - X-Content-Type-Options
   - X-Frame-Options
   - etc.
     │
     ▼
2. CORS
   - Check origin
   - Add CORS headers
   - Allow/deny request
     │
     ▼
3. Rate Limiter
   - Check request count
   - Allow or block
     │
     ▼
4. Body Parser
   - Parse JSON body
   - Make available as req.body
     │
     ▼
5. Route Handler
   - Match route
   - Call controller
     │
     ▼
6. Validator (if defined)
   - Validate input
   - Return errors or continue
     │
     ▼
7. Controller
   - Business logic
   - Database operations
   - Return response
     │
     ▼
8. Error Handler (if error)
   - Catch errors
   - Format response
   - Send to client
     │
     ▼
Response sent back
```

## Real-time Updates (Future Feature)

```
User A creates note
     │
     ▼
Saved to Firestore
     │
     ▼
Firestore triggers listener
     │
     ▼
User B's listener receives update
     │
     ▼
User B's UI updates automatically
```

## Summary

Key takeaways:
1. Frontend and backend are separate
2. They communicate via HTTP/HTTPS
3. Data flows through middleware
4. State management is local (React)
5. Database is external (Firebase)
6. Images stored separately (Cloudinary)
7. Errors handled at each layer

Understanding this flow helps with:
- Debugging issues
- Adding new features
- Optimizing performance
- Securing the application