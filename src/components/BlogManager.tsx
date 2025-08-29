// Blog manager component for the portfolio CMS
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
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { ContentAPI } from '@/content/api';
import { BlogPost } from '@/content/types';
import { useToast } from '@/hooks/use-toast';

interface BlogManagerProps {
  authToken: string;
}

const BlogManager: React.FC<BlogManagerProps> = ({ authToken }) => {
  const { blogPosts, refreshContent } = useContent();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const { toast } = useToast();

  // Reset form
  const resetForm = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setTags('');
    setPublished(false);
    setFeatured(false);
    setAuthorName('');
  };

  // Handle edit blog post
  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setTags(post.tags.join(', '));
    setPublished(post.published);
    setFeatured(post.featured || false);
    setAuthorName(post.author.name);
    setIsDialogOpen(true);
  };

  // Handle delete blog post
  const handleDelete = async (id: string) => {
    try {
      await ContentAPI.deleteBlogPost(id, authToken);
      await refreshContent();
      
      toast({
        title: "Blog Post Deleted",
        description: "The blog post has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete the blog post. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle save blog post
  const handleSave = async () => {
    try {
      // Auto-generate slug if not provided
      let postSlug = slug;
      if (!postSlug) {
        postSlug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      const postData: BlogPost = {
        id: editingPost?.id || `post-${Date.now()}`,
        title,
        slug: postSlug,
        excerpt,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        published,
        featured,
        author: {
          name: authorName || 'Anonymous'
        },
        createdAt: editingPost?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: published ? (editingPost?.publishedAt || new Date().toISOString()) : undefined
      };

      await ContentAPI.upsertBlogPost(postData, authToken);
      await refreshContent();
      setIsDialogOpen(false);
      resetForm();
      
      toast({
        title: "Blog Post Saved",
        description: `The blog post has been successfully ${editingPost ? 'updated' : 'created'}.`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: `Failed to ${editingPost ? 'update' : 'create'} the blog post. Please try again.`,
        variant: "destructive",
      });
    }
  };

  // Generate preview URL (in a real app, this would be the actual blog post URL)
  const getPreviewUrl = (slug: string) => {
    return `/blog/${slug}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Blog Management</CardTitle>
            <CardDescription>
              Manage your blog posts
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Blog Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
                </DialogTitle>
                <DialogDescription>
                  {editingPost 
                    ? 'Update the blog post details below' 
                    : 'Create a new blog post for your portfolio'}
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
                      placeholder="Blog post title"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="slug" className="text-right">
                    Slug
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="URL-friendly slug (auto-generated if empty)"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="excerpt" className="text-right">
                    Excerpt
                  </Label>
                  <div className="col-span-3">
                    <Textarea
                      id="excerpt"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Short excerpt for the blog post"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content" className="text-right">
                    Content
                  </Label>
                  <div className="col-span-3">
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Full blog post content"
                      className="min-h-[200px]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tags" className="text-right">
                    Tags
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Comma-separated tags"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="author" className="text-right">
                    Author
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="author"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Author name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">
                    Options
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <div className="flex items-center">
                      <input
                        id="published"
                        type="checkbox"
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="published" className="ml-2">
                        Published
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="featured"
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="featured" className="ml-2">
                        Featured
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave}>
                  {editingPost ? 'Update Blog Post' : 'Create Blog Post'}
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
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.slug}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    post.published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getPreviewUrl(post.slug), '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
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

export default BlogManager;