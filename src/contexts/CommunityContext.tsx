
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: Date;
  memberCount: number;
  banner?: string;
  icon?: string;
  isActive?: boolean;
  topics?: string[];
}

export interface Post {
  id: string;
  communityId: string;
  title: string;
  content: string;
  userId: string;
  username: string;
  userAvatar?: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  tags?: string[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  parentId?: string; // For threaded comments
  replies?: Comment[]; // Child comments
}

interface CommunityContextType {
  communities: Community[];
  posts: Post[];
  comments: Comment[];
  userCommunities: Community[];
  joinCommunity: (communityId: string) => void;
  leaveCommunity: (communityId: string) => void;
  isMember: (communityId: string) => boolean;
  createPost: (communityId: string, title: string, content: string, tags?: string[]) => Post;
  createComment: (postId: string, content: string, parentId?: string) => Comment;
  upvotePost: (postId: string) => void;
  downvotePost: (postId: string) => void;
  upvoteComment: (commentId: string) => void;
  downvoteComment: (commentId: string) => void;
  getPostComments: (postId: string) => Comment[];
  getThreadedComments: (postId: string) => Comment[];
  getCommunityPosts: (communityId: string) => Post[];
  getCommunity: (communityId: string) => Community | undefined;
  getPost: (postId: string) => Post | undefined;
  searchCommunities: (query: string) => Community[];
  filterCommunitiesByCategory: (category: string) => Community[];
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }
  return context;
}

// Sample data
const initialCommunities: Community[] = [
  {
    id: "tech-innovators",
    name: "Tech Innovators",
    description: "Discuss the latest tech innovations and future trends",
    category: "Technology",
    createdAt: new Date("2023-01-15"),
    memberCount: 1542,
    topics: ["AI", "Blockchain", "IoT", "Robotics"],
    isActive: true,
    banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
    icon: "💻"
  },
  {
    id: "fitness-enthusiasts",
    name: "Fitness Enthusiasts",
    description: "Share workout routines, nutrition tips, and fitness goals",
    category: "Health",
    createdAt: new Date("2023-02-10"),
    memberCount: 987,
    topics: ["Cardio", "Strength Training", "Nutrition", "Mindfulness"],
    isActive: true,
    banner: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    icon: "💪"
  },
  {
    id: "book-club",
    name: "Book Club",
    description: "Discuss books, share recommendations, and explore literary themes",
    category: "Literature",
    createdAt: new Date("2023-03-05"),
    memberCount: 723,
    topics: ["Fiction", "Non-fiction", "Classic Literature", "Poetry"],
    isActive: true,
    banner: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570",
    icon: "📚"
  },
  {
    id: "culinary-explorers",
    name: "Culinary Explorers",
    description: "Share recipes, cooking techniques, and culinary adventures",
    category: "Food",
    createdAt: new Date("2023-04-20"),
    memberCount: 856,
    topics: ["International Cuisine", "Baking", "Cooking Tips", "Food Photography"],
    isActive: true,
    banner: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    icon: "🍳"
  },
  {
    id: "travel-nomads",
    name: "Travel Nomads",
    description: "Share travel experiences, tips, and destination insights",
    category: "Travel",
    createdAt: new Date("2023-05-12"),
    memberCount: 1205,
    topics: ["Budget Travel", "Adventure", "Cultural Experiences", "Solo Travel"],
    isActive: true,
    banner: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81",
    icon: "✈️"
  },
  {
    id: "creative-minds",
    name: "Creative Minds",
    description: "Share creative projects, art, design, and inspiration",
    category: "Art",
    createdAt: new Date("2023-06-08"),
    memberCount: 675,
    topics: ["Digital Art", "Traditional Art", "Design", "Photography"],
    isActive: true,
    banner: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
    icon: "🎨"
  }
];

const initialPosts: Post[] = [
  {
    id: "post1",
    communityId: "tech-innovators",
    title: "The Future of AI in Healthcare",
    content: "AI is transforming healthcare by enabling more accurate diagnoses, personalized treatments, and efficient patient monitoring. What are your thoughts on how AI will shape the future of healthcare?",
    userId: "user1",
    username: "tech_visionary",
    createdAt: new Date("2023-07-15"),
    upvotes: 45,
    downvotes: 3,
    commentCount: 12,
    tags: ["AI", "Healthcare", "Technology"]
  },
  {
    id: "post2",
    communityId: "tech-innovators",
    title: "Quantum Computing: Breakthrough or Hype?",
    content: "Quantum computing promises to revolutionize computing as we know it, but is it living up to the hype? Let's discuss the current state and future potential of quantum computing.",
    userId: "user2",
    username: "quantum_enthusiast",
    createdAt: new Date("2023-07-17"),
    upvotes: 32,
    downvotes: 5,
    commentCount: 8,
    tags: ["Quantum Computing", "Technology", "Innovation"]
  },
  {
    id: "post3",
    communityId: "fitness-enthusiasts",
    title: "HIIT vs. Traditional Cardio: Which is More Effective?",
    content: "High-Intensity Interval Training (HIIT) has gained popularity in recent years. Is it more effective than traditional cardio for fitness goals? Share your experiences and insights!",
    userId: "user3",
    username: "fitness_guru",
    createdAt: new Date("2023-07-18"),
    upvotes: 27,
    downvotes: 2,
    commentCount: 15,
    tags: ["Fitness", "HIIT", "Cardio", "Workout"]
  },
  {
    id: "post4",
    communityId: "book-club",
    title: "Must-Read Books of 2023",
    content: "What are your favorite books released this year? I'm looking for recommendations across all genres. Share your top picks and why you enjoyed them!",
    userId: "user4",
    username: "bookworm",
    createdAt: new Date("2023-07-19"),
    upvotes: 38,
    downvotes: 1,
    commentCount: 23,
    tags: ["Books", "Reading", "Literature", "Recommendations"]
  }
];

const initialComments: Comment[] = [
  {
    id: "comment1",
    postId: "post1",
    userId: "user5",
    username: "health_tech_expert",
    content: "AI in diagnostic imaging has already shown remarkable accuracy in detecting conditions early. I believe the next frontier is in predictive analytics for preventive care.",
    createdAt: new Date("2023-07-15T10:30:00"),
    upvotes: 12,
    downvotes: 0
  },
  {
    id: "comment2",
    postId: "post1",
    userId: "user6",
    username: "medical_innovator",
    content: "While the potential is exciting, we need to address the ethical implications and ensure patient privacy is protected as AI systems access sensitive medical data.",
    createdAt: new Date("2023-07-15T11:15:00"),
    upvotes: 8,
    downvotes: 1
  },
  {
    id: "comment3",
    postId: "post1",
    parentId: "comment1",
    userId: "user7",
    username: "data_scientist",
    content: "Absolutely agree! I'm currently working on a project that uses ML models to predict potential health issues based on lifestyle factors and historical data.",
    createdAt: new Date("2023-07-15T12:00:00"),
    upvotes: 5,
    downvotes: 0
  },
  {
    id: "comment4",
    postId: "post2",
    userId: "user8",
    username: "quantum_physics_phd",
    content: "Current quantum computers are still in their infancy. While they show promise for specific applications, general-purpose quantum computing is likely decades away.",
    createdAt: new Date("2023-07-17T09:45:00"),
    upvotes: 14,
    downvotes: 2
  },
  {
    id: "comment5",
    postId: "post3",
    userId: "user9",
    username: "fitness_coach",
    content: "HIIT is generally more time-efficient and can be better for fat loss, while traditional cardio may be superior for endurance building. The best approach depends on your specific goals.",
    createdAt: new Date("2023-07-18T14:20:00"),
    upvotes: 9,
    downvotes: 0
  },
  {
    id: "comment6",
    postId: "post4",
    userId: "user10",
    username: "literature_professor",
    content: "I'd highly recommend 'The Covenant of Water' by Abraham Verghese. It's a beautifully written multi-generational saga set in South India.",
    createdAt: new Date("2023-07-19T16:10:00"),
    upvotes: 7,
    downvotes: 0
  }
];

interface CommunityProviderProps {
  children: ReactNode;
}

export function CommunityProvider({ children }: CommunityProviderProps) {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [userCommunities, setUserCommunities] = useState<Community[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  // Initialize data
  useEffect(() => {
    // Check if data exists in localStorage
    const storedCommunities = localStorage.getItem("communities");
    const storedPosts = localStorage.getItem("posts");
    const storedComments = localStorage.getItem("comments");
    const storedUserCommunities = localStorage.getItem(`userCommunities_${user?.id}`);
    
    // Set communities
    if (storedCommunities) {
      setCommunities(JSON.parse(storedCommunities).map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt)
      })));
    } else {
      setCommunities(initialCommunities);
      localStorage.setItem("communities", JSON.stringify(initialCommunities));
    }
    
    // Set posts
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts).map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt)
      })));
    } else {
      setPosts(initialPosts);
      localStorage.setItem("posts", JSON.stringify(initialPosts));
    }
    
    // Set comments
    if (storedComments) {
      setComments(JSON.parse(storedComments).map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt)
      })));
    } else {
      setComments(initialComments);
      localStorage.setItem("comments", JSON.stringify(initialComments));
    }
    
    // Set user communities
    if (user && storedUserCommunities) {
      setUserCommunities(JSON.parse(storedUserCommunities));
    } else if (user) {
      setUserCommunities([]);
      localStorage.setItem(`userCommunities_${user.id}`, JSON.stringify([]));
    }
  }, [user]);

  // Update user communities when user changes
  useEffect(() => {
    if (user) {
      const storedUserCommunities = localStorage.getItem(`userCommunities_${user.id}`);
      if (storedUserCommunities) {
        setUserCommunities(JSON.parse(storedUserCommunities));
      } else {
        setUserCommunities([]);
        localStorage.setItem(`userCommunities_${user.id}`, JSON.stringify([]));
      }
    } else {
      setUserCommunities([]);
    }
  }, [user]);

  // Join a community
  const joinCommunity = (communityId: string) => {
    if (!user) return;
    
    const community = communities.find(c => c.id === communityId);
    if (!community) return;
    
    // Update user communities
    const newUserCommunities = [...userCommunities, community];
    setUserCommunities(newUserCommunities);
    localStorage.setItem(`userCommunities_${user.id}`, JSON.stringify(newUserCommunities));
    
    // Update community member count
    const updatedCommunities = communities.map(c => 
      c.id === communityId ? { ...c, memberCount: c.memberCount + 1 } : c
    );
    setCommunities(updatedCommunities);
    localStorage.setItem("communities", JSON.stringify(updatedCommunities));
  };

  // Leave a community
  const leaveCommunity = (communityId: string) => {
    if (!user) return;
    
    // Update user communities
    const newUserCommunities = userCommunities.filter(c => c.id !== communityId);
    setUserCommunities(newUserCommunities);
    localStorage.setItem(`userCommunities_${user.id}`, JSON.stringify(newUserCommunities));
    
    // Update community member count
    const updatedCommunities = communities.map(c => 
      c.id === communityId ? { ...c, memberCount: Math.max(0, c.memberCount - 1) } : c
    );
    setCommunities(updatedCommunities);
    localStorage.setItem("communities", JSON.stringify(updatedCommunities));
  };

  // Check if user is a member of a community
  const isMember = (communityId: string) => {
    if (!user) return false;
    return userCommunities.some(c => c.id === communityId);
  };

  // Create a new post
  const createPost = (communityId: string, title: string, content: string, tags: string[] = []) => {
    if (!user) throw new Error("User must be logged in to create a post");
    
    const newPost: Post = {
      id: `post_${Date.now()}`,
      communityId,
      title,
      content,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      createdAt: new Date(),
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
      tags
    };
    
    const updatedPosts = [...posts, newPost];
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    
    return newPost;
  };

  // Create a new comment
  const createComment = (postId: string, content: string, parentId?: string) => {
    if (!user) throw new Error("User must be logged in to create a comment");
    
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      postId,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      content,
      createdAt: new Date(),
      upvotes: 0,
      downvotes: 0,
      parentId
    };
    
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem("comments", JSON.stringify(updatedComments));
    
    // Update comment count on the post
    const updatedPosts = posts.map(p => 
      p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
    );
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    
    return newComment;
  };

  // Upvote a post
  const upvotePost = (postId: string) => {
    if (!user) return;
    
    const updatedPosts = posts.map(p => 
      p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p
    );
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  // Downvote a post
  const downvotePost = (postId: string) => {
    if (!user) return;
    
    const updatedPosts = posts.map(p => 
      p.id === postId ? { ...p, downvotes: p.downvotes + 1 } : p
    );
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  // Upvote a comment
  const upvoteComment = (commentId: string) => {
    if (!user) return;
    
    const updatedComments = comments.map(c => 
      c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c
    );
    setComments(updatedComments);
    localStorage.setItem("comments", JSON.stringify(updatedComments));
  };

  // Downvote a comment
  const downvoteComment = (commentId: string) => {
    if (!user) return;
    
    const updatedComments = comments.map(c => 
      c.id === commentId ? { ...c, downvotes: c.downvotes + 1 } : c
    );
    setComments(updatedComments);
    localStorage.setItem("comments", JSON.stringify(updatedComments));
  };

  // Get comments for a post
  const getPostComments = (postId: string) => {
    return comments.filter(c => c.postId === postId);
  };

  // Get threaded comments for a post
  const getThreadedComments = (postId: string) => {
    const postComments = comments.filter(c => c.postId === postId);
    
    // Find top-level comments
    const topLevelComments = postComments.filter(c => !c.parentId);
    
    // Function to recursively build comment tree
    const buildCommentTree = (comment: Comment) => {
      const replies = postComments.filter(c => c.parentId === comment.id);
      return {
        ...comment,
        replies: replies.map(buildCommentTree)
      };
    };
    
    return topLevelComments.map(buildCommentTree);
  };

  // Get posts for a community
  const getCommunityPosts = (communityId: string) => {
    return posts.filter(p => p.communityId === communityId);
  };

  // Get a specific community
  const getCommunity = (communityId: string) => {
    return communities.find(c => c.id === communityId);
  };

  // Get a specific post
  const getPost = (postId: string) => {
    return posts.find(p => p.id === postId);
  };

  // Search for communities by name or description
  const searchCommunities = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return communities.filter(
      c => c.name.toLowerCase().includes(lowerQuery) || 
           c.description.toLowerCase().includes(lowerQuery)
    );
  };

  // Filter communities by category
  const filterCommunitiesByCategory = (category: string) => {
    return communities.filter(c => c.category === category);
  };

  return (
    <CommunityContext.Provider value={{
      communities,
      posts,
      comments,
      userCommunities,
      joinCommunity,
      leaveCommunity,
      isMember,
      createPost,
      createComment,
      upvotePost,
      downvotePost,
      upvoteComment,
      downvoteComment,
      getPostComments,
      getThreadedComments,
      getCommunityPosts,
      getCommunity,
      getPost,
      searchCommunities,
      filterCommunitiesByCategory
    }}>
      {children}
    </CommunityContext.Provider>
  );
}
