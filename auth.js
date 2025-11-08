// ===================================
// Firebase Authentication with Google Classroom API
// ===================================

class GoogleAuth {
    constructor() {
        this.isSignedIn = false;
        this.currentUser = null;
        this.accessToken = null;
        this.gapiInitialized = false;
        this.firebaseUser = null;
    }

    /**
     * Initialize Firebase Auth and Google API Client
     */
    async initClient() {
        try {
            console.log('Initializing authentication...');

            // Initialize Google API Client (for Classroom API)
            await new Promise((resolve, reject) => {
                gapi.load('client', { callback: resolve, onerror: reject });
            });

            await gapi.client.init({
                apiKey: GOOGLE_CONFIG.API_KEY,
                discoveryDocs: GOOGLE_CONFIG.DISCOVERY_DOCS,
            });

            this.gapiInitialized = true;
            console.log('Google API Client initialized');

            // Set up Firebase Auth state listener
            firebaseAuth.onAuthStateChanged((user) => {
                this.handleAuthStateChange(user);
            });

            console.log('Authentication initialization complete');
            return true;
        } catch (error) {
            console.error('Error initializing authentication:', error);
            throw error;
        }
    }

    /**
     * Handle Firebase auth state changes
     */
    async handleAuthStateChange(user) {
        if (user) {
            console.log('User signed in:', user.email);
            this.firebaseUser = user;
            this.isSignedIn = true;

            // Get the user's profile info
            this.currentUser = {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                picture: user.photoURL
            };

            // Get the Google access token
            try {
                const credential = await user.getIdTokenResult();

                // For Google Classroom API, we need to get the OAuth access token
                // This is stored in the user's credential
                const googleCredential = firebase.auth.GoogleAuthProvider.credential(
                    null,
                    await this.getGoogleAccessToken(user)
                );

                console.log('User authenticated successfully');
                this.onAuthSuccess();
            } catch (error) {
                console.error('Error getting access token:', error);
                // Try to continue anyway - might need manual token refresh
                this.onAuthSuccess();
            }
        } else {
            console.log('User signed out');
            this.isSignedIn = false;
            this.currentUser = null;
            this.firebaseUser = null;
            this.accessToken = null;
            this.onSignOut();
        }
    }

    /**
     * Get Google OAuth access token from Firebase user
     */
    async getGoogleAccessToken(user) {
        try {
            // Firebase stores the OAuth access token in the user's additional info
            // We'll use Google Identity Services to get the token with proper scopes
            const provider = new firebase.auth.GoogleAuthProvider();

            // Add all required Google Classroom scopes
            GOOGLE_CONFIG.SCOPES.split(' ').forEach(scope => {
                provider.addScope(scope);
            });

            // Get the credential with full scopes
            const result = await user.reauthenticateWithPopup(provider);

            // Extract the access token
            const credential = result.credential;
            this.accessToken = credential.accessToken;

            // Set token for Google API Client
            if (this.accessToken) {
                gapi.client.setToken({ access_token: this.accessToken });
            }

            return this.accessToken;
        } catch (error) {
            console.error('Error getting Google access token:', error);
            throw error;
        }
    }

    /**
     * Sign in with Firebase Google Authentication
     */
    async signIn() {
        try {
            console.log('Starting Google sign-in...');

            const provider = new firebase.auth.GoogleAuthProvider();

            // Add all required Google Classroom scopes
            GOOGLE_CONFIG.SCOPES.split(' ').forEach(scope => {
                provider.addScope(scope);
            });

            // Force account selection and consent screen
            provider.setCustomParameters({
                prompt: 'select_account consent'
            });

            // Sign in with popup
            const result = await firebaseAuth.signInWithPopup(provider);

            // Get the OAuth access token
            const credential = result.credential;
            this.accessToken = credential.accessToken;

            // Set token for Google API Client
            if (this.accessToken) {
                gapi.client.setToken({ access_token: this.accessToken });
            }

            console.log('Sign-in successful');
            return true;
        } catch (error) {
            console.error('Sign-in error:', error);
            this.onAuthError(error);
            return false;
        }
    }

    /**
     * Sign out from Firebase and Google
     */
    async signOut() {
        try {
            // Revoke Google access token if exists
            if (this.accessToken) {
                try {
                    await fetch(`https://oauth2.googleapis.com/revoke?token=${this.accessToken}`, {
                        method: 'POST'
                    });
                } catch (e) {
                    console.warn('Could not revoke token:', e);
                }
                gapi.client.setToken(null);
            }

            // Sign out from Firebase
            await firebaseAuth.signOut();

            this.isSignedIn = false;
            this.currentUser = null;
            this.firebaseUser = null;
            this.accessToken = null;

            console.log('Signed out successfully');
            return true;
        } catch (error) {
            console.error('Sign-out error:', error);
            return false;
        }
    }

    /**
     * Get current user info
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Check if user is currently signed in
     */
    isUserSignedIn() {
        return this.isSignedIn && this.firebaseUser !== null;
    }

    /**
     * Get access token (with auto-refresh if needed)
     */
    async getAccessToken() {
        if (!this.firebaseUser) {
            throw new Error('No user signed in');
        }

        // Check if we have a valid token
        if (this.accessToken) {
            return this.accessToken;
        }

        // If not, get a fresh one
        try {
            await this.getGoogleAccessToken(this.firebaseUser);
            return this.accessToken;
        } catch (error) {
            console.error('Error refreshing access token:', error);
            throw error;
        }
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
