"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Premium Smooth Scroll Component (Lenis)
 * --------------------------------------
 * Provides a luxury kinetic scrolling feel for Desktop users.
 * Strictly disabled on mobile ( < 1024px ) to preserve native feel.
 */
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Check if device is desktop
    const isMobile = window.innerWidth < 1024;
    if (isMobile) return;

    // 2. Initialize Lenis (Only for Desktop)
    const lenis = new Lenis({
      duration: 1.0,          // Reduced from 1.2 to 1.0 for faster response
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,     // Increased from 0.9 for more distance per scroll
      touchMultiplier: 1.5,     
      infinite: false,
    });

    lenisRef.current = lenis;

    // 3. Animation Loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 4. Cleanup on unmount
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null; // This component doesn't render anything, just adds behavior
}
