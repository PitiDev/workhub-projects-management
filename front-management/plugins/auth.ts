// plugins/auth.ts
export default defineNuxtPlugin(async (nuxtApp) => {
    // Initialize auth state from localStorage on client-side
    if (process.client) {
      const { initAuth } = useAuth();
      await initAuth();
    }
  });