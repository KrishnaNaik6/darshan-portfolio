import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { getPortfolioData } from '@/lib/portfolio';

export const revalidate = 0;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getPortfolioData();

  return (
    <>
      <Navbar brandName={data.profile.name} role={data.profile.role} />
      <main className="flex-1">{children}</main>
      <Footer profile={data.profile} socials={data.socials} />
    </>
  );
}
