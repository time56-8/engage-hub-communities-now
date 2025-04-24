
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunity } from '@/contexts/CommunityContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Users, Filter, Search } from 'lucide-react';

const CommunityPage = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const { isAuthenticated } = useAuth();
  const { getCommunity, getCommunityPosts, joinCommunity, leaveCommunity, isMember } = useCommunity();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!communityId) return <div>Community ID is missing</div>;
  
  const community = getCommunity(communityId);
  if (!community) return <div>Community not found</div>;
  
  const posts = getCommunityPosts(communityId);
  const filteredPosts = posts.filter(
    post => post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const isMemberOfCommunity = isMember(communityId);
  
  const handleJoinCommunity = () => {
    if (isMemberOfCommunity) {
      leaveCommunity(communityId);
    } else {
      joinCommunity(communityId);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        {/* Community banner */}
        <div 
          className="h-48 md:h-64 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${community.banner || 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop'})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-4xl mb-4">{community.icon}</div>
              <h1 className="text-3xl font-bold">{community.name}</h1>
              <p className="mt-2 max-w-xl mx-auto">{community.description}</p>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link to="/communities" className="flex items-center text-gray-600 hover:text-community-primary">
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back to Communities</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-1" />
                <span>{community.memberCount.toLocaleString()} members</span>
              </div>
              
              {isAuthenticated && (
                <Button 
                  variant={isMemberOfCommunity ? "outline" : "default"}
                  onClick={handleJoinCommunity}
                >
                  {isMemberOfCommunity ? "Leave Community" : "Join Community"}
                </Button>
              )}
            </div>
          </div>
          
          {/* Topics & Search */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            {community.topics && community.topics.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {community.topics.map((topic, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-100">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search posts..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {isAuthenticated && (
                <Button asChild className="ml-4">
                  <Link to={`/community/${communityId}/create-post`}>
                    <Plus className="h-5 w-5 mr-2" />
                    New Post
                  </Link>
                </Button>
              )}
            </div>
          </div>
          
          {/* Content tabs */}
          <Tabs defaultValue="recent" className="mb-6">
            <TabsList>
              <TabsTrigger value="recent">Recent Posts</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              {isMemberOfCommunity && (
                <TabsTrigger value="for-you">For You</TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="recent">
              {filteredPosts.length > 0 ? (
                <div className="space-y-6">
                  {filteredPosts
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                    .map(post => (
                      <PostCard key={post.id} post={post} />
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No posts yet</h3>
                  {searchQuery ? (
                    <p className="text-gray-600">
                      No posts matching your search.
                    </p>
                  ) : (
                    <p className="text-gray-600">
                      Be the first to start a conversation in this community!
                    </p>
                  )}
                  
                  {isAuthenticated && !searchQuery && (
                    <Button asChild className="mt-4">
                      <Link to={`/community/${communityId}/create-post`}>
                        Create Post
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="popular">
              {filteredPosts.length > 0 ? (
                <div className="space-y-6">
                  {filteredPosts
                    .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
                    .map(post => (
                      <PostCard key={post.id} post={post} />
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No posts yet</h3>
                  <p className="text-gray-600">
                    Be the first to start a conversation in this community!
                  </p>
                </div>
              )}
            </TabsContent>
            
            {isMemberOfCommunity && (
              <TabsContent value="for-you">
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">Personalized Feed</h3>
                  <p className="text-gray-600">
                    This feature will show posts tailored to your interests.
                  </p>
                </div>
              </TabsContent>
            )}
          </Tabs>
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

export default CommunityPage;
