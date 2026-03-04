import { Navbar } from '@/components/navbar';
import { QuickBook } from '@/components/booking/quick-book';

export const metadata = {
  title: 'Book a Cleaning — McClean',
};

export default function BookPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-teal-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-24">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Book a Cleaning
          </h1>
          <p className="text-gray-500 text-lg">
            Find and book a trusted cleaner near you in under 30 seconds.
          </p>
        </div>
        <QuickBook />
      </div>
    </main>
  );
}
