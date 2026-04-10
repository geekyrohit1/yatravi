import Lenis from 'lenis';

/**
 * Smart Scroll Utility for Yatravi
 * --------------------------------
 * Harmonizes programmatic scrolling by prioritizing the ytvLenis kinetic engine.
 * Falls back to native smooth scrolling if the engine is not initialized.
 */
export const smartScrollTo = (
  target: string | HTMLElement | number,
  options: { offset?: number; duration?: number } = {}
) => {
  if (typeof window !== 'undefined' && window.ytvLenis) {
    window.ytvLenis.scrollTo(target, {
      offset: options.offset || 0,
      duration: options.duration || 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
  } else if (typeof window !== 'undefined') {
    // Fallback for native scrolling
    if (typeof target === 'number') {
      window.scrollTo({
        top: target,
        behavior: 'smooth'
      });
    } else {
      const element = typeof target === 'string' ? document.querySelector(target) : target;
      if (element instanceof HTMLElement) {
        const offset = options.offset || 0;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition + offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }
};
