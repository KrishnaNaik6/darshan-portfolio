import Image from 'next/image';
import { PortfolioData } from '@/types/portfolio';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Film,
  Image as ImageIcon,
  Palette,
  Sparkles,
  Layers,
  PlusCircle,
  HardDrive,
  CheckCircle2,
  FolderTree,
  Database,
  RefreshCw,
  Camera
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface DashboardOverviewProps {
  data: PortfolioData;
  onNavigateTab: (tab: string) => void;
  onOpenNewProject: () => void;
}

export function DashboardOverview({
  data,
  onNavigateTab,
  onOpenNewProject,
}: DashboardOverviewProps) {
  const [supabaseStatus, setSupabaseStatus] = useState<{
    configured: boolean;
    connected?: boolean;
    message?: string;
    updatedAt?: string | null;
  } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/supabase')
      .then((res) => res.json())
      .then((json) => setSupabaseStatus(json))
      .catch(() => setSupabaseStatus({ configured: false, message: 'Could not check status' }));
  }, []);

  const handleSyncToSupabase = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await fetch('/api/admin/supabase', { method: 'POST' });
      const json = await res.json();
      if (res.ok) {
        setSyncFeedback('✅ Successfully synced all content to Supabase database!');
        const updated = await fetch('/api/admin/supabase').then((r) => r.json());
        setSupabaseStatus(updated);
      } else {
        setSyncFeedback(`❌ ${json.error || 'Failed to sync'}`);
      }
    } catch {
      setSyncFeedback('❌ Network error during sync');
    } finally {
      setIsSyncing(false);
    }
  };

  const totalProjects = data.projects.length;
  const featuredProjects = data.projects.filter((p) => p.featured).length;
  const videoProjects = data.projects.filter((p) => p.category === 'video').length;
  const imageProjects = data.projects.filter((p) => p.category === 'image').length;
  const graphicProjects = data.projects.filter((p) => p.category === 'graphic').length;
  const totalServices = data.services.length;

  const statCards = [
    {
      title: 'Total Projects',
      value: totalProjects,
      description: 'Items in portfolio',
      icon: <Layers className="w-5 h-5 text-zinc-300" />,
      color: 'border-zinc-800',
    },
    {
      title: 'Featured Projects',
      value: featuredProjects,
      description: 'Highlighted on homepage',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-900/40 bg-amber-950/10',
    },
    {
      title: 'Video Projects',
      value: videoProjects,
      description: 'Reels, promos & edits',
      icon: <Film className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-900/40 bg-emerald-950/10',
    },
    {
      title: 'Image Retouching',
      value: imageProjects,
      description: 'Retouch & composites',
      icon: <ImageIcon className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-900/40 bg-amber-950/10',
    },
    {
      title: 'Graphic Designs',
      value: graphicProjects,
      description: 'Posters, covers & kits',
      icon: <Palette className="w-5 h-5 text-indigo-400" />,
      color: 'border-indigo-900/40 bg-indigo-950/10',
    },
    {
      title: 'Active Services',
      value: totalServices,
      description: 'Offerings listed on site',
      icon: <CheckCircle2 className="w-5 h-5 text-zinc-400" />,
      color: 'border-zinc-800',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Supabase Status Banner */}
      {supabaseStatus && (
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          supabaseStatus.connected
            ? 'border-emerald-800/40 bg-emerald-950/20 text-emerald-300'
            : supabaseStatus.configured
            ? 'border-amber-800/40 bg-amber-950/20 text-amber-300'
            : 'border-zinc-800 bg-zinc-900/40 text-zinc-400'
        }`}>
          <div className="flex items-center gap-2.5">
            <Database className={`w-4 h-4 shrink-0 ${
              supabaseStatus.connected ? 'text-emerald-400' : 'text-zinc-400'
            }`} />
            <div>
              <span className="font-bold">
                {supabaseStatus.connected
                  ? 'Supabase Database: Connected & Syncing'
                  : supabaseStatus.configured
                  ? 'Supabase: Configured (Requires Schema Setup)'
                  : 'Storage Mode: Local JSON / Serverless Fallback'}
              </span>
              <p className="text-[11px] opacity-80 pt-0.5">{supabaseStatus.message}</p>
              {syncFeedback && <p className="font-semibold pt-1">{syncFeedback}</p>}
            </div>
          </div>

          {supabaseStatus.configured && (
            <Button
              size="sm"
              variant="outline"
              disabled={isSyncing}
              onClick={handleSyncToSupabase}
              className="gap-1.5 shrink-0 text-xs h-8 border-emerald-800/60 hover:bg-emerald-950/40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync to Supabase Now'}
            </Button>
          )}
        </div>
      )}

      {/* Quick Action Bar with Avatar & Shortcuts */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900/90 via-zinc-900/50 to-zinc-950 relative overflow-hidden">
        <div className="flex items-center gap-4">
          {/* User Photo Avatar */}
          <div
            onClick={() => onNavigateTab('profile')}
            className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-500/30 relative bg-zinc-950 shrink-0 cursor-pointer group shadow-lg hover:border-amber-500 transition-all"
            title="Click to manage photo"
          >
            {data.profile.profileImage ? (
              <Image
                src={data.profile.profileImage}
                alt={data.profile.name || 'Darshan'}
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform"
                unoptimized={data.profile.profileImage.startsWith('data:') || data.profile.profileImage.includes('drive.google.com')}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-amber-500 font-bold font-mono text-lg">
                DP
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-semibold transition-opacity">
              Edit
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              Welcome back, {data.profile.name || 'Darshan'}
              <span className="text-[11px] font-normal text-amber-400/90 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                {data.profile.role || 'Video Editor'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light">
              Manage your visual projects, services, profile photo, and Google Drive media connections.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 w-full lg:w-auto">
          <Button onClick={onOpenNewProject} variant="accent" className="gap-2 text-xs sm:text-sm flex-1 sm:flex-initial">
            <PlusCircle className="w-4 h-4" />
            Add New Project
          </Button>
          <Button onClick={() => onNavigateTab('profile')} variant="outline" className="gap-1.5 text-xs sm:text-sm flex-1 sm:flex-initial">
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            Manage Photo & Profile
          </Button>
          <Button onClick={() => onNavigateTab('drive-tester')} variant="secondary" className="text-xs sm:text-sm gap-1.5 flex-1 sm:flex-initial">
            <HardDrive className="w-3.5 h-3.5" />
            Test Drive Link
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className={`p-4 space-y-2 ${stat.color}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium line-clamp-1">{stat.title}</span>
              {stat.icon}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
            <div className="text-[11px] text-zinc-500 line-clamp-1">{stat.description}</div>
          </Card>
        ))}
      </div>

      {/* Google Drive Organization Guidelines Box */}
      <Card className="p-6 border-zinc-800 bg-zinc-950/60">
        <CardHeader className="p-0 pb-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
            <FolderTree className="w-4 h-4" />
            Google Drive Media Workflow Guide
          </div>
          <CardTitle className="text-base sm:text-lg text-zinc-200">
            How to link your videos and images seamlessly:
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4 text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-2">
              <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-amber-400 text-xs flex items-center justify-center font-mono">
                  1
                </span>
                Upload to Google Drive
              </div>
              <p className="text-zinc-400 text-xs">
                Upload your video or high-res graphic into your Google Drive folder structure (e.g., <code>Darshan Portfolio / Videos / Reels</code>).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-2">
              <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-amber-400 text-xs flex items-center justify-center font-mono">
                  2
                </span>
                Set File Sharing to &quot;Anyone with the link&quot;
              </div>
              <p className="text-zinc-400 text-xs">
                Right-click the file in Drive → Share → change General Access to <strong>&quot;Anyone with the link can view&quot;</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-2">
              <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-amber-400 text-xs flex items-center justify-center font-mono">
                  3
                </span>
                Paste Link into Project Form
              </div>
              <p className="text-zinc-400 text-xs">
                Copy the link and paste it into the <em>Media URL</em> or <em>Thumbnail URL</em> field. The app automatically extracts the file ID and builds the video player &amp; high-res image previews.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
