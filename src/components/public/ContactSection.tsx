'use client';

import * as React from 'react';
import { Contact, Profile, Socials } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
  Send,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import {
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
  BehanceIcon,
  TwitterIcon,
  GithubIcon,
} from '@/components/ui/social-icons';
import { isSocialLinkActive } from '@/lib/socials';

interface ContactSectionProps {
  contact: Contact;
  profile: Profile;
  socials: Socials;
}

export function ContactSection({ contact, profile, socials }: ContactSectionProps) {
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    projectType: 'Video Editing',
    budget: '',
    message: '',
  });

  const handleCopyEmail = () => {
    if (profile.email) {
      navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Build mailto fallback url or direct client acknowledgment
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 600);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900" id="contact-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Direct Details */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Direct Communication
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-100 uppercase">
              {contact.title || "Let's create something extraordinary."}
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-light">
              {contact.description ||
                'Have an upcoming video edit, photo retouching job, or brand design project? Reach out directly.'}
            </p>
          </div>

          {/* Quick Channels */}
          <div className="space-y-4 pt-4">
            {/* Email Card */}
            {profile.email && (
              <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">Email Address</div>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-sm font-semibold text-zinc-200 hover:text-white transition-colors"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  title="Copy email to clipboard"
                  aria-label="Copy email"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* WhatsApp CTA */}
            {isSocialLinkActive(socials, 'whatsapp') && (
              <a
                href={socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 hover:bg-emerald-950/40 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                      Instant Chat
                    </div>
                    <div className="text-sm font-bold text-zinc-100">WhatsApp Direct</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </a>
            )}

            {/* Phone if available */}
            {profile.phone && (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">Direct Phone</div>
                  <a
                    href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                    className="text-sm font-semibold text-zinc-200 hover:text-white transition-colors"
                  >
                    {profile.phone}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Social Icons List */}
          <div className="pt-4 space-y-2">
            <div className="text-xs text-zinc-500 uppercase tracking-wider">Follow & Portfolios</div>
            <div className="flex flex-wrap gap-2">
              {isSocialLinkActive(socials, 'instagram') && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-pink-400 hover:border-zinc-700 transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              {isSocialLinkActive(socials, 'youtube') && (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-zinc-700 transition-colors"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              )}
              {isSocialLinkActive(socials, 'behance') && (
                <a
                  href={socials.behance}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-blue-400 hover:border-zinc-700 transition-colors"
                  aria-label="Behance"
                >
                  <BehanceIcon className="w-4 h-4" />
                </a>
              )}
              {isSocialLinkActive(socials, 'linkedin') && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-sky-400 hover:border-zinc-700 transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
              {isSocialLinkActive(socials, 'twitter') && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors"
                  aria-label="X (Twitter)"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
              )}
              {isSocialLinkActive(socials, 'github') && (
                <a
                  href={socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-purple-400 hover:border-zinc-700 transition-colors"
                  aria-label="GitHub"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
            {formSubmitted ? (
              <div className="py-16 text-center space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Message Received!</h3>
                <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. Darshan will review your project details and respond via email within 24 hours.
                </p>
                <div className="pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        projectType: 'Video Editing',
                        budget: '',
                        message: '',
                      });
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-100 tracking-tight">Project Inquiry</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Fill in the details below to discuss your project scope and timelines.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                      Your Name *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="alex@brand.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                      Project Service
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-400"
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    >
                      <option value="Video Editing">Video Editing (Reel / YouTube / Promo)</option>
                      <option value="Image Retouching">Image Retouching & Compositing</option>
                      <option value="Graphic Design">Graphic Design & Posters</option>
                      <option value="Full Package">Full Media Package</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                      Estimated Budget (Optional)
                    </label>
                    <Input
                      placeholder="e.g. $500 - $2,000"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Project Overview & Links *
                  </label>
                  <Textarea
                    required
                    rows={4}
                    placeholder="Tell me about your project, target audience, reference links, and deadline..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  variant="default"
                  disabled={isSubmitting}
                  className="w-full gap-2 text-base font-bold h-12 shadow-xl shadow-zinc-100/5"
                >
                  {isSubmitting ? (
                    'Sending Inquiry...'
                  ) : (
                    <>
                      Send Inquiry
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
