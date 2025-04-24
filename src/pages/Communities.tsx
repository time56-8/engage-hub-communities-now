
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CommunityCard from '@/components/CommunityCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Community, useCommunity } from '@/contexts/CommunityContext';
import { Search } from 'lucide-react';

const CommunitiesPage = () => {
  const { communities } = useCommunity();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>(communities);
  const [activeTab, setActiveTab] = useState('all');
  
  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(communities.map(c => c.category)))];
  
  // Filter communities based on search query and active tab
  useEffect(() => {
    let filtered = communities;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        community => 
          community.name.toLowerCase().includes(query) || 
          community.description.toLowerCase().includes(query) ||
          community.topics?.some(topic => topic.toLowerCase().includes(query))
      );
    }
    
    // Filter by category
    if (activeTab !== 'all') {
      filtered = filtered.filter(community => community.category === activeTab);
    }
    
    setFilteredCommunities(filtered);
  }, [searchQuery, communities, activeTab]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Discover Communities</h1>
            
            {/* Search bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search communities by name, description or topic..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Category tabs */}
            <Tabs defaultValue="all" onValueChange={handleTabChange} className="mb-8">
              <TabsList className="grid grid-flow-col auto-cols-max gap-2 overflow-x-auto pb-2">
                <TabsTrigger 
                  value="all" 
                  className="py-2 px-4 rounded"
                >
                  All
                </TabsTrigger>
                {categories.slice(1).map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="py-2 px-4 rounded"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all">
                {/* This will show all communities or filtered ones based on search */}
              </TabsContent>
              
              {categories.slice(1).map((category) => (
                <TabsContent key={category} value={category}>
                  {/* This will show category-specific communities */}
                </TabsContent>
              ))}
            </Tabs>
            
            {/* Communities grid */}
            {filteredCommunities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCommunities.map(community => (
                  <CommunityCard key={community.id} community={community} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No communities found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any communities matching your search.
                </p>
                <Button onClick={() => { setSearchQuery(''); setActiveTab('all'); }}>
                  Clear Filters
                </Button>
              </div>
            )}
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

export default CommunitiesPage;
