
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunity } from '@/contexts/CommunityContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, X } from 'lucide-react';
import { toast } from 'sonner';

const CreatePostPage = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { getCommunity, createPost } = useCommunity();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }
  
  if (!communityId) {
    return <div>Community ID is missing</div>;
  }
  
  const community = getCommunity(communityId);
  if (!community) {
    return <div>Community not found</div>;
  }
  
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim() && content.trim()) {
      try {
        const post = createPost(communityId, title, content, tags);
        toast.success("Post created successfully!");
        navigate(`/community/${communityId}/post/${post.id}`);
      } catch (error) {
        toast.error("Failed to create post. Please try again.");
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto">
            {/* Navigation */}
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center text-gray-600 hover:text-community-primary"
                onClick={() => navigate(`/community/${communityId}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back to {community.name}</span>
              </Button>
            </div>
            
            {/* Post form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold mb-6">Create a New Post</h1>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block font-medium mb-1">Post Title</label>
                  <Input
                    id="title"
                    placeholder="Add a descriptive title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    required
                  />
                  <div className="text-xs text-right text-gray-500 mt-1">
                    {title.length}/100
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="content" className="block font-medium mb-1">Content</label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts with the community..."
                    className="min-h-[200px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="tags" className="block font-medium mb-1">Tags</label>
                  <div className="flex items-center">
                    <Input
                      id="tags"
                      placeholder="Add tags (optional)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      maxLength={20}
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleAddTag}
                      disabled={!tagInput.trim() || tags.length >= 5}
                      className="ml-2"
                    >
                      Add
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1">
                    Add up to 5 tags to help categorize your post
                  </div>
                  
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveTag(tag)}
                            className="h-4 w-4 ml-1 p-0 text-gray-500 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate(`/community/${communityId}`)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={!title.trim() || !content.trim()}
                  >
                    Publish Post
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      {/* Simple footer */}
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          &copy; {new Date().getFullYear()} EngageHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default CreatePostPage;
