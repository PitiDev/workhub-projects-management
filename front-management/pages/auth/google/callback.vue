<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full text-center">
            <div v-if="loading">
                <div
                    class="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 dark:border-gray-100 mx-auto">
                </div>
                <p class="mt-4 text-gray-700 dark:text-gray-300">Processing authentication...</p>
            </div>

            <div v-else-if="error" class="text-red-500">
                <svg class="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h2 class="text-xl font-semibold mt-4">Authentication Error</h2>
                <p class="mt-2">{{ error }}</p>
                <button @click="goBack" class="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Try Again
                </button>
            </div>

            <div v-else class="text-green-500">
                <svg class="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <h2 class="text-xl font-semibold mt-4 text-gray-900 dark:text-white">Authentication Successful</h2>
                <p class="mt-2 text-gray-600 dark:text-gray-400">You're now signed in with Google.</p>
                <button @click="goBack" class="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Continue
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const error = ref(null)
const success = ref(false)

// Get Nuxt services
const { $initGoogleServices, $googleAuth } = useNuxtApp()

// Function to navigate back to the original page
const goBack = () => {
    try {
        const returnUrl = localStorage.getItem('googleAuthReturnTo') || '/'

        // Check if it's a full URL or just a path
        if (returnUrl.startsWith('http')) {
            // Parse the URL
            const urlObj = new URL(returnUrl)

            // Check if it's the same origin/domain
            if (urlObj.origin === window.location.origin) {
                // Use just the path+query+hash for internal navigation
                navigateTo(urlObj.pathname + urlObj.search + urlObj.hash)
            } else {
                // External URL - use explicit option
               // navigateTo(returnUrl, { external: true })
               window.location.href = returnUrl
            }
        } else {
            // Already a relative path
            navigateTo(returnUrl)
        }
    } catch (e) {
        console.error('Navigation error:', e)
        // Fallback to home page
        navigateTo('/')
    }
}

onMounted(async () => {
    try {
        console.log('Processing Google auth callback...')

        // Get the hash fragment from the URL
        const hash = window.location.hash.substring(1) // Remove the leading #

        if (!hash) {
            loading.value = false
            error.value = 'No authentication data received. Please try again.'
            return
        }

        // Parse parameters from the hash
        const params = new URLSearchParams(hash)
        const accessToken = params.get('access_token')
        const expiresIn = params.get('expires_in')
        const tokenType = params.get('token_type')
        const errorParam = params.get('error')

        if (errorParam) {
            loading.value = false
            error.value = `Authentication failed: ${errorParam}`
            return
        }

        if (!accessToken) {
            loading.value = false
            error.value = 'No access token received. Please try again.'
            return
        }

        console.log('Access token received:', !!accessToken)

        // Initialize Google services
        await $initGoogleServices()

        // Store token in localStorage
        localStorage.setItem('googleToken', accessToken)
        localStorage.setItem('googleTokenExpiry', Date.now() + (parseInt(expiresIn) * 1000 || 3600 * 1000))

        // Set token in gapi client
        window.gapi.client.setToken({ access_token: accessToken })

        // Fetch user profile with the token
        try {
            const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch user profile')
            }

            const userData = await response.json()

            // Store user data
            const user = {
                email: userData.email,
                name: userData.name,
                picture: userData.picture,
                sub: userData.id || userData.sub
            }


            localStorage.setItem('googleUser', JSON.stringify(user))
        } catch (profileError) {
            console.error('Error fetching user profile:', profileError)
            // Continue anyway - we at least have the token
        }

        // Clear the hash from the URL to avoid the token being visible
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search)

        loading.value = false
        success.value = true
    } catch (err) {
        console.error('Error processing callback:', err)
        loading.value = false
        error.value = err.message || 'An error occurred during authentication'
    }
})
</script>