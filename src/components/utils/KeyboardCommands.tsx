
import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface KeyboardCommandsProps {
  setCalculatorOpen: (isOpen: boolean) => void;
}

const KeyboardCommands = ({ setCalculatorOpen }: KeyboardCommandsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // "/" opens contact form
      if (e.key === '/') {
        e.preventDefault();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
        toast.info("Contact form opened", {
          description: "Feel free to reach out about your project!"
        });
      }
      
      // Shift + C opens contact
      if (e.key === 'C' && e.shiftKey) {
        e.preventDefault();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
      
      // Shift + D opens work showcase
      if (e.key === 'D' && e.shiftKey) {
        e.preventDefault();
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
      
      // L toggles page info
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        toast.info("Launchory", {
          description: "Next-generation web development agency"
        });
      }
      
      // Command + K or Ctrl + K
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCalculatorOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setCalculatorOpen]);

  return null;
};

export default KeyboardCommands;
