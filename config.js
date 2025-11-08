// ===================================
// Google Classroom API Configuration
// ===================================

// TODO: Replace the API Key with your Google Cloud Project API Key
// To get the API key:
// 1. Go to https://console.cloud.google.com/
// 2. Select your Firebase project (or create a new one)
// 3. Enable the Google Classroom API
// 4. Go to "Credentials" and create an API Key
// 5. Copy the API key below
//
// NOTE: Client ID is no longer needed here - Firebase handles OAuth!
// You'll configure the OAuth Client ID in Firebase Console instead.

const GOOGLE_CONFIG = {
    // API Key from Google Cloud Console (for Classroom API)
    API_KEY: 'YOUR_API_KEY_HERE',

    // Discovery docs for the Google Classroom API
    DISCOVERY_DOCS: ['https://classroom.googleapis.com/$discovery/rest?version=v1'],

    // Authorization scopes required for Google Classroom
    // These will be requested through Firebase Authentication
    SCOPES: [
        'https://www.googleapis.com/auth/classroom.courses.readonly',
        'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
        'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly',
        'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ')
};

// Export for use in other modules
window.GOOGLE_CONFIG = GOOGLE_CONFIG;
