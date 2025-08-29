// Metadata manager component for the portfolio CMS
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useContent } from '@/contexts/ContentContext';
import { ContentAPI } from '@/content/api';
import { PortfolioMetadata } from '@/content/types';
import { useToast } from '@/hooks/use-toast';

interface MetadataManagerProps {
  authToken: string;
}

const MetadataManager: React.FC<MetadataManagerProps> = ({ authToken }) => {
  const { metadata, refreshContent } = useContent();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [keywords, setKeywords] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [email, setEmail] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [secondaryColor, setSecondaryColor] = useState('#8b5cf6');
  const { toast } = useToast();

  // Initialize form with existing metadata
  useEffect(() => {
    if (metadata) {
      setTitle(metadata.title || '');
      setDescription(metadata.description || '');
      setAuthor(metadata.author || '');
      setKeywords(metadata.keywords?.join(', ') || '');
      setGithub(metadata.social?.github || '');
      setLinkedin(metadata.social?.linkedin || '');
      setTwitter(metadata.social?.twitter || '');
      setEmail(metadata.social?.email || '');
      setPrimaryColor(metadata.theme?.primaryColor || '#6366f1');
      setSecondaryColor(metadata.theme?.secondaryColor || '#8b5cf6');
    }
  }, [metadata]);

  // Handle save metadata
  const handleSave = async () => {
    try {
      const metadataData: PortfolioMetadata = {
        title,
        description,
        author,
        keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
        social: {
          github: github || undefined,
          linkedin: linkedin || undefined,
          twitter: twitter || undefined,
          email: email || undefined
        },
        theme: {
          primaryColor,
          secondaryColor
        },
        createdAt: metadata?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await ContentAPI.updateMetadata(metadataData, authToken);
      await refreshContent();
      
      toast({
        title: "Metadata Updated",
        description: "The portfolio metadata has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update the metadata. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Metadata</CardTitle>
        <CardDescription>
          Manage your portfolio's metadata and settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Portfolio Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Your portfolio title"
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Portfolio description for SEO"
                className="min-h-[100px]"
              />
            </div>
            <div>
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Comma-separated keywords for SEO"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label>Social Links</Label>
              <div className="space-y-2 mt-2">
                <Input
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="GitHub profile URL"
                />
                <Input
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="LinkedIn profile URL"
                />
                <Input
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="Twitter profile URL"
                />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contact email"
                />
              </div>
            </div>
            
            <div>
              <Label>Theme Colors</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="primaryColor" className="w-24">Primary</Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="secondaryColor" className="w-24">Secondary</Label>
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Save Metadata
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetadataManager;