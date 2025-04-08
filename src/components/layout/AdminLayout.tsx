import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Inbox, 
  Users, 
  FileText, 
  LogOut, 
  Home, 
  Menu,
  X
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    console.log("AdminLayout - Current user:", user);
    console.log("AdminLayout - Current profile:", profile);
    console.log("AdminLayout - Is admin:", profile?.is_admin);
    
    // Check if we're still loading the profile
    if (!user) {
      console.log("No user found, redirecting to auth");
      navigate("/auth");
      return;
    }
    
    // Give the profile a moment to load before redirecting
    if (profile && profile.is_admin !== true) {
      console.log("User is not admin, redirecting to home");
      navigate("/");
    }
  }, [user, profile, navigate]);

  // Show loading state while checking credentials
  if (!user) {
    return <div className="flex items-center justify-center h-screen">Please sign in to continue</div>;
  }
  
  if (!profile) {
    return <div className="flex items-center justify-center h-screen">Loading profile...</div>;
  }

  // This is important - explicitly check for true to make sure it's a boolean true and not null or undefined
  if (profile.is_admin !== true) {
    console.log("User is not an admin but got past initial check");
    return <div className="flex items-center justify-center h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You don't have administrator privileges.</p>
        <Button onClick={() => navigate("/")}>Return Home</Button>
      </div>
    </div>;
  }

  const navItems = [
    {
      label: "Messages",
      icon: <Inbox className="mr-2 h-4 w-4" />,
      href: "/admin",
      active: window.location.pathname === "/admin",
    },
    {
      label: "Project Requests",
      icon: <FileText className="mr-2 h-4 w-4" />,
      href: "/admin/projects",
      active: window.location.pathname === "/admin/projects",
    },
    {
      label: "Users",
      icon: <Users className="mr-2 h-4 w-4" />,
      href: "/admin/users",
      active: window.location.pathname === "/admin/users",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-background border-b z-50">
        <h1 className="text-lg font-bold">Admin Panel</h1>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-sm">
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Admin Panel</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Home className="mr-2 h-4 w-4" /> Back to Site
                  </Button>
                </Link>
                <Separator className="my-4" />
                {navItems.map((item) => (
                  <Link key={item.href} to={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant={item.active ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
              <Separator className="my-4" />
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-screen fixed inset-y-0 z-50">
        <div className="w-64 border-r bg-card h-full flex flex-col">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
            <div className="space-y-1">
              <Link to="/">
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" /> Back to Site
                </Button>
              </Link>
              <Separator className="my-4" />
              {navItems.map((item) => (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={item.active ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-auto p-4">
            <Separator className="mb-4" />
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium truncate">
                {profile?.first_name || ''} {profile?.last_name || ''}
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        <header className="hidden lg:block sticky top-0 z-10 bg-background border-b h-16">
          <div className="px-6 flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8">
          {children}
        </main>

        <footer className="border-t py-4 px-6">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Admin Dashboard
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
