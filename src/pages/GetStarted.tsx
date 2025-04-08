
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Send } from 'lucide-react';

const GetStarted = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectTitle: '',
    projectDescription: '',
    budget: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If still loading, wait
    if (loading) return;
    
    // If not logged in, redirect to auth
    if (!user) {
      toast.error("Please log in to submit a project request");
      navigate('/auth');
      return;
    }
    
    // Pre-populate form with user data if available
    if (user && profile) {
      setFormData(prev => ({
        ...prev,
        name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim(),
        email: user.email || '',
      }));
    }
  }, [user, profile, loading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Validate budget to only allow numbers and decimals
    if (name === 'budget' && value !== '') {
      const regex = /^[0-9]*\.?[0-9]*$/;
      if (!regex.test(value)) return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in to submit a project request");
      navigate('/auth');
      return;
    }
    
    if (!formData.projectTitle || !formData.projectDescription) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('project_requests')
        .insert({
          user_id: user.id,
          name: formData.name,
          email: formData.email,
          project_title: formData.projectTitle,
          project_description: formData.projectDescription,
          budget: formData.budget ? parseFloat(formData.budget) : null,
        });
        
      if (error) throw error;
      
      toast.success("Project request submitted successfully!");
      navigate('/building');
    } catch (error: any) {
      toast.error(`Error submitting project request: ${error.message}`);
      console.error("Error submitting project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Start Your Project</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tell us about your project, and we'll help bring your vision to life.
            </p>
          </div>
          
          <Card className="border-border/50 shadow-lg">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        required
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="projectTitle">Project Title</Label>
                    <Input
                      id="projectTitle"
                      name="projectTitle"
                      value={formData.projectTitle}
                      onChange={handleChange}
                      placeholder="E.g., Company Website Redesign"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="projectDescription">Project Description</Label>
                    <Textarea
                      id="projectDescription"
                      name="projectDescription"
                      value={formData.projectDescription}
                      onChange={handleChange}
                      placeholder="Tell us about your project, goals, and requirements..."
                      rows={6}
                      required
                      disabled={isSubmitting}
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="budget">Estimated Budget (USD)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="Enter your budget"
                        className="pl-7"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Submit Project Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GetStarted;
