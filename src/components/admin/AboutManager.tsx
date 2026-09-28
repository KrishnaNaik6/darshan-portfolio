'use client';

import * as React from 'react';
import { About, StatItem } from '@/types/portfolio';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Plus, Trash2, BookOpen } from 'lucide-react';

interface AboutManagerProps {
  about: About;
  onRefresh: () => void;
}

export function AboutManager({ about, onRefresh }: AboutManagerProps) {
  const [description, setDescription] = React.useState(about.description || '');
  const [story, setStory] = React.useState(about.story || '');
  const [skillsString, setSkillsString] = React.useState((about.skills || []).join(', '));
  
  // Stats state
  const [stats, setStats] = React.useState<StatItem[]>(
    about.stats && about.stats.length > 0
      ? about.stats
      : [
          { label: 'Projects Completed', value: '250+' },
          { label: 'Client Satisfaction', value: '99%' },
          { label: 'Views Generated', value: '45M+' },
          { label: 'Years Experience', value: '5+' },
        ]
  );

  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const handleStatChange = (index: number, field: keyof StatItem, value: string) => {
    const next = [...stats];
    next[index] = { ...next[index], [field]: value };
    setStats(next);
  };

  const addStat = () => {
    setStats([...stats, { label: 'New Metric', value: '100+' }]);
  };

  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const skills = skillsString
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description.trim(),
          story: story.trim(),
          skills,
          stats,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        onRefresh();
      }
    } catch (err) {
      console.error('Save about failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6 border-zinc-800 bg-zinc-950/60 max-w-4xl">
      <CardHeader className="p-0 pb-6 border-b border-zinc-800 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <CardTitle className="text-lg text-zinc-100">About, Skills & Stats</CardTitle>
          </div>
          {saved && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> Changes Saved!
            </span>
          )}
        </div>
        <CardDescription>
          Edit your full editorial story, toolkit software list, and career statistics.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Short Summary Overview *
          </label>
          <Textarea
            rows={2}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Full Biography Story *
          </label>
          <Textarea
            rows={5}
            required
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Write your creative journey, background, and editing philosophy..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Software & Skills (Comma separated)
          </label>
          <Textarea
            rows={2}
            value={skillsString}
            onChange={(e) => setSkillsString(e.target.value)}
            placeholder="Adobe Premiere Pro, DaVinci Resolve Studio, After Effects, Photoshop"
          />
          <p className="text-[11px] text-zinc-500">
            These will be displayed as badge pills on the homepage and about page.
          </p>
        </div>

        {/* Stats Editor */}
        <div className="space-y-3 pt-4 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Showcase Numbers / Stats
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addStat}
              className="text-xs gap-1 h-7"
            >
              <Plus className="w-3 h-3" /> Add Stat
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-3 rounded-xl border border-zinc-800 bg-zinc-900/40"
              >
                <div className="w-1/3">
                  <Input
                    placeholder="250+"
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    className="h-8 text-xs font-bold font-mono"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Projects Done"
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStat(idx)}
                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800">
          <Button type="submit" variant="default" disabled={saving} className="w-full">
            {saving ? 'Saving About & Skills...' : 'Save About Changes'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
