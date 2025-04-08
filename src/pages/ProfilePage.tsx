import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Save, Loader2, Upload, ClipboardList, Clock, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProfilePage = () => {
  const { user, profile, loading, projectRequests, fetchProjectRequests } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      navigate('/auth');
    }
    
    // Initialize form data with profile data
    if (profile) {
      console.log("Setting form data from profile:", profile);
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        phoneNumber: profile.phone_number || '',
      });
      setAvatarUrl(profile.avatar_url);
    } else {
      console.log("No profile data available");
    }
    
    // Fetch project requests
    if (user && !loading) {
      fetchProjectRequests();
    }
  }, [user, profile, loading, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Only allow digits for phone number
    if (name === 'phoneNumber' && value !== '' && !/^\d+$/.test(value)) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error('Error updating profile: ' + error.message);
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const getInitials = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };
  
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) {
      return;
    }
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}-${Math.random()}.${fileExt}`;
    
    setUploading(true);
    
    try {
      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const avatarUrl = data.publicUrl;
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      setAvatarUrl(avatarUrl);
      toast.success('Avatar updated successfully!');
    } catch (error: any) {
      toast.error('Error uploading avatar: ' + error.message);
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">Completed</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="container mx-auto px-4 py-32 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading profile...</span>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="container mx-auto px-4 py-32">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Profile</h1>
        
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="projects">Project Requests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="shadow-lg border-border/50 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary/20 to-accent/20"></div>
                
                <CardHeader className="flex flex-col items-center relative z-10 pt-12">
                  <div className="relative mb-4 group">
                    <Avatar className="h-32 w-32 ring-4 ring-background shadow-xl">
                      <AvatarImage src={avatarUrl || ''} />
                      <AvatarFallback className="text-3xl bg-gradient-to-br from-accent to-primary text-white">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    
                    {isEditing && (
                      <label 
                        htmlFor="avatar-upload" 
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        {uploading ? (
                          <Loader2 className="h-6 w-6 text-white animate-spin" />
                        ) : (
                          <>
                            <Upload className="h-6 w-6 text-white" />
                            <input 
                              id="avatar-upload" 
                              type="file" 
                              accept="image/*" 
                              onChange={handleAvatarChange} 
                              className="hidden" 
                              disabled={uploading}
                            />
                          </>
                        )}
                      </label>
                    )}
                  </div>
                  
                  <CardTitle className="text-2xl font-space">{user?.email}</CardTitle>
                  <CardDescription>
                    {profile?.created_at ? `Member since ${new Date(profile.created_at).toLocaleDateString()}` : 'Welcome to your profile!'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 p-8">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter your first name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter your last name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                        />
                        <p className="text-xs text-muted-foreground">Only digits allowed.</p>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-accent/5 rounded-xl p-5 border border-accent/10 transition-all duration-300 hover:border-accent/30">
                          <p className="text-sm font-medium text-accent mb-1">First Name</p>
                          <p className="text-lg font-medium">
                            {formData.firstName || (
                              <span className="text-muted-foreground text-base italic">Not set</span>
                            )}
                          </p>
                        </div>
                        
                        <div className="bg-accent/5 rounded-xl p-5 border border-accent/10 transition-all duration-300 hover:border-accent/30">
                          <p className="text-sm font-medium text-accent mb-1">Last Name</p>
                          <p className="text-lg font-medium">
                            {formData.lastName || (
                              <span className="text-muted-foreground text-base italic">Not set</span>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-accent/5 rounded-xl p-5 border border-accent/10 transition-all duration-300 hover:border-accent/30">
                          <p className="text-sm font-medium text-accent mb-1">Phone Number</p>
                          <p className="text-lg font-medium">
                            {formData.phoneNumber || (
                              <span className="text-muted-foreground text-base italic">Not set</span>
                            )}
                          </p>
                        </div>
                        
                        <div className="bg-accent/5 rounded-xl p-5 border border-accent/10 transition-all duration-300 hover:border-accent/30">
                          <p className="text-sm font-medium text-accent mb-1">Email</p>
                          <p className="text-lg font-medium break-all">{user?.email}</p>
                        </div>
                      </div>
                      
                      {profile?.is_admin && (
                        <div className="mt-4">
                          <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm font-medium text-green-800 dark:text-green-300">
                            Admin User
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-end bg-muted/20 py-4 px-8">
                  {isEditing ? (
                    <div className="space-x-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                      Edit Profile
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="projects">
              <Card className="shadow-lg border-border/50">
                <CardHeader className="bg-accent/5">
                  <CardTitle>Your Project Requests</CardTitle>
                  <CardDescription>
                    View and manage your submitted project requests
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6">
                  {projectRequests && projectRequests.length > 0 ? (
                    <div className="space-y-6">
                      {projectRequests.map(project => (
                        <Card key={project.id} className="overflow-hidden">
                          <CardHeader className="bg-accent/5 py-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{project.project_title}</CardTitle>
                                <CardDescription>
                                  Submitted on {new Date(project.created_at).toLocaleDateString()}
                                </CardDescription>
                              </div>
                              {getStatusBadge(project.status)}
                            </div>
                          </CardHeader>
                          <CardContent className="py-4">
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Description</p>
                                <p className="mt-1">{project.project_description}</p>
                              </div>
                              
                              {project.budget && (
                                <div className="flex items-center">
                                  <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                                  <span>Budget: ${project.budget}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Project Requests</h3>
                      <p className="text-muted-foreground">
                        You haven't submitted any project requests yet.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate('/get-started')}
                      >
                        Submit a Project Request
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
