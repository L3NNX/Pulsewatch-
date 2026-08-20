'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { api, User } from '@/lib/api';

interface NavbarProps {
  user?: User | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

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
    { href: '#features', label: 'Features' },
    { href: '#problem-solution', label: 'Why PulseWatch' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#testimonials', label: 'Reviews' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-white/90 backdrop-blur-md border-b border-[#171e19]/10">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Left: Logo in 'Anton' (3xl, uppercase) with a yellow period */}
        <Link href="/" className="flex items-center group">
          <span className="font-anton text-3xl uppercase tracking-normal text-[#171e19]">
            PULSEWATCH<span className="text-[#ffe17c]">.</span>
          </span>
        </Link>

        {/* Center: Nav links in 'Satoshi' (sm, font-medium) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-satoshi text-sm font-medium text-[#171e19]/70 hover:text-[#171e19] transition-colors"
            >
              {link.label}
            </a>
          ))}
          {user && (
            <Link
              href="/dashboard"
              className="font-satoshi text-sm font-bold text-[#171e19] hover:underline"
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right side: Text-only 'Login' link and a pill-shaped button */}
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/status/demo"
                target="_blank"
                className="hidden sm:inline-block font-satoshi text-sm font-medium text-[#171e19]/70 hover:text-[#171e19]"
              >
                Public Status
              </Link>
              <Link
                href="/dashboard"
                className="bg-[#171e19] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#272727] transition-all duration-200"
              >
                Open Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-satoshi text-[#171e19]/60 hover:text-red-600"
                title="Log out"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="font-satoshi text-sm font-medium text-[#171e19]/80 hover:text-[#171e19] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-[#171e19] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#272727] hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
