
import React from 'react';

const CosmicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dark background */}
      <div className="absolute inset-0 bg-black dark:bg-black light:bg-slate-100"></div>
      
      {/* Central cosmic circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[65vmin] h-[65vmin] rounded-full bg-black dark:bg-black light:bg-slate-200 border-[12px] border-blue-900/30 dark:border-blue-900/30 light:border-blue-900/10 overflow-hidden">
        {/* Animated particles inside the circle */}
        {Array.from({ length: 150 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[2px] bg-blue-500 rounded-full animate-pulse-slow"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDuration: `${3 + Math.random() * 7}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>
      
      {/* Blue glow effect */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85vmin] h-[85vmin] rounded-full bg-blue-700 dark:bg-blue-700 light:bg-blue-400 opacity-20 filter blur-[50px] animate-pulse-cosmic"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[75vmin] h-[75vmin] rounded-full bg-blue-600 dark:bg-blue-600 light:bg-blue-500 opacity-15 filter blur-[30px] animate-pulse-cosmic" style={{ animationDelay: '1s' }}></div>
      
      {/* Additional floating blue particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i + 'outer'}
          className="absolute w-[3px] h-[3px] bg-blue-400 rounded-full animate-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.2,
            animationDuration: `${10 + Math.random() * 20}s`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default CosmicBackground;
