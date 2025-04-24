
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import CommentComponent from '@/components/CommentComponent';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunity } from '@/contexts/CommunityContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, ArrowUp, ArrowDown, MessageSquare, Clock } from 'lucide-react';

const PostPage = () => {
  const { communityId, postId } = useParams<{ communityId: string, postId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { 
    getPost, 
    getCommunity, 
    getThreadedComments, 
    upvotePost, 
    downvotePost, 
    createComment 
  } = useCommunity();
  
  const [newComment, setNewComment] = useState('');
  
  if (!communityId || !postId) {
    return <div>Missing parameters</div>;
  }
  
  const post = getPost(postId);
  if (!post) {
    return <div>Post not found</div>;
  }
  
  const community = getCommunity(communityId);
  if (!community) {
    return <div>Community not found</div>;
  }
  
  const comments = getThreadedComments(postId);
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  const handleUpvote = () => {
    if (isAuthenticated) {
      upvotePost(postId);
    }
  };
  
  const handleDownvote = () => {
    if (isAuthenticated) {
      downvotePost(postId);
    }
  };
  
  const handleSubmitComment = () => {
    if (isAuthenticated && newComment.trim()) {
      createComment(postId, newComment);
      setNewComment('');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
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
            
            {/* Post */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              {/* Post header */}
              <div className="border-b p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={post.userAvatar} alt={post.username} />
                    <AvatarFallback>{post.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">{post.username}</span>
                    <span className="mx-1">in</span>
                    <Link 
                      to={`/community/${community.id}`} 
                      className="font-medium text-community-primary hover:underline"
                    >
                      {community.name}
                    </Link>
                    <span className="mx-1">•</span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-100">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Post content */}
              <div className="p-6">
                <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
              </div>
              
              {/* Post actions */}
              <div className="border-t p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center border rounded-full overflow-hidden">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-none border-r text-gray-500 hover:text-community-primary"
                      onClick={handleUpvote}
                      disabled={!isAuthenticated}
                    >
                      <ArrowUp className="h-5 w-5" />
                    </Button>
                    <span className="px-3 font-medium">{post.upvotes - post.downvotes}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-none border-l text-gray-500 hover:text-community-primary"
                      onClick={handleDownvote}
                      disabled={!isAuthenticated}
                    >
                      <ArrowDown className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-500">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span className="text-sm">{post.commentCount} comments</span>
                </div>
              </div>
            </div>
            
            {/* Comment form */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h2 className="text-lg font-semibold mb-4">Comments</h2>
              
              {isAuthenticated ? (
                <div>
                  <Textarea
                    placeholder="Add your comment..."
                    className="min-h-[100px] mb-3"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim()}
                    >
                      Post Comment
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="mb-2">You need to be logged in to comment</p>
                  <Button asChild>
                    <Link to="/login">Log in</Link>
                  </Button>
                </div>
              )}
            </div>
            
            {/* Comments */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              {comments.length > 0 ? (
                <div>
                  {comments.map(comment => (
                    <CommentComponent key={comment.id} comment={comment} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">No comments yet</h3>
                  <p className="text-gray-600">Be the first to share your thoughts!</p>
                </div>
              )}
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

export default PostPage;
