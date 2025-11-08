# ClassroomFocus - ADHD-Friendly Google Classroom Assignment Tracker

A modern, minimalist web application designed to help students (especially those with ADHD) manage their Google Classroom assignments in a focused, distraction-free environment.

## Features

- 🎯 **ADHD-Friendly Design** - Clean, minimalist interface with reduced visual clutter
- 📊 **Assignment Dashboard** - Visual overview of all your assignments with priority indicators
- ⏰ **Smart Prioritization** - Automatic categorization (Due Soon, This Week, Upcoming)
- ✅ **Quick Actions** - Mark assignments as complete with one click
- 🌙 **Dark Mode** - Easy on the eyes for extended use
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🔗 **Google Classroom Integration** - Real-time sync with your Google Classroom account
- 🔐 **Firebase Authentication** - Secure, easy Google sign-in

## Design Principles

Following modern 2025 web design trends and ADHD-friendly UX principles:

- **Minimal Distractions** - No unnecessary animations or pop-ups
- **Clear Visual Hierarchy** - Color-coded priority system
- **Predictable Navigation** - Consistent layout and simple filters
- **Manageable Chunks** - Breaking down information into digestible cards
- **Ample Whitespace** - Reduced cognitive load
- **Soft Color Palette** - Muted colors to minimize sensory overload

## Setup Instructions

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Give your project a name (e.g., "ClassroomFocus")
4. (Optional) Enable Google Analytics
5. Click "Create project"

### 2. Enable Firebase Authentication

1. In the Firebase Console, go to **Authentication**
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable **Google** as a sign-in provider:
   - Click on "Google"
   - Toggle "Enable"
   - Select a support email
   - Click "Save"

### 3. Register Your Web App with Firebase

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the **Web icon** (`</>`) to add a web app
4. Register your app:
   - App nickname: "ClassroomFocus"
   - (Optional) Check "Also set up Firebase Hosting"
   - Click "Register app"
5. Copy the `firebaseConfig` object - you'll need this!

### 4. Enable Google Classroom API

1. In the Firebase Console, click on **Project Settings** (gear icon)
2. Go to the "Service accounts" tab
3. Click on "Google Cloud Platform (GCP) service account" link
4. This opens Google Cloud Console
5. Click on "ENABLE APIS AND SERVICES"
6. Search for "Google Classroom API"
7. Click on it and press "Enable"

### 5. Create API Key

1. Still in Google Cloud Console, go to **APIs & Services** > **Credentials**
2. Click "CREATE CREDENTIALS" > "API key"
3. Copy the API key
4. (Recommended) Click "RESTRICT KEY":
   - Under "API restrictions", select "Restrict key"
   - Select "Google Classroom API"
   - Click "Save"

### 6. Configure Your Application

#### Update `firebase-config.js`:

1. Open `firebase-config.js` in a text editor
2. Replace the entire `firebaseConfig` object with the one from Firebase Console (Step 3):

```javascript
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

3. Save the file

#### Update `config.js`:

1. Open `config.js` in a text editor
2. Replace `YOUR_API_KEY_HERE` with your Google Cloud API Key (from Step 5)
3. Save the file

### 7. Run the Application

#### Option A: Simple HTTP Server (Recommended for Testing)

Python 3:
```bash
python -m http.server 8080
```

Python 2:
```bash
python -m SimpleHTTPServer 8080
```

Node.js:
```bash
npx http-server -p 8080
```

#### Option B: Deploy with Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project directory
firebase init hosting

# Deploy
firebase deploy
```

#### Option C: Deploy to Any Web Server

Upload all files to your web hosting service. Make sure to update the authorized domains in Firebase Console.

### 8. Use the Application

1. Open your browser and navigate to `http://localhost:8080` (or your deployed URL)
2. Click "Get Started" or "Connect Google Classroom"
3. Sign in with your Google account (via Firebase)
4. Grant the necessary Google Classroom permissions
5. View and manage your assignments!

## File Structure

```
ClassroomFocus/
├── index.html              # Main HTML file
├── styles.css              # All styling (light/dark mode)
├── script.js               # Main application logic
├── config.js               # Google Classroom API config (YOU NEED TO EDIT THIS)
├── firebase-config.js      # Firebase configuration (YOU NEED TO EDIT THIS)
├── auth.js                 # Firebase Authentication with Google
├── classroom-api.js        # Google Classroom API integration
└── README.md               # This file
```

## Required OAuth Scopes

The application requests the following scopes through Firebase Authentication:

- `classroom.courses.readonly` - View your Google Classroom classes
- `classroom.coursework.me.readonly` - View your course work and grades
- `classroom.student-submissions.me.readonly` - View your course work submissions
- `userinfo.profile` - View your basic profile info

## Why Firebase Authentication?

Using Firebase Authentication provides several benefits:

- **Easier Setup** - No need to manage OAuth Client IDs in your code
- **Better Session Management** - Firebase handles token refresh automatically
- **Secure** - Credentials are managed server-side by Firebase
- **Future-Ready** - Easy to add more features like:
  - Database storage (Firestore)
  - Push notifications (FCM)
  - Analytics
  - Multi-device sync

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Note: Internet Explorer is not supported.

## Troubleshooting

### "Failed to connect to Google Classroom"

- Make sure you've updated both `firebase-config.js` AND `config.js`
- Check that Firebase Authentication is enabled with Google provider
- Verify the Google Classroom API is enabled in Google Cloud Console
- Open browser console (F12) for detailed error messages

### "Authentication failed"

- Ensure Google sign-in is enabled in Firebase Console (Authentication > Sign-in method)
- Clear your browser cache and cookies
- Make sure you're using the correct Google account
- Check your Firebase project settings

### "Firebase not initialized"

- Verify you've replaced the config in `firebase-config.js`
- Make sure you're running the app through a web server (not file://)
- Check the browser console for specific Firebase errors

### No assignments showing

- Verify you have active courses in Google Classroom
- Check that you have assignments in your courses
- Open browser console to check for API errors
- Make sure the Google Classroom API is enabled in your Google Cloud project

### CORS or "googleapis.com" errors

- Ensure you're running through a web server (not file://)
- Check that your domain is authorized in Firebase Console
- Verify the Google Classroom API key is correct

## Privacy

This application:
- Only accesses your Google Classroom data (read-only)
- Does not store any data on external servers
- All data processing happens in your browser
- Does not share your information with third parties

## Future Enhancements

- 📅 Calendar view integration
- 🔔 Browser notifications for upcoming deadlines
- 📈 Progress tracking and statistics
- 🎨 Customizable themes
- 📥 Export assignments to various formats
- 🔄 Auto-refresh assignments

## Contributing

This is a simple vanilla JavaScript project. Feel free to fork and customize it for your needs!

## License

MIT License - Feel free to use and modify as needed.

## Credits

Built with vanilla HTML, CSS, and JavaScript.
Designed following ADHD-friendly and modern web design principles.
