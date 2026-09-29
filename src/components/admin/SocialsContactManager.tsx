'use client';

import * as React from 'react';
import { Socials, Contact } from '@/types/portfolio';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  CheckCircle2,
  Share2,
  Mail,
  ExternalLink,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  MessageCircle,
} from 'lucide-react';
import {
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
  BehanceIcon,
  TwitterIcon,
  GithubIcon,
} from '@/components/ui/social-icons';
import { SOCIAL_PLATFORMS } from '@/lib/socials';

interface SocialsContactManagerProps {
  socials: Socials;
  contact: Contact;
  onRefresh: () => void;
}

export function SocialsContactManager({
  socials,
  contact,
  onRefresh,
}: SocialsContactManagerProps) {
  // Socials URLs state
  const [urls, setUrls] = React.useState<Record<string, string>>({
    instagram: socials.instagram || '',
    youtube: socials.youtube || '',
    behance: socials.behance || '',
    linkedin: socials.linkedin || '',
    whatsapp: socials.whatsapp || '',
    twitter: socials.twitter || '',
    github: socials.github || '',
  });

  // Enabled toggles state (default to true if not explicitly false)
  const [enabledState, setEnabledState] = React.useState<Record<string, boolean>>({
    instagram: socials.enabled?.instagram !== false,
    youtube: socials.enabled?.youtube !== false,
    behance: socials.enabled?.behance !== false,
    linkedin: socials.enabled?.linkedin !== false,
    whatsapp: socials.enabled?.whatsapp !== false,
    twitter: socials.enabled?.twitter !== false,
    github: socials.enabled?.github !== false,
  });

  // Sync state if prop changes
  const [prevSocials, setPrevSocials] = React.useState(socials);
  if (socials !== prevSocials) {
    setPrevSocials(socials);
    setUrls({
      instagram: socials.instagram || '',
      youtube: socials.youtube || '',
      behance: socials.behance || '',
      linkedin: socials.linkedin || '',
      whatsapp: socials.whatsapp || '',
      twitter: socials.twitter || '',
      github: socials.github || '',
    });
    setEnabledState({
      instagram: socials.enabled?.instagram !== false,
      youtube: socials.enabled?.youtube !== false,
      behance: socials.enabled?.behance !== false,
      linkedin: socials.enabled?.linkedin !== false,
      whatsapp: socials.enabled?.whatsapp !== false,
      twitter: socials.enabled?.twitter !== false,
      github: socials.enabled?.github !== false,
    });
  }

  // Contact State
  const [title, setTitle] = React.useState(contact.title || '');
  const [description, setDescription] = React.useState(contact.description || '');
  const [customNote, setCustomNote] = React.useState(contact.customNote || '');

  const [savingSocials, setSavingSocials] = React.useState(false);
  const [savingContact, setSavingContact] = React.useState(false);
  const [socialsSaved, setSocialsSaved] = React.useState(false);
  const [contactSaved, setContactSaved] = React.useState(false);

  const handleUrlChange = (key: string, value: string) => {
    setUrls((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key: string) => {
    setEnabledState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEnableAll = () => {
    const next: Record<string, boolean> = {};
    SOCIAL_PLATFORMS.forEach((p) => {
      next[p.key] = true;
    });
    setEnabledState(next);
  };

  const handleDisableAll = () => {
    const next: Record<string, boolean> = {};
    SOCIAL_PLATFORMS.forEach((p) => {
      next[p.key] = false;
    });
    setEnabledState(next);
  };

  const handleSaveSocials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSocials(true);
    setSocialsSaved(false);

    try {
      const payload: Socials = {
        instagram: urls.instagram.trim(),
        youtube: urls.youtube.trim(),
        behance: urls.behance.trim(),
        linkedin: urls.linkedin.trim(),
        whatsapp: urls.whatsapp.trim(),
        twitter: urls.twitter.trim(),
        github: urls.github.trim(),
        enabled: { ...enabledState },
      };

      const res = await fetch('/api/admin/socials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSocialsSaved(true);
        setTimeout(() => setSocialsSaved(false), 3000);
        onRefresh();
      }
    } catch (err) {
      console.error('Save socials failed:', err);
    } finally {
      setSavingSocials(false);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingContact(true);
    setContactSaved(false);

    try {
      const res = await fetch('/api/admin/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          customNote: customNote.trim(),
        }),
      });

      if (res.ok) {
        setContactSaved(true);
        setTimeout(() => setContactSaved(false), 3000);
        onRefresh();
      }
    } catch (err) {
      console.error('Save contact failed:', err);
    } finally {
      setSavingContact(false);
    }
  };

  // Render platform icon helper
  const renderPlatformIcon = (key: string, className = 'w-4 h-4') => {
    switch (key) {
      case 'instagram':
        return <InstagramIcon className={className} />;
      case 'youtube':
        return <YoutubeIcon className={className} />;
      case 'behance':
        return <BehanceIcon className={className} />;
      case 'linkedin':
        return <LinkedinIcon className={className} />;
      case 'whatsapp':
        return <MessageCircle className={className} />;
      case 'twitter':
        return <TwitterIcon className={className} />;
      case 'github':
        return <GithubIcon className={className} />;
      default:
        return <Share2 className={className} />;
    }
  };

  const activeCount = SOCIAL_PLATFORMS.filter(
    (p) => enabledState[p.key] && urls[p.key]?.trim().length > 0
  ).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Social Links & Visibility Manager */}
      <Card className="p-6 border-zinc-800 bg-zinc-950/80 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Light */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <CardHeader className="p-0 pb-6 border-b border-zinc-800 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-zinc-100 flex items-center gap-2">
                  Social Channels & Visibility
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {activeCount} Active
                  </span>
                </CardTitle>
                <CardDescription className="text-zinc-400 text-xs mt-0.5">
                  Enable or disable which platforms visitors can see in the footer and contact area.
                </CardDescription>
              </div>
            </div>

            {socialsSaved && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Saved to Supabase!
              </span>
            )}
          </div>

          {/* Quick Actions & Live Badge Strip */}
          <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleEnableAll}
                className="text-xs h-7 px-2.5 text-zinc-300 hover:text-white border-zinc-700"
              >
                Enable All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDisableAll}
                className="text-xs h-7 px-2.5 text-zinc-400 hover:text-zinc-200 border-zinc-800"
              >
                Disable All
              </Button>
            </div>

            {/* Live Website Preview Pill Strip */}
            <div className="flex items-center gap-1.5 bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-zinc-800 text-[11px] text-zinc-400">
              <span className="text-zinc-500 font-medium mr-1">Preview:</span>
              {SOCIAL_PLATFORMS.map((platform) => {
                const isActive = enabledState[platform.key] && urls[platform.key]?.trim().length > 0;
                return (
                  <span
                    key={platform.key}
                    title={`${platform.label}: ${isActive ? 'Visible' : 'Hidden'}`}
                    className={`transition-all duration-200 ${
                      isActive ? platform.colorClass + ' opacity-100 scale-105' : 'text-zinc-700 opacity-40'
                    }`}
                  >
                    {renderPlatformIcon(platform.key, 'w-3.5 h-3.5')}
                  </span>
                );
              })}
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSaveSocials} className="space-y-4">
          {SOCIAL_PLATFORMS.map((platform) => {
            const isEnabled = enabledState[platform.key];
            const hasUrl = urls[platform.key]?.trim().length > 0;
            const isFullyActive = isEnabled && hasUrl;

            return (
              <div
                key={platform.key}
                className={`p-3.5 rounded-xl border transition-all duration-200 ${
                  isFullyActive
                    ? 'bg-zinc-900/40 border-zinc-700/80'
                    : isEnabled
                    ? 'bg-zinc-950 border-zinc-800/80'
                    : 'bg-zinc-950/40 border-zinc-900 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={platform.colorClass}>
                      {renderPlatformIcon(platform.key, 'w-4 h-4')}
                    </span>
                    <span className="text-xs font-semibold text-zinc-200">
                      {platform.label}
                    </span>
                    {isFullyActive ? (
                      <span className="text-[10px] font-semibold text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-0.5">
                        <Eye className="w-2.5 h-2.5" /> Visible
                      </span>
                    ) : isEnabled ? (
                      <span className="text-[10px] text-zinc-400 px-1.5 py-0.2 rounded bg-zinc-800 border border-zinc-700">
                        No URL Set
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-zinc-400 px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 flex items-center gap-0.5">
                        <EyeOff className="w-2.5 h-2.5 text-zinc-400" /> Hidden
                      </span>
                    )}
                  </div>

                  {/* Enable/Disable Toggle Switch Button */}
                  <button
                    type="button"
                    onClick={() => handleToggle(platform.key)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                      isEnabled
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                        : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                    }`}
                    title={isEnabled ? 'Click to hide this channel' : 'Click to enable this channel'}
                  >
                    {isEnabled ? (
                      <>
                        <ToggleRight className="w-4 h-4 text-emerald-400" />
                        <span>Enabled</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4 text-zinc-500" />
                        <span>Disabled</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder={platform.placeholder}
                    value={urls[platform.key]}
                    onChange={(e) => handleUrlChange(platform.key, e.target.value)}
                    className={`font-mono text-xs bg-zinc-950 border-zinc-800 focus-visible:ring-amber-500/50 ${
                      !isEnabled ? 'text-zinc-500' : ''
                    }`}
                  />
                  {hasUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(urls[platform.key], '_blank')}
                      className="shrink-0 h-9 px-2 text-zinc-400 hover:text-white border-zinc-700"
                      title="Test URL in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          <div className="pt-3">
            <Button
              type="submit"
              variant="default"
              disabled={savingSocials}
              className="w-full gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {savingSocials ? 'Saving Social Channels...' : 'Save Social Channels & Visibility'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Contact Section Settings */}
      <Card className="p-6 border-zinc-800 bg-zinc-950/60">
        <CardHeader className="p-0 pb-6 border-b border-zinc-800 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-400" />
              <CardTitle className="text-lg text-zinc-100">Contact Section Messaging</CardTitle>
            </div>
            {contactSaved && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Saved!
              </span>
            )}
          </div>
          <CardDescription>
            Customize the heading, call-to-action description, and availability notes.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSaveContact} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Contact Title *
            </label>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Contact Overview Description *
            </label>
            <Textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Custom Response Time Note
            </label>
            <Input
              placeholder="e.g. Average response time: within 24 hours."
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="default" disabled={savingContact} className="w-full">
              {savingContact ? 'Saving Contact...' : 'Save Contact Settings'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
