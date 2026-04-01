import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="text-center max-w-md">
                <h1 className="text-7xl font-bold text-gray-200 mb-4">404</h1>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Page Not Found</h2>
                <p className="text-gray-500 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
