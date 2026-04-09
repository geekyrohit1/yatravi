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

    // 2. Wrap initialization in a timeout to sync with sequential reveal
    const initTimeout = setTimeout(() => {
      const lenis = new Lenis({
        duration: 1.2,          
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,     
        infinite: false,
      });

      lenisRef.current = lenis;

      // Animation Loop
      let rafId: number;
      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
      
      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
      };
    }, 500); // 500ms delay gives the orchestration head-start

    return () => {
      clearTimeout(initTimeout);
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  return null; // This component doesn't render anything, just adds behavior
}
