import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { Employee, Admin, LoanOfficer, Accountant, RegisterEmployeeRequest, RegisterAdminRequest, RegisterLoanOfficerRequest, RegisterAccountantRequest } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Trash2, Users, Briefcase, Calculator, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export function UserManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loanOfficers, setLoanOfficers] = useState<LoanOfficer[]>([]);
  const [accountants, setAccountants] = useState<Accountant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [currentUserType, setCurrentUserType] = useState<'employee' | 'admin' | 'loan-officer' | 'accountant'>('employee');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    adminRole: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const [empRes, adminRes, officerRes, accountantRes] = await Promise.all([
        api.get<Employee[]>('/employees'),
        api.get<Admin[]>('/admins'),
        api.get<LoanOfficer[]>('/loan-officers'),
        api.get<Accountant[]>('/accountants'),
      ]);

      setEmployees(empRes.data);
      setAdmins(adminRes.data);
      setLoanOfficers(officerRes.data);
      setAccountants(accountantRes.data);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (currentUserType === 'employee') {
        const data: RegisterEmployeeRequest = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          department: formData.department || 'General',
        };
        await api.post('/auth/register/employee', data);
      } else if (currentUserType === 'admin') {
        const data: RegisterAdminRequest = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          adminRole: formData.adminRole || 'Admin',
        };
        await api.post('/auth/register/admin', data);
      } else if (currentUserType === 'loan-officer') {
        const data: RegisterLoanOfficerRequest = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };
        await api.post('/auth/register/loan-officer', data);
      } else if (currentUserType === 'accountant') {
        const data: RegisterAccountantRequest = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };
        await api.post('/auth/register/accountant', data);
      }

      toast.success('User created successfully');
      setShowDialog(false);
      setFormData({ name: '', email: '', password: '', department: '', adminRole: '' });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (type: string, id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/${type}/${id}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const UserCard = ({ user, type, icon: Icon }: { user: Employee | Admin | LoanOfficer | Accountant; type: string; icon: any }) => (
    <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {'department' in user && user.department && (
              <p className="text-xs text-muted-foreground mt-1">Department: {user.department}</p>
            )}
            {'adminRole' in user && user.adminRole && (
              <p className="text-xs text-muted-foreground mt-1">Role: {user.adminRole}</p>
            )}
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDeleteUser(type, user.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage all system users and roles</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>View and manage users across all roles</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="employees">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="employees">Employees ({employees.length})</TabsTrigger>
                <TabsTrigger value="loan-officers">Loan Officers ({loanOfficers.length})</TabsTrigger>
                <TabsTrigger value="accountants">Accountants ({accountants.length})</TabsTrigger>
                <TabsTrigger value="admins">Admins ({admins.length})</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="employees" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Employees</h3>
                <Dialog open={showDialog && currentUserType === 'employee'} onOpenChange={(open) => {
                  setShowDialog(open);
                  if (open) setCurrentUserType('employee');
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Employee
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Employee</DialogTitle>
                      <DialogDescription>Add a new employee to the system</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                      <Button onClick={handleCreateUser}>Create Employee</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {employees.map(employee => (
                <UserCard key={employee.id} user={employee} type="employees" icon={Users} />
              ))}
            </TabsContent>

            <TabsContent value="loan-officers" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Loan Officers</h3>
                <Dialog open={showDialog && currentUserType === 'loan-officer'} onOpenChange={(open) => {
                  setShowDialog(open);
                  if (open) setCurrentUserType('loan-officer');
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Loan Officer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Loan Officer</DialogTitle>
                      <DialogDescription>Add a new loan officer to process applications</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                      <Button onClick={handleCreateUser}>Create Loan Officer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {loanOfficers.map(officer => (
                <UserCard key={officer.id} user={officer} type="loan-officers" icon={Briefcase} />
              ))}
            </TabsContent>

            <TabsContent value="accountants" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Accountants</h3>
                <Dialog open={showDialog && currentUserType === 'accountant'} onOpenChange={(open) => {
                  setShowDialog(open);
                  if (open) setCurrentUserType('accountant');
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Accountant
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Accountant</DialogTitle>
                      <DialogDescription>Add a new accountant to manage finances</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                      <Button onClick={handleCreateUser}>Create Accountant</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {accountants.map(accountant => (
                <UserCard key={accountant.id} user={accountant} type="accountants" icon={Calculator} />
              ))}
            </TabsContent>

            <TabsContent value="admins" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Administrators</h3>
                <Dialog open={showDialog && currentUserType === 'admin'} onOpenChange={(open) => {
                  setShowDialog(open);
                  if (open) setCurrentUserType('admin');
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Admin</DialogTitle>
                      <DialogDescription>Add a new system administrator</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="adminRole">Admin Role</Label>
                        <Input
                          id="adminRole"
                          value={formData.adminRole}
                          onChange={(e) => setFormData({ ...formData, adminRole: e.target.value })}
                          placeholder="e.g., Super Admin, System Admin"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                      <Button onClick={handleCreateUser}>Create Admin</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {admins.map(admin => (
                <UserCard key={admin.id} user={admin} type="admins" icon={Building2} />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
