import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/lib/api';
import type { LoanApplication } from '@/lib/types';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function AdminPanel() {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await api.get<LoanApplication[]>('/loans');
      setLoans(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLoan = async (loanId: number) => {
    try {
      await api.put(`/loans/${loanId}/approve`);
      toast.success('Loan approved successfully!');
      fetchLoans();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve loan');
    }
  };

  const handleRejectLoan = async (loanId: number) => {
    try {
      await api.put(`/loans/${loanId}/reject`);
      toast.success('Loan rejected');
      fetchLoans();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject loan');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'default';
      case 'PENDING': return 'secondary';
      case 'COMPLETED': return 'outline';
      case 'REJECTED': return 'destructive';
      default: return 'secondary';
    }
  };

  const filterByStatus = (status?: string) => {
    if (!status) return loans;
    return loans.filter(loan => loan.status === status);
  };

  const LoanTable = ({ loans }: { loans: LoanApplication[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Loan Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Applied Date</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loans.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground">
              No loans found
            </TableCell>
          </TableRow>
        ) : (
          loans.map((loan) => (
            <TableRow key={loan.loanId}>
              <TableCell>
                <div>
                  <p className="font-medium">{loan.user.name}</p>
                  <p className="text-xs text-muted-foreground">{loan.user.email}</p>
                </div>
              </TableCell>
              <TableCell>{loan.loanType.name}</TableCell>
              <TableCell>{loan.amount.toLocaleString()} RWF</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(loan.status)}>{loan.status}</Badge>
              </TableCell>
              <TableCell>{new Date(loan.applicationDate).toLocaleDateString()}</TableCell>
              <TableCell>
                {loan.outstandingBalance !== undefined
                  ? `${loan.outstandingBalance.toLocaleString()} RWF`
                  : '-'}
              </TableCell>
              <TableCell>
                {loan.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApproveLoan(loan.loanId)}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRejectLoan(loan.loanId)}
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">Manage loan applications</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loans.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loans.filter(l => l.status === 'PENDING').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loans.filter(l => l.status === 'APPROVED').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loans.filter(l => l.status === 'COMPLETED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan Applications</CardTitle>
          <CardDescription>Review and manage all loan applications</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Loading...</p>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <LoanTable loans={loans} />
              </TabsContent>
              <TabsContent value="pending">
                <LoanTable loans={filterByStatus('PENDING')} />
              </TabsContent>
              <TabsContent value="approved">
                <LoanTable loans={filterByStatus('APPROVED')} />
              </TabsContent>
              <TabsContent value="completed">
                <LoanTable loans={filterByStatus('COMPLETED')} />
              </TabsContent>
              <TabsContent value="rejected">
                <LoanTable loans={filterByStatus('REJECTED')} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
