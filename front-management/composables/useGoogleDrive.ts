// composables/useGoogleDrive.ts
import { ref, reactive } from 'vue';

export const useGoogleDrive = () => {
  const isInitialized = ref(false);
  const isSignedIn = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const user = reactive({
    name: '',
    email: '',
    picture: ''
  });
  
  // Initialize Google Auth
  const initialize = async () => {
    if (isInitialized.value) return;
    
    try {
      isLoading.value = true;
      error.value = null;
      
      // Load the gapi client
      await loadGapiScript();
      
      const config = useRuntimeConfig();
      
      return new Promise<void>((resolve, reject) => {
        window.gapi.load('client:auth2', async () => {
          try {
            await window.gapi.client.init({
              apiKey: config.public.googleApiKey,
              clientId: config.public.googleClientId,
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
              scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata.readonly'
            });
            
            // Set up auth change listener
            const auth = window.gapi.auth2.getAuthInstance();
            auth.isSignedIn.listen(updateSignInStatus);
            
            // Handle initial sign-in state
            updateSignInStatus(auth.isSignedIn.get());
            
            isInitialized.value = true;
            resolve();
          } catch (err) {
            console.error('Error initializing Google API client:', err);
            reject(err);
          }
        });
      });
    } catch (err: any) {
      console.error('Failed to initialize Google Drive:', err);
      error.value = err.message || 'Failed to initialize Google Drive';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Load the Google API script
  const loadGapiScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.body.appendChild(script);
    });
  };
  
  // Update sign-in status
  const updateSignInStatus = (signedIn: boolean) => {
    isSignedIn.value = signedIn;
    
    if (signedIn) {
      // Get user info
      const auth = window.gapi.auth2.getAuthInstance();
      const googleUser = auth.currentUser.get();
      const profile = googleUser.getBasicProfile();
      
      user.name = profile.getName();
      user.email = profile.getEmail();
      user.picture = profile.getImageUrl();
      
      // Important: Make sure we set the auth token for all API requests
      window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse(true);
    } else {
      // Reset user info
      user.name = '';
      user.email = '';
      user.picture = '';
    }
  };
  
  // Sign in
  const signIn = async () => {
    if (!isInitialized.value) {
      await initialize();
    }
    
    try {
      isLoading.value = true;
      error.value = null;
      
      const auth = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth.signIn({
        prompt: 'select_account'
      });
      
      // IMPORTANT: Ensure we have the token available
      const authResponse = googleUser.getAuthResponse(true);
      console.log('Auth token retrieved successfully:', !!authResponse.access_token);
      
      return true;
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      
      // Special handling for popup closed by user
      if (err.error === 'popup_closed_by_user') {
        error.value = 'Sign-in cancelled. Please try again.';
      } else {
        error.value = err.message || 'Failed to sign in with Google';
      }
      
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Sign out
  const signOut = async () => {
    if (!isInitialized.value) return;
    
    try {
      const auth = window.gapi.auth2.getAuthInstance();
      await auth.signOut();
    } catch (err: any) {
      console.error('Google Sign-Out failed:', err);
      error.value = err.message || 'Failed to sign out';
    }
  };
  
  // List files in Google Drive
  const listFiles = async (options = {}) => {
    if (!isSignedIn.value) {
      throw new Error('User not signed in');
    }
    
    try {
      isLoading.value = true;
      error.value = null;
      
      // IMPORTANT: Ensure we have a valid token before making the request
      const auth = window.gapi.auth2.getAuthInstance();
      const currentUser = auth.currentUser.get();
      
      // Force token refresh if needed
      if (currentUser.isSignedIn()) {
        try {
          // This ensures the token is fresh
          const authResponse = currentUser.getAuthResponse(true);
          console.log('Token available for request:', !!authResponse.access_token);
          console.log('Token expiry:', new Date(authResponse.expires_at).toISOString());
        } catch (e) {
          console.error('Error refreshing token:', e);
          // Try to reauthorize
          await currentUser.reloadAuthResponse();
        }
      } else {
        throw new Error('User is not signed in');
      }
      
      // Now make the API request
      const response = await window.gapi.client.drive.files.list({
        'pageSize': 30,
        'fields': 'files(id, name, mimeType, size, modifiedTime, webViewLink, webContentLink)',
        ...options
      });
      
      console.log('Drive API response:', response);
      return response.result.files || [];
    } catch (err: any) {
      console.error('Failed to list files:', err);
      error.value = err.message || 'Failed to list files';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  return {
    isInitialized,
    isSignedIn,
    isLoading,
    error,
    user,
    initialize,
    signIn,
    signOut,
    listFiles
  };
};

// Add TypeScript declarations
declare global {
  interface Window {
    gapi: any;
  }
}