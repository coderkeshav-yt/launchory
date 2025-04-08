
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  is_admin: boolean | null;
  created_at: string;
  updated_at: string;
}

interface ProjectRequest {
  id: string;
  project_title: string;
  project_description: string;
  budget: number | null;
  status: string;
  created_at: string;
}

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  projectRequests: ProjectRequest[];
  signUp: (email: string, password: string, firstName: string, lastName: string, phoneNumber: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchProjectRequests: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Fetch user profile if logged in
        if (currentSession?.user) {
          console.log("User is logged in, fetching profile");
          fetchProfile(currentSession.user.id);
          fetchProjectRequests();
        } else {
          setProfile(null);
          setProjectRequests([]);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession ? "Session exists" : "No session");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log("Initial user data:", currentSession.user);
        fetchProfile(currentSession.user.id);
        fetchProjectRequests();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        
        if (error.code === '42P17' && error.message?.includes('infinite recursion')) {
          console.log("Detected infinite recursion in RLS policy, using manual profile lookup");
          
          // If we encounter the RLS recursion issue, check user metadata for profile info first
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData?.user) {
            const userMeta = userData.user.user_metadata;
            console.log("User metadata:", userMeta);
            
            const manualProfile: Profile = {
              id: userId,
              first_name: userMeta?.first_name || null,
              last_name: userMeta?.last_name || null,
              avatar_url: null,
              phone_number: userMeta?.phone_number || null,
              is_admin: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            
            try {
              const { data: adminCheck, error: rpcError } = await supabase
                .rpc('is_user_admin', { user_id: userId }) as { data: boolean | null, error: any };
                
              if (rpcError) {
                console.error("Error checking admin status via RPC:", rpcError);
              } else {
                console.log("Admin check via RPC returned:", adminCheck);
                manualProfile.is_admin = adminCheck === true;
              }
            } catch (adminCheckError) {
              console.error("Could not check admin status:", adminCheckError);
            }
            
            setProfile(manualProfile);
            
            // Try to upsert the profile data to ensure it's saved properly
            try {
              const { error: upsertError } = await supabase
                .from('profiles')
                .upsert({ 
                  id: userId,
                  first_name: manualProfile.first_name, 
                  last_name: manualProfile.last_name, 
                  phone_number: manualProfile.phone_number,
                  updated_at: new Date().toISOString()
                }, { onConflict: 'id' });
                
              if (upsertError) {
                console.error("Error upserting profile data:", upsertError);
              } else {
                console.log("Successfully upserted profile data from user metadata");
              }
            } catch (upsertError) {
              console.error("Failed to upsert profile:", upsertError);
            }
          }
          
          return;
        }
        
        return;
      }

      if (data) {
        console.log("Profile data loaded:", data);
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error);
    }
  };

  const fetchProjectRequests = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('project_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching project requests:", error);
        return;
      }
      
      setProjectRequests(data as ProjectRequest[]);
    } catch (error) {
      console.error("Error in fetchProjectRequests:", error);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string,
    phoneNumber: string
  ) => {
    try {
      console.log("Signing up with data:", { email, firstName, lastName, phoneNumber });
      
      // Sign up the user with metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
          },
        },
      });

      if (error) throw error;
      
      console.log("Sign up successful:", data);
      
      // Create or update profile immediately after signup
      if (data.user) {
        try {
          // Updated to ensure metadata is properly saved
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({ 
              id: data.user.id,
              first_name: firstName, 
              last_name: lastName, 
              phone_number: phoneNumber,
              updated_at: new Date().toISOString()
            }, { onConflict: 'id' });
            
          if (profileError) {
            console.error("Error updating profile with user data:", profileError);
          } else {
            console.log("Profile created/updated successfully with data:", {
              id: data.user.id,
              first_name: firstName,
              last_name: lastName,
              phone_number: phoneNumber
            });
            
            // Set the profile data in state
            setProfile({
              id: data.user.id,
              first_name: firstName,
              last_name: lastName,
              phone_number: phoneNumber,
              avatar_url: null,
              is_admin: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        } catch (profileUpdateError) {
          console.error("Error in profile update:", profileUpdateError);
        }
      }
      
      toast.success("Account created successfully! Please check your email for verification.");
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message || "An error occurred during sign up");
      console.error("Error signing up:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log("Sign in successful:", data);
      
      // Fetch user profile immediately after sign-in
      if (data?.user) {
        await fetchProfile(data.user.id);
        await fetchProjectRequests();
      }
      
      toast.success("Signed in successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Invalid login credentials");
      console.error("Error signing in:", error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setProfile(null);
      setProjectRequests([]);
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Error signing out");
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      loading, 
      projectRequests, 
      signUp, 
      signIn, 
      signOut, 
      fetchProjectRequests 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
