// Project manager component for the portfolio CMS
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { ContentAPI } from '@/content/api';
import { Project } from '@/content/types';
import { useToast } from '@/hooks/use-toast';

interface ProjectManagerProps {
  authToken: string;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ authToken }) => {
  const { projects, refreshContent } = useContent();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tech, setTech] = useState('');
  const [highlights, setHighlights] = useState('');
  const [github, setGithub] = useState('');
  const [demo, setDemo] = useState('');
  const [featured, setFeatured] = useState(false);
  const { toast } = useToast();

  // Reset form
  const resetForm = () => {
    setEditingProject(null);
    setTitle('');
    setDescription('');
    setCategory('');
    setTech('');
    setHighlights('');
    setGithub('');
    setDemo('');
    setFeatured(false);
  };

  // Handle edit project
  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setCategory(project.category);
    setTech(project.tech.join(', '));
    setHighlights(project.highlights.join(', '));
    setGithub(project.links?.github || '');
    setDemo(project.links?.demo || '');
    setFeatured(project.featured || false);
    setIsDialogOpen(true);
  };

  // Handle delete project
  const handleDelete = async (id: string) => {
    try {
      await ContentAPI.deleteProject(id, authToken);
      await refreshContent();
      
      toast({
        title: "Project Deleted",
        description: "The project has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete the project. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle save project
  const handleSave = async () => {
    try {
      const projectData: Project = {
        id: editingProject?.id || `project-${Date.now()}`,
        title,
        description,
        category,
        tech: tech.split(',').map(t => t.trim()).filter(t => t),
        highlights: highlights.split(',').map(h => h.trim()).filter(h => h),
        links: {
          github: github || undefined,
          demo: demo || undefined
        },
        featured,
        createdAt: editingProject?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await ContentAPI.upsertProject(projectData, authToken);
      await refreshContent();
      setIsDialogOpen(false);
      resetForm();
      
      toast({
        title: "Project Saved",
        description: `The project has been successfully ${editingProject ? 'updated' : 'created'}.`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: `Failed to ${editingProject ? 'update' : 'create'} the project. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Project Management</CardTitle>
            <CardDescription>
              Manage your portfolio projects
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </DialogTitle>
                <DialogDescription>
                  {editingProject 
                    ? 'Update the project details below' 
                    : 'Create a new project for your portfolio'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Project title"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <div className="col-span-3">
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Project description"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Project category"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tech" className="text-right">
                    Technologies
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="tech"
                      value={tech}
                      onChange={(e) => setTech(e.target.value)}
                      placeholder="Comma-separated technologies"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="highlights" className="text-right">
                    Highlights
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="highlights"
                      value={highlights}
                      onChange={(e) => setHighlights(e.target.value)}
                      placeholder="Comma-separated highlights"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="github" className="text-right">
                    GitHub URL
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="github"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="GitHub repository URL"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="demo" className="text-right">
                    Demo URL
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="demo"
                      value={demo}
                      onChange={(e) => setDemo(e.target.value)}
                      placeholder="Live demo URL"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="featured" className="text-right">
                    Featured
                  </Label>
                  <div className="col-span-3 flex items-center">
                    <input
                      id="featured"
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave}>
                  {editingProject ? 'Update Project' : 'Create Project'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>{project.category}</TableCell>
                <TableCell>{project.tech.join(', ')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(project)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProjectManager;