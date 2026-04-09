import React, { useEffect, useRef, useState } from 'react';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fallback: If for any reason the observer doesn't fire, show the content after a short timeout
        // This prevents content from staying "Ghosted" and killing the performance score.
        const failsafe = setTimeout(() => setIsVisible(true), 100);

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    clearTimeout(failsafe);
                }
            });
        }, { threshold: 0.01, rootMargin: '20px' });

        const currentRef = domRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            clearTimeout(failsafe);
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div
            ref={domRef}
            className={`${className} transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ 
                transitionDelay: `${delay}ms`,
                willChange: 'opacity, transform'
            }}
        >
            {children}
        </div>
    );
};
