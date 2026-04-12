import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for Yatravi Security Hardening
 * ----------------------------------------
 * 1. Protects /admin routes from unauthenticated access.
 * 2. Informs crawlers to ignore sensitive paths via X-Robots-Tag.
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const response = NextResponse.next();

    // Normalize path to handle trailing slashes
    const path = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

    // 1. Technical Files & SEO Protection
    const SENSITIVE_PATHS = [
        '/package.json',
        '/tsconfig.json',
        '/next.config.mjs',
        '/README.md',
        '/yatravi.conf',
        '/yatravi_nginx.conf',
        '/yatravi_ssl.conf',
        '/.env',
        '/.env.local',
        '/.git',
        '/.vscode'
    ];

    // Block highly sensitive files immediately
    if (SENSITIVE_PATHS.some(p => path.startsWith(p))) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Add X-Robots-Tag to technical paths (Admin and API only)
    if (path.startsWith('/admin') || path.startsWith('/api')) {
        response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    }

    // 3. Admin Access Control
    if (path === '/admin' || path.startsWith('/admin/')) {
        // Exempt login and forgot-password paths
        const isAuthPage = path === '/admin/login' || path === '/admin/forgot-password';

        if (!isAuthPage) {
            const adminToken = request.cookies.get('admin_token')?.value;

            // Strict Gatekeeper: If no token, redirect to login
            if (!adminToken) {
                const loginUrl = new URL('/admin/login', request.url);
                return NextResponse.redirect(loginUrl);
            }
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/admin',
        '/admin/:path*',
        '/api/:path*',
        '/package.json',
        '/:path*.(json|conf|md|mjs|env)' // Catch-all for common technical extensions
    ],
};
