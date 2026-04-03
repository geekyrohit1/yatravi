/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ['image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ik.imagekit.io',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'plus.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'www.travelcenter.uk',
            },
            {
                protocol: 'https',
                hostname: 'dynamic-media-cdn.tripadvisor.com',
            },
            {
                protocol: 'https',
                hostname: 'images.pickyourtrail.com',
            },
        ],
    },

    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '200mb',
        },
    },
    async redirects() {
        return [
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'www.yatravi.com' }],
                destination: 'https://yatravi.com/:path*',
                permanent: true,
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.BACKEND_API_URL || 'http://localhost:5000'}/api/:path*`,
            },
        ];
    },
};

export default nextConfig;
