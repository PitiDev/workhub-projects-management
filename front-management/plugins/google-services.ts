// plugins/google-services.ts - Simplified Version
import { ref } from 'vue'

// Define types for Google Identity Services
export interface GoogleUser {
    email: string;
    name: string;
    picture: string;
    sub: string; // User ID
}

export default defineNuxtPlugin((nuxtApp) => {
    // State
    const isInitialized = ref(false)
    const isSignedIn = ref(false)
    const user = ref<GoogleUser | null>(null)
    const accessToken = ref<string | null>(null)

    // Get runtime config
    const config = useRuntimeConfig()
    const googleClientId = config.public.googleClientId
    const googleApiKey = config.public.googleApiKey

    // API scopes required
    const scopes = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'

    /**
     * Initialize Google services
     */
    const initGoogleServices = async () => {
        if (isInitialized.value) return true

        try {
            console.log('Initializing Google services...')

            // Make clientId available globally
            if (process.client) {
                window.googleClientId = googleClientId
            }

            // First load GAPI script (only for Drive API, not for auth)
            await loadGapiScript()

            // Initialize Google API client
            await new Promise<void>((resolve, reject) => {
                window.gapi.load('client', async () => {
                    try {
                        await window.gapi.client.init({
                            apiKey: googleApiKey,
                            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
                        })
                        resolve()
                    } catch (err) {
                        console.error('Error initializing Google API client:', err)
                        reject(err)
                    }
                })
            })

            // Check if we have stored credentials
            checkStoredCredentials()

            isInitialized.value = true
            console.log('Google services initialized successfully')
            return true
        } catch (error) {
            console.error('Failed to initialize Google services:', error)
            throw error
        }
    }

    /**
     * Load Google API script
     */
    const loadGapiScript = () => {
        return new Promise<void>((resolve, reject) => {
            // Check if already loaded
            if (window.gapi) {
                resolve()
                return
            }

            const script = document.createElement('script')
            script.src = 'https://apis.google.com/js/api.js'
            script.onload = () => resolve()
            script.onerror = (e) => reject(e)
            document.body.appendChild(script)
        })
    }

    /**
     * Check for stored credentials
     */
    const checkStoredCredentials = () => {
        try {
            // Check for stored token
            const storedToken = localStorage.getItem('googleToken')
            const storedExpiry = localStorage.getItem('googleTokenExpiry')

            if (storedToken && storedExpiry) {
                const expiryTime = parseInt(storedExpiry)

                // Check if token is still valid (with 5-minute buffer)
                if (Date.now() < expiryTime - (5 * 60 * 1000)) {
                    accessToken.value = storedToken

                    // Set token in gapi client
                    if (window.gapi && window.gapi.client) {
                        window.gapi.client.setToken({ access_token: storedToken })
                    }

                    // Check for stored user data
                    const storedUser = localStorage.getItem('googleUser')
                    if (storedUser) {
                        user.value = JSON.parse(storedUser)
                        isSignedIn.value = true
                    }

                    return true
                } else {
                    // Token expired, clear storage
                    localStorage.removeItem('googleToken')
                    localStorage.removeItem('googleTokenExpiry')
                    localStorage.removeItem('googleUser')
                }
            }
        } catch (error) {
            console.error('Error checking stored credentials:', error)
        }

        return false
    }

    /**
     * Handle received access token
     */
    const handleAccessToken = (token: string, expiresIn: number) => {
        // Save the token
        accessToken.value = token

        // Calculate expiry time
        const expiryTime = Date.now() + (expiresIn * 1000)

        // Store token in localStorage
        localStorage.setItem('googleToken', token)
        localStorage.setItem('googleTokenExpiry', expiryTime.toString())

        // Set token in gapi client
        if (window.gapi && window.gapi.client) {
            window.gapi.client.setToken({ access_token: token })
        }

        return token
    }

    /**
     * Load user profile information
     */
    const loadUserProfile = async (token: string) => {
        try {
            const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch user profile')
            }

            const userData = await response.json()
            user.value = {
                email: userData.email,
                name: userData.name,
                picture: userData.picture,
                sub: userData.id || userData.sub
            }

            localStorage.setItem('googleUser', JSON.stringify(user.value))
            isSignedIn.value = true

            return user.value
        } catch (error) {
            console.error('Error loading user profile:', error)
            throw error
        }
    }

    /**
     * Google Auth Service - Simplified
     */
    const googleAuth = {
        isSignedIn,
        user,

        /**
         * Render Sign-in Button
         */
        renderSignInButton(elementId: string, callback: (user: GoogleUser) => void) {
            // Create a custom button that will trigger sign-in
            const buttonContainer = document.getElementById(elementId)
            if (!buttonContainer) return

            // Clear any existing content
            buttonContainer.innerHTML = ''

            // Create the button
            const button = document.createElement('button')
            button.className = 'flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            button.innerHTML = `
        <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#4285F4"/>
        </svg>
        Sign in with Google
      `

            // Add click handler to start the sign-in process
            button.addEventListener('click', async () => {
                try {
                    const result = await this.signIn()
                    if (result && user.value) {
                        callback(user.value)
                    }
                } catch (error) {
                    console.error('Sign-in failed:', error)
                }
            })

            // Add button to container
            buttonContainer.appendChild(button)
        },

        /**
         * Sign in with Google using OAuth implicit flow
         * This is a simplified approach for development
         */
        async signIn() {
            try {
                console.log('Starting sign-in process...')

                // Check if the Google API script is fully loaded
                if (!window.gapi || !window.gapi.client) {
                    await loadGapiScript()

                    await new Promise<void>((resolve) => {
                        window.gapi.load('client', resolve)
                    })

                    await window.gapi.client.init({
                        apiKey: googleApiKey,
                        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
                    })
                }

                // Open a popup window for authentication
                const width = 500
                const height = 600
                const left = window.screen.width / 2 - width / 2
                const top = window.screen.height / 2 - height / 2

                // IMPORTANT: Use a specific redirect URI that matches exactly
                // what's configured in your Google Cloud Console
                const redirectUri = `${window.location.origin}/auth/google/callback`
                console.log('Using redirect URI:', redirectUri)

                // Create OAuth URL - using authorization code flow instead of implicit
                const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
                authUrl.searchParams.append('client_id', googleClientId)
                authUrl.searchParams.append('redirect_uri', redirectUri)
                authUrl.searchParams.append('response_type', 'token') // Still using token for client-side
                authUrl.searchParams.append('scope', scopes)
                authUrl.searchParams.append('include_granted_scopes', 'true')
                authUrl.searchParams.append('state', generateRandomState())

                console.log('Auth URL:', authUrl.toString())

                // Store current URL to return to after auth
                localStorage.setItem('googleAuthReturnTo', window.location.href)

                // For development, just redirect the main window instead of using a popup
                // This is more reliable and avoids popup blockers
                window.location.href = authUrl.toString()

                // This promise won't resolve because we're redirecting the page
                return new Promise<boolean>(() => { })

                /* Popup approach - keeping for reference but using redirect instead
                const authWindow = window.open(
                  authUrl.toString(),
                  'GoogleAuth',
                  `width=${width},height=${height},left=${left},top=${top}`
                )
                
                if (!authWindow) {
                  throw new Error('Popup window was blocked. Please allow popups for this site.')
                }
                
                // Listen for the redirect and extract the token
                return new Promise<boolean>((resolve, reject) => {
                  const checkInterval = setInterval(() => {
                    try {
                      if (authWindow.closed) {
                        clearInterval(checkInterval)
                        reject(new Error('Authentication window was closed before completion'))
                        return
                      }
                      
                      // Check if the URL contains the access token
                      const currentUrl = authWindow.location.href
                      
                      if (currentUrl.includes('access_token=')) {
                        clearInterval(checkInterval)
                        
                        // Extract token from URL hash fragment
                        const hashParams = new URLSearchParams(
                          authWindow.location.hash.substring(1) // Remove the leading #
                        )
                        
                        const accessTokenValue = hashParams.get('access_token')
                        const expiresInValue = hashParams.get('expires_in')
                        
                        if (accessTokenValue) {
                          // Close the popup
                          authWindow.close()
                          
                          // Store the token
                          handleAccessToken(
                            accessTokenValue, 
                            expiresInValue ? parseInt(expiresInValue) : 3600
                          )
                          
                          // Load user profile
                          loadUserProfile(accessTokenValue).then(() => {
                            resolve(true)
                          }).catch(error => {
                            console.error('Error loading user profile:', error)
                            reject(error)
                          })
                        } else {
                          authWindow.close()
                          reject(new Error('No access token received'))
                        }
                      } else if (currentUrl.includes('error=')) {
                        // Extract error information
                        clearInterval(checkInterval)
                        
                        const urlObj = new URL(currentUrl)
                        const errorMsg = urlObj.searchParams.get('error') || 'Unknown error'
                        
                        authWindow.close()
                        reject(new Error(`Authentication failed: ${errorMsg}`))
                      }
                    } catch (e) {
                      // This may happen due to cross-origin restrictions when checking the location
                      // Just continue checking
                    }
                  }, 500)
                })
                */
            } catch (error) {
                console.error('Authentication failed:', error)
                throw error
            }
        },


        /**
         * Sign out
         */
        async signOut() {
            try {
                // Revoke token if exists
                if (accessToken.value) {
                    try {
                        const revokeUrl = `https://oauth2.googleapis.com/revoke?token=${accessToken.value}`
                        await fetch(revokeUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        })
                    } catch (e) {
                        console.warn('Error revoking token:', e)
                    }
                }

                // Clear local storage
                localStorage.removeItem('googleToken')
                localStorage.removeItem('googleTokenExpiry')
                localStorage.removeItem('googleUser')

                // Clear gapi token
                if (window.gapi && window.gapi.client) {
                    window.gapi.client.setToken(null)
                }

                // Reset state
                accessToken.value = null
                user.value = null
                isSignedIn.value = false

                return true
            } catch (error) {
                console.error('Error signing out:', error)
                throw error
            }
        }
    }

    /**
     * Google Drive Service
     */
    const googleDrive = {
        /**
         * Ensure we have a valid token for API requests
         */
        async ensureValidToken() {
            // Check if we have a token
            if (!accessToken.value) {
                // If we have a stored token, try to load it
                if (!checkStoredCredentials()) {
                    // No valid token, need to sign in
                    throw new Error('Authentication required. Please sign in to access Google Drive.')
                }
            }

            // Ensure token is set in client
            window.gapi.client.setToken({ access_token: accessToken.value })

            return accessToken.value as string
        },

        /**
         * List files in Google Drive
         */
        async listFiles(options = {}) {
            // Ensure we have a valid token
            await this.ensureValidToken()

            // Default options
            const defaultOptions = {
                pageSize: 100,
                query: "trashed=false",
                fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink, webContentLink, parents)'
            }

            const mergedOptions = { ...defaultOptions, ...options }

            try {
                const response = await window.gapi.client.drive.files.list({
                    'pageSize': mergedOptions.pageSize,
                    'fields': mergedOptions.fields,
                    'q': mergedOptions.query
                })

                return response.result.files || []
            } catch (error) {
                console.error('Error listing files:', error)

                // Check if it's an auth error
                if (error.status === 401) {
                    console.log('Authorization error, trying to refresh...')

                    // Clear token
                    accessToken.value = null
                    localStorage.removeItem('googleToken')
                    localStorage.removeItem('googleTokenExpiry')

                    // For development purposes, just tell the user to sign in again
                    throw new Error('Authentication expired. Please sign in again.')
                }

                throw error
            }
        },

        /**
         * Create folder in Google Drive
         */
        async createFolder(name: string, parentId: string | null = null) {
            // Ensure we have a valid token
            await this.ensureValidToken()

            const metadata: any = {
                name,
                mimeType: 'application/vnd.google-apps.folder'
            }

            if (parentId) {
                metadata.parents = [parentId]
            }

            try {
                const response = await window.gapi.client.drive.files.create({
                    resource: metadata,
                    fields: 'id, name, mimeType'
                })

                return response.result
            } catch (error) {
                console.error('Error creating folder:', error)
                throw error
            }
        },

        /**
         * Upload file to Google Drive
         */
        async uploadFile(file: File, options: any = {}) {
            // Ensure we have a valid token
            const token = await this.ensureValidToken()

            const metadata: any = {
                name: options.name || file.name,
                mimeType: options.mimeType || file.type
            }

            if (options.folderId) {
                metadata.parents = [options.folderId]
            }

            try {
                const form = new FormData()
                form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
                form.append('file', file)

                if (options.onProgress) {
                    options.onProgress(10)
                }

                const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: form
                })

                if (!response.ok) {
                    const errorText = await response.text()
                    console.error('Upload failed:', errorText)
                    throw new Error('Failed to upload file: ' + response.status)
                }

                if (options.onProgress) {
                    options.onProgress(100)
                }

                return await response.json()
            } catch (error) {
                console.error('Error uploading file:', error)
                throw error
            }
        },

        /**
         * Delete file from Google Drive
         */
        async deleteFile(fileId: string) {
            // Ensure we have a valid token
            await this.ensureValidToken()

            try {
                await window.gapi.client.drive.files.delete({
                    fileId
                })
            } catch (error) {
                console.error('Error deleting file:', error)
                throw error
            }
        }
    }

    // Provide services to the app
    return {
        provide: {
            initGoogleServices,
            googleAuth,
            googleDrive
        }
    }
})

// Add type declarations
declare global {
    interface Window {
        gapi: any
        google: any
        googleClientId: string
    }
}

/**
* Generate a random state parameter to prevent CSRF
*/
function generateRandomState() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}