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
  MessageCircle,
  Mail
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon, LinkedinIcon, BehanceIcon } from '@/components/ui/social-icons';

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
  // Socials State
  const [instagram, setInstagram] = React.useState(socials.instagram || '');
  const [youtube, setYoutube] = React.useState(socials.youtube || '');
  const [behance, setBehance] = React.useState(socials.behance || '');
  const [linkedin, setLinkedin] = React.useState(socials.linkedin || '');
  const [whatsapp, setWhatsapp] = React.useState(socials.whatsapp || '');

  // Contact State
  const [title, setTitle] = React.useState(contact.title || '');
  const [description, setDescription] = React.useState(contact.description || '');
  const [customNote, setCustomNote] = React.useState(contact.customNote || '');

  const [savingSocials, setSavingSocials] = React.useState(false);
  const [savingContact, setSavingContact] = React.useState(false);
  const [socialsSaved, setSocialsSaved] = React.useState(false);
  const [contactSaved, setContactSaved] = React.useState(false);

  const handleSaveSocials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSocials(true);
    setSocialsSaved(false);
    try {
      const res = await fetch('/api/admin/socials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagram: instagram.trim(),
          youtube: youtube.trim(),
          behance: behance.trim(),
          linkedin: linkedin.trim(),
          whatsapp: whatsapp.trim(),
        }),
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Social Links Form */}
      <Card className="p-6 border-zinc-800 bg-zinc-950/60">
        <CardHeader className="p-0 pb-6 border-b border-zinc-800 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-amber-400" />
              <CardTitle className="text-lg text-zinc-100">Social Media & Portfolios</CardTitle>
            </div>
            {socialsSaved && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
          </div>
          <CardDescription>
            Update external portfolio and instant chat URLs.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSaveSocials} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <InstagramIcon className="w-4 h-4 text-pink-400" /> Instagram Profile URL
            </label>
            <Input
              placeholder="https://instagram.com/..."
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <YoutubeIcon className="w-4 h-4 text-red-400" /> YouTube Channel URL
            </label>
            <Input
              placeholder="https://youtube.com/@..."
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <BehanceIcon className="w-4 h-4 text-blue-400" /> Behance Portfolio URL
            </label>
            <Input
              placeholder="https://behance.net/..."
              value={behance}
              onChange={(e) => setBehance(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <LinkedinIcon className="w-4 h-4 text-blue-500" /> LinkedIn Profile URL
            </label>
            <Input
              placeholder="https://linkedin.com/in/..."
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp Direct Link
            </label>
            <Input
              placeholder="https://wa.me/91..."
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="default" disabled={savingSocials} className="w-full">
              {savingSocials ? 'Saving Socials...' : 'Save Social Links'}
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
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
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
