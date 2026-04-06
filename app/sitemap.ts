import { MetadataRoute } from 'next'
import { API_BASE_URL } from '../constants'

/**
 * Senior Developer Level Dynamic Sitemap
 * - Fetch all packages from the database
 * - Fetch all destinations from the database
 * - Combine with static routes
 * - Set priorities based on SEO hierarchy
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yatravi.com'

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/about',
    '/destinations',
    '/packages',
    '/contact',
    '/privacy',
    '/terms',
    '/join',
    '/support-center',
    '/web-check-in',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  try {
    // 2. Fetch Packages from API
    const packagesRes = await fetch(`${API_BASE_URL}/api/packages`, { next: { revalidate: 3600 } })
    const packagesData = await packagesRes.json()
    
    // Support both { packages: [] } and direct [] array formats
    const packagesArray = Array.isArray(packagesData) ? packagesData : (packagesData.packages || [])
    
    const packageRoutes = packagesArray.map((pkg: any) => ({
      url: `${baseUrl}/packages/${pkg.slug || pkg.id}`,
      lastModified: new Date(pkg.updatedAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    // 3. Fetch Destinations from API (assuming there's a destinations endpoint)
    const destinationsRes = await fetch(`${API_BASE_URL}/api/destinations`, { next: { revalidate: 3600 } })
    const destinationsData = await destinationsRes.json()

    const destinationRoutes = (destinationsData || []).map((dest: any) => ({
      url: `${baseUrl}/destination/${dest.slug || dest.id}`,
      lastModified: new Date(dest.updatedAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    return [...staticRoutes, ...packageRoutes, ...destinationRoutes]
  } catch (error) {
    console.error('Sitemap generation error:', error)
    // Fallback to static routes if API fails to prevent 500 error
    return staticRoutes
  }
}
