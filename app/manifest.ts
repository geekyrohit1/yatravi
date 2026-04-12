import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Yatravi - Best Holiday & Luxury Tour Packages',
    short_name: 'Yatravi',
    description: 'Lowest price holiday packages, hand-crafted itineraries, and expert travel guidance.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#FF5A5F',
    icons: [
      {
        src: '/yatraviicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
