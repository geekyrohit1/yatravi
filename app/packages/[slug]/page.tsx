import { Metadata } from 'next';
import { API_BASE_URL } from '../../../constants';
import { getGlobalSettings } from '@/lib/api';
import PackageClient from './PackageClient';
import SEOQuickLinks from '@/components/SEOQuickLinks';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getPackage(slug: string) {
    try {
        const timestamp = new Date().getTime();
        const res = await fetch(`${API_BASE_URL}/api/packages/${slug}?t=${timestamp}`, {
            next: { revalidate: 60 }
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
        const res = await fetch(`${API_BASE_URL}/api/homepage`, { next: { revalidate: 60 } });
        return await res.json();
    } catch (error) {
        console.error('Failed to fetch homepage config:', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    
    // Parallel fetch for package and global settings
    const [pkg, settings] = await Promise.all([
        getPackage(slug),
        getGlobalSettings()
    ]);
    
    const globalSeo = settings?.globalSeo || {};

    if (!pkg) {
        return {
            title: 'Package Not Found',
        };
    }

    const defaultOgImage = globalSeo.defaultOgImage || '/og-image.png';
    const siteKeywords = globalSeo.defaultKeywords || '';

    return {
        title: pkg.seo?.title || pkg.title,
        description: pkg.seo?.description || pkg.overview?.substring(0, 160) || `Explore ${pkg.title} with Yatravi.`,
        keywords: pkg.seo?.keywords 
            ? pkg.seo.keywords.split(',').map((k: string) => k.trim())
            : siteKeywords.split(',').map((k: string) => k.trim()),
        alternates: {
            canonical: pkg.seo?.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL || ''}/packages/${pkg.slug}`,
        },
        openGraph: {
            title: pkg.seo?.ogTitle || pkg.seo?.title || pkg.title,
            description: pkg.seo?.ogDescription || pkg.seo?.description || pkg.overview?.substring(0, 160),
            images: [pkg.seo?.ogImage || pkg.image || defaultOgImage],
            type: 'website',
            siteName: globalSeo.siteName || 'Yatravi'
        },
        twitter: {
            card: 'summary_large_image',
            title: pkg.seo?.twitterTitle || pkg.seo?.title || pkg.title,
            description: pkg.seo?.twitterDescription || pkg.seo?.description || pkg.overview?.substring(0, 160),
            images: [pkg.seo?.twitterImage || pkg.seo?.ogImage || pkg.image || defaultOgImage],
            creator: globalSeo.twitterHandle || '@yatravi'
        },
        robots: {
            index: pkg.seo?.robots?.includes('index'),
            follow: pkg.seo?.robots?.includes('follow'),
        }
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const pkg = await getPackage(slug);

    if (!pkg) {
        redirect('/');
    }

    return (
        <div className="bg-white">
            {pkg.seo?.jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: pkg.seo.jsonLd }}
                />
            )}
            <PackageClient initialPkg={pkg} />
            <SEOQuickLinks links={pkg.seo?.quickLinks || []} title="Important Links & Resources" />
        </div>
    );
}
