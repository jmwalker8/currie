// ===================================
// Google Classroom API Configuration
// ===================================

// TODO: Replace these with your actual Google Cloud Project credentials
// To get these credentials:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select an existing one
// 3. Enable the Google Classroom API
// 4. Go to "Credentials" and create an OAuth 2.0 Client ID
// 5. Set the application type to "Web application"
// 6. Add authorized JavaScript origins (e.g., http://localhost:8080)
// 7. Add authorized redirect URIs (e.g., http://localhost:8080)
// 8. Copy the Client ID below

const GOOGLE_CONFIG = {
    // Your OAuth 2.0 Client ID from Google Cloud Console
    CLIENT_ID: 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com',

    // API Key (optional, but recommended for better quota management)
    API_KEY: 'YOUR_API_KEY_HERE',

    // Discovery docs for the Google Classroom API
    DISCOVERY_DOCS: ['https://classroom.googleapis.com/$discovery/rest?version=v1'],

    // Authorization scopes required for the app
    SCOPES: [
        'https://www.googleapis.com/auth/classroom.courses.readonly',
        'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
        'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly',
        'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ')
};

// Export for use in other modules
window.GOOGLE_CONFIG = GOOGLE_CONFIG;
