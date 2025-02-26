import { useEffect } from 'react';

/**
 * Hook that listens for a global keyboard shortcut (⌘+K or Ctrl+K)
 * and triggers the provided callback when detected.
 *
 * @param callback Function to execute when the shortcut is triggered
 */
export function useCommandTriggerEvent(
  callback: () => void
): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for ⌘+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback]);
}
