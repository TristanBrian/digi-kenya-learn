import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, GraduationCap, User, Shield, LogOut, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from '@supabase/supabase-js';

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Academics", href: "/academics" },
  { name: "Admissions", href: "/admissions" },
  { name: "Fees", href: "/fees" },
  { name: "News", href: "/news" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          checkAdminStatus(session.user.id);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      setIsAdmin(!!userRole);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="font-display text-xl font-semibold text-primary">
              EAIC
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Auth Buttons */}
              <div className="flex items-center gap-2 ml-4">
                {loading ? (
                  <div className="w-8 h-8 animate-spin rounded-full border-b-2 border-primary"></div>
                ) : user ? (
                  <>
                    {isAdmin && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                        className="flex items-center gap-2"
                      >
                        <Link to="/admin">
                          <Shield className="h-4 w-4" />
                          Admin
                        </Link>
                      </Button>
                    )}
                    {!isAdmin && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                        className="flex items-center gap-2"
                      >
                        <Link to="/student">
                          <User className="h-4 w-4" />
                          My Portal
                        </Link>
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleSignOut}
                      className="flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="default" 
                    size="sm"
                    asChild
                    className="flex items-center gap-2"
                  >
                    <Link to="/auth">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-t">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth Section */}
              <div className="pt-4 pb-2 space-y-2">
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 animate-spin rounded-full border-b-2 border-primary"></div>
                  </div>
                ) : user ? (
                  <>
                    {isAdmin && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full flex items-center gap-2"
                        asChild
                      >
                        <Link to="/admin" onClick={() => setIsOpen(false)}>
                          <Shield className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </Button>
                    )}
                    {!isAdmin && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full flex items-center gap-2"
                        asChild
                      >
                        <Link to="/student" onClick={() => setIsOpen(false)}>
                          <User className="h-4 w-4" />
                          Student Portal
                        </Link>
                      </Button>
                    )}
                    <div className="text-center text-sm text-muted-foreground py-2">
                      Welcome, {user.email}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full flex items-center gap-2"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full flex items-center gap-2"
                    asChild
                  >
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
