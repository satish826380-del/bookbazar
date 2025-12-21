import { useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, BookOpen, Package, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/books', label: 'Book Approvals', icon: BookOpen },
  { to: '/admin/orders', label: 'Orders', icon: Package },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="font-display text-xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">BookBazaar</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="mb-3 px-3">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start gap-2 text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="font-display text-lg font-bold">Admin Panel</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        <nav className="flex gap-1 px-4 pb-3 overflow-x-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
                }`
              }
            >
              <Icon className="h-3 w-3" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:p-8 p-4 pt-28 md:pt-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
