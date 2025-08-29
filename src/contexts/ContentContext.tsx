// Content context for managing portfolio content
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Project, 
  Skill, 
  Experience, 
  BlogPost, 
  SkillCategory, 
  PortfolioMetadata 
} from '@/content/types';
import { ContentAPI } from '@/content/api';

// Define the content context type
interface ContentContextType {
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  blogPosts: BlogPost[];
  skillCategories: SkillCategory[];
  metadata: PortfolioMetadata | null;
  loading: boolean;
  error: string | null;
  fetchAllContent: () => Promise<void>;
  refreshContent: () => Promise<void>;
}

// Create the content context
const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Content provider props
interface ContentProviderProps {
  children: ReactNode;
}

// Content provider component
export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [metadata, setMetadata] = useState<PortfolioMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all content
  const fetchAllContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all content types in parallel
      const [
        fetchedProjects,
        fetchedSkills,
        fetchedExperiences,
        fetchedBlogPosts,
        fetchedSkillCategories,
        fetchedMetadata
      ] = await Promise.all([
        ContentAPI.getProjects(),
        ContentAPI.getSkills(),
        ContentAPI.getExperiences(),
        ContentAPI.getBlogPosts(),
        ContentAPI.getSkillCategories(),
        ContentAPI.getMetadata()
      ]);
      
      // Update state with fetched content
      setProjects(fetchedProjects);
      setSkills(fetchedSkills);
      setExperiences(fetchedExperiences);
      setBlogPosts(fetchedBlogPosts);
      setSkillCategories(fetchedSkillCategories);
      setMetadata(fetchedMetadata);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to load content. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh content (useful after updates)
  const refreshContent = async () => {
    await fetchAllContent();
  };

  // Fetch content on initial load
  useEffect(() => {
    fetchAllContent();
  }, []);

  // Context value
  const contextValue: ContentContextType = {
    projects,
    skills,
    experiences,
    blogPosts,
    skillCategories,
    metadata,
    loading,
    error,
    fetchAllContent,
    refreshContent
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};

// Custom hook to use the content context
export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

// Export the context for direct access if needed
export default ContentContext;