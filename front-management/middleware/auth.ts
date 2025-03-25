// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  // Only run on client-side
  if (!process.client) return;

  // Skip auth check for auth-related paths
  const publicPaths = ['/login', '/register', '/forgot-password'];
  if (publicPaths.includes(to.path)) return;

  // Add debug logging
  console.log('Auth middleware checking token for path:', to.path);

  // Check for token
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  // Log result for debugging
  console.log('Token exists:', !!token);

  // Redirect if no token found
  if (!token) {
    console.log('No token found, redirecting to login');
    //return navigateTo('/login');
  }
});