'use client';

import * as React from 'react';
import { Profile, Hero, Settings } from '@/types/portfolio';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, User, Sparkles, Sliders } from 'lucide-react';
import { UserPhotoManager } from '@/components/admin/UserPhotoManager';

interface ProfileHeroManagerProps {
  profile: Profile;
  hero: Hero;
  settings: Settings;
  onRefresh: () => void;
}

export function ProfileHeroManager({
  profile,
  hero,
  settings,
  onRefresh,
}: ProfileHeroManagerProps) {
  // Profile State
  const [name, setName] = React.useState(profile.name || '');
  const [role, setRole] = React.useState(profile.role || '');
  const [bio, setBio] = React.useState(profile.bio || '');
  const [profileImage, setProfileImage] = React.useState(profile.profileImage || '');
  const [email, setEmail] = React.useState(profile.email || '');
  const [phone, setPhone] = React.useState(profile.phone || '');
  const [location, setLocation] = React.useState(profile.location || '');
  const [availabilityStatus, setAvailabilityStatus] = React.useState(profile.availabilityStatus || '');

  // Hero State
  const [heroTitle, setHeroTitle] = React.useState(hero.title || '');
  const [heroSubtitle, setHeroSubtitle] = React.useState(hero.subtitle || '');
  const [primaryCta, setPrimaryCta] = React.useState(hero.primaryCta || '');
  const [secondaryCta, setSecondaryCta] = React.useState(hero.secondaryCta || '');

  // Settings State
  const [featuredLimit, setFeaturedLimit] = React.useState(settings.featuredProjectLimit || 6);

  const [savingProfile, setSavingProfile] = React.useState(false);
  const [savingHero, setSavingHero] = React.useState(false);
  const [profileSaved, setProfileSaved] = React.useState(false);
  const [heroSaved, setHeroSaved] = React.useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSaved(false);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          role: role.trim(),
          bio: bio.trim(),
          profileImage: profileImage.trim(),
          email: email.trim(),
          phone: phone.trim(),
          location: location.trim(),
          availabilityStatus: availabilityStatus.trim(),
        }),
      });
      if (res.ok) {
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
        onRefresh();
      }
    } catch (err) {
      console.error('Save profile failed:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveHeroAndSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHero(true);
    setHeroSaved(false);
    try {
      const heroRes = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: heroTitle.trim(),
          subtitle: heroSubtitle.trim(),
          primaryCta: primaryCta.trim(),
          secondaryCta: secondaryCta.trim(),
        }),
      });

      const settingsRes = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featuredProjectLimit: Number(featuredLimit) || 6,
        }),
      });

      if (heroRes.ok && settingsRes.ok) {
        setHeroSaved(true);
        setTimeout(() => setHeroSaved(false), 3000);
        onRefresh();
      }
    } catch (err) {
      console.error('Save hero/settings failed:', err);
    } finally {
      setSavingHero(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Interactive User Photo Manager */}
      <UserPhotoManager
        currentPhoto={profileImage}
        name={name}
        onPhotoChange={(newUrl) => {
          setProfileImage(newUrl);
        }}
        onRefresh={onRefresh}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Card */}
        <Card className="p-6 border-zinc-800 bg-zinc-950/60">
          <CardHeader className="p-0 pb-6 border-b border-zinc-800/80 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" />
                <CardTitle className="text-lg text-zinc-100">Profile Information</CardTitle>
              </div>
              {profileSaved && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
            </div>
            <CardDescription>
              Your display name, professional role, bio, and direct contact details.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Display Name *
                </label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Professional Role *
                </label>
                <Input
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Short Bio *
              </label>
              <Textarea
                rows={3}
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Profile Photo URL
              </label>
              <Input
                placeholder="https://... (or use the uploader above)"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
              />
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Phone Number
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Location
              </label>
              <Input
                placeholder="e.g. Mumbai, India / Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Availability Badge Text
              </label>
              <Input
                placeholder="e.g. Available for Projects"
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="default" disabled={savingProfile} className="w-full">
              {savingProfile ? 'Saving Profile...' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Hero & Settings Card */}
      <div className="space-y-8">
        <Card className="p-6 border-zinc-800 bg-zinc-950/60">
          <CardHeader className="p-0 pb-6 border-b border-zinc-800/80 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <CardTitle className="text-lg text-zinc-100">Hero Section & CTAs</CardTitle>
              </div>
              {heroSaved && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
            </div>
            <CardDescription>
              Customise the primary headline and buttons visitors see first.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSaveHeroAndSettings} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Hero Headline *
              </label>
              <Input
                required
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Hero Subtitle *
              </label>
              <Textarea
                rows={3}
                required
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Primary CTA Text
                </label>
                <Input
                  value={primaryCta}
                  onChange={(e) => setPrimaryCta(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Secondary CTA Text
                </label>
                <Input
                  value={secondaryCta}
                  onChange={(e) => setSecondaryCta(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-zinc-800">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Featured Projects Limit
              </label>
              <Input
                type="number"
                min={1}
                max={20}
                value={featuredLimit}
                onChange={(e) => setFeaturedLimit(Number(e.target.value))}
              />
              <p className="text-[11px] text-zinc-500">
                Maximum number of featured projects displayed in the homepage highlight section.
              </p>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="default" disabled={savingHero} className="w-full">
                {savingHero ? 'Saving Hero & Settings...' : 'Save Hero & Settings'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
    </div>
  );
}
