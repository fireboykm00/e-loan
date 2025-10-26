export type UserRole = 'EMPLOYEE' | 'ADMIN' | 'LOAN_OFFICER' | 'ACCOUNTANT';

export interface User {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  department?: string;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  adminRole?: string;
}

export interface LoanOfficer {
  id: number;
  name: string;
  email: string;
}

export interface Accountant {
  id: number;
  name: string;
  email: string;
}

export interface LoanType {
  loanTypeId: number;
  name: string;
  description: string;
  maxAmount: number;
  interestRate: number;
}

export interface LoanApplication {
  loanId: number;
  employee: Employee;
  loanOfficer?: LoanOfficer;
  loanType: LoanType;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  applicationDate: string;
  approvedDate?: string;
  remarks?: string;
  rejectionReason?: string;
  repayments?: Repayment[];
  totalPaid?: number;
  outstandingBalance?: number;
}

export interface Repayment {
  repaymentId: number;
  loanApplication?: LoanApplication;
  accountant?: Accountant;
  amountPaid: number;
  paymentDate: string;
  balance: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  name: string;
  role: string;
  userId: number;
}

export interface LoanApplicationRequest {
  loanTypeId: number;
  amount: number;
  remarks?: string;
}

export interface RepaymentRequest {
  loanId: number;
  amountPaid: number;
}

export interface RegisterEmployeeRequest {
  name: string;
  email: string;
  password: string;
  department: string;
}

export interface RegisterAdminRequest {
  name: string;
  email: string;
  password: string;
  adminRole: string;
}

export interface RegisterLoanOfficerRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterAccountantRequest {
  name: string;
  email: string;
  password: string;
}
