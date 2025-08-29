// Portfolio Database Schema with Realistic Relationships
import { z } from 'zod';

// Base entity schema with common fields
const BaseEntitySchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  version: z.number().optional(),
});

// Contact Information Schema
export const ContactInfoSchema = BaseEntitySchema.extend({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  location: z.string(),
  timezone: z.string(),
  status: z.enum(['available', 'busy', 'away', 'offline']),
  responseTime: z.string(),
  lastActive: z.string(),
  profileImage: z.string().optional(),
});

export type ContactInfo = z.infer<typeof ContactInfoSchema>;

// Social Profiles Schema
export const SocialProfileSchema = BaseEntitySchema.extend({
  platform: z.enum(['linkedin', 'github', 'twitter', 'medium', 'stackoverflow']),
  username: z.string(),
  url: z.string().url(),
  followers: z.number(),
  verified: z.boolean(),
  contactId: z.string(), // Foreign key to ContactInfo
});

export type SocialProfile = z.infer<typeof SocialProfileSchema>;

// Skills Schema
export const SkillSchema = BaseEntitySchema.extend({
  name: z.string(),
  category: z.string(),
  proficiency: z.number().min(0).max(100),
  yearsExperience: z.number(),
  description: z.string().optional(),
  icon: z.string().optional(),
  certifications: z.array(z.string()).optional(),
});

export type Skill = z.infer<typeof SkillSchema>;

// Projects Schema
export const ProjectSchema = BaseEntitySchema.extend({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  category: z.string(),
  status: z.enum(['completed', 'in-progress', 'planned', 'archived']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  startDate: z.string(),
  endDate: z.string().optional(),
  featured: z.boolean(),
  technologies: z.array(z.string()),
  highlights: z.array(z.string()),
  repositoryUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  documentationUrl: z.string().url().optional(),
  thumbnail: z.string().optional(),
  tags: z.array(z.string()),
  collaborators: z.array(z.string()).optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

// Project Skills Junction Table
export const ProjectSkillSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  skillId: z.string(),
  proficiency: z.number().min(0).max(100),
  createdAt: z.string(),
});

export type ProjectSkill = z.infer<typeof ProjectSkillSchema>;

// Experience Schema
export const ExperienceSchema = BaseEntitySchema.extend({
  title: z.string(),
  company: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string(),
  achievements: z.array(z.string()),
  technologies: z.array(z.string()),
  companyUrl: z.string().url().optional(),
  companyLogo: z.string().optional(),
  type: z.enum(['full-time', 'part-time', 'contract', 'freelance', 'internship']),
});

export type Experience = z.infer<typeof ExperienceSchema>;

// Certifications Schema
export const CertificationSchema = BaseEntitySchema.extend({
  name: z.string(),
  issuer: z.string(),
  issueDate: z.string(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url().optional(),
  skills: z.array(z.string()),
  verified: z.boolean(),
});

export type Certification = z.infer<typeof CertificationSchema>;

// Blog Posts Schema
export const BlogPostSchema = BaseEntitySchema.extend({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  content: z.string(),
  status: z.enum(['draft', 'published', 'archived']),
  publishedAt: z.string().optional(),
  featured: z.boolean(),
  tags: z.array(z.string()),
  category: z.string(),
  readingTime: z.number(), // in minutes
  coverImage: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type BlogPost = z.infer<typeof BlogPostSchema>;

// Analytics Schema
export const AnalyticsSchema = BaseEntitySchema.extend({
  eventType: z.string(),
  eventData: z.record(z.any()),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  sessionId: z.string(),
  timestamp: z.string(),
});

export type Analytics = z.infer<typeof AnalyticsSchema>;

// Database Tables Collection
export interface PortfolioDatabase {
  contactInfo: ContactInfo[];
  socialProfiles: SocialProfile[];
  skills: Skill[];
  projects: Project[];
  projectSkills: ProjectSkill[];
  experiences: Experience[];
  certifications: Certification[];
  blogPosts: BlogPost[];
  analytics: Analytics[];
}

// Database Relationships
export interface DatabaseRelationships {
  // One-to-Many
  'contactInfo.socialProfiles': SocialProfile[];
  'contactInfo.experiences': Experience[];
  'contactInfo.certifications': Certification[];

  // Many-to-Many
  'projects.skills': Skill[];
  'skills.projects': Project[];

  // Self-referencing
  'projects.relatedProjects': Project[];
}

// Query Result Types
export interface QueryResult<T = any> {
  data: T[];
  totalCount: number;
  executionTime: number;
  query: string;
  timestamp: string;
}

export interface DatabaseStats {
  totalRecords: number;
  lastUpdated: string;
  schemaVersion: string;
  tables: Record<string, number>;
}

// Export all schemas
export const DatabaseSchemas = {
  ContactInfo: ContactInfoSchema,
  SocialProfile: SocialProfileSchema,
  Skill: SkillSchema,
  Project: ProjectSchema,
  ProjectSkill: ProjectSkillSchema,
  Experience: ExperienceSchema,
  Certification: CertificationSchema,
  BlogPost: BlogPostSchema,
  Analytics: AnalyticsSchema,
};