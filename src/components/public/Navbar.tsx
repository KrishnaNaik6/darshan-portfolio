'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavbarProps {
  brandName?: string;
  role?: string;
}

export function Navbar({ brandName = 'DARSHAN', role = 'Editor & Designer' }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/work', label: 'Work' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80 py-3.5 shadow-lg shadow-black/40'
          : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-md"
        >
          <div className="w-8 h-8 rounded-md bg-zinc-100 text-zinc-950 flex items-center justify-center font-black text-sm tracking-tighter shadow-sm group-hover:bg-amber-400 transition-colors">
            <Film className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg tracking-widest text-zinc-100 uppercase group-hover:text-white transition-colors">
              {brandName}
            </span>
            <span className="text-[10px] tracking-wider text-zinc-400 uppercase -mt-1 hidden sm:block">
              {role}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-zinc-800/80 bg-zinc-900/60 px-4 py-1.5 backdrop-blur-md shadow-inner">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3.5 py-1 text-sm font-medium rounded-full transition-all duration-200',
                  isActive
                    ? 'text-zinc-100 bg-zinc-800 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/contact">
            <Button variant="default" size="sm" className="gap-1.5 group">
              Let&apos;s Work
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-zinc-950/95 border-b border-zinc-800 backdrop-blur-xl px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-lg text-base font-medium transition-colors flex items-center justify-between',
                    isActive
                      ? 'bg-zinc-800 text-white font-semibold'
                      : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  )}
                >
                  {link.label}
                  <ArrowUpRight className="w-4 h-4 opacity-50" />
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-zinc-800/80">
            <Link href="/contact" onClick={() => setIsOpen(false)} className="w-full block">
              <Button variant="default" className="w-full justify-center gap-2">
                Let&apos;s Work Together
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
