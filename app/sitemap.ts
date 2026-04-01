import { MetadataRoute } from 'next';
import { API_BASE_URL } from '../constants';

export const dynamic = 'force-dynamic';

async function getPackages() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/packages`, { cache: 'no-store' });
        return await res.json();
    } catch (error) {
        return [];
    }
}

async function getDestinations() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/destinations`, { cache: 'no-store' });
        return await res.json();
    } catch (error) {
        return [];
    }
}

async function getCustomPages() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/pages`, { cache: 'no-store' });
        return await res.json();
    } catch (error) {
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yatravi.com';

    // Fetch dynamic data
    const [packages, destinations, customPages] = await Promise.all([
        getPackages(),
        getDestinations(),
        getCustomPages()
    ]);

    // 1. Static Routes (Manual control for SEO)
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${baseUrl}/destinations`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/domestic`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/international`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/join`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/support-center`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/web-check-in`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ];

    // 2. Package Routes
    const packageEntries = packages.map((pkg: any) => ({
        url: `${baseUrl}/packages/${pkg.slug}`,
        lastModified: new Date(pkg.updatedAt || new Date()),
        changeFrequency: pkg.seo?.sitemapFrequency || 'weekly',
        priority: pkg.seo?.sitemapPriority || 0.8,
    }));

    // 3. Destination Routes
    const destinationEntries = destinations.map((dest: any) => ({
        url: `${baseUrl}/destination/${dest.slug}`,
        lastModified: new Date(dest.updatedAt || new Date()),
        changeFrequency: dest.seo?.sitemapFrequency || 'monthly',
        priority: dest.seo?.sitemapPriority || 0.8,
    }));

    // 4. Custom Admin Pages (Excluding those that match static routes or admin)
    const excludedPages = ['admin', 'about', 'contact', 'privacy', 'terms'];
    const customPageEntries = customPages
        .filter((page: any) => !excludedPages.includes(page.slug))
        .map((page: any) => ({
            url: `${baseUrl}/${page.slug}`,
            lastModified: new Date(page.updatedAt || new Date()),
            changeFrequency: 'monthly',
            priority: 0.5,
        }));

    return [
        ...staticRoutes,
        ...packageEntries,
        ...destinationEntries,
        ...customPageEntries
    ];
}
