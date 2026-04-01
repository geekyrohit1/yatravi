'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="text-center max-w-md">
                <h1 className="text-7xl font-bold text-gray-200 mb-4">500</h1>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Something went wrong</h2>
                <p className="text-gray-500 mb-8">
                    An unexpected error occurred. Please try again.
                </p>
                <button
                    onClick={() => reset()}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
