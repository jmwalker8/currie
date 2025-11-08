// ===================================
// Firebase Configuration
// ===================================

// TODO: Replace with your Firebase project configuration
// To get these values:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select existing one
// 3. Click on the Web icon (</>) to add a web app
// 4. Register your app and copy the configuration below
// 5. Go to Authentication > Sign-in method > Enable Google

const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app;
let auth;
let analytics;

try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();

    // Optional: Initialize Analytics if you want to track usage
    if (typeof firebase.analytics !== 'undefined') {
        analytics = firebase.analytics();
    }

    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase:', error);
}

// Export for use in other modules
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseAnalytics = analytics;
