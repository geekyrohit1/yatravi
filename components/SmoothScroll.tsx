"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    ytvLenis: Lenis | null;
  }
}

/**
 * Premium Smooth Scroll Component (Lenis)
 * --------------------------------------
 * Provides a luxury kinetic scrolling feel for all users.
 */
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const initTimeout = setTimeout(() => {
      const lenis = new Lenis({
        duration: 1.2,          
        lerp: 0.1,              
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,     
        touchMultiplier: 1.5,   
        infinite: false,
      });

      window.ytvLenis = lenis;

      // Add lenis class to HTML for CSS sync
      document.documentElement.classList.add('lenis', 'lenis-smooth');

      let rafId: number;
      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);

      // Simple click-to-scroll protection
      const handleResize = () => lenis.resize();
      window.addEventListener('resize', handleResize);
      
      return () => {
        cancelAnimationFrame(rafId);
        document.documentElement.classList.remove('lenis', 'lenis-smooth');
        window.removeEventListener('resize', handleResize);
        window.ytvLenis = null;
        lenis.destroy();
      };
    }, 100); // Minimal delay

    return () => {
      clearTimeout(initTimeout);
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  return null; // This component doesn't render anything, just adds behavior
}
