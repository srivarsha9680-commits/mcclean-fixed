'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, Mail, Lock, User, Home, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

type Role = 'CUSTOMER' | 'CLEANER';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get('type') === 'cleaner' ? 'CLEANER' : 'CUSTOMER') as Role;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(defaultRole);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        return;
      }

      // Auto sign in after registration
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push('/login');
      } else {
        router.push(role === 'CLEANER' ? '/cleaner' : '/customer');
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card className="shadow-xl border-0">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold text-center">Create your account</CardTitle>
          <CardDescription className="text-center">
            Join thousands of people on McClean
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('CUSTOMER')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium',
                  role === 'CUSTOMER'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                )}
              >
                <Home className="w-6 h-6" />
                I need cleaning
              </button>
              <button
                type="button"
                onClick={() => setRole('CLEANER')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium',
                  role === 'CLEANER'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                )}
              >
                <Briefcase className="w-6 h-6" />
                I&apos;m a cleaner
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="name"
                  placeholder="Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                  minLength={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                `Create ${role === 'CLEANER' ? 'Cleaner' : 'Customer'} Account`
              )}
            </Button>

            <p className="text-xs text-center text-gray-400">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-gray-600">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-gray-600">
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-0">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">
              Already have an account?
            </div>
          </div>
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full">
              Sign In
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
