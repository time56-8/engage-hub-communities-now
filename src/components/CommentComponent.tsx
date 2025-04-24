
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Comment, useCommunity } from '@/contexts/CommunityContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowUp, ArrowDown, MessageSquare, Clock } from 'lucide-react';

interface CommentComponentProps {
  comment: Comment;
  depth?: number;
  maxDepth?: number;
}

const CommentComponent: React.FC<CommentComponentProps> = ({ 
  comment, 
  depth = 0,
  maxDepth = 5 
}) => {
  const { isAuthenticated, user } = useAuth();
  const { upvoteComment, downvoteComment, createComment } = useCommunity();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  
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
  
  const handleUpvote = () => {
    if (isAuthenticated) {
      upvoteComment(comment.id);
    }
  };
  
  const handleDownvote = () => {
    if (isAuthenticated) {
      downvoteComment(comment.id);
    }
  };
  
  const handleReply = () => {
    if (isAuthenticated && replyContent.trim()) {
      createComment(comment.postId, replyContent, comment.id);
      setReplyContent('');
      setShowReplyForm(false);
    }
  };
  
  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };
  
  return (
    <div className={`mb-4 ${depth > 0 ? 'comment-thread' : ''}`}>
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.userAvatar} />
          <AvatarFallback>{comment.username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{comment.username}</span>
            <span className="text-sm text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(comment.createdAt)}
            </span>
          </div>
          
          <div className="mt-1 text-gray-700">
            {comment.content}
          </div>
          
          <div className="flex items-center mt-2 space-x-2">
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-gray-500 hover:text-community-primary"
                onClick={handleUpvote}
                disabled={!isAuthenticated}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <span className="text-xs font-medium">{comment.upvotes - comment.downvotes}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-gray-500 hover:text-community-primary"
                onClick={handleDownvote}
                disabled={!isAuthenticated}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
            
            {depth < maxDepth && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-6 px-2"
                onClick={toggleReplyForm}
                disabled={!isAuthenticated}
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
          </div>
          
          {showReplyForm && isAuthenticated && (
            <div className="mt-3">
              <Textarea
                placeholder="Write a reply..."
                className="min-h-[60px]"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <div className="flex justify-end mt-2 space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowReplyForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={handleReply}
                  disabled={!replyContent.trim()}
                >
                  Reply
                </Button>
              </div>
            </div>
          )}
          
          {/* Render replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              {comment.replies.map((reply) => (
                <CommentComponent 
                  key={reply.id} 
                  comment={reply} 
                  depth={depth + 1} 
                  maxDepth={maxDepth} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentComponent;
