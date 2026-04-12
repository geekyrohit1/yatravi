import { MetadataRoute } from 'next'

/**
 * Dynamic robots.ts (Next.js 14/15/16 standard)
 * This file tells search engines where the sitemap is and what to crawl.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          'HTTrack', 'Zeus', 'Mata Hari', 'LexiBot', 'EmailCollector'
        ],
        disallow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/'],
      },
    ],
    sitemap: 'https://yatravi.com/sitemap.xml',
  }
}
