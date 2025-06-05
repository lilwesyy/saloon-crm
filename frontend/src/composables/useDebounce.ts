/**
 * A simple debounce function to delay execution
 * @param fn The function to debounce
 * @param delay The delay in milliseconds
 * @returns A debounced function
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T, 
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timeout: number | undefined;
  
  return function(...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
