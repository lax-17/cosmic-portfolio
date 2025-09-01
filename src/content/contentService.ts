// Content management service for handling portfolio content
import { 
  Project, 
  ProjectSchema,
  Skill, 
  SkillSchema,
  Experience, 
  ExperienceSchema,
  BlogPost, 
  BlogPostSchema,
  SkillCategory, 
  SkillCategorySchema,
  PortfolioMetadata, 
  PortfolioMetadataSchema,
  ContentVersion,
  AdminUser,
  ContentUpdate,
  ContentVersionSchema
} from './types';
import { sanitizeContent } from './sanitization';

// In-memory storage for content (in a real app, this would be a database or file system)
class ContentStorage {
  private projects: Project[] = [];
  private skills: Skill[] = [];
  private experiences: Experience[] = [];
  private blogPosts: BlogPost[] = [];
  private skillCategories: SkillCategory[] = [];
  private metadata: PortfolioMetadata | null = null;
  private versions: ContentVersion[] = [];
  private adminUsers: AdminUser[] = [];
  private nextVersionId = 1;

  // Initialize with sample data
  constructor() {
    this.initializeSampleData();
  }

  // Initialize with sample data
  private initializeSampleData() {
    // Sample projects
    this.projects = [
      {
        id: "clinical-narrative",
        title: "Clinical Narrative Assistant",
        description: "Fine-tuned LLM for medical narrative processing with 600 structured patient profiles. Achieved significant improvements in clinical data extraction and analysis.",
        category: "NLP/Healthcare",
        tech: ["Llama 3", "QLoRA", "Hugging Face", "Python"],
        highlights: ["600+ Patient Profiles", "Medical NLP", "Production Ready"],
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "drone-navigation",
        title: "Object-Tracking Drone Navigation",
        description: "Real-time drone pursuit system with PID control and GPS fusion. Implemented advanced computer vision algorithms for autonomous navigation and tracking.",
        category: "Computer Vision",
        tech: ["OpenCV", "Python", "PID Control", "GPS Fusion"],
        highlights: ["Real-time Tracking", "Autonomous Navigation", "Computer Vision"],
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "fmri-reconstruction",
        title: "fMRI Image Reconstruction",
        description: "Supervised fMRI-to-image reconstruction using U-Net decoder. Maps N=1024 left-hemisphere fMRI PCA components to 64x64 target images with L1 loss minimization and Adam optimization.",
        category: "Medical AI",
        tech: ["U-Net", "PyTorch", "Adam Optimizer", "L1 Loss", "PCA", "fMRI"],
        highlights: ["Supervised Learning", "Stable Training", "L1 Loss Minimization"],
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    // Sample skills
    this.skills = [
      { id: "pytorch", name: "PyTorch", level: 90, category: "ml-ai", description: "Deep learning framework" },
      { id: "huggingface", name: "Hugging Face", level: 85, category: "ml-ai", description: "Transformers library" },
      { id: "qlora", name: "QLoRA", level: 80, category: "ml-ai", description: "Quantized LoRA fine-tuning" },
      { id: "transformers", name: "Transformers", level: 88, category: "ml-ai", description: "NLP models" },
      { id: "opencv", name: "OpenCV", level: 92, category: "computer-vision", description: "Computer vision library" },
      { id: "dinov2", name: "DINOv2", level: 75, category: "computer-vision", description: "Vision transformer" },
      { id: "mediapipe", name: "MediaPipe", level: 82, category: "computer-vision", description: "ML solutions" },
      { id: "image-processing", name: "Image Processing", level: 89, category: "computer-vision", description: "Image manipulation" },
      { id: "llama3", name: "Llama 3", level: 87, category: "nlp", description: "Large language model" },
      { id: "gemini", name: "Gemini 1.5 Pro", level: 83, category: "nlp", description: "Google's multimodal model" },
      { id: "rag", name: "RAG", level: 85, category: "nlp", description: "Retrieval-augmented generation" },
      { id: "fine-tuning", name: "Fine-tuning", level: 90, category: "nlp", description: "Model adaptation" },
      { id: "docker", name: "Docker", level: 88, category: "tools-tech", description: "Containerization" },
      { id: "cuda", name: "CUDA", level: 82, category: "tools-tech", description: "GPU computing" },
      { id: "linux", name: "Linux", level: 91, category: "tools-tech", description: "Operating system" },
      { id: "python", name: "Python", level: 95, category: "tools-tech", description: "Programming language" }
    ];

    // Sample skill categories
    this.skillCategories = [
      { id: "ml-ai", title: "ML/AI", color: "hsl(272, 91%, 60%)" },
      { id: "computer-vision", title: "Computer Vision", color: "hsl(261, 43%, 60%)" },
      { id: "nlp", title: "NLP", color: "hsl(214, 71%, 60%)" },
      { id: "tools-tech", title: "Tools & Tech", color: "hsl(224, 47%, 60%)" }
    ];

    // Sample experiences
    this.experiences = [
      {
        id: "applied-llm-engineer",
        title: "Applied AI/LLM Engineer (Clinical Narratives Platform)",
        company: "Sheffield Hallam University",
        period: "Jun 2025 – Present",
        location: "Sheffield, UK",
        description: "Built an end-to-end healthcare LLM system: synthetic data generation, fine-tuning with QLoRA, prompt & context engineering, clinician evaluation, and deployment packaging (Docker, llama.cpp for offline inference).",
        highlights: ["QLoRA fine-tuning (Llama 3 8B, 8192 tokens)", "600 clinician-validated profiles", "Schema-faithful JSON outputs", "Safety & hallucination checks", "Docker + llama.cpp deployment"],
        current: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "junior-developer",
        title: "Junior Developer Intern",
        company: "Tan Theta Software Studio",
        period: "Oct 2023 – Dec 2023",
        location: "Remote",
        description: "Contributed to AI-powered software solutions and gained hands-on experience in production-level ML systems.",
        highlights: ["Production ML", "Software Development", "Team Collaboration"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "industry-coordinator",
        title: "Industry Collaboration Coordinator",
        company: "Ufa University of Science and Technology",
        period: "Jan 2022 – June 2022",
        location: "Sterlitamak, Russia",
        description: "Coordinated industry partnerships and research collaborations, bridging academic research with practical applications.",
        highlights: ["Partnership Management", "Research Coordination", "Industry Relations"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    // Sample metadata
    this.metadata = {
      title: "Applied AI/ML Engineer Portfolio",
      description: "Portfolio of Laxmikant Nishad, an Applied AI/ML Engineer specializing in LLMs, Transformers, and multi-modal systems.",
      author: "Laxmikant Nishad",
      keywords: ["Applied AI", "LLM", "Transformers", "RAG", "PyTorch", "Hugging Face", "Computer Vision", "Healthcare AI"],
      social: {
        github: "https://github.com/lax-17",
        linkedin: "https://linkedin.com/in/laxmikant-nishad",
        email: "laxmikant.data@gmail.com"
      },
      theme: {
        primaryColor: "hsl(272, 91%, 60%)",
        secondaryColor: "hsl(261, 43%, 60%)"
      }
    };

    // Sample blog posts
    this.blogPosts = [
      {
        id: "introduction-to-llms",
        title: "Introduction to Large Language Models",
        slug: "introduction-to-llms",
        excerpt: "A beginner's guide to understanding large language models and their applications",
        content: "Large Language Models (LLMs) have revolutionized the field of natural language processing...",
        tags: ["LLM", "NLP", "AI"],
        published: true,
        featured: true,
        author: {
          name: "AI Researcher",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
      }
    ];
  }

  // Get all projects
  getProjects(): Project[] {
    return this.projects;
  }

  // Get project by ID
  getProjectById(id: string): Project | undefined {
    return this.projects.find(project => project.id === id);
  }

  // Add or update project
  upsertProject(project: Project): Project {
    const sanitizedProject = sanitizeContent(project);
    const validatedProject = ProjectSchema.parse(sanitizedProject);
    
    const existingIndex = this.projects.findIndex(p => p.id === validatedProject.id);
    if (existingIndex >= 0) {
      validatedProject.updatedAt = new Date().toISOString();
      this.projects[existingIndex] = validatedProject;
    } else {
      validatedProject.createdAt = new Date().toISOString();
      validatedProject.updatedAt = new Date().toISOString();
      this.projects.push(validatedProject);
    }
    
    this.createVersion('project', validatedProject.id, validatedProject);
    return validatedProject;
  }

  // Delete project
  deleteProject(id: string): boolean {
    const index = this.projects.findIndex(project => project.id === id);
    if (index >= 0) {
      const project = this.projects[index];
      this.createVersion('project', id, project, 'Deleted project');
      this.projects.splice(index, 1);
      return true;
    }
    return false;
  }

  // Get all skills
  getSkills(): Skill[] {
    return this.skills;
  }

  // Get skill by ID
  getSkillById(id: string): Skill | undefined {
    return this.skills.find(skill => skill.id === id);
  }

  // Add or update skill
  upsertSkill(skill: Skill): Skill {
    const sanitizedSkill = sanitizeContent(skill);
    const validatedSkill = SkillSchema.parse(sanitizedSkill);
    
    const existingIndex = this.skills.findIndex(s => s.id === validatedSkill.id);
    if (existingIndex >= 0) {
      validatedSkill.updatedAt = new Date().toISOString();
      this.skills[existingIndex] = validatedSkill;
    } else {
      validatedSkill.createdAt = new Date().toISOString();
      validatedSkill.updatedAt = new Date().toISOString();
      this.skills.push(validatedSkill);
    }
    
    this.createVersion('skill', validatedSkill.id, validatedSkill);
    return validatedSkill;
  }

  // Delete skill
  deleteSkill(id: string): boolean {
    const index = this.skills.findIndex(skill => skill.id === id);
    if (index >= 0) {
      const skill = this.skills[index];
      this.createVersion('skill', id, skill, 'Deleted skill');
      this.skills.splice(index, 1);
      return true;
    }
    return false;
  }

  // Get all experiences
  getExperiences(): Experience[] {
    return this.experiences;
  }

  // Get experience by ID
  getExperienceById(id: string): Experience | undefined {
    return this.experiences.find(exp => exp.id === id);
  }

  // Add or update experience
  upsertExperience(experience: Experience): Experience {
    const sanitizedExperience = sanitizeContent(experience);
    const validatedExperience = ExperienceSchema.parse(sanitizedExperience);
    
    const existingIndex = this.experiences.findIndex(e => e.id === validatedExperience.id);
    if (existingIndex >= 0) {
      validatedExperience.updatedAt = new Date().toISOString();
      this.experiences[existingIndex] = validatedExperience;
    } else {
      validatedExperience.createdAt = new Date().toISOString();
      validatedExperience.updatedAt = new Date().toISOString();
      this.experiences.push(validatedExperience);
    }
    
    this.createVersion('experience', validatedExperience.id, validatedExperience);
    return validatedExperience;
  }

  // Delete experience
  deleteExperience(id: string): boolean {
    const index = this.experiences.findIndex(exp => exp.id === id);
    if (index >= 0) {
      const experience = this.experiences[index];
      this.createVersion('experience', id, experience, 'Deleted experience');
      this.experiences.splice(index, 1);
      return true;
    }
    return false;
  }

  // Get all blog posts
  getBlogPosts(): BlogPost[] {
    return this.blogPosts;
  }

  // Get published blog posts
  getPublishedBlogPosts(): BlogPost[] {
    return this.blogPosts.filter(post => post.published);
  }

  // Get blog post by ID
  getBlogPostById(id: string): BlogPost | undefined {
    return this.blogPosts.find(post => post.id === id);
  }

  // Get blog post by slug
  getBlogPostBySlug(slug: string): BlogPost | undefined {
    return this.blogPosts.find(post => post.slug === slug);
  }

  // Add or update blog post
  upsertBlogPost(blogPost: BlogPost): BlogPost {
    const sanitizedBlogPost = sanitizeContent(blogPost);
    const validatedBlogPost = BlogPostSchema.parse(sanitizedBlogPost);
    
    const existingIndex = this.blogPosts.findIndex(p => p.id === validatedBlogPost.id);
    if (existingIndex >= 0) {
      validatedBlogPost.updatedAt = new Date().toISOString();
      this.blogPosts[existingIndex] = validatedBlogPost;
    } else {
      validatedBlogPost.createdAt = new Date().toISOString();
      validatedBlogPost.updatedAt = new Date().toISOString();
      this.blogPosts.push(validatedBlogPost);
    }
    
    this.createVersion('blog', validatedBlogPost.id, validatedBlogPost);
    return validatedBlogPost;
  }

  // Delete blog post
  deleteBlogPost(id: string): boolean {
    const index = this.blogPosts.findIndex(post => post.id === id);
    if (index >= 0) {
      const post = this.blogPosts[index];
      this.createVersion('blog', id, post, 'Deleted blog post');
      this.blogPosts.splice(index, 1);
      return true;
    }
    return false;
  }

  // Get all skill categories
  getSkillCategories(): SkillCategory[] {
    return this.skillCategories;
  }

  // Get skill category by ID
  getSkillCategoryById(id: string): SkillCategory | undefined {
    return this.skillCategories.find(cat => cat.id === id);
  }

  // Add or update skill category
  upsertSkillCategory(category: SkillCategory): SkillCategory {
    const sanitizedCategory = sanitizeContent(category);
    const validatedCategory = SkillCategorySchema.parse(sanitizedCategory);
    
    const existingIndex = this.skillCategories.findIndex(c => c.id === validatedCategory.id);
    if (existingIndex >= 0) {
      validatedCategory.updatedAt = new Date().toISOString();
      this.skillCategories[existingIndex] = validatedCategory;
    } else {
      validatedCategory.createdAt = new Date().toISOString();
      validatedCategory.updatedAt = new Date().toISOString();
      this.skillCategories.push(validatedCategory);
    }
    
    this.createVersion('skillCategory', validatedCategory.id, validatedCategory);
    return validatedCategory;
  }

  // Delete skill category
  deleteSkillCategory(id: string): boolean {
    const index = this.skillCategories.findIndex(cat => cat.id === id);
    if (index >= 0) {
      const category = this.skillCategories[index];
      this.createVersion('skillCategory', id, category, 'Deleted skill category');
      this.skillCategories.splice(index, 1);
      return true;
    }
    return false;
  }

  // Get portfolio metadata
  getMetadata(): PortfolioMetadata | null {
    return this.metadata;
  }

  // Update portfolio metadata
  updateMetadata(metadata: PortfolioMetadata): PortfolioMetadata {
    const sanitizedMetadata = sanitizeContent(metadata);
    const validatedMetadata = PortfolioMetadataSchema.parse(sanitizedMetadata);
    validatedMetadata.updatedAt = new Date().toISOString();
    this.metadata = validatedMetadata;
    this.createVersion('metadata', 'portfolio', validatedMetadata);
    return validatedMetadata;
  }

  // Create content version for history tracking
  private createVersion(
    contentType: string, 
    contentId: string, 
    data: any, 
    message?: string
  ): ContentVersion {
    const version: ContentVersion = {
      id: `ver_${this.nextVersionId++}`,
      contentId,
      contentType,
      data: JSON.parse(JSON.stringify(data)), // Deep copy
      version: this.getNextVersionNumber(contentId),
      author: 'system',
      createdAt: new Date().toISOString(),
      message
    };
    
    this.versions.push(version);
    return version;
  }

  // Get next version number for content
  private getNextVersionNumber(contentId: string): number {
    const versions = this.versions.filter(v => v.contentId === contentId);
    return versions.length > 0 ? Math.max(...versions.map(v => v.version)) + 1 : 1;
  }

  // Get content versions
  getContentVersions(contentId: string): ContentVersion[] {
    return this.versions
      .filter(v => v.contentId === contentId)
      .sort((a, b) => b.version - a.version);
  }

  // Get content by version
  getContentByVersion(contentId: string, version: number): ContentVersion | undefined {
    return this.versions.find(v => v.contentId === contentId && v.version === version);
  }

  // Revert content to a specific version
  revertToVersion(contentId: string, version: number): boolean {
    const versionData = this.getContentByVersion(contentId, version);
    if (!versionData) return false;
    
    switch (versionData.contentType) {
      case 'project':
        const projectIndex = this.projects.findIndex(p => p.id === contentId);
        if (projectIndex >= 0) {
          this.projects[projectIndex] = versionData.data;
        } else {
          this.projects.push(versionData.data);
        }
        break;
      case 'skill':
        const skillIndex = this.skills.findIndex(s => s.id === contentId);
        if (skillIndex >= 0) {
          this.skills[skillIndex] = versionData.data;
        } else {
          this.skills.push(versionData.data);
        }
        break;
      case 'experience':
        const expIndex = this.experiences.findIndex(e => e.id === contentId);
        if (expIndex >= 0) {
          this.experiences[expIndex] = versionData.data;
        } else {
          this.experiences.push(versionData.data);
        }
        break;
      case 'blog':
        const postIndex = this.blogPosts.findIndex(p => p.id === contentId);
        if (postIndex >= 0) {
          this.blogPosts[postIndex] = versionData.data;
        } else {
          this.blogPosts.push(versionData.data);
        }
        break;
      case 'skillCategory':
        const catIndex = this.skillCategories.findIndex(c => c.id === contentId);
        if (catIndex >= 0) {
          this.skillCategories[catIndex] = versionData.data;
        } else {
          this.skillCategories.push(versionData.data);
        }
        break;
      case 'metadata':
        this.metadata = versionData.data;
        break;
      default:
        return false;
    }
    
    this.createVersion(
      versionData.contentType, 
      contentId, 
      versionData.data, 
      `Reverted to version ${version}`
    );
    
    return true;
  }

  // Add admin user
  addAdminUser(user: AdminUser): AdminUser {
    const existingIndex = this.adminUsers.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      this.adminUsers[existingIndex] = user;
    } else {
      this.adminUsers.push(user);
    }
    return user;
  }

  // Get admin user by ID
  getAdminUserById(id: string): AdminUser | undefined {
    return this.adminUsers.find(user => user.id === id);
  }

  // Get admin user by username
  getAdminUserByUsername(username: string): AdminUser | undefined {
    return this.adminUsers.find(user => user.username === username);
  }

  // Update last login time
  updateLastLogin(userId: string): void {
    const user = this.getAdminUserById(userId);
    if (user) {
      user.lastLogin = new Date().toISOString();
      user.updatedAt = new Date().toISOString();
    }
  }
}

// Export singleton instance
export const contentStorage = new ContentStorage();

// Content service for handling content operations
export class ContentService {
  // Get all projects
  static getProjects(): Project[] {
    return contentStorage.getProjects();
  }

  // Get project by ID
  static getProjectById(id: string): Project | undefined {
    return contentStorage.getProjectById(id);
  }

  // Add or update project
  static upsertProject(project: Project): Project {
    return contentStorage.upsertProject(project);
  }

  // Delete project
  static deleteProject(id: string): boolean {
    return contentStorage.deleteProject(id);
  }

  // Get all skills
  static getSkills(): Skill[] {
    return contentStorage.getSkills();
  }

  // Get skill by ID
  static getSkillById(id: string): Skill | undefined {
    return contentStorage.getSkillById(id);
  }

  // Add or update skill
  static upsertSkill(skill: Skill): Skill {
    return contentStorage.upsertSkill(skill);
  }

  // Delete skill
  static deleteSkill(id: string): boolean {
    return contentStorage.deleteSkill(id);
  }

  // Get all experiences
  static getExperiences(): Experience[] {
    return contentStorage.getExperiences();
  }

  // Get experience by ID
  static getExperienceById(id: string): Experience | undefined {
    return contentStorage.getExperienceById(id);
  }

  // Add or update experience
  static upsertExperience(experience: Experience): Experience {
    return contentStorage.upsertExperience(experience);
  }

  // Delete experience
  static deleteExperience(id: string): boolean {
    return contentStorage.deleteExperience(id);
  }

  // Get all blog posts
  static getBlogPosts(): BlogPost[] {
    return contentStorage.getBlogPosts();
  }

  // Get published blog posts
  static getPublishedBlogPosts(): BlogPost[] {
    return contentStorage.getPublishedBlogPosts();
  }

  // Get blog post by ID
  static getBlogPostById(id: string): BlogPost | undefined {
    return contentStorage.getBlogPostById(id);
  }

  // Get blog post by slug
  static getBlogPostBySlug(slug: string): BlogPost | undefined {
    return contentStorage.getBlogPostBySlug(slug);
  }

  // Add or update blog post
  static upsertBlogPost(blogPost: BlogPost): BlogPost {
    return contentStorage.upsertBlogPost(blogPost);
  }

  // Delete blog post
  static deleteBlogPost(id: string): boolean {
    return contentStorage.deleteBlogPost(id);
  }

  // Get all skill categories
  static getSkillCategories(): SkillCategory[] {
    return contentStorage.getSkillCategories();
  }

  // Get skill category by ID
  static getSkillCategoryById(id: string): SkillCategory | undefined {
    return contentStorage.getSkillCategoryById(id);
  }

  // Add or update skill category
  static upsertSkillCategory(category: SkillCategory): SkillCategory {
    return contentStorage.upsertSkillCategory(category);
  }

  // Delete skill category
  static deleteSkillCategory(id: string): boolean {
    return contentStorage.deleteSkillCategory(id);
  }

  // Get portfolio metadata
  static getMetadata(): PortfolioMetadata | null {
    return contentStorage.getMetadata();
  }

  // Update portfolio metadata
  static updateMetadata(metadata: PortfolioMetadata): PortfolioMetadata {
    return contentStorage.updateMetadata(metadata);
  }

  // Get content versions
  static getContentVersions(contentId: string): ContentVersion[] {
    return contentStorage.getContentVersions(contentId);
  }

  // Get content by version
  static getContentByVersion(contentId: string, version: number): ContentVersion | undefined {
    return contentStorage.getContentByVersion(contentId, version);
  }

  // Revert content to a specific version
  static revertToVersion(contentId: string, version: number): boolean {
    return contentStorage.revertToVersion(contentId, version);
  }

  // Add admin user
  static addAdminUser(user: AdminUser): AdminUser {
    return contentStorage.addAdminUser(user);
  }

  // Get admin user by ID
  static getAdminUserById(id: string): AdminUser | undefined {
    return contentStorage.getAdminUserById(id);
  }

  // Get admin user by username
  static getAdminUserByUsername(username: string): AdminUser | undefined {
    return contentStorage.getAdminUserByUsername(username);
  }

  // Update last login time
  static updateLastLogin(userId: string): void {
    contentStorage.updateLastLogin(userId);
  }

  // Handle content update request
  static handleContentUpdate(update: ContentUpdate): any {
    switch (update.type) {
      case 'project':
        return this.upsertProject(update.data as Project);
      case 'skill':
        return this.upsertSkill(update.data as Skill);
      case 'experience':
        return this.upsertExperience(update.data as Experience);
      case 'blog':
        return this.upsertBlogPost(update.data as BlogPost);
      case 'skillCategory':
        return this.upsertSkillCategory(update.data as SkillCategory);
      case 'metadata':
        return this.updateMetadata(update.data as PortfolioMetadata);
      default:
        throw new Error(`Unsupported content type: ${update.type}`);
    }
  }
}