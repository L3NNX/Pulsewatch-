'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, AlertCircle, Settings, ExternalLink, LogOut, Radio } from 'lucide-react';
import { api, User } from '@/lib/api';
import { cn } from '@/lib/utils';

interface NavbarProps {
  user?: User | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [utcTime, setUtcTime] = useState<string>('00:00:00 UTC');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().split(' ')[4] + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const navLinks = [
    { href: '/dashboard', label: 'MONITORS', icon: LayoutDashboard },
    { href: '/incidents', label: 'INCIDENTS', icon: AlertCircle },
    { href: '/settings/channels', label: 'ALERT CHANNELS', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(0,255,136,0.16)] bg-[#060b10]/95 backdrop-blur-md font-mono">
      <div className="mx-auto flex h-13 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-2.5">
        {/* Brand & Left Status */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 group text-decoration-none">
            <span className="relative flex h-3.5 w-3.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00ff88] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88]" />
            </span>
            <span className="font-['Barlow_Condensed',sans-serif] font-black text-lg tracking-[0.16em] text-[#00ff88] uppercase drop-shadow-[0_0_8px_rgba(0,255,136,0.4)]">
              PULSEWATCH
            </span>
          </Link>

          <span className="hidden lg:inline text-[rgba(0,255,136,0.25)] select-none">|</span>
          <span className="hidden lg:inline text-[11px] tracking-widest uppercase text-[rgba(224,240,232,0.4)]">
            NOC CONSOLE v4.1.2
          </span>

          <span className="hidden sm:inline text-[rgba(0,255,136,0.25)] select-none">|</span>
          <span className="hidden sm:inline text-[11px] text-[rgba(224,240,232,0.55)]">
            {utcTime}
          </span>

          {/* Navigation Links */}
          {user && (
            <nav className="hidden md:flex items-center gap-2 border-l border-[rgba(0,255,136,0.16)] pl-5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-3 py-1 text-[11px] tracking-wider uppercase font-semibold transition-all',
                      isActive
                        ? 'bg-[rgba(0,255,136,0.12)] text-[#00ff88] border border-[rgba(0,255,136,0.35)] shadow-[0_0_10px_rgba(0,255,136,0.1)]'
                        : 'text-[rgba(224,240,232,0.55)] hover:text-[#00ff88] hover:bg-[rgba(0,255,136,0.05)] border border-transparent'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/status/demo"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-[11px] tracking-wider uppercase text-[rgba(224,240,232,0.6)] hover:text-[#00ff88] border border-[rgba(0,255,136,0.2)] px-2.5 py-1 bg-[rgba(10,18,26,0.8)] transition-all hover:border-[rgba(0,255,136,0.4)]"
              >
                <Radio className="h-3 w-3 text-[#00ff88]" />
                <span>PUBLIC STATUS</span>
                <ExternalLink className="h-2.5 w-2.5 text-[rgba(224,240,232,0.4)]" />
              </Link>

              <div className="flex items-center gap-2.5 pl-2 border-l border-[rgba(0,255,136,0.16)]">
                <span className="text-[11px] text-[rgba(224,240,232,0.45)] hidden sm:inline">
                  [{user.email}]
                </span>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-[rgba(224,240,232,0.5)] hover:text-[#ff3030] hover:bg-[rgba(255,48,48,0.1)] border border-transparent hover:border-[rgba(255,48,48,0.3)] transition-all"
                  title="Sign out of console"
                  aria-label="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1 text-[11px] tracking-wider uppercase text-[rgba(224,240,232,0.55)] hover:text-[#00ff88] transition-colors"
              >
                SIGN IN
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 text-xs font-['Barlow_Condensed',sans-serif] font-bold tracking-wider uppercase bg-[#00ff88] text-[#060b10] hover:shadow-[0_0_12px_rgba(0,255,136,0.5)] transition-all"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                }}
              >
                LAUNCH NOC →
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
