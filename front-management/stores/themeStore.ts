// stores/themeStore.ts
import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false,
    isTransitioning: false
  }),

  actions: {
    initTheme() {
      // Check if theme is set in localStorage
      const savedTheme = localStorage.getItem('theme');
      
      // If theme is saved, use it
      if (savedTheme) {
        this.isDark = savedTheme === 'dark';
        this.applyTheme(false); // Don't animate initial theme
        return;
      }
      
      // If no saved preference, use system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.isDark = true;
      } else {
        this.isDark = false;
      }
      
      // Apply theme without animation
      this.applyTheme(false);
    },
    
    toggleTheme() {
      this.isDark = !this.isDark;
      this.applyTheme(true); // Animate theme change
      
      // Save theme preference
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    },
    
    applyTheme(animate = true) {
      // Apply theme to document with animation if requested
      if (animate) {
        // Add transitioning class for animation
        document.documentElement.classList.add('transitioning');
        this.isTransitioning = true;
        
        // Set timeout to remove the transitioning class after animation completes
        setTimeout(() => {
          document.documentElement.classList.remove('transitioning');
          this.isTransitioning = false;
        }, 300); // Match CSS transition duration
      }
      
      // Apply dark mode class
      if (this.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
});