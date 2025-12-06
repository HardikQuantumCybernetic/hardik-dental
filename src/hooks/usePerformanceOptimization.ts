import { useEffect, useCallback } from 'react';
import { debounce, throttle } from '@/utils/performance';

// Preload critical resources
export const usePreloadCriticalResources = () => {
  useEffect(() => {
    // Preload critical images
    const criticalImages = [
      '/love.png', // Logo
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = src;
      link.as = 'image';
      document.head.appendChild(link);
    });

    // Preload critical fonts
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ];

    criticalFonts.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = 'style';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }, []);
};

// Optimize scroll performance
export const useOptimizedScroll = (callback: () => void, delay = 16) => {
  return useCallback(
    throttle(callback, delay),
    [callback, delay]
  );
};

// Optimize search/input performance
export const useOptimizedSearch = (callback: (query: string) => void, delay = 300) => {
  return useCallback(
    debounce(callback, delay),
    [callback, delay]
  );
};

// Resource hints for better performance
export const useResourceHints = () => {
  useEffect(() => {
    // DNS prefetch for external resources
    const domains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }, []);
};

// Critical CSS optimization
export const useInlineCriticalCSS = () => {
  useEffect(() => {
    // Move non-critical CSS to load after paint
    const styleSheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
    
    styleSheets.forEach(sheet => {
      if (sheet instanceof HTMLLinkElement) {
        const newSheet = sheet.cloneNode(true) as HTMLLinkElement;
        newSheet.media = 'print';
        newSheet.onload = () => {
          newSheet.media = 'all';
        };
        sheet.parentNode?.insertBefore(newSheet, sheet.nextSibling);
      }
    });
  }, []);
};