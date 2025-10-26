import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { LoanApplication, Repayment } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DollarSign, TrendingUp, CheckCircle, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export function AccountantDashboard() {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [showRepaymentDialog, setShowRepaymentDialog] = useState(false);
  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  const stats = {
    activeLoans: loans.filter(l => l.status === 'APPROVED').length,
    totalDisbursed: loans.filter(l => l.status === 'APPROVED' || l.status === 'COMPLETED').reduce((sum, l) => sum + l.amount, 0),
    totalRepaid: repayments.reduce((sum, r) => sum + r.amountPaid, 0),
    outstandingBalance: loans.filter(l => l.status === 'APPROVED').reduce((sum, l) => sum + (l.outstandingBalance || 0), 0),
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [loansResponse, repaymentsResponse] = await Promise.all([
        api.get<LoanApplication[]>('/loans/status/APPROVED'),
        api.get<Repayment[]>('/repayments'),
      ]);
      setLoans(loansResponse.data);
      setRepayments(repaymentsResponse.data);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRepayment = async () => {
    if (!selectedLoan || !repaymentAmount) return;

    const amount = parseFloat(repaymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > (selectedLoan.outstandingBalance || 0)) {
      toast.error('Amount exceeds outstanding balance');
      return;
    }

    setProcessing(true);
    try {
      await api.post('/repayments', {
        loanId: selectedLoan.loanId,
        amountPaid: amount,
      });
      toast.success('Repayment processed successfully');
      setShowRepaymentDialog(false);
      setSelectedLoan(null);
      setRepaymentAmount('');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to process repayment');
    } finally {
      setProcessing(false);
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Accountant Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage repayments and track finances</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeLoans}</div>
            <p className="text-xs text-muted-foreground">Requiring repayment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalDisbursed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All approved loans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Repaid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRepaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Payments received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <CreditCard className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.outstandingBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Balance due</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Loans Needing Repayment */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Active Loans</CardTitle>
          <CardDescription>Manage repayments for approved loans</CardDescription>
        </CardHeader>
        <CardContent>
          {loans.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No active loans</p>
            </div>
          ) : (
            <div className="space-y-4">
              {loans.map((loan) => (
                <div
                  key={loan.loanId}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{loan.loanType.name}</h3>
                        <Badge>{loan.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Employee: {loan.employee.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Approved: {loan.approvedDate && new Date(loan.approvedDate).toLocaleDateString()}
                      </p>
                      
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Original Amount:</span>
                          <span className="font-medium">${loan.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Paid:</span>
                          <span className="font-medium text-green-600">
                            ${(loan.totalPaid || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Outstanding:</span>
                          <span className="font-bold text-red-600">
                            ${(loan.outstandingBalance || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{
                              width: `${((loan.totalPaid || 0) / loan.amount) * 100}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(((loan.totalPaid || 0) / loan.amount) * 100).toFixed(1)}% repaid
                        </p>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <Button
                        onClick={() => {
                          setSelectedLoan(loan);
                          setShowRepaymentDialog(true);
                        }}
                        disabled={(loan.outstandingBalance || 0) <= 0}
                      >
                        <DollarSign className="mr-2 h-4 w-4" />
                        Record Payment
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Repayments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Repayments</CardTitle>
          <CardDescription>Latest payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {repayments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No repayments recorded</p>
            </div>
          ) : (
            <div className="space-y-3">
              {repayments.slice(0, 10).map((repayment) => (
                <div
                  key={repayment.repaymentId}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">${repayment.amountPaid.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(repayment.paymentDate).toLocaleDateString()}
                    </p>
                    {repayment.accountant && (
                      <p className="text-xs text-muted-foreground">
                        Processed by: {repayment.accountant.name}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="font-medium">${repayment.balance.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Repayment Dialog */}
      <Dialog open={showRepaymentDialog} onOpenChange={setShowRepaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Repayment</DialogTitle>
            <DialogDescription>
              Process a loan repayment for this application
            </DialogDescription>
          </DialogHeader>
          {selectedLoan && (
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <p><strong>Employee:</strong> {selectedLoan.employee.name}</p>
                <p><strong>Loan Type:</strong> {selectedLoan.loanType.name}</p>
                <p><strong>Original Amount:</strong> ${selectedLoan.amount.toLocaleString()}</p>
                <p><strong>Total Paid:</strong> ${(selectedLoan.totalPaid || 0).toLocaleString()}</p>
                <p><strong>Outstanding Balance:</strong> <span className="text-red-600 font-bold">${(selectedLoan.outstandingBalance || 0).toLocaleString()}</span></p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="repayment-amount">Repayment Amount</Label>
                <Input
                  id="repayment-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  max={selectedLoan.outstandingBalance}
                  placeholder="Enter amount"
                  value={repaymentAmount}
                  onChange={(e) => setRepaymentAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum: ${(selectedLoan.outstandingBalance || 0).toLocaleString()}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowRepaymentDialog(false);
                setRepaymentAmount('');
              }} 
              disabled={processing}
            >
              Cancel
            </Button>
            <Button onClick={handleProcessRepayment} disabled={processing || !repaymentAmount}>
              {processing ? 'Processing...' : 'Process Repayment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
