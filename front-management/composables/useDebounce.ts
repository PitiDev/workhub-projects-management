// composables/useDebounce.ts
import { ref, watch } from 'vue';

/**
 * Creates a debounced version of a ref
 * @param value - The ref to debounce
 * @param delay - Delay in milliseconds
 * @returns A new ref that updates after the specified delay
 */
export function useDebounce<T>(value: any, delay = 300) {
  const debouncedValue = ref<T>(value.value);
  let timeout: ReturnType<typeof setTimeout> | null = null;

  watch(value, (newValue: T) => {
    // Clear previous timeout
    if (timeout) {
      clearTimeout(timeout);
    }

    // Set new timeout
    timeout = setTimeout(() => {
      debouncedValue.value = newValue;
    }, delay);
  });

  return debouncedValue;
}