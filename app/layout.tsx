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
import Script from 'next/script';

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

export const metadata: Metadata = {
    title: {
        default: 'Yatravi | We Care Your Trip - Lowest Price Holiday Packages',
        template: '%s | Yatravi - We Care Your Trip'
    },
    description: 'Yatravi - We Care Your Trip. Explore the world with the lowest price holiday packages, hand-crafted itineraries, and expert travel guidance. Your trusted partner for domestic and international tours.',
    keywords: ['Yatravi', 'We Care Your Trip', 'travel agency', 'holiday packages', 'tour packages', 'cheap flight deals', 'lowest price tours', 'domestic tours India', 'international travel packages', 'luxury holiday packages', 'tour and travel agency'],
    authors: [{ name: 'Yatravi Travel Solutions' }],
    creator: 'Yatravi',
    publisher: 'Yatravi',
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: 'https://yatravi.com',
        siteName: 'Yatravi',
        title: 'Yatravi | We Care Your Trip',
        description: 'Explore the world with Yatravi. We care for your trip with the lowest price holiday packages and premium travel experiences.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Yatravi - We Care Your Trip'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Yatravi | We Care Your Trip',
        description: 'Lowest price holiday packages and premium travel experiences. We care for your trip.',
        images: ['/og-image.png'],
    },
    icons: {
        icon: '/favicon.svg',
    },
    metadataBase: new URL('https://yatravi.com'),
    alternates: {
        canonical: '/',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${montserrat.variable} ${montserratAlternates.variable} ${orangeAvenue.variable} ${satisfy.variable} ${engagement.variable} antialiased`}>
            <head>
                {/* Preconnect to improve TTFB for images and API */}
                <link rel="preconnect" href="https://yatravi.com" />
                <link rel="dns-prefetch" href="https://yatravi.com" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

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
                            "logo": "https://yatravi.com/favicon.svg",
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
            <body className="bg-gray-50">
                <ConsentProvider>
                    <SettingsProvider>
                        <ThemeProvider defaultTheme="light" storageKey="yatravi-theme">
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
