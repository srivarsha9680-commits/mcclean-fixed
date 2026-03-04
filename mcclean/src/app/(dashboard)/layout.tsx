import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardNav role={session.user.role} userName={session.user.name || ''} userImage={session.user.image || ''} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
