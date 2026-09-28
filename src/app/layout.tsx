import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getPortfolioData } from '@/lib/portfolio';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  const title = `${data.profile.name || 'Darshan'} — ${data.profile.role || 'Video Editor & Graphic Designer'}`;
  const description =
    data.profile.bio ||
    'Professional portfolio of Darshan, specializing in cinematic video editing, creative image retouching, and graphic design.';

  return {
    title: {
      default: title,
      template: `%s | ${data.profile.name || 'Darshan'}`,
    },
    description,
    keywords: [
      'Darshan',
      'Video Editor',
      'Image Editing',
      'Photo Retouching',
      'Graphic Design',
      'Color Grading',
      'YouTube Thumbnails',
      'Cinematic Edits',
      'Premiere Pro',
      'DaVinci Resolve',
      'After Effects',
      'Photoshop',
    ],
    authors: [{ name: data.profile.name || 'Darshan' }],
    creator: data.profile.name || 'Darshan',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      title,
      description,
      siteName: `${data.profile.name || 'Darshan'} Portfolio`,
      images: [
        {
          url: data.profile.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200',
          width: 1200,
          height: 630,
          alt: `${data.profile.name || 'Darshan'} - Portfolio`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@darshan',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} font-sans bg-[#09090b] text-[#f4f4f5] antialiased min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
