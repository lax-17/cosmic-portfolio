// Admin dashboard component for the portfolio CMS
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Code, 
  User, 
  Settings,
  LogOut,
  Plus,
  History
} from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import ProjectManager from './ProjectManager';
import SkillManager from './SkillManager';
import ExperienceManager from './ExperienceManager';
import BlogManager from './BlogManager';
import MetadataManager from './MetadataManager';
import VersionHistory from './VersionHistory';

interface AdminDashboardProps {
  authToken: string;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ authToken, onLogout }) => {
  const { projects, skills, experiences, blogPosts } = useContent();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Stats for the dashboard
  const stats = [
    { title: 'Projects', value: projects.length, icon: Briefcase },
    { title: 'Skills', value: skills.length, icon: Code },
    { title: 'Experience', value: experiences.length, icon: User },
    { title: 'Blog Posts', value: blogPosts.length, icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            <h1 className="text-xl font-bold">Portfolio CMS</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="metadata" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Metadata
            </TabsTrigger>
            <TabsTrigger value="versions" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Versions
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest changes to your portfolio content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium">Project Updated</p>
                          <p className="text-sm text-muted-foreground">
                            Clinical Narrative Assistant
                          </p>
                        </div>
                        <div className="ml-auto text-sm text-muted-foreground">
                          Just now
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium">Skill Added</p>
                          <p className="text-sm text-muted-foreground">
                            TensorFlow
                          </p>
                        </div>
                        <div className="ml-auto text-sm text-muted-foreground">
                          2 hours ago
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium">Blog Post Published</p>
                          <p className="text-sm text-muted-foreground">
                            Introduction to Neural Networks
                          </p>
                        </div>
                        <div className="ml-auto text-sm text-muted-foreground">
                          1 day ago
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common content management tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => setActiveTab('projects')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Project
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => setActiveTab('skills')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Skill
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => setActiveTab('experience')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => setActiveTab('blog')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Write Blog Post
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <ProjectManager authToken={authToken} />
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <SkillManager authToken={authToken} />
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience">
            <ExperienceManager authToken={authToken} />
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog">
            <BlogManager authToken={authToken} />
          </TabsContent>

          {/* Metadata Tab */}
          <TabsContent value="metadata">
            <MetadataManager authToken={authToken} />
          </TabsContent>

          {/* Versions Tab */}
          <TabsContent value="versions">
            <VersionHistory authToken={authToken} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;