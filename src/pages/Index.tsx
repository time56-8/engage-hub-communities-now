
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import CommunityCard from '@/components/CommunityCard';
import { useCommunity } from '@/contexts/CommunityContext';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { communities } = useCommunity();
  const { isAuthenticated } = useAuth();
  
  // Get featured communities (just the first 3)
  const featuredCommunities = communities.slice(0, 3);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
                Discover Your Perfect Community
              </h1>
              <p className="text-lg mb-8 opacity-90 animate-slide-in">
                Join conversations, share knowledge, and connect with people who share your passions.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-in">
                <Button size="lg" asChild className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold">
                  <Link to="/communities">Explore Communities</Link>
                </Button>
                
                {!isAuthenticated && (
                  <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white/10 font-semibold">
                    <Link to="/signup">Create Account</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured communities section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">Featured Communities</h2>
              <Link to="/communities" className="text-indigo-600 hover:underline font-medium">
                View All
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCommunities.map(community => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          </div>
        </section>
        
        {/* How it works section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-center mb-12">How EngageHub Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="mb-4 p-4 bg-indigo-100 inline-block rounded-full">
                  <svg className="h-10 w-10 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <path d="M9 9h.01" />
                    <path d="M15 9h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Join Communities</h3>
                <p className="text-gray-600">
                  Find and join communities that match your interests and passions.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 p-4 bg-purple-100 inline-block rounded-full">
                  <svg className="h-10 w-10 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9M16.5 3.5v17M7.5 3.5v17M3 16.5h8.5M3 7.5h8.5M3 12h8.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Engage in Discussions</h3>
                <p className="text-gray-600">
                  Participate in meaningful conversations and share your knowledge.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 p-4 bg-fuchsia-100 inline-block rounded-full">
                  <svg className="h-10 w-10 text-fuchsia-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Stay Connected</h3>
                <p className="text-gray-600">
                  Get updates about the topics and discussions that matter to you.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA section - only show if not authenticated */}
        {!isAuthenticated && (
          <section className="py-16 bg-gray-900 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Join the Conversation?</h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Create an account today and start connecting with communities that share your interests.
              </p>
              <Button size="lg" asChild className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                <Link to="/signup">Get Started Now</Link>
              </Button>
            </div>
          </section>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <Link to="/" className="text-xl font-bold">
                EngageHub
              </Link>
              <p className="mt-2 text-gray-400 text-sm max-w-md">
                A platform for discovering and engaging with niche communities based on your interests.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold mb-3 uppercase">Platform</h3>
                <ul className="space-y-2">
                  <li><Link to="/communities" className="text-gray-400 hover:text-white">Communities</Link></li>
                  <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                  <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-3 uppercase">Resources</h3>
                <ul className="space-y-2">
                  <li><Link to="/guidelines" className="text-gray-400 hover:text-white">Guidelines</Link></li>
                  <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                  <li><Link to="/support" className="text-gray-400 hover:text-white">Support</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-3 uppercase">Legal</h3>
                <ul className="space-y-2">
                  <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                  <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                  <li><Link to="/cookies" className="text-gray-400 hover:text-white">Cookie Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} EngageHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
