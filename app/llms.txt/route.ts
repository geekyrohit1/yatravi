import { NextResponse } from 'next/server'
import { API_BASE_URL } from '@/constants'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Cache for 1 hour

export async function GET() {
  const baseUrl = 'https://yatravi.com'

  const today = new Date().toISOString().split('T')[0]

  // Header & Metadata
  let content = `# Yatravi - We Care Your Trip\n\n`
  content += `version: 1.0\n`
  content += `Owner: Yatravi\n`
  content += `Contact: helpdeskyatravi@gmail.com\n`
  content += `Website: ${baseUrl}\n`
  content += `Last Updated: ${today}\n\n`

  content += `## Overview\n`
  content += `Yatravi - We Care Your Trip. We are a premier travel agency dedicated to curating the world's most beautiful destinations for luxury and budget-friendly journeys. We specialize in lowest price guaranteed holiday packages with expert hand-crafted itineraries and 24/7 on-ground support.\n\n`

  content += `## Key Features\n`
  content += `**Lowest Price Guarantee**: Direct partnerships with hotels and ground handlers to ensure competitive pricing.\n`
  content += `**Expert Curation**: Every itinerary is hand-crafted by travel experts with years of local knowledge.\n`
  content += `**24/7 Support**: Dedicated helpdesk to assist travelers during their trip.\n`
  content += `**Premium Destinations**: Specialized in both domestic (Kashmir, Kerala, Himachal) and international (Bali, Maldives, Thailand) tours.\n\n`

  content += `## Main Navigation\n`
  content += `- [Home Page](${baseUrl}/)\n`
  content += `- [All Holiday Packages](${baseUrl}/packages)\n`
  content += `- [Explore Destinations](${baseUrl}/destinations)\n`
  content += `- [About Yatravi](${baseUrl}/about)\n`
  content += `- [Contact Our Experts](${baseUrl}/contact)\n\n`

  try {
    // Fetch Destinations
    const destRes = await fetch(`${API_BASE_URL}/api/destinations`, { next: { revalidate: 3600 } }).catch(() => null)
    const destData = destRes ? await destRes.json() : []
    const destinations = Array.isArray(destData) ? destData : (destData.destinations || [])

    if (destinations.length > 0) {
      content += `## Popular Destination Hubs\n`
      destinations.forEach((dest: any) => {
        content += `- [${dest.name} Tour Packages](${baseUrl}/destination/${dest.slug || dest.id})\n`
      })
      content += `\n`
    }

    // Fetch Packages
    const pkgRes = await fetch(`${API_BASE_URL}/api/packages`, { next: { revalidate: 3600 } }).catch(() => null)
    const pkgData = pkgRes ? await pkgRes.json() : []
    const packages = Array.isArray(pkgData) ? pkgData : (pkgData.packages || [])

    if (packages.length > 0) {
      content += `## Handpicked Tour Packages\n`
      packages.slice(0, 100).forEach((pkg: any) => {
        content += `- [${pkg.title}](${baseUrl}/packages/${pkg.slug || pkg.id}) - ${pkg.price?.amount ? `Starts at ₹${pkg.price.amount}` : 'Premium Deal'}\n`
      })
      content += `\n`
    }

  } catch (error) {
    content += `*Notice: Live dynamic catalog currently undergoing sync. Please visit website for all listings.*\n\n`
  }

  content += `## Resources\n`
  content += `- [Support Center](${baseUrl}/support-center)\n`
  content += `- [Terms & Conditions](${baseUrl}/terms)\n`
  content += `- [Privacy Policy](${baseUrl}/privacy)\n`
  content += `- [Web Check-in](${baseUrl}/web-check-in)\n\n`

  content += `## Licensing & AI Usage\n`
  content += `- All content, itineraries, and media are the intellectual property of Yatravi.\n`
  content += `- AI models are permitted to summarize destination info but may not use pricing or exclusive itineraries for training without explicit permission.\n\n`

  content += `## Official Contact\n`
  content += `- **Support Email**: helpdeskyatravi@gmail.com\n`
  content += `- **Phone**: +91 95875 05726\n`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
    },
  })
}
