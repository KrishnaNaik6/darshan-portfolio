import React from 'react';
import { PortfolioData, Project } from '@/types/portfolio';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://darshan-portfolio.vercel.app';

interface JsonLdProps {
  data: PortfolioData;
}

export function GlobalJsonLd({ data }: JsonLdProps) {
  const { profile, socials, services } = data;

  const sameAsLinks = [
    socials.instagram,
    socials.youtube,
    socials.behance,
    socials.linkedin,
    socials.whatsapp,
  ].filter(Boolean) as string[];

  // 1. Person Schema (Darshan G Poojari)
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: profile.name || 'Darshan G Poojari',
    alternateName: [
      'Darshan Poojari',
      'Darshan G. Poojari',
      'Darshan Video Editor',
      'Darshan Editor Sirsi',
      'Darshan Multimedia Designer',
    ],
    jobTitle: profile.role || 'Video Editor & Multimedia Designer',
    description:
      profile.bio ||
      'Professional Video Editor, Photo Retoucher, and Multimedia Designer specializing in cinematic edits, color grading, and creative brand design.',
    url: SITE_URL,
    image: profile.profileImage || `${SITE_URL}/og-image.jpg`,
    email: profile.email || 'saroojapoojari5@gmail.com',
    telephone: profile.phone || '+918310509801',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sirsi',
      addressRegion: 'Karnataka',
      postalCode: '581401',
      addressCountry: 'India',
    },
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'Government Polytechnic Avrguppa, Siddapur',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Sooryanarayana High School Bisalakoppa, Sirsi',
      },
    ],
    knowsAbout: [
      'Video Editing',
      'Cinematic Video Production',
      'Color Grading & LUT Styling',
      'Adobe Premiere Pro',
      'DaVinci Resolve Studio',
      'Adobe After Effects',
      'Adobe Photoshop',
      'Photo Retouching & Compositing',
      'Graphic Design & Posters',
      'High-CTR YouTube Thumbnails',
      'Sound Design & Audio Mastering',
      'Cloud Storage (AWS S3)',
      'Web Technologies (HTML, CSS)',
    ],
    knowsLanguage: ['Kannada', 'English', 'Hindi'],
    sameAs: sameAsLinks,
  };

  // 2. WebSite Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: `${profile.name || 'Darshan G Poojari'} Portfolio`,
    alternateName: 'Darshan Video Editing & Visual Design Portfolio',
    description:
      'Official portfolio of Darshan G Poojari — Professional Video Editor, Photo Retoucher, and Graphic Designer based in Karnataka, India.',
    publisher: {
      '@id': `${SITE_URL}/#person`,
    },
    inLanguage: 'en-US',
  };

  // 3. ProfessionalService / Creative Business Schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#service`,
    name: `${profile.name || 'Darshan G Poojari'} — Video Editing & Visual Design Studio`,
    url: SITE_URL,
    image: profile.profileImage || `${SITE_URL}/og-image.jpg`,
    telephone: profile.phone || '+918310509801',
    email: profile.email || 'saroojapoojari5@gmail.com',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sirsi',
      addressRegion: 'Karnataka',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '14.6195',
      longitude: '74.8354',
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'India',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Karnataka',
      },
      {
        '@type': 'Country',
        name: 'United States',
      },
      {
        '@type': 'Country',
        name: 'United Kingdom',
      },
      {
        '@type': 'Country',
        name: 'Worldwide',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Editing & Design Services',
      itemListElement: services.map((srv, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: srv.title,
          description: srv.shortDescription,
        },
        position: index + 1,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}

export function ProjectJsonLd({ project }: { project: Project }) {
  const isVideo = project.type === 'video' || project.category === 'video';

  const schema = isVideo
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: project.title,
        description: project.description,
        thumbnailUrl: [project.thumbnail],
        uploadDate: `${project.year || new Date().getFullYear()}-01-01T08:00:00+05:30`,
        contentUrl: project.mediaUrl,
        embedUrl: project.mediaUrl,
        author: {
          '@type': 'Person',
          name: 'Darshan G Poojari',
        },
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        headline: project.title,
        description: project.description,
        image: project.thumbnail,
        dateCreated: `${project.year || new Date().getFullYear()}-01-01`,
        author: {
          '@type': 'Person',
          name: 'Darshan G Poojari',
        },
        genre: project.category === 'image' ? 'Photo Retouching' : 'Graphic Design',
        keywords: project.tags.join(', '),
      };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
