import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'PulseWatch | Know Before Your Users Do',
  description:
    'High-precision HTTP probes, automated AI postmortems, and public status pages for modern SaaS teams.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-[#171e19] font-satoshi antialiased selection:bg-[#ffe17c] selection:text-[#171e19]">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
