import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'PulseWatch | Uptime Monitoring & Public Status Pages',
  description:
    'Reliable, lightweight uptime monitoring, incident detection, AI-written summaries, and public status pages for developers and small teams.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#060b10] text-[#e0f0e8] antialiased selection:bg-[#00ff88]/20 selection:text-[#00ff88]">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
