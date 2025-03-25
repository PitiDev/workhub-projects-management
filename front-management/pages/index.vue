<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
    <!-- Header with Glassmorphism -->
    <header class="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex-shrink-0">
            <span class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">PM System</span>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/login" class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
              Sign In
            </NuxtLink>
            <NuxtLink 
              to="/register" 
              class="px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <main class="flex-1 flex items-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div class="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          <!-- Text Content -->
          <div class="lg:col-span-6 lg:pr-8">
            <div class="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-3 tracking-wide uppercase">Project Management Simplified</div>
            <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              <span class="block">Modern Project</span>
              <span class="block bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Management Platform</span>
            </h1>
            <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Streamline your workflow, collaborate with your team, and deliver projects on time with our comprehensive and intuitive project management solution.
            </p>
            
            <!-- Feature List -->
            <div class="mt-8 space-y-4">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p class="ml-3 text-base text-gray-600 dark:text-gray-300">Real-time collaboration with your team</p>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p class="ml-3 text-base text-gray-600 dark:text-gray-300">Intuitive task tracking and management</p>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p class="ml-3 text-base text-gray-600 dark:text-gray-300">Comprehensive analytics and reporting</p>
              </div>
            </div>
            
            <!-- CTA Buttons -->
            <div class="mt-10 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <NuxtLink 
                to="/register" 
                class="px-6 py-3 rounded-lg shadow-md text-center text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Get Started for Free
              </NuxtLink>
              <NuxtLink 
                to="/login" 
                class="px-6 py-3 rounded-lg shadow-md text-center text-base font-medium text-indigo-700 dark:text-indigo-300 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 border border-indigo-200 dark:border-gray-600 transition-colors duration-200"
              >
                Sign In to Dashboard
              </NuxtLink>
            </div>
          </div>
          
          <!-- Image Content with Floating Elements -->
          <div class="mt-12 lg:mt-0 lg:col-span-6 relative">
            <div class="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                class="w-full h-auto object-cover" 
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Project management dashboard" 
              />
              
              <!-- Decorative elements -->
              <div class="absolute -top-4 -right-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl"></div>
              <div class="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
            </div>
            
            <!-- Floating Card -->
            <div class="absolute -bottom-6 -right-6 md:bottom-12 md:right-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-48 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div class="flex items-center mb-2">
                <div class="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                <span class="text-sm font-medium text-gray-800 dark:text-white">Project Timeline</span>
              </div>
              <div class="space-y-2">
                <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div class="h-full bg-indigo-500 rounded-full" style="width: 75%"></div>
                </div>
                <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div class="h-full bg-purple-500 rounded-full" style="width: 60%"></div>
                </div>
                <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div class="h-full bg-indigo-500 rounded-full" style="width: 85%"></div>
                </div>
              </div>
            </div>
            
            <!-- Floating Badge -->
            <div class="absolute -top-4 -left-4 md:top-12 md:left-12 bg-white dark:bg-gray-800 rounded-full shadow-lg px-4 py-2 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
              <div class="flex items-center">
                <svg class="h-5 w-5 text-yellow-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="text-sm font-medium text-gray-800 dark:text-white">4.9 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {{ new Date().getFullYear() }} PM System. All rights reserved.
        </p>
        <div class="mt-4 md:mt-0 flex space-x-6">
          <a href="#" class="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
            <span class="sr-only">Privacy Policy</span>
            Privacy Policy
          </a>
          <a href="#" class="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
            <span class="sr-only">Terms of Service</span>
            Terms of Service
          </a>
          <a href="#" class="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
            <span class="sr-only">Contact Us</span>
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// No setup required for this landing page
</script>

<style scoped>
/* Adding custom animations */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}
</style>