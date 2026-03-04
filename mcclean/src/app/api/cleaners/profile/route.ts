import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const profileSchema = z.object({
  bio: z.string().max(500).optional(),
  hourlyRate: z.number().min(10).max(500).optional(),
  yearsExperience: z.number().min(0).max(50).optional(),
  workRadius: z.number().min(1).max(100).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  address: z.string().optional(),
});

// GET /api/cleaners/profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.cleanerProfile.findUnique({
      where: { userId: session.user.id },
      include: { services: true, availability: true },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PATCH /api/cleaners/profile
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'CLEANER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = profileSchema.parse(body);

    const profile = await prisma.cleanerProfile.update({
      where: { userId: session.user.id },
      data,
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
