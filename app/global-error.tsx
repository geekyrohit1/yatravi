'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('CRITICAL GLOBAL ERROR:', error);
    }, [error]);

    return (
        <html lang="en">
            <body className="bg-white min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-light/10 text-brand">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Systems recovering...</h1>
                    <p className="text-gray-500 mb-8 text-sm">
                        Yatravi has encountered a temporary technical glitch. We are automatically attempting to restore your session.
                    </p>
                    <button
                        onClick={() => reset()}
                        className="px-8 py-3 bg-brand text-white rounded-xl font-semibold shadow-lg shadow-brand/20 hover:bg-brand-dark transition-all active:scale-95"
                    >
                        Refresh Website
                    </button>
                    <p className="mt-6 text-[10px] text-gray-400 uppercase tracking-widest">Error ID: {error.digest || 'ROOT_CRASH'}</p>
                </div>
            </body>
        </html>
    );
}
