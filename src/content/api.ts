// Content API endpoints for the portfolio CMS
import { ContentService } from './contentService';
import { ContentCaching } from './cache';
import {
  Project,
  Skill,
  Experience, 
  BlogPost, 
  SkillCategory, 
  PortfolioMetadata,
  ContentUpdate,
  ContentVersion,
  AdminUser
} from './types';

// Mock authentication middleware (in a real app, this would use JWT or session-based auth)
const authenticateAdmin = (token: string | null): boolean => {
  // In a real implementation, this would verify the token
  // For now, we'll just check if a token is provided
  return !!token && token.length > 0;
};

// Mock rate limiting middleware
const rateLimit = (clientId: string): boolean => {
  // In a real implementation, this would track requests per client
  // For now, we'll allow all requests
  return true;
};

// Content API handlers
export class ContentAPI {
  // Get all projects
  static async getProjects(): Promise<Project[]> {
    try {
      return await ContentCaching.getCachedContent(
        ContentCaching.CACHE_KEYS.PROJECTS,
        async () => ContentService.getProjects()
      );
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects');
    }
  }

  // Get project by ID
  static async getProjectById(id: string): Promise<Project | undefined> {
    try {
      return await ContentCaching.getCachedContent(
        ContentCaching.CACHE_KEYS.PROJECT_BY_ID(id),
        async () => ContentService.getProjectById(id)
      );
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw new Error('Failed to fetch project');
    }
  }

  // Create or update project
  static async upsertProject(
    project: Project, 
    authToken: string | null
  ): Promise<Project> {
    // Authenticate admin
    if (!authenticateAdmin(authToken)) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Apply rate limiting
    if (!rateLimit(authToken || 'anonymous')) {
      throw new Error('Rate limit exceeded');
    }

    try {
      return ContentService.upsertProject(project);
    } catch (error) {
      console.error('Error upserting project:', error);
      throw new Error('Failed to save project');
    }
  }

  // Delete project
  static async deleteProject(
    id: string, 
    authToken: string | null
  ): Promise<boolean> {
    // Authenticate admin
    if (!authenticateAdmin(authToken)) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Apply rate limiting
    if (!rateLimit(authToken || 'anonymous')) {
      throw new Error('Rate limit exceeded');
    }

    try {
      return ContentService.deleteProject(id);
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw new Error('Failed to delete project');
    }
  }

  // Get all skills
  static async getSkills(): Promise<Skill[]> {
    try {
      return ContentService.getSkills();
    } catch (error) {
      console.error('Error fetching skills:', error);
      throw new Error('Failed to fetch skills');
    }
  }

  // Get skill by ID
  static async getSkillById(id: string): Promise<Skill | undefined> {
    try {
      return ContentService.getSkillById(id);
    } catch (error) {
      console.error(`Error fetching skill ${id}:`, error);
      throw new Error('Failed to fetch skill');
    }
  }

  // Create or update skill
  static async upsertSkill(
    skill: Skill, 
    authToken: string | null
  ): Promise<Skill> {
    // Authenticate admin
    if (!authenticateAdmin(authToken)) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Apply rate limiting
    if (!rateLimit(authToken || 'anonymous')) {
      throw new Error('Rate limit exceeded');
    }

    try {
      return ContentService.upsertSkill(skill);
    } catch (error) {
      console.error('Error upserting skill:', error);
      throw new Error('Failed to save skill');
    }
  }

  // Delete skill
  static async deleteSkill(
    id: string, 
    authToken: string | null
  ): Promise<boolean> {
    // Authenticate admin
    if (!authenticateAdmin(authToken)) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Apply rate limiting
    if (!rateLimit(authToken || 'anonymous')) {
      throw new Error('Rate limit exceeded');
    }

    try {
      return ContentService.deleteSkill(id);
    } catch (error) {
      console.error(`Error deleting skill ${id}:`, error);
      throw new Error('Failed to delete skill');
    }
  }

  // Get all experiences
  static async getExperiences(): Promise<Experience[]> {
    try {
      return ContentService.getExperiences();
    } catch (error) {
      console.error('Error fetching experiences:', error);
      throw new Error('Failed to fetch experiences');
    }
  }

  // Get experience by ID
  static async getExperienceById(id: string): Promise<Experience | undefined> {
    try {
      return ContentService.getExperienceById(id);
    } catch (error) {
      console.error(`Error fetching experience ${id}:`, error);
      throw new Error('Failed to fetch experience');
    }
  }

  // Create or update experience
  static async upsertExperience(
    experience: Experience, 
    authToken: string | null
  ): Promise<Experience> {
    // Authenticate admin
    if (!authenticateAdmin(authToken)) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Apply rate limiting
    if (!rateLimit(authToken || 'anonymous')) {
      throw new Error('Rate limit exceeded');
    }

    try {
      return ContentService.upsertExperience(experience);
    } catch (error) {
      console.error('Error upserting experience:', error);
      throw new Error('Failed to save experience');
    }
  }

  // Delete experience
  static async deleteExperience(
    id: string, 
    authToken: string | null
  ): Promise<boolean> {
    // Authenticate admin
    if (!authenticateAdmin(authToken)) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Apply rate limiting
    if (!rateLimit(authToken || 'anonymous')) {
      throw new Error('Rate limit exceeded');
    }

    try {
      return ContentService.deleteExperience(id);
    } catch (error) {
      console.error(`Error deleting experience ${id}:`, error);
      throw new Error('Failed to delete experience');
    }
  }

  // Get all blog posts
  static async getBlogPosts(): Promise<BlogPost[]> {
    try {
      return ContentService.getBlogPosts();
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw new Error('Failed to fetch blog posts');
    }
  }

  // Get published blog posts
  static async getPublishedBlogPosts(): Promise<BlogPost[]> {
    try {
      return ContentService.getPublishedBlogPosts();
    } catch (error) {
      console.error('Error fetching published blog posts:', error);
      throw new Error('Failed to fetch published blog posts');
    }
  }

  // Get blog post by ID
  static async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    try {
      return ContentService.getBlogPostById(id);
    } catch (error) {
      console.error(`Error fetching blog post ${id}:`, error);
      throw new Error('Failed to fetch blog post');
    }
  }

  // Get blog post by slug
  static async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    try {
      return ContentService.getBlogPostBySlug(slug);
    } catch (error) {
      console.error(`Error fetching blog post ${slug}:`, error);
      throw new Error('Failed to fetch blog post');
    }
  }

  // Create or update blog post
  static async upsertBlogPost(
    blogPost: BlogPost, 
    authToken: string | null
  ): Promise<BlogPost> {
    // Authenticate admin
    if (!authenticateAdmin(authToken)) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Apply rate limiting
    if (!rateLimit(authToken || 'anonymous')) {
      throw new Error('Rate limit exceeded');
    }

    try {
      return ContentService.upsertBlogPost(blogPost);
    } catch (error) {
      console.error('Error upserting blog post:', error);
      throw new Error('Failed to save blog post');
    }
  }

  // Delete blog post
  static async deleteBlogPost(
    id: string, 
    authToken: string | null
  ): Promise<boolean> {
    // Authenticate admin
    if (!authenticateAdmin(authToken)) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Apply rate limiting
    if (!rateLimit(authToken || 'anonymous')) {
      throw new Error('Rate limit exceeded');
    }

    try {
      return ContentService.deleteBlogPost(id);
    } catch (error) {
      console.error(`Error deleting blog post ${id}:`, error);
      throw new Error('Failed to delete blog post');
    }
  }

  // Get all skill categories
  static async getSkillCategories(): Promise<SkillCategory[]> {
    try {
      return ContentService.getSkillCategories();
    } catch (error) {
      console.error('Error fetching skill categories:', error);
      throw new Error('Failed to fetch skill categories');
    }
  }

  // Get skill category by ID
  static async getSkillCategoryById(id: string): Promise<SkillCategory | undefined> {
    try {
      return ContentService.getSkillCategoryById(id);
    } catch (error) {
      console.error(`Error fetching skill category ${id}:`, error);
      throw new Error('Failed to fetch skill category');
    }
  }

  // Create or update skill category
  static async upsertSkillCategory(
    category: SkillCategory, 
    authToken: string | null
  ): Promise<SkillCategory> {
    // Authenticate admin
    if (!authenticateAdmin(authToken)) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Apply rate limiting
    if (!rateLimit(authToken || 'anonymous')) {
      throw new Error('Rate limit exceeded');
    }

    try {
      return ContentService.upsertSkillCategory(category);
    } catch (error) {
      console.error('Error upserting skill category:', error);
      throw new Error('Failed to save skill category');
    }
  }

  // Delete skill category
  static async deleteSkillCategory(
    id: string, 
    authToken: string | null
  ): Promise<boolean> {
    // Authenticate admin
    if (!authenticateAdmin(authToken)) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Apply rate limiting
    if (!rateLimit(authToken || 'anonymous')) {
      throw new Error('Rate limit exceeded');
    }

    try {
      return ContentService.deleteSkillCategory(id);
    } catch (error) {
      console.error(`Error deleting skill category ${id}:`, error);
      throw new Error('Failed to delete skill category');
    }
  }

  // Get portfolio metadata
  static async getMetadata(): Promise<PortfolioMetadata | null> {
    try {
      return ContentService.getMetadata();
    } catch (error) {
      console.error('Error fetching metadata:', error);
      throw new Error('Failed to fetch metadata');
    }
  }

  // Update portfolio metadata
  static async updateMetadata(
    metadata: PortfolioMetadata, 
    authToken: string | null
  ): Promise<PortfolioMetadata> {
    // Authenticate admin
    if (!authenticateAdmin(authToken)) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Apply rate limiting
    if (!rateLimit(authToken || 'anonymous')) {
      throw new Error('Rate limit exceeded');
    }

    try {
      return ContentService.updateMetadata(metadata);
    } catch (error) {
      console.error('Error updating metadata:', error);
      throw new Error('Failed to update metadata');
    }
  }

  // Get content versions
  static async getContentVersions(contentId: string): Promise<ContentVersion[]> {
    try {
      return ContentService.getContentVersions(contentId);
    } catch (error) {
      console.error(`Error fetching versions for ${contentId}:`, error);
      throw new Error('Failed to fetch content versions');
    }
  }

  // Revert content to a specific version
  static async revertToVersion(
    contentId: string, 
    version: number, 
    authToken: string | null
  ): Promise<boolean> {
    // Authenticate admin
    if (!authenticateAdmin(authToken)) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Apply rate limiting
    if (!rateLimit(authToken || 'anonymous')) {
      throw new Error('Rate limit exceeded');
    }

    try {
      return ContentService.revertToVersion(contentId, version);
    } catch (error) {
      console.error(`Error reverting ${contentId} to version ${version}:`, error);
      throw new Error('Failed to revert content');
    }
  }

  // Handle content update request
  static async handleContentUpdate(
    update: ContentUpdate, 
    authToken: string | null
  ): Promise<any> {
    // Authenticate admin
    if (!authenticateAdmin(authToken)) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Apply rate limiting
    if (!rateLimit(authToken || 'anonymous')) {
      throw new Error('Rate limit exceeded');
    }

    try {
      return ContentService.handleContentUpdate(update);
    } catch (error) {
      console.error('Error handling content update:', error);
      throw new Error('Failed to handle content update');
    }
  }

  // Add admin user (admin only)
  static async addAdminUser(
    user: AdminUser, 
    authToken: string | null
  ): Promise<AdminUser> {
    // Authenticate admin
    if (!authenticateAdmin(authToken)) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Apply rate limiting
    if (!rateLimit(authToken || 'anonymous')) {
      throw new Error('Rate limit exceeded');
    }

    try {
      return ContentService.addAdminUser(user);
    } catch (error) {
      console.error('Error adding admin user:', error);
      throw new Error('Failed to add admin user');
    }
  }

  // Get admin user by ID (admin only)
  static async getAdminUserById(
    id: string, 
    authToken: string | null
  ): Promise<AdminUser | undefined> {
    // Authenticate admin
    if (!authenticateAdmin(authToken)) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Apply rate limiting
    if (!rateLimit(authToken || 'anonymous')) {
      throw new Error('Rate limit exceeded');
    }

    try {
      return ContentService.getAdminUserById(id);
    } catch (error) {
      console.error(`Error fetching admin user ${id}:`, error);
      throw new Error('Failed to fetch admin user');
    }
  }

  // Get admin user by username (admin only)
  static async getAdminUserByUsername(
    username: string, 
    authToken: string | null
  ): Promise<AdminUser | undefined> {
    // Authenticate admin
    if (!authenticateAdmin(authToken)) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Apply rate limiting
    if (!rateLimit(authToken || 'anonymous')) {
      throw new Error('Rate limit exceeded');
    }

    try {
      return ContentService.getAdminUserByUsername(username);
    } catch (error) {
      console.error(`Error fetching admin user ${username}:`, error);
      throw new Error('Failed to fetch admin user');
    }
  }
}