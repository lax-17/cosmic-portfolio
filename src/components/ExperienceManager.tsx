// Experience manager component for the portfolio CMS
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
import { Experience } from '@/content/types';
import { useToast } from '@/hooks/use-toast';

interface ExperienceManagerProps {
  authToken: string;
}

const ExperienceManager: React.FC<ExperienceManagerProps> = ({ authToken }) => {
  const { experiences, refreshContent } = useContent();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [period, setPeriod] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [highlights, setHighlights] = useState('');
  const [current, setCurrent] = useState(false);
  const { toast } = useToast();

  // Reset form
  const resetForm = () => {
    setEditingExperience(null);
    setTitle('');
    setCompany('');
    setPeriod('');
    setLocation('');
    setDescription('');
    setHighlights('');
    setCurrent(false);
  };

  // Handle edit experience
  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setTitle(experience.title);
    setCompany(experience.company);
    setPeriod(experience.period);
    setLocation(experience.location);
    setDescription(experience.description);
    setHighlights(experience.highlights.join(', '));
    setCurrent(experience.current || false);
    setIsDialogOpen(true);
  };

  // Handle delete experience
  const handleDelete = async (id: string) => {
    try {
      await ContentAPI.deleteExperience(id, authToken);
      await refreshContent();
      
      toast({
        title: "Experience Deleted",
        description: "The experience has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete the experience. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle save experience
  const handleSave = async () => {
    try {
      const experienceData: Experience = {
        id: editingExperience?.id || `exp-${Date.now()}`,
        title,
        company,
        period,
        location,
        description,
        highlights: highlights.split(',').map(h => h.trim()).filter(h => h),
        current,
        createdAt: editingExperience?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await ContentAPI.upsertExperience(experienceData, authToken);
      await refreshContent();
      setIsDialogOpen(false);
      resetForm();
      
      toast({
        title: "Experience Saved",
        description: `The experience has been successfully ${editingExperience ? 'updated' : 'created'}.`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: `Failed to ${editingExperience ? 'update' : 'create'} the experience. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Experience Management</CardTitle>
            <CardDescription>
              Manage your professional experience
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingExperience ? 'Edit Experience' : 'Add New Experience'}
                </DialogTitle>
                <DialogDescription>
                  {editingExperience 
                    ? 'Update the experience details below' 
                    : 'Create a new experience for your portfolio'}
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
                      placeholder="Job title"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">
                    Company
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Company name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="period" className="text-right">
                    Period
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="period"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      placeholder="e.g., June 2020 – Present"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Location"
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
                      placeholder="Job description"
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
                  <Label htmlFor="current" className="text-right">
                    Current
                  </Label>
                  <div className="col-span-3 flex items-center">
                    <input
                      id="current"
                      type="checkbox"
                      checked={current}
                      onChange={(e) => setCurrent(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span className="ml-2 text-sm">Currently working here</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave}>
                  {editingExperience ? 'Update Experience' : 'Create Experience'}
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
              <TableHead>Company</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.map((experience) => (
              <TableRow key={experience.id}>
                <TableCell className="font-medium">{experience.title}</TableCell>
                <TableCell>{experience.company}</TableCell>
                <TableCell>{experience.period}</TableCell>
                <TableCell>{experience.location}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(experience)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(experience.id)}
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

export default ExperienceManager;