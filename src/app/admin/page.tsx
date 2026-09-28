import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getServerAdminSession } from '@/lib/auth';
import { getPortfolioData } from '@/lib/portfolio';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard — Portfolio Control Panel',
  robots: {
    index: false,
    follow: false,
  },
};

export const revalidate = 0;

export default async function AdminPage() {
  const session = await getServerAdminSession();

  if (!session || !session.authenticated) {
    redirect('/admin/login');
  }

  const data = await getPortfolioData();

  return (
    <AdminDashboardClient
      initialData={data}
      username={session.username}
    />
  );
}
