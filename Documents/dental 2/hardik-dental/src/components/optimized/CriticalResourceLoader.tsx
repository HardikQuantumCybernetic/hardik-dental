import { useEffect } from 'react';

const CriticalResourceLoader = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalResources = [
        { href: '/love.png', as: 'image' },
        { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', as: 'style' }
      ];

      criticalResources.forEach(({ href, as }) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        if (as === 'style') {
          link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
      });
    };

    // DNS prefetch for external domains
    const prefetchDomains = () => {
      const domains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://mmsmljkeedqfrbgsqipf.supabase.co'
      ];

      domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    // Optimize script loading
    const optimizeScripts = () => {
      const scripts = document.querySelectorAll('script[data-defer]');
      scripts.forEach(script => {
        if (script instanceof HTMLScriptElement) {
          script.defer = true;
        }
      });
    };

    // Run optimizations
    preloadCriticalResources();
    prefetchDomains();
    
    // Defer non-critical optimizations
    requestIdleCallback(() => {
      optimizeScripts();
    });
  }, []);

  return null;
};

export default CriticalResourceLoader;