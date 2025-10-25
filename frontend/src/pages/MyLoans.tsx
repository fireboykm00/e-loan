import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import type { LoanApplication, Repayment, RepaymentRequest } from '@/lib/types';
import { Link } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';

export function MyLoans() {
  const { user } = useAuth();
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await api.get<LoanApplication[]>(`/loans/user/${user?.userId}`);
      setLoans(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRepayments = async (loanId: number) => {
    try {
      const response = await api.get<Repayment[]>(`/repayments/loan/${loanId}`);
      setRepayments(response.data);
    } catch (error) {
      console.error('Error fetching repayments:', error);
    }
  };

  const handleViewDetails = (loan: LoanApplication) => {
    setSelectedLoan(loan);
    fetchRepayments(loan.loanId);
  };

  const handleMakePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan) return;

    try {
      const request: RepaymentRequest = {
        loanId: selectedLoan.loanId,
        amountPaid: parseFloat(paymentAmount),
      };

      await api.post('/repayments', request);
      toast.success('Payment recorded successfully!');
      setPaymentAmount('');
      fetchLoans();
      fetchRepayments(selectedLoan.loanId);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to record payment');
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Loan Applications</h1>
          <p className="text-muted-foreground">View and manage your loans</p>
        </div>
        <Link to="/loans/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan Applications</CardTitle>
          <CardDescription>All your loan applications and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Loading...</p>
          ) : loans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">You haven't applied for any loans yet.</p>
              <Link to="/loans/new">
                <Button>Apply Now</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan) => (
                  <TableRow key={loan.loanId}>
                    <TableCell className="font-medium">{loan.loanType.name}</TableCell>
                    <TableCell>{loan.amount.toLocaleString()} RWF</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(loan.status)}>{loan.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(loan.applicationDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {loan.status === 'APPROVED' && loan.outstandingBalance !== undefined
                        ? `${loan.outstandingBalance.toLocaleString()} RWF`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(loan)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Loan Details</DialogTitle>
                            <DialogDescription>
                              {loan.loanType.name} - {loan.status}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium">Loan Amount</p>
                                <p className="text-2xl font-bold">{loan.amount.toLocaleString()} RWF</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Outstanding Balance</p>
                                <p className="text-2xl font-bold">
                                  {loan.outstandingBalance !== undefined 
                                    ? `${loan.outstandingBalance.toLocaleString()} RWF`
                                    : 'N/A'}
                                </p>
                              </div>
                            </div>

                            {loan.remarks && (
                              <div>
                                <p className="text-sm font-medium">Remarks</p>
                                <p className="text-sm text-muted-foreground">{loan.remarks}</p>
                              </div>
                            )}

                            {loan.status === 'APPROVED' && loan.outstandingBalance && loan.outstandingBalance > 0 && (
                              <form onSubmit={handleMakePayment} className="space-y-3 p-4 border rounded-lg">
                                <h3 className="font-semibold">Make a Payment</h3>
                                <div className="space-y-2">
                                  <Label htmlFor="payment">Payment Amount (RWF)</Label>
                                  <Input
                                    id="payment"
                                    type="number"
                                    step="0.01"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    max={loan.outstandingBalance}
                                    required
                                  />
                                </div>
                                <Button type="submit" className="w-full">Submit Payment</Button>
                              </form>
                            )}

                            <div>
                              <h3 className="font-semibold mb-3">Payment History</h3>
                              {repayments.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No payments made yet.</p>
                              ) : (
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Date</TableHead>
                                      <TableHead>Amount Paid</TableHead>
                                      <TableHead>Balance After</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {repayments.map((repayment) => (
                                      <TableRow key={repayment.repaymentId}>
                                        <TableCell>
                                          {new Date(repayment.paymentDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{repayment.amountPaid.toLocaleString()} RWF</TableCell>
                                        <TableCell>{repayment.balance.toLocaleString()} RWF</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
