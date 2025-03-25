// nuxt.config.ts
export default defineNuxtConfig({
  // pages: false,
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  build: {
    transpile: ['vue3-apexcharts','date-fns']
  },

  plugins: [
    { src: '~/plugins/apexcharts.js', mode: 'client' }
  ],

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3001/api',
      googleApiKey: process.env.GOOGLE_API_KEY,
      googleClientId: process.env.GOOGLE_CLIENT_ID
    }
  },

  app: {
    head: {
      title: 'Project Management',
      meta: [
        { name: 'description', content: 'Modern Project Management application' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },

  // Add global middleware for authentication
  routeRules: {
    '/': { middleware: ['auth'] },
    '/projects/**': {  },
    '/teams/**': { middleware: ['auth'] },
    '/tasks/**': { middleware: ['auth'] },
    '/profile/**': { middleware: ['auth'] },
    headers: {
      // More permissive CSP for development - restrict further in production
      'Content-Security-Policy': 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' https: data:; " +
        "connect-src 'self' https://accounts.google.com https://*.googleapis.com; " +
        "frame-src https://accounts.google.com;"
    }
  },

  // Add proxy configuration
  nitro: {
    devProxy: {
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true, // Enable WebSocket proxying
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:3001/api',
        changeOrigin: true,
        prependPath: false
      }
    }
  },

  compatibilityDate: '2025-03-08'
})