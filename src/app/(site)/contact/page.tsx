import { Metadata } from 'next';
import { getPortfolioData } from '@/lib/portfolio';
import { ContactSection } from '@/components/public/ContactSection';

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  return {
    title: `Contact ${data.profile.name || 'Darshan'} — Inquiries & Bookings`,
    description: `Get in touch with ${data.profile.name || 'Darshan'} for video editing, photo retouching, and graphic design projects.`,
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
