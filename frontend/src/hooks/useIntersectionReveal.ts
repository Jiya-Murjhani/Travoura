import { useEffect, useRef, useState } from 'react';

interface UseIntersectionRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useIntersectionReveal(options: UseIntersectionRevealOptions = {}) {
  const { threshold = 0.15, rootMargin = '0px', once = true } = options;
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
