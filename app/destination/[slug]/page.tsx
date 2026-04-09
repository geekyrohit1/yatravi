import { Metadata } from 'next';
import { API_BASE_URL } from '../../../constants';
import { getGlobalSettings } from '@/lib/api';
import DestinationClient from './DestinationClient';
import SEOQuickLinks from '@/components/SEOQuickLinks';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getDestination(slug: string) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/destinations`, {
            next: { revalidate: 60 }
        });
        const allDestinations = await res.json();

        const normalize = (s: string) => s?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
        const searchSlug = normalize(slug);

        // 1. Try exact slug match
        const exactSlugMatch = allDestinations.find((d: any) => normalize(d.slug) === searchSlug);
        if (exactSlugMatch) return exactSlugMatch;

        // 2. Try exact name match
        const exactNameMatch = allDestinations.find((d: any) => normalize(d.name) === searchSlug);
        if (exactNameMatch) return exactNameMatch;

        // 3. Fallback to fuzzy matching
        const fuzzyMatch = allDestinations.find((d: any) =>
            normalize(d.name).includes(searchSlug) ||
            searchSlug.includes(normalize(d.name))
        );
        return fuzzyMatch;
    } catch (error) {
        console.error('Failed to fetch destination:', error);
        return null;
    }
}

async function getPackages() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/packages`, { next: { revalidate: 60 } });
        return await res.json();
    } catch (error) {
        return [];
    }
}

async function getHomepageConfig() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/homepage`, { next: { revalidate: 60 } });
        return await res.json();
    } catch (error) {
        console.error('Failed to fetch homepage config:', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    
    // Parallel fetch for destination and global settings
    const [dest, settings] = await Promise.all([
        getDestination(slug),
        getGlobalSettings()
    ]);
    
    const globalSeo = settings?.globalSeo || {};

    if (!dest) {
        return {
            title: 'Destination Not Found',
        };
    }

    const defaultOgImage = globalSeo.defaultOgImage || '/og-image.png';
    const siteKeywords = globalSeo.defaultKeywords || '';

    return {
        title: dest.seo?.title || `${dest.name} Tour Packages`,
        description: dest.seo?.description || dest.description || `Explore top tour packages for ${dest.name}.`,
        keywords: dest.seo?.keywords 
            ? dest.seo.keywords.split(',').map((k: string) => k.trim())
            : siteKeywords.split(',').map((k: string) => k.trim()),
        alternates: {
            canonical: dest.seo?.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL || ''}/destination/${dest.slug}`,
        },
        openGraph: {
            title: dest.seo?.ogTitle || dest.seo?.title || `${dest.name} Tour Packages`,
            description: dest.seo?.ogDescription || dest.seo?.description || dest.description,
            images: [dest.seo?.ogImage || dest.heroImage || defaultOgImage],
            type: 'website',
            siteName: globalSeo.siteName || 'Yatravi'
        },
        twitter: {
            card: 'summary_large_image',
            title: dest.seo?.twitterTitle || dest.seo?.title || `${dest.name} Tour Packages`,
            description: dest.seo?.twitterDescription || dest.seo?.description || dest.description,
            images: [dest.seo?.twitterImage || dest.seo?.ogImage || dest.heroImage || defaultOgImage],
            creator: globalSeo.twitterHandle || '@yatravi'
        },
        robots: {
            index: dest.seo?.robots?.includes('index'),
            follow: dest.seo?.robots?.includes('follow'),
        }
    };
}

// Helper to filter packages (similar to client-side logic)
const filterPackages = (allPackages: any[], destName: string, searchSlug: string) => {
    const normalize = (str: string) => str?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
    const normName = normalize(destName?.split(',')[0] || '');
    const normSlug = normalize(searchSlug);

    return allPackages.filter((pkg: any) => {
        const loc = normalize(pkg.location || '');
        const title = normalize(pkg.title || '');

        if (normSlug === 'europe') {
            return ['switzerland', 'france', 'italy', 'spain', 'netherlands', 'germany', 'austria', 'uk', 'greece'].some(country => loc.includes(country));
        }
        return loc.includes(normSlug) || title.includes(normSlug) || (normName && loc.includes(normName)) || (normSlug.includes(loc) && loc.length > 3);
    });
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const dest = await getDestination(slug);
    const allPackages = await getPackages();
    const config = await getHomepageConfig();
    const { slug: searchSlug } = await params;

    if (!dest) {
        redirect('/');
    }

    // Filter packages server-side if destination is found
    const filteredPackages = filterPackages(allPackages, dest.name, searchSlug);

    return (
        <div className="bg-white">
            {dest?.seo?.jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: dest.seo.jsonLd }}
                />
            )}
            <h1 className="sr-only">{dest?.name} Tour Packages</h1>
            <DestinationClient initialDestination={dest} initialPackages={filteredPackages} />
            <SEOQuickLinks links={dest.seo?.quickLinks || []} title="Important Travel Links" />
        </div>
    );
}
