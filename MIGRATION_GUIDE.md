# Employee Loan Management System - Migration Guide

## Overview
This document outlines the migration from the previous single `User` entity system to a new multi-entity role-based system with **Employee**, **Admin**, **LoanOfficer**, and **Accountant** as separate entities.

---

## What Changed?

### 1. Entity Structure

#### Previous Structure
- Single `User` entity with a `Role` enum (ADMIN, EMPLOYEE)
- User table stored all users regardless of their role

#### New Structure
- **UserBase**: Abstract base class with common fields (id, name, email, password)
- **Employee**: Extends UserBase, has `department` field
- **Admin**: Extends UserBase, has `adminRole` field
- **LoanOfficer**: Extends UserBase
- **Accountant**: Extends UserBase

Each role now has its own database table:
- `employees`
- `admins`
- `loan_officers`
- `accountants`

### 2. Entity Relationships

#### LoanApplication
- **Before**: `user` (ManyToOne to User), `approvedBy` (ManyToOne to User)
- **After**: `employee` (ManyToOne to Employee), `loanOfficer` (ManyToOne to LoanOfficer)

#### Repayment
- **Before**: Only `loanApplication` relationship
- **After**: Added `accountant` (ManyToOne to Accountant) to track who processed the repayment

#### LoanType
- **Added**: `interestRate` field (BigDecimal)

### 3. New Repositories
Created separate repositories for each entity:
- `EmployeeRepository`
- `AdminRepository`
- `LoanOfficerRepository`
- `AccountantRepository`

### 4. New Services
Created dedicated services for managing each user type:
- `EmployeeService`
- `AdminService`
- `LoanOfficerService`
- `AccountantService`
- `UnifiedAuthService` - Handles authentication across all user types

### 5. Updated Services
- **LoanApplicationService**: Now works with `Employee` and `LoanOfficer`
- **RepaymentService**: Now tracks which `Accountant` processed each repayment
- **CustomUserDetailsService**: Checks all four repositories for authentication

### 6. New Controllers
Created controllers for each user type:
- `EmployeeController` - `/api/employees`
- `AdminController` - `/api/admins`
- `LoanOfficerController` - `/api/loan-officers`
- `AccountantController` - `/api/accountants`

### 7. Updated Controllers
- **AuthController**: 
  - Uses `UnifiedAuthService` for login
  - Separate registration endpoints for each user type:
    - `POST /api/auth/register/employee`
    - `POST /api/auth/register/admin`
    - `POST /api/auth/register/loan-officer`
    - `POST /api/auth/register/accountant`

- **LoanApplicationController**:
  - Updated role-based access controls
  - Changed `/user/{userId}` to `/employee/{employeeId}`
  - Updated PreAuthorize annotations to include new roles

---

## New Role Definitions

### EMPLOYEE
- Can apply for loans
- View their own loan applications
- Check loan status and repayment history

### ADMIN
- Full system access
- Manage all users (Create, Read, Update, Delete)
- View all system data
- Monitor overall loan portfolio

### LOAN_OFFICER
- Review loan applications
- Approve or reject loan requests
- View all loan applications
- Update loan status

### ACCOUNTANT
- Process loan repayments
- View approved loans
- Complete fully paid loans
- Track financial records

---

## API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/register/employee
POST /api/auth/register/admin
POST /api/auth/register/loan-officer
POST /api/auth/register/accountant
```

### Employee Management
```
GET    /api/employees           [ADMIN]
GET    /api/employees/{id}      [ADMIN, LOAN_OFFICER]
PUT    /api/employees/{id}      [ADMIN, EMPLOYEE]
DELETE /api/employees/{id}      [ADMIN]
```

### Admin Management
```
GET    /api/admins              [ADMIN]
GET    /api/admins/{id}         [ADMIN]
PUT    /api/admins/{id}         [ADMIN]
DELETE /api/admins/{id}         [ADMIN]
```

### Loan Officer Management
```
GET    /api/loan-officers       [ADMIN]
GET    /api/loan-officers/{id}  [ADMIN, LOAN_OFFICER]
PUT    /api/loan-officers/{id}  [ADMIN, LOAN_OFFICER]
DELETE /api/loan-officers/{id}  [ADMIN]
```

### Accountant Management
```
GET    /api/accountants         [ADMIN]
GET    /api/accountants/{id}    [ADMIN, ACCOUNTANT]
PUT    /api/accountants/{id}    [ADMIN, ACCOUNTANT]
DELETE /api/accountants/{id}    [ADMIN]
```

### Loan Applications
```
GET    /api/loans                    [ADMIN, LOAN_OFFICER]
GET    /api/loans/my-loans           [ALL AUTHENTICATED]
GET    /api/loans/employee/{id}      [ADMIN, LOAN_OFFICER]
GET    /api/loans/status/{status}    [ADMIN, LOAN_OFFICER, ACCOUNTANT]
GET    /api/loans/{id}               [ALL AUTHENTICATED]
POST   /api/loans                    [EMPLOYEE]
PUT    /api/loans/{id}/approve       [ADMIN, LOAN_OFFICER]
PUT    /api/loans/{id}/reject        [ADMIN, LOAN_OFFICER]
PUT    /api/loans/{id}/complete      [ADMIN, ACCOUNTANT]
```

### Repayments
```
GET    /api/repayments               [ADMIN, ACCOUNTANT]
GET    /api/repayments/loan/{id}     [ALL AUTHENTICATED]
POST   /api/repayments               [ACCOUNTANT]
```

---

## Database Migration Steps

### Step 1: Backup Current Database
```bash
cp employee_loans.db employee_loans_backup.db
```

### Step 2: Start the Application
The application will auto-create the new tables based on JPA entities:
- `employees`
- `admins`
- `loan_officers`
- `accountants`

### Step 3: Data Migration (If Needed)
If you have existing data in the old `users` table, you'll need to migrate it:

```sql
-- Example migration queries (adjust as needed)

-- Migrate Employees
INSERT INTO employees (id, name, email, password, department)
SELECT id, name, email, password, 'General' 
FROM users WHERE role = 'EMPLOYEE';

-- Migrate Admins
INSERT INTO admins (id, name, email, password, admin_role)
SELECT id, name, email, password, 'Super Admin'
FROM users WHERE role = 'ADMIN';

-- Update LoanApplication references
UPDATE loan_applications 
SET employee_id = user_id;
```

### Step 4: Verify Data Integrity
- Check that all user records have been migrated
- Verify loan applications are linked correctly
- Test authentication with each user type

---

## Testing the New System

### 1. Create Test Users
```bash
# Create an Employee
curl -X POST http://localhost:8080/api/auth/register/employee \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@company.com", "password": "password123", "department": "IT"}'

# Create a Loan Officer
curl -X POST http://localhost:8080/api/auth/register/loan-officer \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Smith", "email": "jane@company.com", "password": "password123"}'

# Create an Accountant
curl -X POST http://localhost:8080/api/auth/register/accountant \
  -H "Content-Type: application/json" \
  -d '{"name": "Bob Finance", "email": "bob@company.com", "password": "password123"}'

# Create an Admin
curl -X POST http://localhost:8080/api/auth/register/admin \
  -H "Content-Type: application/json" \
  -d '{"name": "Admin User", "email": "admin@company.com", "password": "password123", "adminRole": "Super Admin"}'
```

### 2. Test Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@company.com", "password": "password123"}'
```

### 3. Test Loan Workflow
1. **Employee** applies for loan
2. **Loan Officer** reviews and approves
3. **Accountant** processes repayments
4. **Admin** monitors overall system

---

## Breaking Changes

### Frontend Updates Required

1. **Update Login Response Handling**
   - Role is now returned as string: "EMPLOYEE", "ADMIN", "LOAN_OFFICER", "ACCOUNTANT"
   - Update role checks in frontend routing

2. **Update API Endpoints**
   - Change `/api/loans/user/{id}` to `/api/loans/employee/{id}`
   - Use new registration endpoints

3. **Update Role-Based UI**
   - Add conditional rendering for new roles
   - Update navigation menus for each role type

4. **Update Forms**
   - Add department field for Employee registration
   - Add adminRole field for Admin registration

---

## Security Considerations

1. **Role-Based Access**: Ensure proper `PreAuthorize` annotations on all endpoints
2. **Password Encoding**: All passwords are encrypted using BCrypt
3. **JWT Tokens**: Include role information in token claims
4. **Data Isolation**: Each role can only access their authorized data

---

## Rollback Plan

If migration fails:
1. Restore backup database: `mv employee_loans_backup.db employee_loans.db`
2. Revert to previous code version
3. Restart application

---

## Support

For issues or questions regarding the migration:
- Check application logs for errors
- Verify database schema matches expected structure
- Test each role's permissions individually
- Ensure JWT configuration includes new roles

---

## Next Steps

1. ✅ Backend entities, services, and controllers updated
2. 🔄 Update frontend to work with new API structure
3. 🔄 Create seed data script for initial system setup
4. 🔄 Update documentation and API specs
5. 🔄 Add integration tests for new roles
6. 🔄 Update deployment scripts

---

## Summary

This migration introduces a more robust role-based access system with dedicated entities for each user type. This provides:
- **Better data organization**
- **Clearer role separation**
- **Enhanced security**
- **Easier auditing**
- **Scalability for future role additions**

The new structure aligns with the project requirements and provides a solid foundation for the Employee Loan Management System.
