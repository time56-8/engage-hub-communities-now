
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunity } from '@/contexts/CommunityContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunityCard from '@/components/CommunityCard';
import PostCard from '@/components/PostCard';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { userCommunities, posts } = useCommunity();
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  // Get user's posts
  const userPosts = posts.filter(post => post.userId === user.id);
  
  // Format join date
  const formattedJoinDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(user.joinDate);

  const handleEditProfile = () => {
    navigate('/settings');
    toast.info("Edit your profile in settings");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-5xl mx-auto">
            {/* Profile header */}
            <Card className="mb-6">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <Avatar className="h-24 w-24 border-4 border-white shadow">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback className="text-2xl">{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 text-center md:text-left">
                    <CardTitle className="text-2xl mb-1">{user.username}</CardTitle>
                    <p className="text-gray-500 mb-4">{user.email}</p>
                    {user.bio && <p className="text-gray-700 mb-4">{user.bio}</p>}
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={handleEditProfile}
                      >
                        <Pencil className="w-4 h-4" />
                        Edit Profile
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500" 
                        onClick={() => navigate('/settings')}
                      >
                        Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="border-t pt-4">
                <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <dt className="text-gray-500 text-sm mb-1">Joined</dt>
                    <dd className="font-medium">{formattedJoinDate}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 text-sm mb-1">Communities</dt>
                    <dd className="font-medium">{userCommunities.length}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 text-sm mb-1">Posts</dt>
                    <dd className="font-medium">{userPosts.length}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 text-sm mb-1">Role</dt>
                    <dd className="font-medium">Member</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            {/* Profile content */}
            <Tabs defaultValue="communities" className="mb-6">
              <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
                <TabsTrigger value="communities">My Communities</TabsTrigger>
                <TabsTrigger value="posts">My Posts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="communities">
                {userCommunities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userCommunities.map(community => (
                      <CommunityCard key={community.id} community={community} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">No communities joined yet</h3>
                    <p className="text-gray-600 mb-6">
                      Join some communities to see them here
                    </p>
                    <Button onClick={() => navigate('/communities')}>
                      Browse Communities
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="posts">
                {userPosts.length > 0 ? (
                  <div className="space-y-6">
                    {userPosts
                      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                      .map(post => (
                        <PostCard key={post.id} post={post} showCommunity />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">No posts created yet</h3>
                    <p className="text-gray-600 mb-6">
                      Share your thoughts with the community
                    </p>
                    <Button onClick={() => navigate('/communities')}>
                      Browse Communities to Post In
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          &copy; {new Date().getFullYear()} EngageHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Profile;
