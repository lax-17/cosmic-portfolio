// Skill manager component for the portfolio CMS
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
import { Skill } from '@/content/types';
import { useToast } from '@/hooks/use-toast';

interface SkillManagerProps {
  authToken: string;
}

const SkillManager: React.FC<SkillManagerProps> = ({ authToken }) => {
  const { skills, skillCategories, refreshContent } = useContent();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [name, setName] = useState('');
  const [level, setLevel] = useState(50);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  // Reset form
  const resetForm = () => {
    setEditingSkill(null);
    setName('');
    setLevel(50);
    setCategory('');
    setDescription('');
  };

  // Handle edit skill
  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setName(skill.name);
    setLevel(skill.level);
    setCategory(skill.category);
    setDescription(skill.description || '');
    setIsDialogOpen(true);
  };

  // Handle delete skill
  const handleDelete = async (id: string) => {
    try {
      await ContentAPI.deleteSkill(id, authToken);
      await refreshContent();
      
      toast({
        title: "Skill Deleted",
        description: "The skill has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete the skill. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle save skill
  const handleSave = async () => {
    try {
      if (!category) {
        toast({
          title: "Validation Error",
          description: "Please select a category for the skill.",
          variant: "destructive",
        });
        return;
      }

      const skillData: Skill = {
        id: editingSkill?.id || `skill-${Date.now()}`,
        name,
        level,
        category,
        description: description || undefined,
        createdAt: editingSkill?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await ContentAPI.upsertSkill(skillData, authToken);
      await refreshContent();
      setIsDialogOpen(false);
      resetForm();
      
      toast({
        title: "Skill Saved",
        description: `The skill has been successfully ${editingSkill ? 'updated' : 'created'}.`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: `Failed to ${editingSkill ? 'update' : 'create'} the skill. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Skill Management</CardTitle>
            <CardDescription>
              Manage your portfolio skills
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                </DialogTitle>
                <DialogDescription>
                  {editingSkill 
                    ? 'Update the skill details below' 
                    : 'Create a new skill for your portfolio'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Skill name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="level" className="text-right">
                    Level
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="level"
                      type="number"
                      min="0"
                      max="100"
                      value={level}
                      onChange={(e) => setLevel(Number(e.target.value))}
                      placeholder="Skill level (0-100)"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <div className="col-span-3">
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a category</option>
                      {skillCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.title}
                        </option>
                      ))}
                    </select>
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
                      placeholder="Skill description (optional)"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave}>
                  {editingSkill ? 'Update Skill' : 'Create Skill'}
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
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Level</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.map((skill) => (
              <TableRow key={skill.id}>
                <TableCell className="font-medium">{skill.name}</TableCell>
                <TableCell>
                  {skillCategories.find(c => c.id === skill.category)?.title || skill.category}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                    <span>{skill.level}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(skill)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(skill.id)}
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

export default SkillManager;