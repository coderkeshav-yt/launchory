
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CodeXml, Menu, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Get Started", path: "/get-started" },
  ];
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (profile) {
      const firstInitial = profile.first_name ? profile.first_name[0] : '';
      const lastInitial = profile.last_name ? profile.last_name[0] : '';
      return (firstInitial + lastInitial).toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };
  
  // Debug admin status
  console.log("Current profile in Header:", profile);
  console.log("Is admin:", profile?.is_admin);
  
  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        isScrolled ? "bg-background/80 border-border/40 backdrop-blur" : "",
        isOpen ? "bg-background border-border/40" : ""
      )}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-xl">
          <CodeXml className="w-6 h-6 text-accent" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent-foreground">
            Launchory
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
                location.pathname === item.path && "text-accent font-medium"
              )}
            >
              {item.name}
            </Link>
          ))}

          {/* Conditional rendering based on auth state */}
          {user ? (
            <div className="flex gap-4 items-center">
              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">View Profile</Link>
                  </DropdownMenuItem>
                  {profile?.is_admin === true && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="default">Sign In</Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden py-6 px-6 bg-background border-t border-border/40">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-2 py-1 hover:text-accent transition-colors",
                  location.pathname === item.path && "text-accent font-medium"
                )}
              >
                {item.name}
              </Link>
            ))}

            {/* Conditional rendering based on auth state */}
            {user ? (
              <div className="flex flex-col gap-2 mt-4 border-t border-border/40 pt-4">
                <div className="flex items-center gap-2 px-2 py-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <span>{profile?.first_name || user.email}</span>
                </div>
                <Link to="/profile" className="w-full">
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </Link>
                {profile?.is_admin === true && (
                  <Link to="/admin" className="w-full">
                    <Button variant="outline" className="w-full">
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="mt-4 border-t border-border/40 pt-4">
                <Link to="/auth" className="w-full block">
                  <Button variant="default" className="w-full">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
