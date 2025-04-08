
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const formRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Track form completion status
  const isStep1Complete = name.trim().length >= 2;
  const isStep2Complete = email.trim().length >= 5 && email.includes('@');
  const isStep3Complete = message.trim().length >= 10;

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

  // Handle outside click to close form
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
        duration: 5000,
      });
      
      // Reset form
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
      setIsOpen(false);
      setCurrentStep(1);
    }, 1500);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleContactForm = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating button with pulse animation */}
      <motion.div
        className="fixed bottom-8 left-8 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.3, type: "spring" }}
      >
        <Button
          onClick={toggleContactForm}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-accent to-secondary hover:from-secondary hover:to-accent text-white shadow-lg group relative transition-all duration-300"
        >
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
          
          {/* Pulse ring animation */}
          <span className="absolute inset-0 rounded-full border-2 border-accent animate-ping opacity-75"></span>
        </Button>
        
        {/* Label tooltip */}
        <div className="absolute -top-10 left-0 bg-card px-4 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Contact Us
        </div>
      </motion.div>

      {/* Contact popup */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              ref={formRef}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 md:w-96 bg-gradient-to-br from-card to-card/90 border border-accent/20 rounded-xl shadow-xl z-[100] overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-border flex justify-between items-center bg-accent/5">
                <div>
                  <h3 className="text-lg font-medium">Get In Touch</h3>
                  <div className="flex mt-1">
                    {[1, 2, 3].map((step) => (
                      <div 
                        key={step} 
                        className="flex items-center"
                        onClick={() => currentStep > step ? setCurrentStep(step) : null}
                      >
                        <div 
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer transition-colors
                            ${currentStep === step ? 'bg-accent text-white' : 
                              currentStep > step ? 'bg-accent/30 text-foreground cursor-pointer' : 
                              'bg-muted text-muted-foreground'}
                          `}
                        >
                          {step}
                        </div>
                        {step < 3 && (
                          <div className={`w-4 h-0.5 ${currentStep > step ? 'bg-accent/30' : 'bg-muted'}`}></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <Badge className="bg-accent/20 text-accent hover:bg-accent/30 mb-2">Step 1/3</Badge>
                      <h4 className="text-lg font-medium">What's your name?</h4>
                      
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                          className="pl-10"
                          autoFocus
                          required
                          autoComplete="name"
                        />
                      </div>
                      
                      <Button 
                        type="button" 
                        className="w-full"
                        disabled={!isStep1Complete}
                        onClick={nextStep}
                      >
                        Continue <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                  
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <Badge className="bg-accent/20 text-accent hover:bg-accent/30 mb-2">Step 2/3</Badge>
                      <h4 className="text-lg font-medium">What's your email?</h4>
                      
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="pl-10"
                          autoFocus
                          required
                          autoComplete="email"
                        />
                      </div>
                      
                      <div className="flex justify-between space-x-2">
                        <Button 
                          type="button" 
                          variant="outline"
                          className="w-1/3"
                          onClick={prevStep}
                        >
                          Back
                        </Button>
                        <Button 
                          type="button" 
                          className="w-2/3"
                          disabled={!isStep2Complete}
                          onClick={nextStep}
                        >
                          Continue <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <Badge className="bg-accent/20 text-accent hover:bg-accent/30 mb-2">Step 3/3</Badge>
                      <h4 className="text-lg font-medium">How can we help you?</h4>
                      
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your project or question..."
                        rows={4}
                        autoFocus
                        required
                        className="resize-none"
                      />
                      
                      <div>
                        <p className="text-xs text-muted-foreground mb-4">
                          By submitting this form, you agree to our <a href="#" className="text-accent hover:underline">Privacy Policy</a> and consent to be contacted about our services.
                        </p>
                      </div>
                      
                      <div className="flex justify-between space-x-2">
                        <Button 
                          type="button" 
                          variant="outline"
                          className="w-1/3"
                          onClick={prevStep}
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit" 
                          className="w-2/3 bg-gradient-to-r from-accent to-secondary hover:from-secondary hover:to-accent"
                          disabled={isSubmitting || !isStep3Complete}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                              Sending...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              Send Message
                              <Send className="w-4 h-4" />
                            </span>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
              
              {/* Contact info footer */}
              <div className="p-4 bg-muted/30 border-t border-border">
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <span>Need urgent help?</span>
                  <a href="mailto:contact@example.com" className="text-accent hover:underline">
                    contact@example.com
                  </a>
                </div>
              </div>
            </motion.div>
            
            {/* Backdrop with higher z-index */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingContact;
