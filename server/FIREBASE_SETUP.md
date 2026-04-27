# Firebase Setup Guide

Quick guide to get your Firebase credentials.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" (or select existing project)
3. Enter project name (e.g., "nodepad")
4. Follow the setup wizard

## Step 2: Enable Firestore

1. In Firebase Console, click "Firestore Database" in left menu
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to you)
5. Click "Enable"

## Step 3: Get Service Account Credentials

1. Click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Go to "Service accounts" tab
4. Click "Generate new private key"
5. Click "Generate key" - a JSON file will download

## Step 4: Configure .env File

Open the downloaded JSON file and copy these values to `server/.env`:

### From JSON file:
```json
{
  "project_id": "your-project-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
}
```

### To .env file:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

**IMPORTANT:** 
- Keep the quotes around FIREBASE_PRIVATE_KEY
- Keep the `\n` characters (they represent line breaks)
- Don't remove any dashes or text from the key

## Step 5: Cloudinary Setup (Optional for now)

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for free account
3. Go to Dashboard
4. Copy these values to `server/.env`:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Step 6: Test the Setup

1. Save the `.env` file
2. Restart the server: `npm run dev`
3. You should see: `✅ Firebase initialized successfully`

## Example .env File

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=nodepad-12345
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc123@nodepad-12345.iam.gserviceaccount.com

# Cloudinary Configuration (optional for now)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Security
JWT_SECRET=your-random-secret-key-change-this
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Troubleshooting

### Error: "project_id" property
- Make sure FIREBASE_PROJECT_ID is set correctly
- Check for typos in the .env file

### Error: "private_key" format
- Ensure the private key is wrapped in quotes
- Keep all `\n` characters
- Don't add extra spaces or line breaks

### Error: Permission denied
- Make sure Firestore is enabled in Firebase Console
- Check that the service account has proper permissions

### Still having issues?
- See `docs/TROUBLESHOOTING.md`
- Double-check the JSON file values
- Try regenerating the service account key

## Security Notes

⚠️ **NEVER commit the .env file to Git!**
- The `.gitignore` file already excludes it
- Keep your credentials secret
- Use different credentials for production

## Next Steps

Once Firebase is configured:
1. Start the server: `npm run dev`
2. Start the client: `cd ../client && npm run dev`
3. Open http://localhost:3000
4. Create your first note!

---

Need help? Check the main documentation in `docs/` folder.