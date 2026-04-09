import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Satisfy, Engagement } from 'next/font/google';
import '../index.css';
import { Layout } from '../components/Layout';
import { GlobalInquiryPopup } from '../components/GlobalInquiryPopup';
import { SettingsProvider } from '../context/SettingsContext';
import { ThemeProvider } from '../context/ThemeContext';
import { ConsentProvider } from '../context/ConsentContext';
import { CookieBanner } from '../components/CookieBanner';
import { API_BASE_URL } from '@/constants';
import { getGlobalSettings } from '@/lib/api';
import Script from 'next/script';
import SmoothScroll from '../components/SmoothScroll';

const satisfy = Satisfy({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-satisfy',
    display: 'swap',
});

const engagement = Engagement({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-engagement',
    display: 'swap',
});

const montserrat = localFont({
    src: [
        { path: '../public/fonts/Montserrat/Montserrat-Light.woff2', weight: '300', style: 'normal' },
        { path: '../public/fonts/Montserrat/Montserrat-Regular.woff2', weight: '400', style: 'normal' },
        { path: '../public/fonts/Montserrat/Montserrat-Medium.woff2', weight: '500', style: 'normal' },
        { path: '../public/fonts/Montserrat/Montserrat-SemiBold.woff2', weight: '600', style: 'normal' },
        { path: '../public/fonts/Montserrat/Montserrat-Bold.woff2', weight: '700', style: 'normal' },
    ],
    variable: '--font-montserrat',
    display: 'swap',
});

const montserratAlternates = localFont({
    src: [
        { path: '../public/fonts/MontserratAlternates/MontserratAlternates-Regular.otf', weight: '400', style: 'normal' },
        { path: '../public/fonts/MontserratAlternates/MontserratAlternates-SemiBold.otf', weight: '600', style: 'normal' },
        { path: '../public/fonts/MontserratAlternates/MontserratAlternates-Bold.otf', weight: '700', style: 'normal' },
        { path: '../public/fonts/MontserratAlternates/MontserratAlternates-BoldItalic.otf', weight: '700', style: 'italic' },
    ],
    variable: '--font-montserrat-alt',
    display: 'swap',
});

const orangeAvenue = localFont({
    src: [
        { path: '../public/fonts/Orange_Avenue_Regular.otf', weight: '400', style: 'normal' },
    ],
    variable: '--font-orange-avenue',
    display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getGlobalSettings();
    const globalSeo = settings?.globalSeo || {};

    const siteName = globalSeo.siteName || 'Yatravi';
    const titleSeparator = globalSeo.titleSeparator || '|';
    const defaultTitle = globalSeo.defaultTitle || 'Yatravi | We Care Your Trip - Lowest Price Holiday Packages';
    const defaultDescription = globalSeo.defaultDescription || 'Explore the world with Yatravi. Lowest price holiday packages and premium travel experiences.';
    const defaultKeywords = globalSeo.defaultKeywords || 'travel agency, holiday packages, tour packages, cheapest tours';
    const ogImage = globalSeo.defaultOgImage || '/og-image.png';

    return {
        title: defaultTitle,
        description: defaultDescription,
        keywords: defaultKeywords.split(',').map((k: string) => k.trim()),
        authors: [{ name: 'Yatravi Travel Solutions' }],
        creator: siteName,
        publisher: siteName,
        openGraph: {
            type: 'website',
            locale: 'en_IN',
            url: 'https://yatravi.com',
            siteName: siteName,
            title: defaultTitle,
            description: defaultDescription,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: siteName
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: defaultTitle,
            description: defaultDescription,
            images: [ogImage],
            creator: globalSeo.twitterHandle || '@yatravi'
        },
        icons: {
            icon: '/favicon.svg',
            apple: '/yatraviicon.png',
        },
        metadataBase: new URL('https://yatravi.com'),
        alternates: {
            canonical: '/',
        },
    };
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const settings = await getGlobalSettings();

    return (
        <html lang="en" suppressHydrationWarning className={`${montserrat.variable} ${montserratAlternates.variable} ${orangeAvenue.variable} ${satisfy.variable} ${engagement.variable} antialiased`}>
            <head>
                {/* Preconnect to improve TTFB for images and API */}
                <link rel="preconnect" href="https://yatravi.com" />
                <link rel="dns-prefetch" href="https://yatravi.com" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                
                {/* Google Translate can modify the DOM during hydration, these suppressions prevent crashes */}
                <Script id="google-translate-fix" strategy="afterInteractive">
                  {`
                    document.addEventListener('DOMContentLoaded', function() {
                      var observer = new MutationObserver(function(mutations) {
                        mutations.forEach(function(mutation) {
                          if (mutation.type === 'childList') {
                            // Check for Google Translate injected elements or attribute changes
                          }
                        });
                      });
                    });
                  `}
                </Script>

                {/* JSON-LD Structured Data for Travel Agency */}
                <Script
                    id="travel-agency-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "TravelAgency",
                            "name": "Yatravi",
                            "url": "https://yatravi.com",
                            "logo": "https://yatravi.com/yatraviicon.png",
                            "image": "https://yatravi.com/og-image.png",
                            "description": "Lowest price holiday packages, hand-crafted itineraries, and expert travel guidance.",
                            "address": {
                                "@type": "PostalAddress",
                                "addressCountry": "IN"
                            },
                            "telephone": "+91 95875 05726",
                            "priceRange": "$$",
                            "sameAs": [
                                "https://www.facebook.com/yatravi",
                                "https://www.instagram.com/yatravi"
                            ]
                        })
                    }}
                />
            </head>
            <body className="bg-gray-50" suppressHydrationWarning>
                <ConsentProvider>
                    <SettingsProvider initialSettings={settings}>
                        <ThemeProvider defaultTheme="light" storageKey="yatravi-theme">
                            <SmoothScroll />
                            <GlobalInquiryPopup />
                            <CookieBanner />
                            <Layout>
                                {children}
                            </Layout>
                        </ThemeProvider>
                    </SettingsProvider>
                </ConsentProvider>
            </body>
        </html>
    );
}
