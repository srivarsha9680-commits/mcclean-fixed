import Link from 'next/link';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-teal-50 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="font-bold text-xl text-gray-900">McClean</span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} McClean. All rights reserved.
      </footer>
    </div>
  );
}
