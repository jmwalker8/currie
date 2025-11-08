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

## Design Principles

Following modern 2025 web design trends and ADHD-friendly UX principles:

- **Minimal Distractions** - No unnecessary animations or pop-ups
- **Clear Visual Hierarchy** - Color-coded priority system
- **Predictable Navigation** - Consistent layout and simple filters
- **Manageable Chunks** - Breaking down information into digestible cards
- **Ample Whitespace** - Reduced cognitive load
- **Soft Color Palette** - Muted colors to minimize sensory overload

## Setup Instructions

### 1. Get Google Classroom API Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **Google Classroom API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Classroom API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Configure the OAuth consent screen if prompted:
     - User Type: External
     - App name: ClassroomFocus
     - Add your email as developer contact
     - Add scopes (will be added automatically on first use)
   - Set Application type to "Web application"
   - Add Authorized JavaScript origins:
     - `http://localhost:8080` (for local testing)
     - Your production domain (if deploying)
   - Add Authorized redirect URIs:
     - `http://localhost:8080` (for local testing)
     - Your production domain (if deploying)
   - Click "Create"
   - Copy the **Client ID**

5. (Optional) Create an API Key:
   - Click "Create Credentials" > "API Key"
   - Copy the API key

### 2. Configure the Application

1. Open `config.js` in a text editor
2. Replace `YOUR_CLIENT_ID_HERE.apps.googleusercontent.com` with your actual Client ID
3. (Optional) Replace `YOUR_API_KEY_HERE` with your API Key
4. Save the file

### 3. Run the Application

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

#### Option B: Deploy to a Web Server

Upload all files to your web hosting service. Make sure to:
- Update the authorized JavaScript origins in Google Cloud Console
- Update the authorized redirect URIs in Google Cloud Console

### 4. Use the Application

1. Open your browser and navigate to `http://localhost:8080`
2. Click "Get Started" or "Connect Google Classroom"
3. Sign in with your Google account
4. Grant the necessary permissions
5. View and manage your assignments!

## File Structure

```
ClassroomFocus/
├── index.html              # Main HTML file
├── styles.css              # All styling (light/dark mode)
├── script.js               # Main application logic
├── config.js              # Google API configuration (YOU NEED TO EDIT THIS)
├── auth.js                # OAuth 2.0 authentication module
├── classroom-api.js       # Google Classroom API integration
└── README.md              # This file
```

## Required OAuth Scopes

The application requests the following scopes:

- `classroom.courses.readonly` - View your Google Classroom classes
- `classroom.coursework.me.readonly` - View your course work and grades
- `classroom.student-submissions.me.readonly` - View your course work submissions
- `userinfo.profile` - View your basic profile info

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Note: Internet Explorer is not supported.

## Troubleshooting

### "Failed to connect to Google Classroom"

- Make sure you've replaced the Client ID in `config.js`
- Check that the Google Classroom API is enabled in Google Cloud Console
- Verify your authorized JavaScript origins include your current domain
- Open browser console (F12) for detailed error messages

### "Authentication failed"

- Clear your browser cache and cookies
- Make sure you're using the correct Google account
- Check that your OAuth consent screen is configured correctly

### No assignments showing

- Verify you have active courses in Google Classroom
- Check that you have assignments in your courses
- Try refreshing the page

### CORS errors

- Make sure you're running the app through a web server (not file://)
- Verify your domain is in the authorized JavaScript origins

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
