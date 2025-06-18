import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, ArrowRight } from 'lucide-react';
import TypewriterText from '@/components/TypewriterText';

const Index = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Rotate through phrases
    const interval = setInterval(() => {
      setCurrentPhraseIndex(prevIndex => (prevIndex + 1) % phrases.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleStartChatting = () => {
    navigate('/chatbot');
  };

  const phrases = [
    "Ask me about course schedules",
    "Get information about facilities",
    "Learn about upcoming events"
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-reva-blue/5"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-reva-blue/10 rounded-full filter blur-3xl animate-float" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl animate-float" style={{ animationDuration: '25s', animationDelay: '3s' }}></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-blue-400/5 rounded-full filter blur-3xl animate-float" style={{ animationDuration: '18s', animationDelay: '1s' }}></div>
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${15 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.3 + Math.random() * 0.7
            }}
          ></div>
        ))}
      </div>

      <div className="w-full max-w-4xl z-10">
        {/* Bot Icon Animation */}
        <div 
          className="flex justify-center mb-12 opacity-0 animate-fade-in" 
          style={{ animationDelay: '200ms' }}
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-reva-blue/20 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full bg-reva-blue/10 animate-pulse" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
            <Bot className="w-24 h-24 text-reva-blue relative z-10 animate-float" />
          </div>
        </div>

        {/* Main Title with Staggered Animation */}
        <div className="text-center mb-6">
          <h1 
            className="text-5xl md:text-7xl font-bold mb-2 opacity-0 animate-fade-in" 
            style={{ animationDelay: '600ms' }}
          >
            Welcome to <span className="text-gradient">RevaBot</span>
          </h1>
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: '1000ms' }}>
            {showContent && (
              <p className="text-xl text-white/80 dark:text-white/80 light:text-reva-dark/80 mt-6 mb-8">
                <TypewriterText 
                  text="Your AI-powered assistant for REVA University."
                  delay={50}
                  onComplete={() => setShowButton(true)}
                />
              </p>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 opacity-0 animate-fade-in" 
          style={{ animationDelay: '1400ms' }}
        >
          {[
            {
              title: "Instant Answers",
              description: "Get quick responses to your questions about courses, schedules, and more."
            },
            {
              title: "Event Updates",
              description: "Stay informed about campus events, workshops, and important dates."
            },
            {
              title: "Voice Enabled",
              description: "Interact with RevaBot using voice commands for a hands-free experience."
            },
            {
              title: "Live Data Fetching",
              description: "Get real-time information directly from REVA University's official sources."
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="glass p-6 rounded-2xl transform transition-all duration-500 hover:scale-105 hover:bg-white/10 border border-white/10 shadow-md backdrop-blur-md"
            >
              <h3 className="text-lg font-semibold mb-2 text-gradient">{feature.title}</h3>
              <p className="text-sm text-white/70 dark:text-white/70 light:text-reva-dark/70">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Button with Animation */}
        <div className="flex justify-center">
          {showButton && (
            <button 
              onClick={handleStartChatting}
              className="opacity-0 animate-fade-in flex items-center gap-2 bg-reva-blue hover:bg-reva-blue/90 text-white py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-reva-blue/20 border border-reva-blue/50 group" 
              style={{ animationDelay: '1800ms' }}
            >
              <span>Start Chatting</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          )}
        </div>

        {/* Rotating Phrases */}
        <div 
          className="absolute bottom-10 left-0 right-0 text-center text-white/60 dark:text-white/60 light:text-reva-dark/60 text-sm opacity-0 animate-fade-in"
          style={{ animationDelay: '2200ms' }}
        >
          <div className="h-6 overflow-hidden">
            {phrases.map((phrase, index) => (
              <div
                key={index}
                className={`h-6 transition-all duration-1000 ${
                  currentPhraseIndex === index
                    ? "opacity-100 transform-none"
                    : "opacity-0 transform translate-y-8"
                }`}
              >
                {phrase}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
