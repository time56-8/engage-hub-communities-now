
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Post } from '@/contexts/CommunityContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunity } from '@/contexts/CommunityContext';
import { MessageSquare, ArrowUp, ArrowDown, Clock } from 'lucide-react';

interface PostCardProps {
  post: Post;
  showCommunity?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, showCommunity = false }) => {
  const { isAuthenticated } = useAuth();
  const { upvotePost, downvotePost, getCommunity } = useCommunity();
  const community = getCommunity(post.communityId);
  
  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      upvotePost(post.id);
    }
  };
  
  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      downvotePost(post.id);
    }
  };
  
  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <Link to={`/community/${post.communityId}/post/${post.id}`}>
        <CardContent className="p-4">
          {/* Post header */}
          <div className="flex items-center space-x-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.userAvatar} alt={post.username} />
              <AvatarFallback>{post.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-sm text-gray-500">
              <span className="font-medium">{post.username}</span>
              {showCommunity && community && (
                <>
                  <span className="mx-1">in</span>
                  <Link 
                    to={`/community/${community.id}`} 
                    className="font-medium text-community-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {community.name}
                  </Link>
                </>
              )}
              <span className="mx-1">•</span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDate(post.createdAt)}
              </span>
            </div>
          </div>
          
          {/* Post title */}
          <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
          
          {/* Post content */}
          <p className="text-gray-700 line-clamp-3 mb-3">{post.content}</p>
          
          {/* Post tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-gray-100 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="px-4 py-2 border-t flex justify-between">
          {/* Votes */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-500 hover:text-community-primary"
                onClick={handleUpvote}
                disabled={!isAuthenticated}
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
              <span className="text-sm font-medium">{post.upvotes - post.downvotes}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-500 hover:text-community-primary"
                onClick={handleDownvote}
                disabled={!isAuthenticated}
              >
                <ArrowDown className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Comments */}
          <div className="flex items-center text-gray-500">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span className="text-sm">{post.commentCount} comments</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default PostCard;
