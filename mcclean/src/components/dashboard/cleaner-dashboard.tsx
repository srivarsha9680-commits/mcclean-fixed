'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  DollarSign,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Camera,
  TrendingUp,
  User,
  Edit3,
  Shield,
  Award,
} from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface CleanerDashboardProps {
  profile: any;
}

const statusConfig = {
  PENDING: { label: 'Pending', variant: 'warning' as const },
  CONFIRMED: { label: 'Confirmed', variant: 'info' as const },
  IN_PROGRESS: { label: 'In Progress', variant: 'info' as const },
  COMPLETED: { label: 'Completed', variant: 'success' as const },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' as const },
};

// Mock earnings data — replace with real DB query
const earningsData = [
  { month: 'Oct', amount: 1820 },
  { month: 'Nov', amount: 2140 },
  { month: 'Dec', amount: 1950 },
  { month: 'Jan', amount: 2680 },
  { month: 'Feb', amount: 2450 },
  { month: 'Mar', amount: 3100 },
];

export function CleanerDashboard({ profile }: CleanerDashboardProps) {
  const [activeTab, setActiveTab] = useState('jobs');

  const stats = [
    {
      label: 'Rating',
      value: `${(profile?.rating || 0).toFixed(1)}/5`,
      icon: Star,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      label: 'Jobs Done',
      value: profile?.completedJobs || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'This Month',
      value: formatCurrency(3100),
      icon: DollarSign,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
    },
    {
      label: 'Response Rate',
      value: '98%',
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  const maxEarnings = Math.max(...earningsData.map((d) => d.amount));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cleaner Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your cleaning business</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* ── JOBS TAB ── */}
        <TabsContent value="jobs" className="space-y-4">
          {!profile?.bookings?.length ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No active jobs
                </h3>
                <p className="text-gray-400">
                  New job requests will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            profile.bookings.map((booking: any) => {
              const status =
                statusConfig[booking.status as keyof typeof statusConfig];
              const customerName = booking.customer?.name || 'Customer';
              const initials = customerName
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              return (
                <Card
                  key={booking.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-11 w-11 flex-shrink-0">
                          {booking.customer?.image && (
                            <AvatarImage
                              src={booking.customer.image}
                              alt={customerName}
                            />
                          )}
                          <AvatarFallback className="text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-gray-900">
                              {booking.service?.name?.replace(/_/g, ' ')}
                            </span>
                            <Badge variant={status.variant}>
                              {status.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(new Date(booking.scheduledDate))}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatTime(booking.startTime)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {booking.address}, {booking.city}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm text-gray-500">
                              {customerName}
                            </span>
                            <span className="font-semibold text-primary-600">
                              {formatCurrency(Number(booking.totalPrice))}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {booking.status === 'PENDING' && (
                          <>
                            <Button variant="outline" size="sm">
                              <XCircle className="w-4 h-4 mr-1" />
                              Decline
                            </Button>
                            <Button size="sm">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                          </>
                        )}
                        {booking.status === 'CONFIRMED' && (
                          <Button size="sm">
                            <Camera className="w-4 h-4 mr-1" />
                            Start Job
                          </Button>
                        )}
                        {booking.status === 'IN_PROGRESS' && (
                          <Button size="sm" variant="outline">
                            <Camera className="w-4 h-4 mr-1" />
                            Upload After Photos
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* ── SCHEDULE TAB ── */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                  (day, i) => {
                    const slots = profile?.availability?.filter(
                      (a: any) => a.dayOfWeek === i
                    );
                    return (
                      <div key={day} className="text-center">
                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                          {day}
                        </p>
                        <div className="space-y-1">
                          {slots?.map((slot: any) => (
                            <div
                              key={slot.id}
                              className="bg-primary-100 text-primary-700 text-xs py-1 px-1.5 rounded text-center leading-tight"
                            >
                              {formatTime(slot.startTime)}
                              <br />
                              {formatTime(slot.endTime)}
                            </div>
                          ))}
                          <button className="w-full text-xs text-gray-400 hover:text-primary-600 py-1 border border-dashed border-gray-200 rounded hover:border-primary-300 transition-colors">
                            + Add
                          </button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── EARNINGS TAB ── */}
        <TabsContent value="earnings">
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'This Month', value: formatCurrency(3100), delta: '+12%' },
                { label: 'Last Month', value: formatCurrency(2450), delta: '+5%' },
                { label: 'All Time', value: formatCurrency(14140), delta: null },
              ].map((item) => (
                <Card key={item.label}>
                  <CardContent className="p-5">
                    <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {item.value}
                    </p>
                    {item.delta && (
                      <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {item.delta} vs prior period
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bar chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Monthly Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-3 h-40">
                  {earningsData.map((d) => {
                    const heightPct = (d.amount / maxEarnings) * 100;
                    const isLast = d.month === 'Mar';
                    return (
                      <div
                        key={d.month}
                        className="flex-1 flex flex-col items-center gap-2"
                      >
                        <span className="text-xs font-medium text-gray-600">
                          {formatCurrency(d.amount)}
                        </span>
                        <div className="w-full flex items-end" style={{ height: '80px' }}>
                          <div
                            className={cn(
                              'w-full rounded-t-md transition-all',
                              isLast
                                ? 'bg-primary-500'
                                : 'bg-primary-200 hover:bg-primary-300'
                            )}
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{d.month}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent payouts table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: 'Mar 1, 2026', jobs: 8, gross: 1240, fee: 124, net: 1116 },
                    { date: 'Feb 15, 2026', jobs: 6, gross: 930, fee: 93, net: 837 },
                    { date: 'Feb 1, 2026', jobs: 7, gross: 1085, fee: 108.5, net: 976.5 },
                  ].map((payout) => (
                    <div
                      key={payout.date}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {payout.date}
                        </p>
                        <p className="text-xs text-gray-400">
                          {payout.jobs} jobs · {formatCurrency(payout.fee)} platform fee
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(payout.net)}
                        </p>
                        <p className="text-xs text-gray-400 line-through">
                          {formatCurrency(payout.gross)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── PROFILE TAB ── */}
        <TabsContent value="profile">
          <div className="space-y-6">
            {/* Basic info */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Profile Information</CardTitle>
                <Button variant="outline" size="sm">
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    {profile?.profilePhoto && (
                      <AvatarImage src={profile.profilePhoto} />
                    )}
                    <AvatarFallback className="text-2xl">
                      <User className="w-8 h-8 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Upload Photo
                    </Button>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG up to 5 MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      label: 'Hourly Rate',
                      value: formatCurrency(Number(profile?.hourlyRate || 25)) + '/hr',
                    },
                    {
                      label: 'Years Experience',
                      value: `${profile?.yearsExperience || 0} years`,
                    },
                    { label: 'Work Radius', value: `${profile?.workRadius || 25} miles` },
                    { label: 'City', value: profile?.city || '—' },
                  ].map((field) => (
                    <div key={field.label}>
                      <p className="text-xs text-gray-500 mb-1">{field.label}</p>
                      <p className="font-medium text-gray-900">{field.value}</p>
                    </div>
                  ))}
                </div>

                {profile?.bio && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Bio</p>
                    <p className="text-sm text-gray-700">{profile.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Verification badges */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Verification Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      icon: Shield,
                      label: 'Identity Verified',
                      done: profile?.isVerified,
                    },
                    {
                      icon: Shield,
                      label: 'Insurance Verified',
                      done: profile?.isInsured,
                    },
                    {
                      icon: Award,
                      label: 'Background Check',
                      done: profile?.backgroundChecked,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={cn(
                            'w-5 h-5',
                            item.done ? 'text-green-500' : 'text-gray-300'
                          )}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {item.label}
                        </span>
                      </div>
                      {item.done ? (
                        <Badge variant="success">Verified</Badge>
                      ) : (
                        <Button variant="outline" size="sm">
                          Verify
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Services offered */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Services Offered</CardTitle>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </CardHeader>
              <CardContent>
                {!profile?.services?.length ? (
                  <p className="text-sm text-gray-400">
                    No services added yet. Add services to start receiving bookings.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.services.map((service: any) => (
                      <Badge key={service.id} variant="outline" className="text-sm py-1 px-3">
                        {service.name.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
