import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getPortfolioData } from '@/lib/portfolio';
import { GlobalJsonLd } from '@/components/public/JsonLd';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://darshan-portfolio.vercel.app').replace(/\/$/, '');

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  const name = data.profile.name || 'Darshan G Poojari';
  const role = data.profile.role || 'Video Editor & Multimedia Designer';
  const title = `${name} | ${role} — Official Portfolio`;
  const description =
    data.profile.bio ||
    'Official portfolio of Darshan G Poojari — specialized in cinematic video editing, YouTube content, commercial reels, photo retouching, and brand graphic design.';

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${name}`,
    },
    description,
    keywords: [
      'Darshan G Poojari',
      'Darshan Poojari',
      'Darshan Video Editor',
      'Darshan Editor Sirsi',
      'Darshan Multimedia Designer',
      'Video Editor Karnataka',
      'Video Editor Sirsi',
      'Cinematic Video Editor India',
      'Freelance Video Editor',
      'DaVinci Resolve Colorist',
      'Adobe Premiere Pro Editor',
      'After Effects Motion Graphics',
      'Photo Retouching India',
      'Creative Image Manipulation',
      'Graphic Designer Sirsi',
      'YouTube Video Editor',
      'High-CTR YouTube Thumbnails',
      'Instagram Reels Video Editor',
      'Commercial Promo Video Editing',
      'Wedding & Cinematic Teaser Editor',
    ],
    authors: [{ name, url: SITE_URL }],
    creator: name,
    publisher: name,
    category: 'Video Editing, Multimedia, Graphic Design & Creative Services',
    alternates: {
      canonical: '/',
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        {
          rel: 'mask-icon',
          url: '/icon.svg',
          color: '#f59e0b',
        },
      ],
    },
    openGraph: {
      type: 'profile',
      locale: 'en_US',
      url: SITE_URL,
      title,
      description,
      siteName: `${name} — Video Editor & Designer Portfolio`,
      images: [
        {
          url: data.profile.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=90',
          width: 1200,
          height: 630,
          alt: `${name} - Video Editor & Multimedia Designer`,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@darshan_poojari',
      images: [data.profile.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=90'],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'geo.region': 'IN-KA',
      'geo.placename': 'Sirsi',
      'geo.position': '14.6195;74.8354',
      'ICBM': '14.6195, 74.8354',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getPortfolioData();

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <GlobalJsonLd data={data} />
      </head>
      <body className={`${inter.variable} font-sans bg-[#09090b] text-[#f4f4f5] antialiased min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
