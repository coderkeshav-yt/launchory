
import React, { useState, useRef, useEffect } from 'react';
import { Send, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Contact = () => {
  const { user } = useAuth();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    budget: 'Medium',
    service: 'Web Development'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Auto-fill form with user data if logged in
  useEffect(() => {
    if (user?.user_metadata) {
      setFormState(prev => ({
        ...prev,
        name: user.user_metadata.first_name ? 
          `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim() : 
          prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send message to Supabase
      const { error } = await supabase
        .from("contact_messages")
        .insert([
          {
            name: formState.name,
            email: formState.email,
            message: formState.message
          }
        ]);

      if (error) throw error;

      setIsSuccess(true);
      setFormState({
        name: '',
        email: '',
        message: '',
        budget: 'Medium',
        service: 'Web Development'
      });
      
      toast.success("Message sent successfully!", {
        description: "We'll get back to you soon.",
        action: {
          label: "Close",
          onClick: () => console.log("Closed")
        }
      });
      
      // Reset success state
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="py-24 px-6 opacity-0 transition-opacity duration-700"
    >
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-lg font-medium uppercase tracking-widest text-accent/80 mb-4">Collaborate</h2>
          <h3 className="text-4xl md:text-5xl font-bold font-space mb-6">
            <span className="text-gradient">Let's Build</span> Your Vision
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to transform your digital presence? Reach out to discuss your project needs and discover how our team can bring your vision to life.
          </p>
        </div>

        <div className="max-w-3xl mx-auto glass rounded-xl p-8 md:p-10 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formState.name}
                  onChange={handleChange}
                  className="w-full bg-muted border-muted rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formState.email}
                  onChange={handleChange}
                  className="w-full bg-muted border-muted rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="service" className="block text-sm font-medium mb-2">
                  Service Interest
                </label>
                <select
                  id="service"
                  name="service"
                  value={formState.service}
                  onChange={handleChange}
                  className="w-full bg-muted border-muted rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="UI Design">UI Design</option>
                  <option value="SaaS Development">SaaS Development</option>
                  <option value="Web3 Solutions">Web3 Solutions</option>
                  <option value="Performance Optimization">Performance Optimization</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="budget" className="block text-sm font-medium mb-2">
                  Budget Range
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formState.budget}
                  onChange={handleChange}
                  className="w-full bg-muted border-muted rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300"
                >
                  <option value="Small">Small ($100 - $300)</option>
                  <option value="Medium">Medium ($1500 - $500)</option>
                  <option value="Large">Large ($50k - $100k)</option>
                  <option value="Enterprise">Enterprise ($100k+)</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Project Details
              </label>
              <textarea
                id="message"
                name="message"
                required
                value={formState.message}
                onChange={handleChange}
                rows={5}
                className="w-full bg-muted border-muted rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300"
                placeholder="Tell us about your project..."
              />
            </div>
            
            <div className="text-right">
              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`glass-button flex items-center gap-2 transition-all duration-300 ${
                  isSuccess ? 'bg-green-500/20 border-green-500/30 text-green-400' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-pulse">Sending...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <Check size={18} />
                    <span>Message Sent</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
          
          {/* Keyboard shortcut hint */}
          <div className="mt-8 pt-4 border-t border-muted/30 text-center">
            <p className="text-sm text-muted-foreground">
              Pro tip: Press <kbd className="px-2 py-0.5 bg-muted rounded text-xs">/</kbd> anywhere to quickly open the contact form
            </p>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default Contact;
