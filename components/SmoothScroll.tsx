"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
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
 * Optimized for Smart Navigation: Resets scroll for all pages EXCEPT Home.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Initialize Lenis
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
    lenisRef.current = lenis;

    // Add lenis class to HTML for CSS sync
    document.documentElement.classList.add('lenis', 'lenis-smooth');

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    const handleResize = () => lenis.resize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
      window.removeEventListener('resize', handleResize);
      window.ytvLenis = null;
      lenis.destroy();
    };
  }, []);

  // 2. Handle Smart Navigation & Jitter Fix
  useEffect(() => {
    if (window.ytvLenis) {
      // Small timeout to ensure Next.js transitions are underway
      setTimeout(() => {
        window.ytvLenis?.resize();
        
        // ONLY reset scroll if we are NOT on the homepage
        // This keeps the user's scroll position intact when returning to Home
        if (pathname !== "/" && pathname !== "") {
          window.ytvLenis?.scrollTo(0, { immediate: true });
        }
      }, 50);
    }
  }, [pathname]);

  return null;
}
