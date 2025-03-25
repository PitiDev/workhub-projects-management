<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-6 lg:p-8">
    <div class="w-full max-w-md">
      <!-- Card Container -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <!-- Card Header with Gradient -->
        <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6 text-white">
          <h2 class="text-3xl font-bold">Welcome Back</h2>
          <p class="mt-2 text-indigo-100">Sign in to your account to continue</p>
        </div>
        
        <!-- Card Body -->
        <div class="p-8">
          <!-- Alert for errors -->
          <div v-if="error" class="mb-6 rounded-lg bg-red-50 dark:bg-red-900/30 p-4 animate-fadeIn">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400 dark:text-red-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                  {{ error }}
                </h3>
              </div>
            </div>
          </div>
          
          <form class="space-y-6" @submit.prevent="handleLogin">
            <!-- Email Field -->
            <div>
              <label for="email-address" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input 
                  id="email-address" 
                  v-model="formData.email" 
                  name="email" 
                  type="email" 
                  autocomplete="email" 
                  required 
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="you@example.com"
                  :disabled="loading"
                />
              </div>
            </div>
            
            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input 
                  id="password" 
                  v-model="formData.password" 
                  name="password" 
                  type="password" 
                  autocomplete="current-password" 
                  required 
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="••••••••"
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Remember me and Forgot password -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input 
                  id="remember-me" 
                  v-model="rememberMe"
                  name="remember-me" 
                  type="checkbox" 
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                  :disabled="loading"
                />
                <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div class="text-sm">
                <NuxtLink to="/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition">
                  Forgot password?
                </NuxtLink>
              </div>
            </div>

            <!-- Submit Button -->
            <div>
              <button 
                type="submit" 
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                :disabled="loading"
              >
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loading ? 'Signing in...' : 'Sign in' }}
              </button>
            </div>
          </form>
          
          <!-- Create Account Link -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?
              <NuxtLink to="/register" class="ml-1 font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition">
                Create one now
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        By signing in, you agree to our
        <a href="#" class="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">Terms of Service</a>
        and
        <a href="#" class="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">Privacy Policy</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { authAPI } from '~/services/api';
const router = useRouter();


// State
const formData = ref({
  email: 'piti@example.com',
  password: '11111111'
});
const rememberMe = ref(false);
const loading = ref(false);
const error = ref('');

// Handle login
const handleLogin = async () => {
  try {
    error.value = '';
    loading.value = true;
    
    // Call login API using our service
    const response = await authAPI.login(formData.value.email, formData.value.password);
    
    // Get token and user from response
    const { token, user } = response.data.data;
    
    // Store token in localStorage or sessionStorage based on rememberMe
    if (rememberMe.value) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
    
    // Store user data
    localStorage.setItem('user', JSON.stringify(user));
    
    // Redirect to dashboard
    router.push('/dashboard');
  } catch (err: any) {
    // Handle API errors
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      error.value = err.response.data.error || 'Invalid email or password';
    } else if (err.request) {
      // The request was made but no response was received
      error.value = 'No response from server. Please try again later.';
    } else {
      // Something happened in setting up the request that triggered an Error
      error.value = 'An error occurred. Please try again.';
    }
    console.error('Login error:', err);
  } finally {
    loading.value = false;
  }
};

// Check if user is already logged in
onMounted(() => {
  // const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  // if (token) {
  //   // Redirect to dashboard if already logged in
  //   navigateTo('/dashboard');
  // }
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>