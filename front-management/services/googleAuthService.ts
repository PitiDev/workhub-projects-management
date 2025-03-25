// services/googleAuthService.ts
import { ref } from 'vue';

// Define types for Google Identity Services
interface CredentialResponse {
  credential: string;
  select_by: string;
  clientId: string;
}

export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string; // User ID
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export const googleAuthService = {
  // State
  isInitialized: ref(false),
  isSignedIn: ref(false),
  accessToken: ref<string | null>(null),
  user: ref<GoogleUser | null>(null),

  /**
   * Initialize Google Identity Services
   */
  async initialize(clientId: string) {
    if (this.isInitialized.value) return;

    return new Promise<void>((resolve, reject) => {
      try {
        // Check if the script is already loaded
        if (document.getElementById('google-identity-script')) {
          this.isInitialized.value = true;
          this.checkExistingSession();
          resolve();
          return;
        }

        // Load Google Identity Services script
        const script = document.createElement('script');
        script.id = 'google-identity-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          this.isInitialized.value = true;
          this.checkExistingSession();
          resolve();
        };
        
        script.onerror = (error) => {
          console.error('Error loading Google Identity Services:', error);
          reject(new Error('Failed to load Google Identity Services'));
        };
        
        document.head.appendChild(script);
      } catch (error) {
        console.error('Error initializing Google Identity Services:', error);
        reject(error);
      }
    });
  },

  /**
   * Check if user has an existing session
   */
  checkExistingSession() {
    // Check local storage for tokens
    const tokenData = localStorage.getItem('googleToken');
    if (tokenData) {
      try {
        const { token, expires } = JSON.parse(tokenData);
        const now = new Date().getTime();
        
        if (now < expires) {
          // Token is still valid
          this.accessToken.value = token;
          this.isSignedIn.value = true;
          
          // Try to get user data from localStorage
          const userData = localStorage.getItem('googleUser');
          if (userData) {
            this.user.value = JSON.parse(userData);
          }
          
          return true;
        } else {
          // Token expired
          localStorage.removeItem('googleToken');
          localStorage.removeItem('googleUser');
        }
      } catch (e) {
        console.error('Error parsing stored token:', e);
      }
    }
    
    return false;
  },

  /**
   * Handle credential response from Google Identity Services
   */
  async handleCredentialResponse(response: CredentialResponse) {
    try {
      // Decode the JWT to get user info
      const decodedToken = this.parseJwt(response.credential);
      
      // Store user info
      this.user.value = {
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture,
        sub: decodedToken.sub
      };
      
      localStorage.setItem('googleUser', JSON.stringify(this.user.value));
      
      // Get access token for Google APIs
      await this.getAccessToken(response.credential);
      
      this.isSignedIn.value = true;
      
      return true;
    } catch (error) {
      console.error('Error handling credential response:', error);
      throw error;
    }
  },

  /**
   * Get access token for Google APIs using the ID token
   */
  async getAccessToken(idToken: string) {
    // For simplicity, we're storing the ID token as our access token
    // In a production app, you would exchange this for a real access token
    // using your backend server
    
    this.accessToken.value = idToken;
    
    // Store token with expiry (1 hour from now)
    const expires = new Date().getTime() + 3600 * 1000;
    localStorage.setItem('googleToken', JSON.stringify({
      token: idToken,
      expires
    }));
    
    return idToken;
  },

  /**
   * Initialize the sign-in with Google button
   */
  renderSignInButton(elementId: string, callback: (user: GoogleUser) => void) {
    if (!this.isInitialized.value || !window.google) {
      console.error('Google Identity Services not initialized');
      return;
    }
    
    window.google.accounts.id.initialize({
      client_id: window.googleClientId,
      callback: (response: CredentialResponse) => {
        this.handleCredentialResponse(response).then(() => {
          if (this.user.value) {
            callback(this.user.value);
          }
        });
      },
      auto_select: false,
      cancel_on_tap_outside: true
    });
    
    window.google.accounts.id.renderButton(
      document.getElementById(elementId)!,
      { 
        type: 'standard', 
        theme: 'outline', 
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left'
      }
    );
    
    // Also display the One Tap UI
    window.google.accounts.id.prompt();
  },

  /**
   * Sign out from Google
   */
  signOut() {
    if (!this.isInitialized.value || !window.google) {
      console.error('Google Identity Services not initialized');
      return Promise.resolve();
    }
    
    return new Promise<void>((resolve) => {
      window.google.accounts.id.disableAutoSelect();
      
      // Clear local storage
      localStorage.removeItem('googleToken');
      localStorage.removeItem('googleUser');
      
      // Reset state
      this.accessToken.value = null;
      this.user.value = null;
      this.isSignedIn.value = false;
      
      resolve();
    });
  },

  /**
   * Parse JWT token
   */
  parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  }
};

// Add type declarations
declare global {
  interface Window {
    google: any;
    googleClientId: string;
  }
}

export default googleAuthService;