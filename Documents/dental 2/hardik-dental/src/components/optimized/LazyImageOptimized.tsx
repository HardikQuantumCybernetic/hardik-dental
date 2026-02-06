import React, { useState, useCallback } from 'react';
import { createIntersectionObserver } from '@/utils/performance';

interface LazyImageOptimizedProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  width?: number;
  height?: number;
}

const LazyImageOptimized: React.FC<LazyImageOptimizedProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjNmNGY2Ii8+CjwvcmVnPgo=',
  width,
  height
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);

  const imgRef = useCallback((node: HTMLImageElement | null) => {
    if (!node) return;

    const observer = createIntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (observer) {
      observer.observe(node);
    }
  }, []);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  return (
    <img
      ref={imgRef}
      src={inView ? src : placeholder}
      alt={alt}
      className={`transition-opacity duration-300 ${
        loaded ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      style={{
        filter: loaded ? 'none' : 'blur(5px)',
        backgroundColor: error ? '#f3f4f6' : 'transparent'
      }}
    />
  );
};

export default LazyImageOptimized;