import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import type { LoanApplication, Employee, LoanOfficer, Accountant, Admin } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  XCircle,
  UserCog,
  Building2,
  Briefcase,
  Calculator
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminDashboard() {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loanOfficers, setLoanOfficers] = useState<LoanOfficer[]>([]);
  const [accountants, setAccountants] = useState<Accountant[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const stats = {
    totalEmployees: employees.length,
    totalLoanOfficers: loanOfficers.length,
    totalAccountants: accountants.length,
    totalAdmins: admins.length,
    totalLoans: loans.length,
    pendingLoans: loans.filter(l => l.status === 'PENDING').length,
    approvedLoans: loans.filter(l => l.status === 'APPROVED').length,
    rejectedLoans: loans.filter(l => l.status === 'REJECTED').length,
    completedLoans: loans.filter(l => l.status === 'COMPLETED').length,
    totalDisbursed: loans.filter(l => l.status === 'APPROVED' || l.status === 'COMPLETED').reduce((sum, l) => sum + l.amount, 0),
    totalRepaid: loans.reduce((sum, l) => sum + (l.totalPaid || 0), 0),
    outstandingBalance: loans.filter(l => l.status === 'APPROVED').reduce((sum, l) => sum + (l.outstandingBalance || 0), 0),
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [loansRes, employeesRes, officersRes, accountantsRes, adminsRes] = await Promise.all([
        api.get<LoanApplication[]>('/loans'),
        api.get<Employee[]>('/employees'),
        api.get<LoanOfficer[]>('/loan-officers'),
        api.get<Accountant[]>('/accountants'),
        api.get<Admin[]>('/admins'),
      ]);

      setLoans(loansRes.data);
      setEmployees(employeesRes.data);
      setLoanOfficers(officersRes.data);
      setAccountants(accountantsRes.data);
      setAdmins(adminsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error(error);
    } finally {
      setLoading(false);
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Complete system overview and management</p>
        </div>
        <Link to="/admin/users">
          <Button>
            <UserCog className="mr-2 h-4 w-4" />
            Manage Users
          </Button>
        </Link>
      </div>

      {/* User Stats */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">System Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employees</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">Active employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loan Officers</CardTitle>
              <Briefcase className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLoanOfficers}</div>
              <p className="text-xs text-muted-foreground">Processing applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accountants</CardTitle>
              <Calculator className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAccountants}</div>
              <p className="text-xs text-muted-foreground">Managing finances</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Building2 className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAdmins}</div>
              <p className="text-xs text-muted-foreground">System administrators</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Loan Stats */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Loan Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLoans}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingLoans}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
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
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedLoans}</div>
              <p className="text-xs text-muted-foreground">Fully repaid</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalDisbursed.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Approved & completed loans</p>
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
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.outstandingBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Balance due</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Loan Applications</CardTitle>
          <CardDescription>Latest activity across the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-4">
              {loans.slice(0, 10).map((loan) => (
                <div key={loan.loanId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{loan.employee.name}</p>
                    <p className="text-sm text-muted-foreground">{loan.loanType.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Applied: {new Date(loan.applicationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${loan.amount.toLocaleString()}</p>
                    <p className="text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        loan.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        loan.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        loan.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {loan.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4 mt-4">
              {loans.filter(l => l.status === 'PENDING').slice(0, 10).map((loan) => (
                <div key={loan.loanId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{loan.employee.name}</p>
                    <p className="text-sm text-muted-foreground">{loan.loanType.name}</p>
                  </div>
                  <p className="font-bold">${loan.amount.toLocaleString()}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4 mt-4">
              {loans.filter(l => l.status === 'APPROVED').slice(0, 10).map((loan) => (
                <div key={loan.loanId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{loan.employee.name}</p>
                    <p className="text-sm text-muted-foreground">{loan.loanType.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${loan.amount.toLocaleString()}</p>
                    <p className="text-sm text-red-600">
                      Outstanding: ${(loan.outstandingBalance || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4 mt-4">
              {loans.filter(l => l.status === 'REJECTED').slice(0, 10).map((loan) => (
                <div key={loan.loanId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{loan.employee.name}</p>
                    <p className="text-sm text-muted-foreground">{loan.loanType.name}</p>
                    {loan.rejectionReason && (
                      <p className="text-xs text-red-600 mt-1">Reason: {loan.rejectionReason}</p>
                    )}
                  </div>
                  <p className="font-bold">${loan.amount.toLocaleString()}</p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
