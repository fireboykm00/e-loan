# Employee Loan Management System (ELMS) - Project Report

**University of Lay Adventists of Kigali (UNILAK)**  
**Module:** MSIT6120 – Advanced Programming Concepts  
**Date:** October 2025

---

## 1. Project Description

A full-stack web application that automates employee loan management including applications, approvals, and repayment tracking.

**Technology Stack:**
- Backend: Spring Boot 3.2.0 + Spring Security + JWT
- Frontend: React 19 + TypeScript + Vite + shadcn/ui
- Database: SQLite
- Styling: TailwindCSS

---

## 2. Objectives

✅ Automate loan application and approval workflow  
✅ Implement JWT-based authentication with role-based access  
✅ Track loan repayments and calculate balances automatically  
✅ Generate financial reports for administrators  
✅ Build responsive UI using modern components  

---

## 3. System Architecture

```
┌──────────────────┐
│  React Frontend  │
│  (Port 5173)     │
└────────┬─────────┘
         │ REST API (Axios)
         ▼
┌──────────────────┐
│  Spring Boot     │
│  (Port 8080)     │
└────────┬─────────┘
         │ JPA
         ▼
┌──────────────────┐
│  SQLite Database │
│  employee_loan.db│
└──────────────────┘
```

---

## 4. Entity Relationship Diagram (ERD)

**Database Schema:**

```dbml
Table employees {
  id bigint [pk]
  name varchar
  email varchar [unique]
  password varchar
  department varchar
}

Table admins {
  id bigint [pk]
  name varchar
  email varchar [unique]
  password varchar
  admin_role varchar
}

Table loan_officers {
  id bigint [pk]
  name varchar
  email varchar [unique]
  password varchar
}

Table accountants {
  id bigint [pk]
  name varchar
  email varchar [unique]
  password varchar
}

Table loan_types {
  loan_type_id bigint [pk]
  name varchar
  description text
  max_amount decimal
}

Table loan_applications {
  loan_id bigint [pk]
  employee_id bigint [ref: > employees.id]
  loan_type_id bigint [ref: > loan_types.loan_type_id]
  officer_id bigint [ref: > loan_officers.id]
  amount decimal
  status varchar  // PENDING, APPROVED, REJECTED, COMPLETED
  application_date date
  approved_date date
  remarks text
  rejection_reason text
}

Table repayments {
  repayment_id bigint [pk]
  loan_id bigint [ref: > loan_applications.loan_id]
  accountant_id bigint [ref: > accountants.id]
  amount_paid decimal
  payment_date date
  balance decimal
}
```

**Key Relationships:**
- Employee → LoanApplication (1:N) - Employees apply for loans
- LoanOfficer → LoanApplication (1:N) - Officers approve/reject applications
- LoanType → LoanApplication (1:N) - Each loan has a specific type
- LoanApplication → Repayment (1:N) - Loans have multiple payments
- Accountant → Repayment (1:N) - Accountants process repayments

**Calculated Fields (Transient):**
- `total_paid` = SUM of all repayments for a loan
- `outstanding_balance` = loan amount - total_paid

> **Note:** See `ERD.dbml` file for complete schema to use on dbdiagram.io

---

## 5. Key Features

### For Employees:
- Apply for loans online with multiple loan types
- Track application status in real-time
- View detailed loan history
- Monitor outstanding balances

### For Loan Officers:
- Review pending loan applications
- Approve or reject applications with remarks
- View comprehensive loan statistics
- Access financial reports
- Track approval history

### For Accountants:
- Process loan repayments
- View active loans requiring payment
- Track repayment history
- Monitor outstanding balances
- Access financial reports
- Auto-complete loans when fully paid

### For Administrators:
- Create users (Employees, Loan Officers, Accountants, Admins)
- Full system oversight
- Manage loan types
- Access all reports and statistics
- User management dashboard

### Security Features:
- JWT token authentication (1-hour expiration)
- Role-based access control (4 distinct roles)
- Password encryption with BCrypt
- Protected API endpoints with @PreAuthorize
- Automatic token refresh handling
- Secure session management
- Authorization checks on all sensitive operations

---

## 6. Design Decisions

| Decision | Rationale |
|----------|-----------|
| **SQLite Database** | Lightweight, no external server needed, perfect for demo |
| **JWT Authentication** | Stateless, scalable, industry standard |
| **shadcn/ui Components** | Modern, accessible, customizable UI components |
| **Spring Data JPA** | Reduces boilerplate, automatic schema generation |
| **TypeScript** | Type safety, better developer experience |
| **Vite** | Fast development server and build times |

---

## 7. Implementation Highlights

### Backend API Endpoints

**Authentication:**
```
POST   /api/auth/login                      - User login (Public)
POST   /api/auth/register/employee          - Create employee (Admin only)
POST   /api/auth/register/admin             - Create admin (Admin only)
POST   /api/auth/register/loan-officer      - Create loan officer (Admin only)
POST   /api/auth/register/accountant        - Create accountant (Admin only)
```

**Loans:**
```
GET    /api/loans                           - Get all loans (Admin, Loan Officer)
GET    /api/loans/my-loans                  - Get user's loans (Employee)
GET    /api/loans/status/{status}           - Filter by status (Admin, Loan Officer, Accountant)
POST   /api/loans                           - Apply for loan (Employee)
PUT    /api/loans/{id}/approve              - Approve loan (Admin, Loan Officer)
PUT    /api/loans/{id}/reject               - Reject loan (Admin, Loan Officer)
PUT    /api/loans/{id}/complete             - Complete loan (Admin, Accountant)
```

**Repayments:**
```
GET    /api/repayments                      - Get all repayments (Admin, Accountant)
GET    /api/repayments/loan/{loanId}        - Get loan repayments (Admin, Accountant, Loan Officer)
POST   /api/repayments                      - Process payment (Admin, Accountant)
```

**Reports:**
```
GET    /api/reports/summary                 - Get statistics (Admin, Loan Officer, Accountant)
GET    /api/reports/outstanding             - Outstanding loans (Admin, Loan Officer, Accountant)
```

**User Management:**
```
GET    /api/employees                       - List employees (Admin)
GET    /api/loan-officers                   - List loan officers (Admin)
GET    /api/accountants                     - List accountants (Admin)
GET    /api/admins                          - List admins (Admin)
DELETE /api/{user-type}/{id}                - Delete user (Admin)
```

### Frontend Pages

**Public:**
- **Login** - Authentication with role-based redirect

**Employee Dashboard:**
- **Dashboard** - Personal statistics and quick actions
- **My Loans** - Detailed loan history
- **New Application** - Loan application form with validation

**Loan Officer Dashboard:**
- **Dashboard** - Pending, approved, rejected loans with tabs
- **Reports** - Financial summaries and analytics

**Accountant Dashboard:**
- **Dashboard** - Active loans with repayment features
- **Repayment Processing** - Record payments with auto-balance updates
- **Reports** - Outstanding balances and payment history

**Admin Dashboard:**
- **Dashboard** - System-wide statistics
- **User Management** - Create and manage all user types
- **Reports** - Comprehensive financial reports

**Shared Features:**
- Responsive navigation with role-based menus
- Real-time data updates
- Toast notifications for actions
- Protected routes with automatic redirects

### Default Data
**Loan Types:**
- Salary Advance (500,000 RWF)
- Emergency Loan (1,000,000 RWF)
- Education Loan (2,000,000 RWF)
- Personal Loan (1,500,000 RWF)

**Test Accounts:**
- Employee: employee@company.com / pass123
- Loan Officer: officer@company.com / pass123
- Accountant: accountant@company.com / pass123
- Admin: admin@company.com / pass123

---

## 8. Challenges and Solutions

### Challenge 1: JWT Token Management
**Problem:** Token expiration handling and storage across multiple user types  
**Solution:** Implemented Axios interceptors to automatically add tokens, handle 401 errors, and redirect based on user role

### Challenge 2: Real-time Balance Calculation
**Problem:** Keeping loan balance accurate after each payment without manual updates  
**Solution:** 
- Used `@Transient` methods in LoanApplication entity to calculate balances dynamically
- Updated RepaymentService to maintain bidirectional relationships
- Ensured loan entity is saved after each repayment to persist changes

### Challenge 3: Multi-Role Architecture
**Problem:** Managing 4 distinct user types with separate tables and permissions  
**Solution:** 
- Created separate entities (Employee, Admin, LoanOfficer, Accountant) extending UserBase
- Implemented unified authentication service for all user types
- Applied granular @PreAuthorize annotations on all endpoints

### Challenge 4: Authorization Security
**Problem:** Ensuring proper access control for sensitive operations  
**Solution:**
- Protected all registration endpoints (Admin-only user creation)
- Restricted repayment operations to Accountants and Admins
- Allowed Report access to Admin, Loan Officer, and Accountant roles
- Implemented role-based navigation and UI rendering

### Challenge 5: Navigation Security
**Problem:** Logged-in users could access login page, causing confusion  
**Solution:**
- Added useEffect redirect in Login component for authenticated users
- Updated Navbar logo to redirect to user's dashboard instead of root
- Implemented role-based dashboard routing throughout the app

### Challenge 6: Data Integrity
**Problem:** Loan-repayment relationship not maintained correctly  
**Solution:** Updated RepaymentService to add repayments to loan's collection and save loan entity, ensuring bidirectional relationship is preserved

---

## 9. Screenshots

### Login Page
Beautiful authentication page with demo credentials displayed for easy testing.

### Employee Dashboard
Statistics cards showing total loans, pending applications, and approved amounts.

### Loan Application Form
Clean form with loan type selection, amount input, and validation.

### Admin Panel
Tabbed interface for viewing pending, approved, and completed loans with approve/reject actions.

### Reports Page
Financial summary with outstanding balances and loan distribution charts.

---

## 10. Testing

**Backend Testing:**
- All REST endpoints tested using Postman
- JWT authentication verified
- CRUD operations confirmed working
- Role-based access control validated

**Frontend Testing:**
- All pages rendered correctly
- Navigation and routing functional
- Form submissions successful
- Error handling verified

---

## 11. How to Run

### Option 1: Using Scripts (Recommended)

**Linux/Mac:**
```bash
./start-backend.sh    # Terminal 1
./start-frontend.sh   # Terminal 2
```

**Windows:**
```cmd
start-backend.bat     # Terminal 1
start-frontend.bat    # Terminal 2
```

### Option 3: Manual

**Backend:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend runs on: http://localhost:8080

**Frontend:**
```bash
cd frontend
pnpm install
pnpm dev
```
Frontend runs on: http://localhost:5173

### Access the Application
Open http://localhost:5173 and login with:
- **Employee:** employee@company.com / pass123
- **Loan Officer:** officer@company.com / pass123
- **Accountant:** accountant@company.com / pass123
- **Admin:** admin@company.com / pass123

---

## 12. Conclusion

The Employee Loan Management System successfully demonstrates:
- Modern full-stack development with Spring Boot and React
- Secure authentication and authorization
- Clean architecture and code organization
- Professional UI with shadcn/ui components
- Complete CRUD operations and business logic

The system is fully functional, well-structured, and ready for demonstration. All objectives have been met, and the application provides a solid foundation for future enhancements.

---

## 13. Recent Improvements (October 2024)

### Security Enhancements:
✅ Added authorization to all user registration endpoints (Admin-only)  
✅ Fixed report access for Accountants and Loan Officers  
✅ Added proper authorization to repayment endpoints  
✅ Implemented navigation security (prevent logged-in users from seeing login page)

### Bug Fixes:
✅ Fixed accountant dashboard showing 0 active loans  
✅ Fixed repayment processing not updating loan balances  
✅ Fixed recent payments section not displaying  
✅ Fixed reports not accessible to authorized roles  
✅ Fixed bidirectional relationship between loans and repayments

### Documentation:
✅ Created comprehensive FIXES.md with all changes  
✅ Updated ERD to reflect actual database schema  
✅ Generated dbdiagram.io code (ERD.dbml)  
✅ Updated project report with accurate information

---

## 14. Future Recommendations

- Add email notifications for loan status changes
- Implement automated repayment schedules with installments
- Add loan interest rate calculations
- Export reports to PDF/Excel
- Add interactive dashboard analytics charts
- Implement loan amendment requests
- Add loan guarantor system
- Implement payment reminders
- Add audit trail for all transactions

---

**Project Files:**
- Source code: `/backend` and `/frontend` directories
- Database: `employee_loan.db` (auto-created)
- Documentation: This report and README files
- Start scripts: `start-backend.sh/bat` and `start-frontend.sh/bat`
