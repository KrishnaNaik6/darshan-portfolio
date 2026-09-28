import { promises as fs } from 'fs';
import path from 'path';
import {
  PortfolioData,
  Project,
  Service,
  Profile,
  Socials,
  Hero,
  About,
  Contact,
  Settings
} from '@/types/portfolio';

// Path to data/portfolio.json at the workspace root
const DATA_DIR = path.join(process.cwd(), 'data');
const PORTFOLIO_FILE = path.join(DATA_DIR, 'portfolio.json');

const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  profile: {
    name: "Darshan G Poojari",
    role: "Video Editor & Multimedia Designer",
    bio: "Multimedia specialist, video editor, and visual designer with expertise in cinematic video editing, photo retouching, graphic design, and cloud media workflows.",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    email: "saroojapoojari5@gmail.com",
    phone: "+91 8310509801",
    location: "Bisalakoppa, Sirsi (U.K), Karnataka, India",
    availabilityStatus: "Available for Freelance & Projects"
  },
  socials: {
    instagram: "https://instagram.com/darshan_poojari",
    youtube: "https://youtube.com/@darshanpoojari",
    behance: "https://behance.net/darshanpoojari",
    linkedin: "https://linkedin.com/in/darshan-poojari",
    whatsapp: "https://wa.me/918310509801"
  },
  hero: {
    title: "Visuals that tell the story.",
    subtitle: "High-impact video editing, precision photo retouching, and striking graphic design crafted with passion and technical precision.",
    primaryCta: "View My Work",
    secondaryCta: "Let's Work Together",
    badgeText: "Video Editor & Multimedia Designer"
  },
  services: [],
  projects: [],
  about: {
    description: "I'm Darshan G Poojari, a passionate video editor and multimedia designer from Sirsi, Karnataka.",
    skills: ["Multimedia Production", "Video Editing", "Image Retouching", "Graphic Design", "HTML / CSS", "AWS S3"]
  },
  contact: {
    title: "Let's create something extraordinary together.",
    description: "Have an upcoming video project or design concept? Get in touch."
  },
  settings: {
    featuredProjectLimit: 6,
    showCategoryFilters: true,
    showAvailabilityBadge: true
  }
};

/**
 * Ensure data folder and file exist
 */
async function ensureDataFileExists(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(PORTFOLIO_FILE);
    } catch {
      await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(DEFAULT_PORTFOLIO_DATA, null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Error ensuring portfolio data file exists:', error);
  }
}

/**
 * Reads and returns the complete portfolio data
 */
export async function getPortfolioData(): Promise<PortfolioData> {
  await ensureDataFileExists();
  try {
    const raw = await fs.readFile(PORTFOLIO_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<PortfolioData>;
    
    // Merge safely with defaults to prevent missing keys
    return {
      profile: { ...DEFAULT_PORTFOLIO_DATA.profile, ...(parsed.profile || {}) },
      socials: { ...DEFAULT_PORTFOLIO_DATA.socials, ...(parsed.socials || {}) },
      hero: { ...DEFAULT_PORTFOLIO_DATA.hero, ...(parsed.hero || {}) },
      services: Array.isArray(parsed.services) ? parsed.services : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      about: { ...DEFAULT_PORTFOLIO_DATA.about, ...(parsed.about || {}) },
      contact: { ...DEFAULT_PORTFOLIO_DATA.contact, ...(parsed.contact || {}) },
      settings: { ...DEFAULT_PORTFOLIO_DATA.settings, ...(parsed.settings || {}) }
    };
  } catch (error) {
    console.error('Failed to read portfolio.json, falling back to default:', error);
    return DEFAULT_PORTFOLIO_DATA;
  }
}

/**
 * Safely writes portfolio data back to file with atomic write
 */
export async function savePortfolioData(updatedData: PortfolioData): Promise<PortfolioData> {
  await ensureDataFileExists();
  const tempFile = `${PORTFOLIO_FILE}.tmp.${Date.now()}`;
  try {
    const serialized = JSON.stringify(updatedData, null, 2);
    await fs.writeFile(tempFile, serialized, 'utf-8');
    await fs.rename(tempFile, PORTFOLIO_FILE);
    return updatedData;
  } catch (error) {
    try {
      await fs.unlink(tempFile);
    } catch {
      // Ignore temp file cleanup failure
    }
    console.error('Failed to write portfolio data:', error);
    throw new Error('Failed to save portfolio data to disk.');
  }
}

/**
 * Get project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const data = await getPortfolioData();
  const project = data.projects.find(p => p.slug.toLowerCase() === slug.toLowerCase());
  return project || null;
}

/**
 * Get project by ID
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const data = await getPortfolioData();
  const project = data.projects.find(p => p.id === id);
  return project || null;
}

/**
 * Updates profile fields
 */
export async function updateProfile(partialProfile: Partial<Profile>): Promise<Profile> {
  const data = await getPortfolioData();
  data.profile = {
    ...data.profile,
    ...partialProfile
  };
  await savePortfolioData(data);
  return data.profile;
}

/**
 * Updates hero section
 */
export async function updateHero(partialHero: Partial<Hero>): Promise<Hero> {
  const data = await getPortfolioData();
  data.hero = {
    ...data.hero,
    ...partialHero
  };
  await savePortfolioData(data);
  return data.hero;
}

/**
 * Updates socials
 */
export async function updateSocials(partialSocials: Partial<Socials>): Promise<Socials> {
  const data = await getPortfolioData();
  data.socials = {
    ...data.socials,
    ...partialSocials
  };
  await savePortfolioData(data);
  return data.socials;
}

/**
 * Updates about section
 */
export async function updateAbout(partialAbout: Partial<About>): Promise<About> {
  const data = await getPortfolioData();
  data.about = {
    ...data.about,
    ...partialAbout
  };
  await savePortfolioData(data);
  return data.about;
}

/**
 * Updates contact section
 */
export async function updateContact(partialContact: Partial<Contact>): Promise<Contact> {
  const data = await getPortfolioData();
  data.contact = {
    ...data.contact,
    ...partialContact
  };
  await savePortfolioData(data);
  return data.contact;
}

/**
 * Updates settings
 */
export async function updateSettings(partialSettings: Partial<Settings>): Promise<Settings> {
  const data = await getPortfolioData();
  data.settings = {
    ...data.settings,
    ...partialSettings
  };
  await savePortfolioData(data);
  return data.settings;
}

import { generateSlug } from '@/lib/slug';
export { generateSlug };

/**
 * Add a new project
 */
export async function createProject(projectInput: Omit<Project, 'id'> & { id?: string }): Promise<Project> {
  const data = await getPortfolioData();
  
  const id = projectInput.id || `proj-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  let slug = projectInput.slug ? generateSlug(projectInput.slug) : generateSlug(projectInput.title);
  
  // Ensure unique slug
  let counter = 1;
  const originalSlug = slug;
  while (data.projects.some(p => p.slug === slug)) {
    slug = `${originalSlug}-${counter}`;
    counter++;
  }

  const newProject: Project = {
    id,
    slug,
    title: projectInput.title.trim(),
    category: projectInput.category || 'video',
    type: projectInput.type || 'video',
    description: projectInput.description.trim(),
    fullDescription: projectInput.fullDescription?.trim() || projectInput.description.trim(),
    client: projectInput.client?.trim() || '',
    year: projectInput.year?.trim() || new Date().getFullYear().toString(),
    duration: projectInput.duration?.trim() || '',
    tools: Array.isArray(projectInput.tools) ? projectInput.tools : [],
    thumbnail: projectInput.thumbnail.trim(),
    mediaUrl: projectInput.mediaUrl.trim(),
    featured: Boolean(projectInput.featured),
    tags: Array.isArray(projectInput.tags) ? projectInput.tags : [],
    order: typeof projectInput.order === 'number' ? projectInput.order : data.projects.length + 1
  };

  data.projects.push(newProject);
  await savePortfolioData(data);
  return newProject;
}

/**
 * Update an existing project
 */
export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  const data = await getPortfolioData();
  const index = data.projects.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Project with ID "${id}" not found.`);
  }

  const current = data.projects[index];
  let slug = updates.slug ? generateSlug(updates.slug) : current.slug;

  // If slug changed, ensure uniqueness
  if (slug !== current.slug) {
    let counter = 1;
    const baseSlug = slug;
    while (data.projects.some(p => p.id !== id && p.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  const updatedProject: Project = {
    ...current,
    ...updates,
    id: current.id, // ID cannot be changed
    slug,
    title: updates.title !== undefined ? updates.title.trim() : current.title,
    description: updates.description !== undefined ? updates.description.trim() : current.description,
    thumbnail: updates.thumbnail !== undefined ? updates.thumbnail.trim() : current.thumbnail,
    mediaUrl: updates.mediaUrl !== undefined ? updates.mediaUrl.trim() : current.mediaUrl
  };

  data.projects[index] = updatedProject;
  await savePortfolioData(data);
  return updatedProject;
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<boolean> {
  const data = await getPortfolioData();
  const initialLength = data.projects.length;
  data.projects = data.projects.filter(p => p.id !== id);
  
  if (data.projects.length === initialLength) {
    return false;
  }

  await savePortfolioData(data);
  return true;
}

/**
 * Reorder projects
 */
export async function reorderProjects(orderedIds: string[]): Promise<Project[]> {
  const data = await getPortfolioData();
  const projectMap = new Map(data.projects.map(p => [p.id, p]));
  
  const reordered: Project[] = [];
  orderedIds.forEach((id, idx) => {
    const proj = projectMap.get(id);
    if (proj) {
      proj.order = idx + 1;
      reordered.push(proj);
      projectMap.delete(id);
    }
  });

  // Append any remaining projects
  projectMap.forEach(proj => {
    proj.order = reordered.length + 1;
    reordered.push(proj);
  });

  data.projects = reordered;
  await savePortfolioData(data);
  return data.projects;
}

/**
 * Create a new service
 */
export async function createService(serviceInput: Omit<Service, 'id'> & { id?: string }): Promise<Service> {
  const data = await getPortfolioData();
  const id = serviceInput.id || `srv-${Date.now().toString(36)}`;
  
  const newService: Service = {
    id,
    title: serviceInput.title.trim(),
    category: serviceInput.category || 'video',
    shortDescription: serviceInput.shortDescription.trim(),
    features: Array.isArray(serviceInput.features) ? serviceInput.features : [],
    iconName: serviceInput.iconName || 'Film',
    order: typeof serviceInput.order === 'number' ? serviceInput.order : data.services.length + 1
  };

  data.services.push(newService);
  await savePortfolioData(data);
  return newService;
}

/**
 * Update a service
 */
export async function updateService(id: string, updates: Partial<Service>): Promise<Service> {
  const data = await getPortfolioData();
  const index = data.services.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error(`Service with ID "${id}" not found.`);
  }

  const current = data.services[index];
  const updatedService: Service = {
    ...current,
    ...updates,
    id: current.id
  };

  data.services[index] = updatedService;
  await savePortfolioData(data);
  return updatedService;
}

/**
 * Delete a service
 */
export async function deleteService(id: string): Promise<boolean> {
  const data = await getPortfolioData();
  const initialLength = data.services.length;
  data.services = data.services.filter(s => s.id !== id);
  
  if (data.services.length === initialLength) {
    return false;
  }

  await savePortfolioData(data);
  return true;
}
