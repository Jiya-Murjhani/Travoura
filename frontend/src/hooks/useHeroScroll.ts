import { useEffect, useState, useCallback } from 'react';

interface HeroScrollState {
  scrollProgress: number;  // 0 to 1, clamped
  imageScale: number;       // 1.04 to 1.18
  panelBOpacity: number;    // 1 to 0
  panelBTranslateX: number; // 0 to -24
  overlayOpacity: number;   // 0.25 to 0.65
}

export function useHeroScroll(maxScroll: number = 400): HeroScrollState {
  const [state, setState] = useState<HeroScrollState>({
    scrollProgress: 0,
    imageScale: 1.04,
    panelBOpacity: 1,
    panelBTranslateX: 0,
    overlayOpacity: 0.25,
  });

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const progress = Math.min(scrollY / maxScroll, 1);

    setState({
      scrollProgress: progress,
      imageScale: 1.04 + progress * 0.14,
      panelBOpacity: Math.max(1 - progress * 1.5, 0),
      panelBTranslateX: -progress * 24,
      overlayOpacity: 0.25 + progress * 0.4,
    });
  }, [maxScroll]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return state;
}
