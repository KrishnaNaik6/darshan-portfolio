'use client';

import * as React from 'react';
import { PortfolioData, Project } from '@/types/portfolio';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { DashboardOverview } from '@/components/admin/DashboardOverview';
import { ProjectsManager } from '@/components/admin/ProjectsManager';
import { ProjectFormDialog } from '@/components/admin/ProjectFormDialog';
import { ServicesManager } from '@/components/admin/ServicesManager';
import { ProfileHeroManager } from '@/components/admin/ProfileHeroManager';
import { AboutManager } from '@/components/admin/AboutManager';
import { SocialsContactManager } from '@/components/admin/SocialsContactManager';
import { DriveMediaTester } from '@/components/admin/DriveMediaTester';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  LayoutDashboard,
  Layers,
  Sparkles,
  User,
  BookOpen,
  Share2,
  HardDrive
} from 'lucide-react';

interface AdminDashboardClientProps {
  initialData: PortfolioData;
  username: string;
}

export function AdminDashboardClient({ initialData, username }: AdminDashboardClientProps) {
  const [data, setData] = React.useState<PortfolioData>(initialData);
  const [activeTab, setActiveTab] = React.useState('overview');
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Project Dialog State
  const [projectDialogOpen, setProjectDialogOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);

  const fetchFreshData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/portfolio', { cache: 'no-store' });
      if (res.ok) {
        const fresh = await res.json();
        setData(fresh);
      }
    } catch (err) {
      console.error('Failed to fetch fresh data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenCreateProject = () => {
    setEditingProject(null);
    setProjectDialogOpen(true);
  };

  const handleOpenEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectDialogOpen(true);
  };

  const handleProjectSaved = () => {
    fetchFreshData();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Top Navbar */}
      <AdminNavbar
        username={username}
        userPhoto={data.profile?.profileImage}
        profileName={data.profile?.name}
        onRefresh={fetchFreshData}
        isRefreshing={isRefreshing}
      />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Main Navigation Tabs */}
          <TabsList className="w-full flex justify-start gap-1 p-1.5 bg-zinc-900/90 border border-zinc-800">
            <TabsTrigger
              value="overview"
              icon={<LayoutDashboard className="w-4 h-4" />}
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              icon={<Layers className="w-4 h-4" />}
            >
              Projects ({data.projects.length})
            </TabsTrigger>
            <TabsTrigger
              value="services"
              icon={<Sparkles className="w-4 h-4" />}
            >
              Services ({data.services.length})
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              icon={<User className="w-4 h-4" />}
            >
              Profile &amp; Hero
            </TabsTrigger>
            <TabsTrigger
              value="about"
              icon={<BookOpen className="w-4 h-4" />}
            >
              About &amp; Skills
            </TabsTrigger>
            <TabsTrigger
              value="socials"
              icon={<Share2 className="w-4 h-4" />}
            >
              Socials &amp; Contact
            </TabsTrigger>
            <TabsTrigger
              value="drive-tester"
              icon={<HardDrive className="w-4 h-4" />}
            >
              Drive Tester
            </TabsTrigger>
          </TabsList>

          {/* Overview Content */}
          <TabsContent value="overview">
            <DashboardOverview
              data={data}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenNewProject={handleOpenCreateProject}
            />
          </TabsContent>

          {/* Projects Content */}
          <TabsContent value="projects">
            <ProjectsManager
              projects={data.projects}
              onRefresh={fetchFreshData}
              onOpenCreate={handleOpenCreateProject}
              onOpenEdit={handleOpenEditProject}
            />
          </TabsContent>

          {/* Services Content */}
          <TabsContent value="services">
            <ServicesManager
              services={data.services}
              onRefresh={fetchFreshData}
            />
          </TabsContent>

          {/* Profile & Hero Content */}
          <TabsContent value="profile">
            <ProfileHeroManager
              profile={data.profile}
              hero={data.hero}
              settings={data.settings}
              onRefresh={fetchFreshData}
            />
          </TabsContent>

          {/* About Content */}
          <TabsContent value="about">
            <AboutManager
              about={data.about}
              onRefresh={fetchFreshData}
            />
          </TabsContent>

          {/* Socials & Contact Content */}
          <TabsContent value="socials">
            <SocialsContactManager
              socials={data.socials}
              contact={data.contact}
              onRefresh={fetchFreshData}
            />
          </TabsContent>

          {/* Google Drive Tester */}
          <TabsContent value="drive-tester">
            <DriveMediaTester />
          </TabsContent>
        </Tabs>
      </div>

      {/* Project Form Dialog (Create / Edit) */}
      <ProjectFormDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        projectToEdit={editingProject}
        onSuccess={handleProjectSaved}
      />
    </div>
  );
}
