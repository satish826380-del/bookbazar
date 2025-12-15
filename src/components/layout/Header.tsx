import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/auth';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'seller': return '/seller';
      case 'buyer': return '/buyer';
      default: return '/';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-semibold text-foreground">BookBazaar</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Browse Books
          </Link>
          {user ? (
            <>
              <Link to={getDashboardLink()} className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout} className="gap-2 cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/auth?mode=signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-card border-b border-border p-4 space-y-3 animate-fade-in">
          <Link 
            to="/" 
            className="block py-2 text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            Browse Books
          </Link>
          {user ? (
            <>
              <Link 
                to={getDashboardLink()} 
                className="block py-2 text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button 
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 py-2 text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" asChild>
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              </Button>
              <Button asChild>
                <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
};
