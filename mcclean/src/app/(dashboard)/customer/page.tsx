import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CustomerDashboard } from '@/components/dashboard/customer-dashboard';

export default async function CustomerPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'CUSTOMER') {
    redirect('/login');
  }

  const bookings = await prisma.booking.findMany({
    where: { customerId: session.user.id },
    include: {
      service: true,
      cleaner: {
        include: {
          user: { select: { name: true, image: true } },
        },
      },
      review: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return (
    <CustomerDashboard
      user={{
        id: session.user.id,
        name: session.user.name || '',
        email: session.user.email || '',
      }}
      bookings={bookings}
    />
  );
}
