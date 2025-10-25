import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import type { LoanApplication } from '@/lib/types';
import { DollarSign, TrendingUp, Users, AlertCircle } from 'lucide-react';

interface ReportSummary {
  totalLoans: number;
  pendingLoans: number;
  approvedLoans: number;
  completedLoans: number;
  rejectedLoans: number;
  totalDisbursed: number;
}

interface OutstandingReport {
  totalOutstandingLoans: number;
  totalOutstandingAmount: number;
  loans: LoanApplication[];
}

export function Reports() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [outstanding, setOutstanding] = useState<OutstandingReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [summaryRes, outstandingRes] = await Promise.all([
        api.get<ReportSummary>('/reports/summary'),
        api.get<OutstandingReport>('/reports/outstanding'),
      ]);
      
      setSummary(summaryRes.data);
      setOutstanding(outstandingRes.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-center py-12">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Financial insights and loan statistics</p>
      </div>

      {summary && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalLoans}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All applications received
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.pendingLoans}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Awaiting approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.approvedLoans}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Currently being repaid
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summary.totalDisbursed.toLocaleString()} RWF
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  All approved loans
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Loan Status Breakdown</CardTitle>
                <CardDescription>Distribution of loan applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Pending</Badge>
                      <span className="text-sm">Pending Review</span>
                    </div>
                    <span className="font-semibold">{summary.pendingLoans}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Approved</Badge>
                      <span className="text-sm">Active Loans</span>
                    </div>
                    <span className="font-semibold">{summary.approvedLoans}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Completed</Badge>
                      <span className="text-sm">Fully Repaid</span>
                    </div>
                    <span className="font-semibold">{summary.completedLoans}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">Rejected</Badge>
                      <span className="text-sm">Declined</span>
                    </div>
                    <span className="font-semibold">{summary.rejectedLoans}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {outstanding && (
              <Card>
                <CardHeader>
                  <CardTitle>Outstanding Balance Summary</CardTitle>
                  <CardDescription>Total unpaid loan amounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Outstanding</p>
                      <p className="text-3xl font-bold mt-1">
                        {outstanding.totalOutstandingAmount.toLocaleString()} RWF
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Across {outstanding.totalOutstandingLoans} active loans
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {outstanding && outstanding.loans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Outstanding Loans Details</CardTitle>
            <CardDescription>Loans with pending repayments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Loan Type</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Date Approved</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outstanding.loans.map((loan) => (
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
                      {loan.totalPaid !== undefined 
                        ? `${loan.totalPaid.toLocaleString()} RWF`
                        : '0 RWF'}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {loan.outstandingBalance !== undefined
                        ? `${loan.outstandingBalance.toLocaleString()} RWF`
                        : '0 RWF'}
                    </TableCell>
                    <TableCell>
                      {loan.approvedDate 
                        ? new Date(loan.approvedDate).toLocaleDateString()
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
