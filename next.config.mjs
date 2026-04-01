/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
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

    experimental: {
        serverActions: {
            bodySizeLimit: '200mb',
        },
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
