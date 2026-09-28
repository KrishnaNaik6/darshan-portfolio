export type ProjectCategory = 'video' | 'image' | 'graphic';
export type ProjectMediaType = 'video' | 'image';

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  type: ProjectMediaType;
  description: string;
  fullDescription?: string;
  client?: string;
  year?: string;
  duration?: string;
  tools?: string[];
  thumbnail: string;
  mediaUrl: string;
  featured: boolean;
  tags: string[];
  order: number;
}

export interface Service {
  id: string;
  title: string;
  category: ProjectCategory;
  shortDescription: string;
  features: string[];
  iconName?: string;
  order: number;
}

export interface Profile {
  name: string;
  role: string;
  bio: string;
  profileImage: string;
  email: string;
  phone: string;
  location: string;
  availabilityStatus?: string;
}

export interface Socials {
  instagram?: string;
  youtube?: string;
  behance?: string;
  linkedin?: string;
  whatsapp?: string;
  twitter?: string;
  github?: string;
}

export interface Hero {
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  badgeText?: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface About {
  description: string;
  story?: string;
  skills: string[];
  stats?: StatItem[];
  experience?: ExperienceItem[];
}

export interface Contact {
  title: string;
  description: string;
  formRecipientEmail?: string;
  customNote?: string;
}

export interface Settings {
  featuredProjectLimit: number;
  showCategoryFilters: boolean;
  showAvailabilityBadge: boolean;
}

export interface PortfolioData {
  profile: Profile;
  socials: Socials;
  hero: Hero;
  services: Service[];
  projects: Project[];
  about: About;
  contact: Contact;
  settings: Settings;
}
