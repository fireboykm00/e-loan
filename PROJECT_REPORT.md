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

```sql
Table User {
  user_id int [pk, increment]
  name varchar
  email varchar [unique]
  password varchar
  role varchar  // ADMIN or EMPLOYEE
}

Table LoanType {
  loan_type_id int [pk, increment]
  name varchar
  description varchar
  max_amount decimal
}

Table LoanApplication {
  loan_id int [pk, increment]
  user_id int [ref: > User.user_id]
  loan_type_id int [ref: > LoanType.loan_type_id]
  amount decimal
  status varchar  // PENDING, APPROVED, REJECTED, COMPLETED
  application_date date
  approved_date date
  remarks text
}

Table Repayment {
  repayment_id int [pk, increment]
  loan_id int [ref: > LoanApplication.loan_id]
  amount_paid decimal
  payment_date date
  balance decimal
}
```

**Relationships:**
- User → LoanApplication (1:N)
- LoanType → LoanApplication (1:N)
- LoanApplication → Repayment (1:N)

---

## 5. Key Features

### For Employees:
- Apply for loans online
- Track application status
- Make loan repayments
- View repayment history

### For Administrators:
- Approve/reject loan applications
- View all employee loans
- Generate financial reports
- Monitor outstanding balances

### Security:
- JWT token authentication
- Role-based access control (Admin/Employee)
- Password encryption with BCrypt
- Protected API endpoints

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
```
POST   /api/auth/login              - User login
GET    /api/loans                   - Get all loans
POST   /api/loans                   - Apply for loan
PUT    /api/loans/{id}/approve      - Approve loan (Admin)
POST   /api/repayments              - Record payment
GET    /api/reports/summary         - Get statistics (Admin)
```

### Frontend Pages
- **Login** - Authentication with demo credentials
- **Dashboard** - Statistics and recent loans
- **My Loans** - Personal loan management
- **New Application** - Loan application form
- **Admin Panel** - Loan approval interface
- **Reports** - Financial insights (Admin only)

### Default Data
**Loan Types:**
- Salary Advance (500,000 RWF)
- Emergency Loan (1,000,000 RWF)
- Education Loan (2,000,000 RWF)
- Personal Loan (1,500,000 RWF)

**Test Accounts:**
- Admin: admin@unilak.ac.rw / admin123
- Employee: john.doe@unilak.ac.rw / employee123

---

## 8. Challenges and Solutions

### Challenge 1: JWT Token Management
**Problem:** Token expiration handling and storage  
**Solution:** Implemented Axios interceptors to automatically add tokens and redirect on 401 errors

### Challenge 2: Real-time Balance Calculation
**Problem:** Keeping loan balance accurate after each payment  
**Solution:** Used `@Transient` methods in entity to calculate balance on-the-fly

### Challenge 3: Role-Based UI Rendering
**Problem:** Different views for Admin vs Employee  
**Solution:** Created `ProtectedRoute` component with role checking and conditional rendering

### Challenge 4: Form Validation
**Problem:** Preventing loans exceeding maximum amounts  
**Solution:** Backend validation with custom error messages + frontend real-time validation

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
- **Admin:** admin@unilak.ac.rw / admin123
- **Employee:** john.doe@unilak.ac.rw / employee123

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

## 13. Future Recommendations

- Add email notifications for loan status changes
- Implement automated repayment schedules
- Add loan interest rate calculations
- Export reports to PDF/Excel
- Add dashboard analytics charts
- Implement loan amendment requests

---

**Project Files:**
- Source code: `/backend` and `/frontend` directories
- Database: `employee_loan.db` (auto-created)
- Documentation: This report and README files
- Start scripts: `start-backend.sh/bat` and `start-frontend.sh/bat`
