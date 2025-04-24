
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Community } from '@/contexts/CommunityContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunity } from '@/contexts/CommunityContext';
import { Users } from 'lucide-react';

interface CommunityCardProps {
  community: Community;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  const { isAuthenticated } = useAuth();
  const { joinCommunity, leaveCommunity, isMember } = useCommunity();
  const isMemberOfCommunity = isMember(community.id);
  
  const handleJoinCommunity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isMemberOfCommunity) {
      leaveCommunity(community.id);
    } else {
      joinCommunity(community.id);
    }
  };
  
  return (
    <Card className="community-card h-full flex flex-col">
      <Link to={`/community/${community.id}`} className="flex-1">
        <div 
          className="h-28 bg-cover bg-center rounded-t-lg"
          style={{ backgroundImage: `url(${community.banner || 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=500&q=60'})` }}
        >
          <div className="h-full w-full bg-black bg-opacity-30 flex items-center justify-center rounded-t-lg">
            <span className="text-4xl">{community.icon}</span>
          </div>
        </div>
        <CardContent className="pt-4">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold">{community.name}</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{community.description}</p>
          
          <div className="mt-3 flex flex-wrap gap-1">
            {community.topics && community.topics.slice(0, 3).map((topic, index) => (
              <Badge key={index} variant="outline" className="bg-gray-100 text-xs">
                {topic}
              </Badge>
            ))}
            {community.topics && community.topics.length > 3 && (
              <Badge variant="outline" className="bg-gray-100 text-xs">
                +{community.topics.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Link>
      
      <CardFooter className="pt-0 pb-4">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span>{community.memberCount.toLocaleString()} members</span>
          </div>
          
          {isAuthenticated && (
            <Button
              size="sm"
              variant={isMemberOfCommunity ? "outline" : "default"}
              className={isMemberOfCommunity ? "btn-hover-effect" : "btn-hover-effect"}
              onClick={handleJoinCommunity}
            >
              {isMemberOfCommunity ? "Leave" : "Join"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CommunityCard;
