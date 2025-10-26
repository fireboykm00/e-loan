import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import type { LoanApplication } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, TrendingUp, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export function EmployeeDashboard() {
  const { user } = useAuth();
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLoans: 0,
    pendingLoans: 0,
    approvedLoans: 0,
    totalBorrowed: 0,
    totalRepaid: 0,
    outstanding: 0,
  });

  useEffect(() => {
    fetchMyLoans();
  }, []);

  const fetchMyLoans = async () => {
    try {
      const response = await api.get<LoanApplication[]>('/loans/my-loans');
      const loansData = response.data;
      setLoans(loansData);
      
      // Calculate stats
      const stats = {
        totalLoans: loansData.length,
        pendingLoans: loansData.filter(l => l.status === 'PENDING').length,
        approvedLoans: loansData.filter(l => l.status === 'APPROVED').length,
        totalBorrowed: loansData
          .filter(l => l.status === 'APPROVED' || l.status === 'COMPLETED')
          .reduce((sum, l) => sum + l.amount, 0),
        totalRepaid: loansData
          .reduce((sum, l) => sum + (l.totalPaid || 0), 0),
        outstanding: loansData
          .filter(l => l.status === 'APPROVED')
          .reduce((sum, l) => sum + (l.outstandingBalance || 0), 0),
      };
      setStats(stats);
    } catch (error) {
      toast.error('Failed to fetch loans');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      PENDING: 'secondary',
      APPROVED: 'default',
      REJECTED: 'destructive',
      COMPLETED: 'outline',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground mt-1">Manage your loans and track your applications</p>
        </div>
        <Link to="/loans/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Apply for Loan
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLoans}</div>
            <p className="text-xs text-muted-foreground">All time applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingLoans}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedLoans}</div>
            <p className="text-xs text-muted-foreground">Active loans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalBorrowed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime borrowing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Repaid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRepaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Payments made</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.outstanding.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Remaining balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Loans */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Loan Applications</CardTitle>
          <CardDescription>Your latest loan applications and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {loans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No loan applications yet</p>
              <Link to="/loans/new">
                <Button>Apply for Your First Loan</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {loans.slice(0, 5).map((loan) => (
                <div
                  key={loan.loanId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{loan.loanType.name}</h3>
                      {getStatusBadge(loan.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Applied on {new Date(loan.applicationDate).toLocaleDateString()}
                    </p>
                    {loan.approvedDate && (
                      <p className="text-sm text-muted-foreground">
                        Approved on {new Date(loan.approvedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">${loan.amount.toLocaleString()}</p>
                    {loan.status === 'APPROVED' && loan.outstandingBalance && (
                      <p className="text-sm text-muted-foreground">
                        Outstanding: ${loan.outstandingBalance.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {loans.length > 5 && (
                <div className="text-center pt-4">
                  <Link to="/loans">
                    <Button variant="outline">View All Loans</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
