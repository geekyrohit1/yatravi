import { MetadataRoute } from 'next'
import { API_BASE_URL } from '../constants'

/**
 * Timeout wrapper for sitemap fetches to prevent hangs
 */
async function fetchWithTimeout(url: string, options: any = {}, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (e) {
        clearTimeout(id);
        throw e;
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yatravi.com'

  const staticRoutes = [
    { route: '', priority: 1.0, changeFrequency: 'daily' },
    { route: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { route: '/destinations', priority: 0.8, changeFrequency: 'daily' },
    { route: '/packages', priority: 0.8, changeFrequency: 'daily' },
    { route: '/contact', priority: 0.7, changeFrequency: 'monthly' },
    { route: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
    { route: '/terms', priority: 0.3, changeFrequency: 'monthly' },
    { route: '/join', priority: 0.6, changeFrequency: 'weekly' },
    { route: '/support-center', priority: 0.6, changeFrequency: 'weekly' },
    { route: '/web-check-in', priority: 0.5, changeFrequency: 'monthly' },
  ].map((item) => ({
    url: `${baseUrl}${item.route}`,
    lastModified: new Date(),
    changeFrequency: item.changeFrequency as any,
    priority: item.priority,
  }))

  try {
    // Fetch Packages with Timeout
    const packagesRes = await fetchWithTimeout(`${API_BASE_URL}/api/packages`, { next: { revalidate: 3600 } }).catch(() => null);
    const packagesData = packagesRes ? await packagesRes.json() : [];
    const packagesArray = Array.isArray(packagesData) ? packagesData : (packagesData.packages || [])
    
    const packageRoutes = packagesArray.map((pkg: any) => ({
      url: `${baseUrl}/packages/${pkg.slug || pkg.id}`,
      lastModified: new Date(pkg.updatedAt || new Date()),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))

    // Fetch Destinations with Timeout & Robust Array Handling
    const destinationsRes = await fetchWithTimeout(`${API_BASE_URL}/api/destinations`, { next: { revalidate: 3600 } }).catch(() => null);
    const destinationsData = destinationsRes ? await destinationsRes.json() : [];
    const destinationsArray = Array.isArray(destinationsData) ? destinationsData : (destinationsData.destinations || [])

    const destinationRoutes = destinationsArray.map((dest: any) => ({
      url: `${baseUrl}/destination/${dest.slug || dest.id}`,
      lastModified: new Date(dest.updatedAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    return [...staticRoutes, ...packageRoutes, ...destinationRoutes]
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return staticRoutes
  }
}
