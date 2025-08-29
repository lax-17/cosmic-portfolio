// Version history component for the portfolio CMS
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
  DialogTitle 
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, RotateCcw, Eye } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { ContentAPI } from '@/content/api';
import { ContentVersion } from '@/content/types';
import { useToast } from '@/hooks/use-toast';

interface VersionHistoryProps {
  authToken: string;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ authToken }) => {
  const { projects, skills, experiences, blogPosts, refreshContent } = useContent();
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<ContentVersion | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Get all content IDs for fetching versions
  const getAllContentIds = () => {
    const ids = [
      ...projects.map(p => p.id),
      ...skills.map(s => s.id),
      ...experiences.map(e => e.id),
      ...blogPosts.map(p => p.id)
    ];
    return ids;
  };

  // Fetch all versions for all content
  const fetchAllVersions = async () => {
    setLoading(true);
    try {
      const allContentIds = getAllContentIds();
      const allVersions: ContentVersion[] = [];
      
      // Fetch versions for each content item
      for (const id of allContentIds) {
        const contentVersions = await ContentAPI.getContentVersions(id);
        allVersions.push(...contentVersions);
      }
      
      // Sort by creation date (newest first)
      allVersions.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setVersions(allVersions);
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Failed to load version history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // View version details
  const handleViewVersion = (version: ContentVersion) => {
    setSelectedVersion(version);
    setIsDialogOpen(true);
  };

  // Revert to a specific version
  const handleRevert = async (contentId: string, version: number) => {
    try {
      await ContentAPI.revertToVersion(contentId, version, authToken);
      await refreshContent();
      
      toast({
        title: "Reverted Successfully",
        description: "The content has been reverted to the selected version.",
      });
    } catch (error) {
      toast({
        title: "Revert Failed",
        description: "Failed to revert to the selected version. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Load versions on component mount
  useEffect(() => {
    fetchAllVersions();
  }, [projects, skills, experiences, blogPosts]);

  // Format content type for display
  const formatContentType = (type: string) => {
    switch (type) {
      case 'project': return 'Project';
      case 'skill': return 'Skill';
      case 'experience': return 'Experience';
      case 'blog': return 'Blog Post';
      case 'skillCategory': return 'Skill Category';
      case 'metadata': return 'Metadata';
      default: return type;
    }
  };

  // Get content title by ID and type
  const getContentTitle = (contentId: string, contentType: string) => {
    switch (contentType) {
      case 'project':
        const project = projects.find(p => p.id === contentId);
        return project ? project.title : contentId;
      case 'skill':
        const skill = skills.find(s => s.id === contentId);
        return skill ? skill.name : contentId;
      case 'experience':
        const experience = experiences.find(e => e.id === contentId);
        return experience ? experience.title : contentId;
      case 'blog':
        const post = blogPosts.find(p => p.id === contentId);
        return post ? post.title : contentId;
      default:
        return contentId;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Version History</CardTitle>
        <CardDescription>
          View and manage content version history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            Showing {versions.length} versions
          </div>
          <Button 
            variant="outline" 
            onClick={fetchAllVersions}
            disabled={loading}
          >
            <History className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versions.map((version) => (
              <TableRow key={version.id}>
                <TableCell className="font-medium">
                  {getContentTitle(version.contentId, version.contentType)}
                </TableCell>
                <TableCell>
                  {formatContentType(version.contentType)}
                </TableCell>
                <TableCell>v{version.version}</TableCell>
                <TableCell>
                  {new Date(version.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{version.author}</TableCell>
                <TableCell>{version.message || 'No message'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewVersion(version)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevert(version.contentId, version.version)}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {versions.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            No version history found
          </div>
        )}
      </CardContent>
      
      {/* Version Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Version Details</DialogTitle>
            <DialogDescription>
              Details for version {selectedVersion?.version} of {selectedVersion && 
                getContentTitle(selectedVersion.contentId, selectedVersion.contentType)}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4">
              {selectedVersion && (
                <>
                  <div>
                    <h3 className="font-medium mb-2">Content Data</h3>
                    <pre className="bg-secondary p-4 rounded-md text-sm overflow-x-auto">
                      {JSON.stringify(selectedVersion.data, null, 2)}
                    </pre>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Version Info</h3>
                      <div className="space-y-1 text-sm">
                        <div><span className="font-medium">Version:</span> {selectedVersion.version}</div>
                        <div><span className="font-medium">Date:</span> {new Date(selectedVersion.createdAt).toLocaleString()}</div>
                        <div><span className="font-medium">Author:</span> {selectedVersion.author}</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Content Info</h3>
                      <div className="space-y-1 text-sm">
                        <div><span className="font-medium">ID:</span> {selectedVersion.contentId}</div>
                        <div><span className="font-medium">Type:</span> {formatContentType(selectedVersion.contentType)}</div>
                        <div><span className="font-medium">Message:</span> {selectedVersion.message || 'No message'}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button 
              onClick={() => selectedVersion && handleRevert(selectedVersion.contentId, selectedVersion.version)}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Revert to this Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default VersionHistory;