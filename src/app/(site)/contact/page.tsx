import { Metadata } from 'next';
import { getPortfolioData } from '@/lib/portfolio';
import { ContactSection } from '@/components/public/ContactSection';

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  const name = data.profile.name || 'Darshan G Poojari';
  return {
    title: `Hire ${name} | Video Editor & Multimedia Designer Inquiries`,
    description: `Get in touch with ${name} for freelance video editing, YouTube editing, Reels, photo retouching, and graphic design projects. Instant WhatsApp and email contact.`,
    keywords: [
      `Contact ${name}`,
      'Hire Video Editor',
      'Freelance Video Editor Contact',
      'Hire Video Editor Karnataka',
      'Darshan G Poojari Email',
      'Darshan G Poojari WhatsApp',
      'Video Editing Services Inquiry',
    ],
    alternates: {
      canonical: '/contact',
    },
    openGraph: {
      title: `Contact & Inquiries | ${name}`,
      description: `Discuss your upcoming video editing or design project with ${name}.`,
      url: '/contact',
    },
  };
}

export default async function ContactPage() {
  const data = await getPortfolioData();

  return (
    <div className="pt-24 pb-12">
      <ContactSection
        contact={data.contact}
        profile={data.profile}
        socials={data.socials}
      />
    </div>
  );
}
