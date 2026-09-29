'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogOut, Globe, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminNavbarProps {
  username?: string;
  userPhoto?: string;
  profileName?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function AdminNavbar({
  username = 'Darshan',
  userPhoto,
  profileName,
  onRefresh,
  isRefreshing,
}: AdminNavbarProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between">
      {/* Brand & Badge */}
      <div className="flex items-center gap-3">
        {userPhoto ? (
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber-500/40 relative bg-zinc-900 shadow-md shrink-0">
            <Image
              src={userPhoto}
              alt={profileName || username}
              fill
              className="object-cover object-top"
              unoptimized={userPhoto.startsWith('data:') || userPhoto.includes('drive.google.com')}
            />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Shield className="w-4 h-4" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base text-zinc-100 tracking-wide uppercase">
              Portfolio Studio Admin
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              v1.0
            </span>
          </div>
          <div className="text-xs text-zinc-400 flex items-center gap-1.5">
            <span>Logged in as</span>
            <span className="text-zinc-200 font-medium">{profileName || username}</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="gap-1.5 text-xs hidden sm:inline-flex"
            title="Reload latest data from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}

        <Link href="/" target="_blank">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Live Site</span>
            <span className="sm:hidden">Site</span>
          </Button>
        </Link>

        <Button
          variant="destructive"
          size="sm"
          onClick={handleLogout}
          disabled={loggingOut}
          className="gap-1.5 text-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{loggingOut ? 'Signing out...' : 'Logout'}</span>
        </Button>
      </div>
    </header>
  );
}

