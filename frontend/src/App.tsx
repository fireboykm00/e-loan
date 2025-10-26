import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Login } from '@/pages/Login';
import { EmployeeDashboard } from '@/pages/EmployeeDashboard';
import { LoanOfficerDashboard } from '@/pages/LoanOfficerDashboard';
import { AccountantDashboard } from '@/pages/AccountantDashboard';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { MyLoans } from '@/pages/MyLoans';
import { NewLoanApplication } from '@/pages/NewLoanApplication';
import { UserManagement } from '@/pages/UserManagement';
import { Reports } from '@/pages/Reports';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Employee Routes */}
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute roles={['EMPLOYEE']}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/loans"
              element={
                <ProtectedRoute roles={['EMPLOYEE']}>
                  <MyLoans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/loans/new"
              element={
                <ProtectedRoute roles={['EMPLOYEE']}>
                  <NewLoanApplication />
                </ProtectedRoute>
              }
            />
            
            {/* Loan Officer Routes */}
            <Route
              path="/loan-officer/dashboard"
              element={
                <ProtectedRoute roles={['LOAN_OFFICER']}>
                  <LoanOfficerDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Accountant Routes */}
            <Route
              path="/accountant/dashboard"
              element={
                <ProtectedRoute roles={['ACCOUNTANT']}>
                  <AccountantDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute roles={['ADMIN', 'LOAN_OFFICER', 'ACCOUNTANT']}>
                  <Reports />
                </ProtectedRoute>
              }
            />
            
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
