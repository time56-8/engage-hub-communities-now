
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold bg-gradient-to-r from-community-primary to-community-secondary bg-clip-text text-transparent mb-6">
          404
        </div>
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <div className="space-y-4">
          <Button asChild size="lg" className="w-full">
            <Link to="/">Return to Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link to="/communities">Browse Communities</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
