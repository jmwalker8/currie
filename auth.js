// ===================================
// Google OAuth 2.0 Authentication Module
// ===================================

class GoogleAuth {
    constructor() {
        this.isSignedIn = false;
        this.currentUser = null;
        this.gapiInitialized = false;
        this.gisInitialized = false;
        this.tokenClient = null;
        this.accessToken = null;
    }

    /**
     * Initialize the Google API client library
     */
    async initClient() {
        try {
            console.log('Initializing Google API Client...');

            // Initialize gapi
            await new Promise((resolve, reject) => {
                gapi.load('client', { callback: resolve, onerror: reject });
            });

            await gapi.client.init({
                apiKey: GOOGLE_CONFIG.API_KEY,
                discoveryDocs: GOOGLE_CONFIG.DISCOVERY_DOCS,
            });

            this.gapiInitialized = true;
            console.log('GAPI client initialized successfully');

            // Initialize Google Identity Services
            this.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CONFIG.CLIENT_ID,
                scope: GOOGLE_CONFIG.SCOPES,
                callback: (tokenResponse) => {
                    this.handleAuthResponse(tokenResponse);
                },
            });

            this.gisInitialized = true;
            console.log('Google Identity Services initialized successfully');

            return true;
        } catch (error) {
            console.error('Error initializing Google API client:', error);
            throw error;
        }
    }

    /**
     * Handle the authentication response
     */
    handleAuthResponse(tokenResponse) {
        if (tokenResponse.error !== undefined) {
            console.error('Authentication error:', tokenResponse);
            this.onAuthError(tokenResponse.error);
            return;
        }

        this.accessToken = tokenResponse.access_token;
        this.isSignedIn = true;

        // Set the access token for API requests
        gapi.client.setToken({ access_token: tokenResponse.access_token });

        console.log('Authentication successful');
        this.onAuthSuccess();
    }

    /**
     * Sign in to Google
     */
    async signIn() {
        if (!this.gapiInitialized || !this.gisInitialized) {
            console.error('Google API not initialized. Call initClient() first.');
            return false;
        }

        try {
            // Check if we already have a valid token
            const token = gapi.client.getToken();
            if (token !== null) {
                this.isSignedIn = true;
                this.accessToken = token.access_token;
                this.onAuthSuccess();
                return true;
            }

            // Request a new token
            this.tokenClient.requestAccessToken({ prompt: 'consent' });
            return true;
        } catch (error) {
            console.error('Sign in error:', error);
            this.onAuthError(error);
            return false;
        }
    }

    /**
     * Sign out from Google
     */
    signOut() {
        const token = gapi.client.getToken();
        if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token, () => {
                console.log('Access token revoked');
            });
            gapi.client.setToken(null);
        }

        this.isSignedIn = false;
        this.currentUser = null;
        this.accessToken = null;

        console.log('Signed out successfully');
        this.onSignOut();
    }

    /**
     * Get current user profile
     */
    async getUserProfile() {
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            const profile = await response.json();
            this.currentUser = {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                picture: profile.picture
            };

            return this.currentUser;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }

    /**
     * Check if user is currently signed in
     */
    isUserSignedIn() {
        return this.isSignedIn && this.accessToken !== null;
    }

    /**
     * Callback functions - override these in your main app
     */
    onAuthSuccess() {
        console.log('Auth success callback - override this method');
    }

    onAuthError(error) {
        console.error('Auth error callback - override this method', error);
    }

    onSignOut() {
        console.log('Sign out callback - override this method');
    }
}

// Create a global instance
window.googleAuth = new GoogleAuth();
