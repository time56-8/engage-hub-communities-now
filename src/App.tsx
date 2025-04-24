
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CommunityProvider } from "./contexts/CommunityContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Communities from "./pages/Communities";
import CommunityPage from "./pages/CommunityPage";
import PostPage from "./pages/PostPage";
import CreatePostPage from "./pages/CreatePostPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CommunityProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/community/:communityId" element={<CommunityPage />} />
              <Route path="/community/:communityId/post/:postId" element={<PostPage />} />
              <Route path="/community/:communityId/create-post" element={<CreatePostPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CommunityProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
