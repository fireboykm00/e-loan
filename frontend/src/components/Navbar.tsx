import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Menu, Building2 } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <Building2 className="h-6 w-6" />
            <span>ELMS</span>
          </Link>
          {user && (
            <div className="hidden md:flex gap-2">
              {/* Employee Navigation */}
              {user.role === 'EMPLOYEE' && (
                <>
                  <Link to="/employee/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Link to="/loans">
                    <Button variant="ghost">My Loans</Button>
                  </Link>
                  <Link to="/loans/new">
                    <Button variant="ghost">Apply for Loan</Button>
                  </Link>
                </>
              )}
              
              {/* Loan Officer Navigation */}
              {user.role === 'LOAN_OFFICER' && (
                <>
                  <Link to="/loan-officer/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Link to="/reports">
                    <Button variant="ghost">Reports</Button>
                  </Link>
                </>
              )}
              
              {/* Accountant Navigation */}
              {user.role === 'ACCOUNTANT' && (
                <>
                  <Link to="/accountant/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Link to="/reports">
                    <Button variant="ghost">Reports</Button>
                  </Link>
                </>
              )}
              
              {/* Admin Navigation */}
              {user.role === 'ADMIN' && (
                <>
                  <Link to="/admin/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Link to="/admin/users">
                    <Button variant="ghost">User Management</Button>
                  </Link>
                  <Link to="/reports">
                    <Button variant="ghost">Reports</Button>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                  <span className="text-xs font-semibold text-primary mt-1">
                    {user.role.replace('_', ' ')}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}
