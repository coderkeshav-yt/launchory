
import React, { useState, useEffect } from 'react';
import { X, Calculator, Clock, Layers, Cpu } from 'lucide-react';

interface BudgetCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const BudgetCalculator = ({ isOpen, onClose }: BudgetCalculatorProps) => {
  const [formState, setFormState] = useState({
    projectType: 'website',
    complexity: 'medium',
    duration: '1-3',
    features: []
  });
  const [budget, setBudget] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Control body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store the current scroll position
      const scrollY = window.scrollY;
      
      // Prevent scrolling on the body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scrolling and position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Scroll back to original position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }
    
    return () => {
      // Cleanup in case component unmounts while modal is open
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleFeatureToggle = (feature: string) => {
    setFormState(prev => {
      const features = [...prev.features] as string[];
      if (features.includes(feature)) {
        return { ...prev, features: features.filter(f => f !== feature) };
      } else {
        return { ...prev, features: [...features, feature] };
      }
    });
  };

  const calculateBudget = () => {
    setIsCalculating(true);
    
    // Simulate AI calculation
    setTimeout(() => {
      // Base price based on project type
      let basePrice = 0;
      switch (formState.projectType) {
        case 'website': basePrice = 2000; break; // Reduced from 5000
        case 'webapp': basePrice = 6000; break;  // Reduced from 15000
        case 'ecommerce': basePrice = 8000; break; // Reduced from 20000
        case 'saas': basePrice = 10000; break;  // Reduced from 25000
      }
      
      // Complexity multiplier
      let complexityMultiplier = 1;
      switch (formState.complexity) {
        case 'simple': complexityMultiplier = 0.8; break;
        case 'medium': complexityMultiplier = 1; break;
        case 'complex': complexityMultiplier = 1.5; break;
        case 'enterprise': complexityMultiplier = 2; break;
      }
      
      // Duration factor
      let durationFactor = 1;
      switch (formState.duration) {
        case '1-3': durationFactor = 1.2; break;
        case '3-6': durationFactor = 1; break;
        case '6-12': durationFactor = 0.9; break;
      }
      
      // Feature additions (reduced from 2500 to 1000 per feature)
      const featuresCost = (formState.features.length * 1000);
      
      // Calculate total
      const total = basePrice * complexityMultiplier * durationFactor + featuresCost;
      
      // Generate range (±15%)
      const min = Math.round(total * 0.85 / 1000) * 1000;
      const max = Math.round(total * 1.15 / 1000) * 1000;
      
      setBudget(`$${min.toLocaleString()} - $${max.toLocaleString()}`);
      setIsCalculating(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100]">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="w-full max-w-lg bg-background/95 backdrop-blur-sm border border-border/40 shadow-xl rounded-2xl p-6 md:p-8 relative z-[101] animate-fade-in overflow-hidden">
        {/* Premium gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-primary/10 opacity-90"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold font-space text-gradient">AI Budget Calculator</h3>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X size={20} />
            </button>
          </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Cpu size={16} />
              Project Type
            </label>
            <select
              name="projectType"
              value={formState.projectType}
              onChange={handleChange}
              className="w-full bg-muted border-muted rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            >
              <option value="website">Website</option>
              <option value="webapp">Web Application</option>
              <option value="ecommerce">E-Commerce</option>
              <option value="saas">SaaS Platform</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Layers size={16} />
              Complexity
            </label>
            <select
              name="complexity"
              value={formState.complexity}
              onChange={handleChange}
              className="w-full bg-muted border-muted rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            >
              <option value="simple">Simple</option>
              <option value="medium">Medium</option>
              <option value="complex">Complex</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Clock size={16} />
              Duration (months)
            </label>
            <select
              name="duration"
              value={formState.duration}
              onChange={handleChange}
              className="w-full bg-muted border-muted rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            >
              <option value="1-3">0.5-1 months</option>
              <option value="3-6">1-1.5 months</option>
              <option value="6-12">1.5-2.5 months</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Features (select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Authentication', 'Payment Processing', 
                'User Dashboard', 'Admin Panel', 
                'API Integration', 'Custom Animation', 
                'Search Functionality', 'Full Stack web Development'
              ].map(feature => (
                <div 
                  key={feature}
                  onClick={() => handleFeatureToggle(feature)}
                  className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                    (formState.features as string[]).includes(feature) 
                      ? 'bg-accent/30 border border-accent/50' 
                      : 'bg-muted border border-transparent'
                  }`}
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={calculateBudget}
            disabled={isCalculating}
            className="glass-button w-full flex items-center justify-center gap-2"
          >
            {isCalculating ? (
              <span className="animate-pulse">Calculating...</span>
            ) : (
              <>
                <Calculator size={18} />
                <span>Calculate Budget</span>
              </>
            )}
          </button>
          
          {budget && (
            <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg text-center">
              <h4 className="text-sm font-medium mb-2">Estimated Budget Range</h4>
              <p className="text-2xl font-bold font-space text-gradient">{budget}</p>
              <p className="text-xs text-muted-foreground mt-2">
                This is an AI-generated estimate. Contact us for an accurate quote.
              </p>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCalculator;
