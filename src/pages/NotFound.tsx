
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Bot, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-reva-dark px-4">
      <div className="text-center max-w-md">
        <div className="mb-8 flex justify-center opacity-0 animate-fade-in">
          <Bot className="h-24 w-24 text-reva-blue animate-float" />
        </div>
        
        <h1 className="text-6xl font-bold mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <span className="text-gradient">404</span>
        </h1>
        
        <div className="glass p-8 rounded-2xl opacity-0 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <p className="text-xl mb-6">
            Oops! The page you're looking for doesn't exist
          </p>
          
          <p className="text-white/70 mb-8">
            It seems you've ventured into uncharted territory. Let's get you back on track.
          </p>
          
          <Link 
            to="/" 
            className="btn-primary inline-flex"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
