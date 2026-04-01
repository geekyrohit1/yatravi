import { Metadata } from 'next';
import { API_BASE_URL } from '../../../constants'; // Adjust path as needed
import PackageClient from './PackageClient';
import { FooterQuickLinks } from '@/components/FooterQuickLinks';

export const dynamic = 'force-dynamic';

async function getPackage(slug: string) {
    try {
        const timestamp = new Date().getTime();
        const res = await fetch(`${API_BASE_URL}/api/packages/${slug}?t=${timestamp}`, {
            cache: 'no-store'
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Failed to fetch package:', error);
        return null;
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
    // Await params object before accessing properties
    const { slug } = await params;
    const pkg = await getPackage(slug);

    if (!pkg) {
        return {
            title: 'Package Not Found',
        };
    }

    // Use SEO object if available, fall back to package details
    return {
        title: pkg.seo?.title || `${pkg.title} | Yatravi`,
        description: pkg.seo?.description || pkg.overview?.substring(0, 160) || `Explore ${pkg.title} with Yatravi.`,
        keywords: pkg.seo?.keywords?.split(',').map((k: string) => k.trim()),
        alternates: {
            canonical: pkg.seo?.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL || ''}/packages/${pkg.slug}`,
        },
        openGraph: {
            title: pkg.seo?.ogTitle || pkg.seo?.title || pkg.title,
            description: pkg.seo?.ogDescription || pkg.seo?.description || pkg.overview?.substring(0, 160),
            images: [pkg.seo?.ogImage || pkg.image || ''],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: pkg.seo?.twitterTitle || pkg.seo?.title || pkg.title,
            description: pkg.seo?.twitterDescription || pkg.seo?.description || pkg.overview?.substring(0, 160),
            images: [pkg.seo?.twitterImage || pkg.seo?.ogImage || pkg.image || ''],
        },
        robots: {
            index: pkg.seo?.robots?.includes('index'),
            follow: pkg.seo?.robots?.includes('follow'),
        }
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    // Await params object before accessing properties
    const { slug } = await params;
    const pkg = await getPackage(slug);
    const config = await getHomepageConfig();

    if (!pkg) {
        return <div>Package not found</div>;
    }

    return (
        <>
            {pkg.seo?.jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: pkg.seo.jsonLd }}
                />
            )}
            <PackageClient initialPkg={pkg} />
            <FooterQuickLinks
                quickLinks={config?.quickLinks || []}
                importantLinks={config?.importantLinks || []}
            />
        </>
    );
}
