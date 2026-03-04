'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Star,
  MapPin,
  Shield,
  Award,
  CheckCircle,
  Loader2,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Cleaner {
  id: string;
  rating: number;
  reviewCount: number;
  hourlyRate: string;
  yearsExperience: number;
  isVerified: boolean;
  isInsured: boolean;
  backgroundChecked: boolean;
  city: string;
  distance: number | null;
  user: { name: string; image: string | null };
  services: { id: string; name: string; basePrice: string }[];
}

// Map service URL slug → display name
const serviceLabels: Record<string, string> = {
  'home-cleaning': 'Home Cleaning',
  'office-cleaning': 'Office Cleaning',
  'airbnb-turnover': 'Airbnb Turnover',
  'deep-cleaning': 'Deep Cleaning',
  'move-in-out': 'Move In/Out',
};

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const service = searchParams.get('service') || '';
  const address = searchParams.get('address') || '';
  const date = searchParams.get('date') || '';

  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCleaner, setSelectedCleaner] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const fetchCleaners = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/cleaners?service=${service}`);
        const data = await res.json();
        setCleaners(data);
      } catch {
        // Silently fail — show empty state
      } finally {
        setIsLoading(false);
      }
    };
    fetchCleaners();
  }, [service]);

  const handleBook = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/book/confirm?service=${service}&address=${address}&date=${date}`);
      return;
    }
    if (!selectedCleaner) return;

    setIsBooking(true);
    try {
      const cleaner = cleaners.find((c) => c.id === selectedCleaner);
      const serviceObj = cleaner?.services?.[0];

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cleanerId: selectedCleaner,
          serviceId: serviceObj?.id,
          scheduledDate: new Date(date).toISOString(),
          startTime: '09:00',
          duration: 120,
          address,
          city: 'Your City',
          state: 'CA',
          zipCode: '00000',
          totalPrice: Number(serviceObj?.basePrice || 120),
        }),
      });

      if (res.ok) {
        setBooked(true);
      }
    } catch {
      // handle error
    } finally {
      setIsBooking(false);
    }
  };

  if (booked) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-32 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Booking Confirmed!
          </h1>
          <p className="text-gray-500 mb-8">
            Your cleaner has been notified and will confirm shortly. You&apos;ll
            receive an email with the details.
          </p>
          <Link href="/customer">
            <Button size="lg">View My Bookings</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-24">
        {/* Breadcrumb */}
        <Link
          href="/book"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to booking
        </Link>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-8 flex flex-wrap gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Service</p>
            <p className="font-semibold text-gray-900">
              {serviceLabels[service] || service}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Address</p>
            <p className="font-semibold text-gray-900">{address}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
            <p className="font-semibold text-gray-900">
              {date
                ? new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })
                : '—'}
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Choose Your Cleaner
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : cleaners.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No cleaners available
              </h3>
              <p className="text-gray-400">
                We couldn&apos;t find any verified cleaners for this area. Try a different date or service.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {cleaners.map((cleaner) => {
              const initials = (cleaner.user?.name || 'C')
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
              const isSelected = selectedCleaner === cleaner.id;

              return (
                <Card
                  key={cleaner.id}
                  onClick={() => setSelectedCleaner(cleaner.id)}
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-md',
                    isSelected
                      ? 'ring-2 ring-primary-500 shadow-md'
                      : 'hover:border-gray-300'
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14 flex-shrink-0">
                        {cleaner.user?.image && (
                          <AvatarImage src={cleaner.user.image} />
                        )}
                        <AvatarFallback className="text-lg font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {cleaner.user?.name}
                            </h3>
                            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                              <span className="flex items-center gap-1 text-sm text-gray-600">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                {cleaner.rating.toFixed(1)} ({cleaner.reviewCount} reviews)
                              </span>
                              {cleaner.yearsExperience > 0 && (
                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                  <Clock className="w-3.5 h-3.5" />
                                  {cleaner.yearsExperience}+ yrs
                                </span>
                              )}
                              {cleaner.city && (
                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {cleaner.city}
                                  {cleaner.distance != null && (
                                    <> · {cleaner.distance.toFixed(1)} mi away</>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary-600">
                              {formatCurrency(Number(cleaner.hourlyRate))}/hr
                            </p>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {cleaner.isVerified && (
                            <Badge variant="success" className="gap-1">
                              <Shield className="w-3 h-3" />
                              Verified
                            </Badge>
                          )}
                          {cleaner.isInsured && (
                            <Badge variant="success" className="gap-1">
                              <Shield className="w-3 h-3" />
                              Insured
                            </Badge>
                          )}
                          {cleaner.backgroundChecked && (
                            <Badge variant="success" className="gap-1">
                              <Award className="w-3 h-3" />
                              Background Checked
                            </Badge>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <CheckCircle className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Sticky footer CTA */}
        {selectedCleaner && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex items-center justify-between gap-4 z-40">
            <div>
              <p className="text-sm text-gray-500">
                {cleaners.find((c) => c.id === selectedCleaner)?.user.name}
              </p>
              <p className="font-semibold text-gray-900">
                {formatCurrency(
                  Number(
                    cleaners.find((c) => c.id === selectedCleaner)?.hourlyRate
                  )
                )}
                /hr ·{' '}
                {serviceLabels[service]}
              </p>
            </div>
            <Button
              size="lg"
              className="px-8"
              onClick={handleBook}
              disabled={isBooking}
            >
              {isBooking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : session ? (
                'Confirm Booking'
              ) : (
                'Sign in to Book'
              )}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
