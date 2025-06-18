
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, Home, BarChart2, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center transition-all duration-500 ${
        scrolled 
          ? theme === 'dark' 
            ? 'bg-black/30 backdrop-blur-xl border-b border-white/5 shadow-md' 
            : 'bg-white/70 backdrop-blur-xl border-b border-black/5 shadow-md'
          : 'bg-transparent'
      }`}
    >
      <Link 
        to="/" 
        className="flex items-center gap-2 opacity-0 animate-fade-in" 
        style={{ animationDelay: '200ms' }}
      >
        <div className="relative">
          <Bot className="text-reva-blue h-6 w-6 animate-float" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-0 bg-reva-blue/20 rounded-full filter blur-sm animate-pulse"></div>
        </div>
        <span className="text-xl font-semibold dark:text-white light:text-reva-dark">RevaBot</span>
      </Link>

      <div className="flex items-center gap-8">
        <div className="flex items-center opacity-0 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <Link 
            to="/" 
            className={`nav-link relative ${isActive('/') ? 'active' : ''}`}
          >
            <div className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </div>
            {isActive('/') && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-reva-blue rounded-full"></div>
            )}
          </Link>
          
          <Link 
            to="/chatbot" 
            className={`nav-link relative ml-6 ${isActive('/chatbot') ? 'active' : ''}`}
          >
            <div className="flex items-center gap-1">
              <Bot className="h-4 w-4" />
              <span>Chatbot</span>
            </div>
            {isActive('/chatbot') && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-reva-blue rounded-full"></div>
            )}
          </Link>
          
          <Link 
            to="/updates" 
            className={`nav-link relative ml-6 ${isActive('/updates') ? 'active' : ''}`}
          >
            <div className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              <span>Updates</span>
            </div>
            {isActive('/updates') && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-reva-blue rounded-full"></div>
            )}
          </Link>
        </div>

        <button 
          className="btn-icon opacity-0 animate-fade-in border border-white/20 hover:border-white/40 dark:border-white/20 dark:hover:border-white/40 light:border-black/20 light:hover:border-black/40 rounded-full p-2 transition-all duration-300 hover:shadow-glow" 
          style={{ animationDelay: '600ms' }}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-yellow-300" />
          ) : (
            <Moon className="h-5 w-5 text-blue-500" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
