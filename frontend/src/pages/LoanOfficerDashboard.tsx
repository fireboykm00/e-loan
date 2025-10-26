import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import type { LoanApplication } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export function LoanOfficerDashboard() {
  const { user } = useAuth();
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const stats = {
    pending: loans.filter(l => l.status === 'PENDING').length,
    approved: loans.filter(l => l.status === 'APPROVED').length,
    rejected: loans.filter(l => l.status === 'REJECTED').length,
    totalAmount: loans.filter(l => l.status === 'APPROVED').reduce((sum, l) => sum + l.amount, 0),
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await api.get<LoanApplication[]>('/loans');
      setLoans(response.data);
    } catch (error) {
      toast.error('Failed to fetch loans');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLoan = async () => {
    if (!selectedLoan) return;
    
    setProcessing(true);
    try {
      await api.put(`/loans/${selectedLoan.loanId}/approve`);
      toast.success('Loan approved successfully');
      setShowApproveDialog(false);
      setSelectedLoan(null);
      fetchLoans();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve loan');
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectLoan = async () => {
    if (!selectedLoan || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    
    setProcessing(true);
    try {
      await api.put(`/loans/${selectedLoan.loanId}/reject`, rejectionReason, {
        headers: { 'Content-Type': 'text/plain' }
      });
      toast.success('Loan rejected');
      setShowRejectDialog(false);
      setSelectedLoan(null);
      setRejectionReason('');
      fetchLoans();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject loan');
    } finally {
      setProcessing(false);
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

  const LoanCard = ({ loan }: { loan: LoanApplication }) => (
    <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{loan.loanType.name}</h3>
            {getStatusBadge(loan.status)}
          </div>
          <p className="text-sm text-muted-foreground">
            Employee: {loan.employee.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Applied: {new Date(loan.applicationDate).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">${loan.amount.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">
            Max: ${loan.loanType.maxAmount.toLocaleString()}
          </p>
        </div>
      </div>
      
      {loan.remarks && (
        <p className="text-sm text-muted-foreground mb-3">
          <span className="font-medium">Remarks:</span> {loan.remarks}
        </p>
      )}

      {loan.status === 'PENDING' && (
        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            onClick={() => {
              setSelectedLoan(loan);
              setShowApproveDialog(true);
            }}
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              setSelectedLoan(loan);
              setShowRejectDialog(true);
            }}
          >
            <XCircle className="mr-1 h-4 w-4" />
            Reject
          </Button>
        </div>
      )}

      {loan.status === 'REJECTED' && loan.rejectionReason && (
        <p className="text-sm text-destructive mt-2">
          <span className="font-medium">Reason:</span> {loan.rejectionReason}
        </p>
      )}

      {loan.loanOfficer && (
        <p className="text-xs text-muted-foreground mt-2">
          Processed by: {loan.loanOfficer.name}
        </p>
      )}
    </div>
  );

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
        <h1 className="text-3xl font-bold">Loan Officer Dashboard</h1>
        <p className="text-muted-foreground mt-1">Review and process loan applications</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting decision</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Active loans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Declined applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Loan value</p>
          </CardContent>
        </Card>
      </div>

      {/* Loan Applications Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Applications</CardTitle>
          <CardDescription>Review and process employee loan requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
              <TabsTrigger value="all">All ({loans.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4 mt-4">
              {loans.filter(l => l.status === 'PENDING').length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No pending applications</p>
                </div>
              ) : (
                loans.filter(l => l.status === 'PENDING').map(loan => (
                  <LoanCard key={loan.loanId} loan={loan} />
                ))
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4 mt-4">
              {loans.filter(l => l.status === 'APPROVED').length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No approved loans</p>
                </div>
              ) : (
                loans.filter(l => l.status === 'APPROVED').map(loan => (
                  <LoanCard key={loan.loanId} loan={loan} />
                ))
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4 mt-4">
              {loans.filter(l => l.status === 'REJECTED').length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <XCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No rejected applications</p>
                </div>
              ) : (
                loans.filter(l => l.status === 'REJECTED').map(loan => (
                  <LoanCard key={loan.loanId} loan={loan} />
                ))
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4 mt-4">
              {loans.map(loan => (
                <LoanCard key={loan.loanId} loan={loan} />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Loan Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this loan application?
            </DialogDescription>
          </DialogHeader>
          {selectedLoan && (
            <div className="py-4">
              <p><strong>Employee:</strong> {selectedLoan.employee.name}</p>
              <p><strong>Loan Type:</strong> {selectedLoan.loanType.name}</p>
              <p><strong>Amount:</strong> ${selectedLoan.amount.toLocaleString()}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)} disabled={processing}>
              Cancel
            </Button>
            <Button onClick={handleApproveLoan} disabled={processing}>
              {processing ? 'Processing...' : 'Approve Loan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Loan Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application
            </DialogDescription>
          </DialogHeader>
          {selectedLoan && (
            <div className="py-4 space-y-4">
              <div>
                <p><strong>Employee:</strong> {selectedLoan.employee.name}</p>
                <p><strong>Amount:</strong> ${selectedLoan.amount.toLocaleString()}</p>
              </div>
              <div>
                <Label htmlFor="rejection-reason">Rejection Reason</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Enter the reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)} disabled={processing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectLoan} disabled={processing || !rejectionReason.trim()}>
              {processing ? 'Processing...' : 'Reject Loan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
