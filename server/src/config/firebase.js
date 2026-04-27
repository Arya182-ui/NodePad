const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if Firebase credentials are configured
    if (!process.env.FIREBASE_PROJECT_ID || 
        process.env.FIREBASE_PROJECT_ID === 'your-project-id') {
      console.log('⚠️  Firebase not configured yet');
      console.log('📝 Please follow these steps:');
      console.log('');
      console.log('1. Go to https://console.firebase.google.com/');
      console.log('2. Create a project or select existing one');
      console.log('3. Go to Project Settings → Service Accounts');
      console.log('4. Click "Generate New Private Key"');
      console.log('5. Copy the values to server/.env:');
      console.log('   - FIREBASE_PROJECT_ID');
      console.log('   - FIREBASE_PRIVATE_KEY (keep the quotes and \\n)');
      console.log('   - FIREBASE_CLIENT_EMAIL');
      console.log('');
      console.log('6. Enable Firestore Database in Firebase Console');
      console.log('');
      console.log('⚠️  Server will run but database operations will fail');
      console.log('');
      return;
    }

    // In production, use service account JSON file
    // For development, use environment variables
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('   - Check that all Firebase credentials are set in server/.env');
    console.log('   - Ensure FIREBASE_PRIVATE_KEY has proper format with \\n');
    console.log('   - Verify the service account has Firestore permissions');
    console.log('   - See docs/TROUBLESHOOTING.md for more help');
    console.log('');
    process.exit(1);
  }
};

// Get Firestore instance
const getFirestore = () => {
  return admin.firestore();
};

module.exports = {
  initializeFirebase,
  getFirestore,
  admin
};