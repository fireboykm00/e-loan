import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import type { LoanApplication } from '@/lib/types';
import { Link } from 'react-router-dom';
import { DollarSign, FileText, CheckCircle, Clock } from 'lucide-react';

export function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const endpoint = isAdmin ? '/loans' : '/loans/my-loans';
      const response = await api.get<LoanApplication[]>(endpoint);
      setLoans(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: loans.length,
    pending: loans.filter(l => l.status === 'PENDING').length,
    approved: loans.filter(l => l.status === 'APPROVED').length,
    completed: loans.filter(l => l.status === 'COMPLETED').length,
    totalAmount: loans
      .filter(l => l.status === 'APPROVED' || l.status === 'COMPLETED')
      .reduce((sum, l) => sum + l.amount, 0),
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}!
          </p>
        </div>
        {!isAdmin && (
          <Link to="/loans/new">
            <Button>Apply for Loan</Button>
          </Link>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalAmount.toLocaleString()} RWF
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Loan Applications</CardTitle>
          <CardDescription>
            {isAdmin ? 'All loan applications' : 'Your loan applications'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : loans.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No loan applications yet.</p>
          ) : (
            <div className="space-y-3">
              {loans.slice(0, 5).map((loan) => (
                <div
                  key={loan.loanId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{loan.loanType.name}</p>
                      <Badge
                        variant={
                          loan.status === 'APPROVED'
                            ? 'default'
                            : loan.status === 'PENDING'
                            ? 'secondary'
                            : loan.status === 'COMPLETED'
                            ? 'outline'
                            : 'destructive'
                        }
                      >
                        {loan.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isAdmin && `${loan.employee.name} • `}
                      Applied: {new Date(loan.applicationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{loan.amount.toLocaleString()} RWF</p>
                    {loan.status === 'APPROVED' && loan.outstandingBalance !== undefined && (
                      <p className="text-sm text-muted-foreground">
                        Balance: {loan.outstandingBalance.toLocaleString()} RWF
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
