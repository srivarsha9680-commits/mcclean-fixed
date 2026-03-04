'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/book', label: 'Book Cleaning' },
  { href: '/register?type=cleaner', label: 'For Cleaners' },
  { href: '/#how-it-works', label: 'How It Works' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const initials = session?.user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  const dashboardHref =
    session?.user?.role === 'CLEANER' ? '/cleaner' : '/customer';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-xl text-gray-900">McClean</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <Link href={dashboardHref}>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-7 w-7">
                    {session.user?.image && (
                      <AvatarImage src={session.user.image} />
                    )}
                    <AvatarFallback className="text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 transition-all duration-200',
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        )}
      >
        <div className="px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-gray-600 hover:text-primary-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-gray-200" />
          {session ? (
            <Link href={dashboardHref} onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Log In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
