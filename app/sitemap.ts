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
    '', '/about', '/destinations', '/packages', '/contact', 
    '/privacy', '/terms', '/join', '/support-center', '/web-check-in',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    priority: route === '' ? 1.0 : 0.8,
  }))

  try {
    // Fetch Packages with Timeout
    const packagesRes = await fetchWithTimeout(`${API_BASE_URL}/api/packages`, { next: { revalidate: 3600 } }).catch(() => null);
    const packagesData = packagesRes ? await packagesRes.json() : [];
    const packagesArray = Array.isArray(packagesData) ? packagesData : (packagesData.packages || [])
    
    const packageRoutes = packagesArray.map((pkg: any) => ({
      url: `${baseUrl}/packages/${pkg.slug || pkg.id}`,
      lastModified: new Date(pkg.updatedAt || new Date()),
      priority: 0.9,
    }))

    // Fetch Destinations with Timeout & Robust Array Handling
    const destinationsRes = await fetchWithTimeout(`${API_BASE_URL}/api/destinations`, { next: { revalidate: 3600 } }).catch(() => null);
    const destinationsData = destinationsRes ? await destinationsRes.json() : [];
    const destinationsArray = Array.isArray(destinationsData) ? destinationsData : (destinationsData.destinations || [])

    const destinationRoutes = destinationsArray.map((dest: any) => ({
      url: `${baseUrl}/destination/${dest.slug || dest.id}`,
      lastModified: new Date(dest.updatedAt || new Date()),
      priority: 0.9,
    }))

    return [...staticRoutes, ...packageRoutes, ...destinationRoutes]
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return staticRoutes
  }
}
