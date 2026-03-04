'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Star,
  Settings,
  LogOut,
  Briefcase,
  DollarSign,
  User,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DashboardNavProps {
  role: string;
  userName: string;
  userImage: string;
}

const cleanerLinks = [
  { href: '/cleaner', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/cleaner/jobs', icon: Briefcase, label: 'My Jobs' },
  { href: '/cleaner/schedule', icon: Calendar, label: 'Schedule' },
  { href: '/cleaner/earnings', icon: DollarSign, label: 'Earnings' },
  { href: '/cleaner/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/cleaner/reviews', icon: Star, label: 'Reviews' },
  { href: '/cleaner/profile', icon: User, label: 'Profile' },
  { href: '/cleaner/settings', icon: Settings, label: 'Settings' },
];

const customerLinks = [
  { href: '/customer', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/customer/bookings', icon: Calendar, label: 'My Bookings' },
  { href: '/customer/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/customer/reviews', icon: Star, label: 'My Reviews' },
  { href: '/customer/settings', icon: Settings, label: 'Settings' },
];

export function DashboardNav({ role, userName, userImage }: DashboardNavProps) {
  const pathname = usePathname();
  const links = role === 'CLEANER' ? cleanerLinks : customerLinks;
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="font-bold text-xl text-gray-900">McClean</span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
          <Avatar className="h-10 w-10">
            {userImage && <AvatarImage src={userImage} alt={userName} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
            <p className="text-xs text-gray-500 capitalize">{role.toLowerCase()}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <link.icon
                className={cn(
                  'w-5 h-5 flex-shrink-0',
                  isActive ? 'text-primary-600' : 'text-gray-400'
                )}
              />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Quick book link for customers */}
      {role === 'CUSTOMER' && (
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/book"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            Book a Cleaning
          </Link>
        </div>
      )}

      {/* Sign out */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <LogOut className="w-5 h-5 text-gray-400" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
