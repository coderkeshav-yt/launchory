
import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import BudgetCalculator from './BudgetCalculator';

const FloatingAIButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-accent/90 text-white flex items-center justify-center z-40 shadow-neon-glow transition-transform duration-300 hover:scale-110"
        aria-label="Open AI Budget Calculator"
      >
        <Brain size={24} />
        
        {/* Ripple effect on hover */}
        <span 
          className={`absolute inset-0 rounded-full border border-accent/50 transition-all duration-500 ${
            isHovered ? 'opacity-0 scale-[1.4]' : 'opacity-100 scale-100'
          }`}
        />
        <span 
          className={`absolute inset-0 rounded-full border border-accent/30 transition-all duration-700 ${
            isHovered ? 'opacity-0 scale-[1.8]' : 'opacity-100 scale-100'
          }`}
        />
      </button>
      
      {/* Tooltip */}
      <div 
        className={`fixed bottom-8 right-24 bg-card px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        AI Budget Calculator
      </div>
      
      {/* Budget Calculator Modal */}
      <BudgetCalculator isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default FloatingAIButton;
