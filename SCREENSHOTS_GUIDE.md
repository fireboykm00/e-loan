# Screenshots Guide for ELMS Project Report

## Instructions for Taking Screenshots

When running the application, capture the following screens for your project report:

---

## 1. Backend Screenshots

### A. Spring Boot Running
**Terminal showing:**
- Maven build success
- Spring Boot startup logs
- "Started EmployeeLoanApplication" message
- Port 8080 active

### B. Postman API Tests
**Test these endpoints and capture:**

1. **Login Success:**
   - POST http://localhost:8080/api/auth/login
   - Body: `{"email":"admin@unilak.ac.rw","password":"admin123"}`
   - Response showing JWT token

2. **Get All Loans (with JWT token):**
   - GET http://localhost:8080/api/loans
   - Headers: `Authorization: Bearer {token}`
   - Response with loan data

3. **Create Loan Application:**
   - POST http://localhost:8080/api/loans
   - Show request body and successful response

---

## 2. Frontend Screenshots

### A. Login Page (http://localhost:5173/login)
**Capture:**
- Beautiful login form
- Demo credentials visible
- Clean UI with shadcn/ui components

### B. Employee Dashboard (http://localhost:5173/dashboard)
**Capture:**
- Statistics cards (Total Loans, Pending, Approved, Total Amount)
- Recent loan applications list
- User name displayed in navbar

### C. My Loans Page (http://localhost:5173/loans)
**Capture:**
- Table showing all user's loans
- Different status badges (Pending, Approved, etc.)
- "Details" button visible

### D. Loan Details Dialog
**Capture:**
- Click "Details" on a loan
- Show loan information
- Payment form (if approved)
- Repayment history table

### E. New Loan Application (http://localhost:5173/loans/new)
**Capture:**
- Loan type dropdown
- Amount input field
- Remarks textarea
- Submit button

### F. Admin Panel (http://localhost:5173/admin)
**Login as admin first**
**Capture:**
- Statistics cards for admin
- Tabs (All, Pending, Approved, etc.)
- Table with Approve/Reject buttons
- Different employees' loans visible

### G. Reports Page (http://localhost:5173/reports)
**Admin only**
**Capture:**
- Summary statistics
- Loan status breakdown
- Outstanding balance section
- Detailed loans table

---

## 3. Database Screenshots

### SQLite Database
**Using DB Browser for SQLite:**
1. Open `employee_loan.db`
2. Capture:
   - Database Structure (showing all 4 tables)
   - `users` table with sample data
   - `loan_applications` table with different statuses
   - `repayments` table with payment records

---

## 4. Code Screenshots (Optional)

### Backend Code
- `SecurityConfig.java` - showing JWT setup
- `LoanApplicationController.java` - showing REST endpoints
- `application.properties` - database configuration

### Frontend Code
- `AuthContext.tsx` - authentication logic
- `Dashboard.tsx` - main component
- `api.ts` - Axios configuration with interceptors

---

## 5. System Architecture Diagrams

### Create using draw.io:

**Architecture Diagram:**
```
[Browser] ←→ [React Frontend] ←→ [Spring Boot API] ←→ [SQLite DB]
  5173          Vite Server           8080            employee_loan.db
```

**ERD Diagram:**
Use dbdiagram.io with the code from PROJECT_REPORT.md

---

## Screenshot Organization for Report

**Recommended structure:**

1. **Figure 1:** System Architecture Diagram
2. **Figure 2:** Entity Relationship Diagram (ERD)
3. **Figure 3:** Spring Boot Application Running
4. **Figure 4:** Login Page
5. **Figure 5:** Employee Dashboard
6. **Figure 6:** Loan Application Form
7. **Figure 7:** Admin Panel - Pending Loans
8. **Figure 8:** Admin Panel - Approve/Reject Actions
9. **Figure 9:** Reports Page
10. **Figure 10:** Postman API Test - Login
11. **Figure 11:** Postman API Test - Get Loans
12. **Figure 12:** SQLite Database Structure

---

## Tips for Good Screenshots

✅ Use full-screen or maximize browser window  
✅ Clear browser cache for clean UI  
✅ Use demo data to show realistic scenarios  
✅ Highlight important parts with arrows/boxes (optional)  
✅ Use high resolution (at least 1920x1080)  
✅ Crop unnecessary parts (browser toolbars, etc.)  
✅ Add captions under each figure in your report  

---

## Quick Test Scenario

To get diverse screenshots, follow this flow:

1. **Start backend and frontend**
2. **Login as employee** (john.doe@unilak.ac.rw)
   - Screenshot: Dashboard
   - Screenshot: My Loans (empty or with loans)
3. **Create a new loan application**
   - Screenshot: Application form
4. **Logout and login as admin** (admin@unilak.ac.rw)
   - Screenshot: Admin Dashboard
   - Screenshot: Admin Panel with pending loan
5. **Approve the loan**
   - Screenshot: Approval action
6. **Go to Reports**
   - Screenshot: Reports page
7. **Login back as employee**
   - View approved loan
   - Make a payment
   - Screenshot: Payment confirmation

This gives you the complete workflow in screenshots!
