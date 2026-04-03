import { Metadata } from 'next';
import { API_BASE_URL } from '../../../constants';
import DestinationClient from './DestinationClient';
import { FooterQuickLinks } from '@/components/FooterQuickLinks';

export const dynamic = 'force-dynamic';

async function getDestination(slug: string) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/destinations`, {
            cache: 'no-store'
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
        const timestamp = new Date().getTime();
        const res = await fetch(`${API_BASE_URL}/api/packages?t=${timestamp}`, { cache: 'no-store' });
        return await res.json();
    } catch (error) {
        return [];
    }
}

async function getHomepageConfig() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/homepage`, { cache: 'no-store' });
        return await res.json();
    } catch (error) {
        console.error('Failed to fetch homepage config:', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const dest = await getDestination(slug);

    if (!dest) {
        return {
            title: 'Destination Not Found',
        };
    }

    return {
        title: dest.seo?.title || `${dest.name} Tour Packages | Yatravi`,
        description: dest.seo?.description || dest.description || `Explore top tour packages for ${dest.name}.`,
        keywords: dest.seo?.keywords?.split(',').map((k: string) => k.trim()),
        alternates: {
            canonical: dest.seo?.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL || ''}/destination/${dest.slug}`,
        },
        openGraph: {
            title: dest.seo?.ogTitle || dest.seo?.title || `${dest.name} Tour Packages`,
            description: dest.seo?.ogDescription || dest.seo?.description || dest.description,
            images: [dest.seo?.ogImage || dest.heroImage || '/og-image.png'],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: dest.seo?.twitterTitle || dest.seo?.title || `${dest.name} Tour Packages`,
            description: dest.seo?.twitterDescription || dest.seo?.description || dest.description,
            images: [dest.seo?.twitterImage || dest.seo?.ogImage || dest.heroImage || '/og-image.png'],
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

    // Filter packages server-side if destination is found
    const filteredPackages = dest
        ? filterPackages(allPackages, dest.name, slug)
        : [];

    return (
        <>
            {dest?.seo?.jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: dest.seo.jsonLd }}
                />
            )}
            <h1 className="sr-only">{dest?.name} Tour Packages | Yatravi</h1>
            {/* Pass only relevant packages to client */}
            <DestinationClient initialDestination={dest} initialPackages={filteredPackages} />
        </>
    );
}
