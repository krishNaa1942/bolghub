import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BlogHub - Modern Blogging Platform',
    short_name: 'BlogHub',
    description: 'Professional blogging platform with markdown support',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#6366f1',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
