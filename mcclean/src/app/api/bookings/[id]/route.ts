import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateSchema = z.object({
  status: z.enum(['CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
});

// PATCH /api/bookings/[id] — update booking status
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { status } = updateSchema.parse(body);

    // Find the booking and verify ownership
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { cleaner: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Only the assigned cleaner or customer can update
    const isCleanerOwner = booking.cleaner.userId === session.user.id;
    const isCustomerOwner = booking.customerId === session.user.id;

    if (!isCleanerOwner && !isCustomerOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Customers can only cancel
    if (isCustomerOwner && status !== 'CANCELLED') {
      return NextResponse.json(
        { error: 'Customers can only cancel bookings' },
        { status: 403 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status,
        ...(status === 'COMPLETED' && {
          cleanerDepartedAt: new Date(),
          paymentStatus: 'RELEASED',
        }),
        ...(status === 'IN_PROGRESS' && {
          cleanerArrivedAt: new Date(),
        }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Booking update error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

// GET /api/bookings/[id] — get single booking
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        service: true,
        customer: { select: { id: true, name: true, image: true, email: true } },
        cleaner: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        },
        review: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: { select: { id: true, name: true, image: true } },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Security: only parties involved can view
    const isParty =
      booking.customerId === session.user.id ||
      booking.cleaner.userId === session.user.id;

    if (!isParty) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}
