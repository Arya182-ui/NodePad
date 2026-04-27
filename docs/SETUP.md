# NodePad Setup Guide

Complete guide to set up and run NodePad locally.

## Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Cloudinary account

## Step 1: Clone and Install

```bash
# Navigate to project root
cd nodepad

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Step 2: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Save the JSON file securely

## Step 3: Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up or log in
3. Go to Dashboard
4. Copy your Cloud Name, API Key, and API Secret

## Step 4: Environment Variables

### Server Configuration

Create `server/.env` file:

```env
PORT=5000
NODE_ENV=development

# Firebase (from your service account JSON)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Security
JWT_SECRET=your-random-secret-key-change-this
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Client Configuration

Create `client/.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## Step 5: Run the Application

### Start Backend Server

```bash
cd server
npm run dev
```

Server will run on http://localhost:5000

### Start Frontend

```bash
cd client
npm run dev
```

Client will run on http://localhost:3000

## Step 6: Test the Application

1. Open http://localhost:3000 in your browser
2. Click "New Note" to create a note
3. Add title, content, and tags
4. Upload images (optional)
5. Click "Save Note"

## Troubleshooting

### Firebase Connection Issues
- Verify your Firebase credentials in `.env`
- Ensure Firestore is enabled in Firebase Console
- Check that private key has proper line breaks (`\n`)

### Cloudinary Upload Fails
- Verify API credentials
- Check file size (max 5MB)
- Ensure file is a valid image format

### Port Already in Use
- Change PORT in `server/.env`
- Update VITE_API_URL in `client/.env` accordingly

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment guide.

## API Endpoints

### Notes
- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/search?q=query` - Search notes

### Upload
- `POST /api/upload` - Upload image

## Next Steps

- Add user authentication
- Implement real-time sync
- Add note sharing
- Create mobile app