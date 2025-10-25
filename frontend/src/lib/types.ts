export interface User {
  userId: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

export interface LoanType {
  loanTypeId: number;
  name: string;
  description: string;
  maxAmount: number;
}

export interface LoanApplication {
  loanId: number;
  user: User;
  loanType: LoanType;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  applicationDate: string;
  approvedDate?: string;
  remarks?: string;
  repayments?: Repayment[];
  totalPaid?: number;
  outstandingBalance?: number;
}

export interface Repayment {
  repaymentId: number;
  loanApplication?: LoanApplication;
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
