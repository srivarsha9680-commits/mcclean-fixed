'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  Plus,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface CustomerDashboardProps {
  user: { id: string; name: string; email: string };
  bookings: any[];
}

const statusConfig = {
  PENDING: { label: 'Pending', variant: 'warning' as const },
  CONFIRMED: { label: 'Confirmed', variant: 'info' as const },
  IN_PROGRESS: { label: 'In Progress', variant: 'info' as const },
  COMPLETED: { label: 'Completed', variant: 'success' as const },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' as const },
};

export function CustomerDashboard({ user, bookings }: CustomerDashboardProps) {
  const upcoming = bookings.filter((b) =>
    ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(b.status)
  );
  const past = bookings.filter((b) =>
    ['COMPLETED', 'CANCELLED'].includes(b.status)
  );
  const totalSpent = bookings
    .filter((b) => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + Number(b.totalPrice), 0);

  const firstName = user.name.split(' ')[0];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Hello, {firstName} 👋
          </h1>
          <p className="text-gray-500 mt-1">Manage your cleaning bookings</p>
        </div>
        <Link href="/book">
          <Button size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Book a Cleaning
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Bookings',
            value: bookings.length,
            icon: Calendar,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
          },
          {
            label: 'Completed',
            value: past.filter((b) => b.status === 'COMPLETED').length,
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-50',
          },
          {
            label: 'Upcoming',
            value: upcoming.length,
            icon: Clock,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
          },
          {
            label: 'Total Spent',
            value: formatCurrency(totalSpent),
            icon: Star,
            color: 'text-primary-600',
            bg: 'bg-primary-50',
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    stat.bg
                  )}
                >
                  <stat.icon className={cn('w-5 h-5', stat.color)} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Bookings */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Bookings</h2>
        </div>

        {upcoming.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No upcoming bookings
              </h3>
              <p className="text-gray-400 mb-6">
                Book your first cleaning and enjoy a spotless home!
              </p>
              <Link href="/book">
                <Button>Book Now</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcoming.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>

      {/* Past Bookings */}
      {past.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Past Bookings
          </h2>
          <div className="space-y-3">
            {past.slice(0, 5).map((booking) => (
              <BookingCard key={booking.id} booking={booking} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BookingCard({
  booking,
  compact = false,
}: {
  booking: any;
  compact?: boolean;
}) {
  const status = statusConfig[booking.status as keyof typeof statusConfig];
  const cleanerName = booking.cleaner?.user?.name || 'Cleaner';
  const initials = cleanerName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card
      className={cn(
        'hover:shadow-md transition-shadow',
        compact && 'shadow-none border-gray-100'
      )}
    >
      <CardContent className={cn('p-5', compact && 'py-4')}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Avatar className={cn('flex-shrink-0', compact ? 'h-9 w-9' : 'h-11 w-11')}>
              {booking.cleaner?.user?.image && (
                <AvatarImage src={booking.cleaner.user.image} alt={cleanerName} />
              )}
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-semibold text-gray-900 text-sm">
                  {booking.service?.name?.replace(/_/g, ' ')}
                </span>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(new Date(booking.scheduledDate))}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(booking.startTime)}
                </span>
                {!compact && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {booking.city}
                  </span>
                )}
              </div>
              {!compact && (
                <p className="text-xs text-gray-400 mt-1">with {cleanerName}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="font-semibold text-primary-600">
              {formatCurrency(Number(booking.totalPrice))}
            </span>
            {!compact && booking.status === 'CONFIRMED' && (
              <Button size="sm" variant="outline" className="gap-1">
                <MessageSquare className="w-3 h-3" />
                Message
              </Button>
            )}
            {!compact && booking.status === 'COMPLETED' && !booking.review && (
              <Button size="sm" className="gap-1">
                <Star className="w-3 h-3" />
                Review
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
