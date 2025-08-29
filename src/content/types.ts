// Content types for the portfolio CMS
import { z } from 'zod';

// Project content type
export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  tech: z.array(z.string()),
  highlights: z.array(z.string()),
  links: z.object({
    github: z.string().optional(),
    demo: z.string().optional(),
    documentation: z.string().optional(),
  }).optional(),
  featured: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

// Skill content type
export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.number().min(0).max(100),
  category: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Skill = z.infer<typeof SkillSchema>;

// Experience content type
export const ExperienceSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  period: z.string(),
  location: z.string(),
  description: z.string(),
  highlights: z.array(z.string()),
  current: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Experience = z.infer<typeof ExperienceSchema>;

// Blog post content type
export const BlogPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  published: z.boolean(),
  featured: z.boolean().optional(),
  coverImage: z.string().optional(),
  author: z.object({
    name: z.string(),
    avatar: z.string().optional(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
});

export type BlogPost = z.infer<typeof BlogPostSchema>;

// Skill category content type
export const SkillCategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  color: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type SkillCategory = z.infer<typeof SkillCategorySchema>;

// Portfolio metadata
export const PortfolioMetadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  author: z.string(),
  keywords: z.array(z.string()),
  social: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    email: z.string().optional(),
  }).optional(),
  theme: z.object({
    primaryColor: z.string(),
    secondaryColor: z.string(),
  }).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type PortfolioMetadata = z.infer<typeof PortfolioMetadataSchema>;

// Content version type
export const ContentVersionSchema = z.object({
  id: z.string(),
  contentId: z.string(),
  contentType: z.string(),
  data: z.any(),
  version: z.number(),
  author: z.string(),
  createdAt: z.string(),
  message: z.string().optional(),
});

export type ContentVersion = z.infer<typeof ContentVersionSchema>;

// Admin user type
export const AdminUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  passwordHash: z.string(),
  role: z.enum(['admin', 'editor']),
  lastLogin: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type AdminUser = z.infer<typeof AdminUserSchema>;

// Content update request type
export const ContentUpdateSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['project', 'skill', 'experience', 'blog', 'skillCategory', 'metadata']),
  data: z.any(),
  message: z.string().optional(),
});

export type ContentUpdate = z.infer<typeof ContentUpdateSchema>;