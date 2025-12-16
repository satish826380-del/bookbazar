import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-lg bg-primary text-primary-foreground transition-transform duration-200 group-hover:scale-105">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">BookBazaar</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Home
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Browse Books
            </Button>
          </Link>
          <Link to={user?.role === 'seller' ? '/seller/sell' : '/auth'}>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Sell Books
            </Button>
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="capitalize">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to={getDashboardLink()} className="w-full cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button className="font-medium">Login</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-card border-b border-border p-4 space-y-2 animate-slide-up">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">Home</Button>
          </Link>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">Browse Books</Button>
          </Link>
          <Link to={user?.role === 'seller' ? '/seller/sell' : '/auth'} onClick={() => setMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">Sell Books</Button>
          </Link>
          <div className="pt-2 border-t border-border">
            {user ? (
              <>
                <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Login</Button>
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};
