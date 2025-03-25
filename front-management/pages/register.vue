<template>
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div class="w-full max-w-md">
        <!-- Card Container -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <!-- Card Header with Gradient -->
          <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6 text-white">
            <h2 class="text-3xl font-bold">Create Account</h2>
            <p class="mt-2 text-indigo-100">Join us and start managing your projects</p>
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
            
            <!-- Success alert -->
            <div v-if="success" class="mb-6 rounded-lg bg-green-50 dark:bg-green-900/30 p-4 animate-fadeIn">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
                    Registration successful! You can now 
                    <NuxtLink to="/login" class="underline font-semibold">sign in</NuxtLink>.
                  </h3>
                </div>
              </div>
            </div>
            
            <form v-if="!success" class="space-y-5" @submit.prevent="handleRegister">
              <!-- Name Fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- First Name Field -->
                <div>
                  <label for="first-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name
                  </label>
                  <div class="relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <input 
                      id="first-name" 
                      v-model="formData.first_name" 
                      name="first_name" 
                      type="text" 
                      required 
                      class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="John"
                      :disabled="loading"
                    />
                  </div>
                </div>
                
                <!-- Last Name Field -->
                <div>
                  <label for="last-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name
                  </label>
                  <div class="relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <input 
                      id="last-name" 
                      v-model="formData.last_name" 
                      name="last_name" 
                      type="text" 
                      required 
                      class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Doe"
                      :disabled="loading"
                    />
                  </div>
                </div>
              </div>
              
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
                    class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
                    autocomplete="new-password" 
                    required 
                    class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="••••••••"
                    :disabled="loading"
                  />
                </div>
              </div>
              
              <!-- Confirm Password Field -->
              <div>
                <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div class="relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <input 
                    id="confirm-password" 
                    v-model="formData.confirm_password" 
                    name="confirm_password" 
                    type="password" 
                    autocomplete="new-password" 
                    required 
                    class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="••••••••"
                    :disabled="loading"
                  />
                </div>
              </div>
              
              <!-- Terms and Conditions -->
              <div class="flex items-start mt-6">
                <div class="flex items-center h-5">
                  <input 
                    id="terms" 
                    v-model="acceptTerms" 
                    name="terms" 
                    type="checkbox" 
                    required 
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                    :disabled="loading"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="terms" class="font-medium text-gray-700 dark:text-gray-300">
                    I agree to the 
                    <a href="#" class="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                      Terms and Conditions
                    </a>
                    and 
                    <a href="#" class="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>
  
              <!-- Submit Button -->
              <div class="pt-2">
                <button 
                  type="submit" 
                  class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  :disabled="loading || !isFormValid"
                >
                  <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ loading ? 'Creating Account...' : 'Create Account' }}
                </button>
              </div>
            </form>
            
            <!-- Sign In Link -->
            <div class="mt-6 text-center" v-if="!success">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?
                <NuxtLink to="/login" class="ml-1 font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition">
                  Sign in
                </NuxtLink>
              </p>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          By creating an account, you agree to our
          <a href="#" class="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">Terms of Service</a>
          and
          <a href="#" class="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">Privacy Policy</a>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
  </style>

<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from 'axios';

// Form state
const formData = ref({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: ''
});
const acceptTerms = ref(false);
const loading = ref(false);
const error = ref('');
const success = ref(false);

// Form validation
const isFormValid = computed(() => {
    return (
        formData.value.first_name.trim() !== '' &&
        formData.value.last_name.trim() !== '' &&
        isValidEmail(formData.value.email) &&
        isValidPassword(formData.value.password) &&
        formData.value.password === formData.value.confirm_password &&
        acceptTerms.value
    );
});

// Validate email format
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate password (at least 8 characters)
const isValidPassword = (password: string): boolean => {
    return password.length >= 8;
};

// Handle registration
const handleRegister = async () => {
    // Validate form
    if (!isFormValid.value) {
        if (!isValidEmail(formData.value.email)) {
            error.value = 'Please enter a valid email address';
        } else if (!isValidPassword(formData.value.password)) {
            error.value = 'Password must be at least 8 characters long';
        } else if (formData.value.password !== formData.value.confirm_password) {
            error.value = 'Passwords do not match';
        } else {
            error.value = 'Please fill in all required fields';
        }
        return;
    }

    try {
        error.value = '';
        loading.value = true;

        // Call register API
        await axios.post('http://localhost:3001/api/auth/register', {
            first_name: formData.value.first_name,
            last_name: formData.value.last_name,
            email: formData.value.email,
            password: formData.value.password
        });

        // Show success message
        success.value = true;

        // Reset form
        formData.value = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirm_password: ''
        };
        acceptTerms.value = false;
    } catch (err: any) {
        // Handle API errors
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            error.value = err.response.data.error || 'Registration failed';
        } else if (err.request) {
            // The request was made but no response was received
            error.value = 'No response from server. Please try again later.';
        } else {
            // Something happened in setting up the request that triggered an Error
            error.value = 'An error occurred. Please try again.';
        }
        console.error('Registration error:', err);
    } finally {
        loading.value = false;
    }
};

// Check if user is already logged in
onMounted(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
        // Redirect to dashboard if already logged in
        navigateTo('/dashboard');
    }
});
</script>