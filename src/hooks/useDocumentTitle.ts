import { useEffect } from 'react';
import type { Task } from '../types/Task';

export function useDocumentTitle(tasks: Task[]) {
  useEffect(() => {
    // Update favicon
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!favicon) {
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.href = '/favicon.webp';
      document.head.appendChild(newFavicon);
    } else {
      favicon.href = '/favicon.webp';
    }

    // Update title based on visibility
    const updateTitle = () => {
      if (document.hidden) {
        const completedCount = tasks.filter(task => task.completed).length;
        document.title = `Today ${completedCount}/${tasks.length} completed`;
      } else {
        document.title = 'Plannerbuddy.app';
      }
    };

    // Initial title update
    updateTitle();

    // Add visibility change listener
    document.addEventListener('visibilitychange', updateTitle);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', updateTitle);
    };
  }, [tasks]);
} 