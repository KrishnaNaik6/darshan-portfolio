import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Darshan G Poojari — Video Editor & Multimedia Designer',
    short_name: 'Darshan Portfolio',
    description:
      'Professional portfolio of Darshan G Poojari specializing in cinematic video editing, photo retouching, and graphic design.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
