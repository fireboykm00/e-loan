import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const dashboardMap: Record<string, string> = {
        EMPLOYEE: '/employee/dashboard',
        LOAN_OFFICER: '/loan-officer/dashboard',
        ACCOUNTANT: '/accountant/dashboard',
        ADMIN: '/admin/dashboard',
      };
      navigate(dashboardMap[user.role] || '/employee/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ email, password });
      
      // Get the user data from localStorage after login
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        
        // Redirect based on role
        const dashboardMap: Record<string, string> = {
          EMPLOYEE: '/employee/dashboard',
          LOAN_OFFICER: '/loan-officer/dashboard',
          ACCOUNTANT: '/accountant/dashboard',
          ADMIN: '/admin/dashboard',
        };
        
        navigate(dashboardMap[user.role] || '/employee/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome to ELMS</CardTitle>
          <CardDescription className="text-center">
            Employee Loan Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@unilak.ac.rw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>

            <div className="text-sm text-muted-foreground text-center space-y-2">
              <p className="font-semibold">Demo Credentials:</p>
              <div className="space-y-1">
                <p className="font-mono text-xs">👤 Employee: employee@company.com / pass123</p>
                <p className="font-mono text-xs">💼 Loan Officer: officer@company.com / pass123</p>
                <p className="font-mono text-xs">📊 Accountant: accountant@company.com / pass123</p>
                <p className="font-mono text-xs">🔧 Admin: admin@company.com / pass123</p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
