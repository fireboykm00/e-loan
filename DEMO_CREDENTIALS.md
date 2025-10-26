# 🔐 Demo Credentials

## Default Login Accounts

All demo accounts use the same password for simplicity: **`pass123`**

### 👤 Employee Account
```
Email:    employee@company.com
Password: pass123
Role:     EMPLOYEE
```
**Access:**
- View personal loan applications
- Apply for new loans
- Make loan repayments
- View loan history

---

### 💼 Loan Officer Account
```
Email:    officer@company.com
Password: pass123
Role:     LOAN_OFFICER
```
**Access:**
- Review pending loan applications
- Approve or reject loan requests
- Add remarks/rejection reasons
- View all loans by status

---

### 📊 Accountant Account
```
Email:    accountant@company.com
Password: pass123
Role:     ACCOUNTANT
```
**Access:**
- View approved loans
- Record loan repayments
- View payment history
- Track outstanding balances

---

### 🔧 Admin Account
```
Email:    admin@company.com
Password: pass123
Role:     ADMIN
```
**Access:**
- Full system access
- Create/manage all user types (Employee, Admin, Loan Officer, Accountant)
- Manage loan types
- View system reports
- System configuration

---

## Additional Demo Users

### Jane Smith (Employee)
```
Email:    jane.smith@company.com
Password: pass123
Role:     EMPLOYEE
```

---

## Quick Reference Table

| Role | Email | Password | Primary Functions |
|------|-------|----------|-------------------|
| 👤 **Employee** | `employee@company.com` | `pass123` | Apply & repay loans |
| 💼 **Loan Officer** | `officer@company.com` | `pass123` | Approve/reject loans |
| 📊 **Accountant** | `accountant@company.com` | `pass123` | Record payments |
| 🔧 **Admin** | `admin@company.com` | `pass123` | Manage users & system |

---

## Testing Workflow

### Scenario 1: Complete Loan Lifecycle

1. **Login as Employee** (`employee@company.com`)
   - Apply for a new loan
   - View application status

2. **Login as Loan Officer** (`officer@company.com`)
   - Review pending applications
   - Approve the employee's loan

3. **Login as Employee** (`employee@company.com`)
   - View approved loan
   - Make a repayment

4. **Login as Accountant** (`accountant@company.com`)
   - Verify payment recorded
   - View outstanding balance

5. **Login as Admin** (`admin@company.com`)
   - View system reports
   - Check loan statistics

### Scenario 2: User Management

1. **Login as Admin** (`admin@company.com`)
2. Navigate to **User Management**
3. Create new users:
   - Click "Add Employee" button
   - Fill in: Name, Email, Password, Department
   - Submit

---

## Important Notes

### 🔒 Security
- These are **demo credentials** only
- **DO NOT use in production**
- Change all passwords before deploying to production
- Implement proper password policies for production use

### 🚫 No Public Registration
- There is **no public sign-up page**
- New users must be created by Administrators
- This is intentional for enterprise employee systems

### 💾 Data Persistence
- System uses **H2 in-memory database**
- All data is **reset on backend restart**
- Demo users are recreated automatically on startup

### ⏳ First Login
- Wait 15-30 seconds after starting backend
- Look for "Started EmployeeLoanApplication" in backend terminal
- Backend initializes users and loan types on startup

---

## Troubleshooting Login Issues

### "Unauthorized" Error
**Cause:** Backend not fully started
**Solution:** Wait for "Started EmployeeLoanApplication" message in backend terminal

### "Network Error"
**Cause:** Backend not running
**Solution:** 
```bash
./start-all.sh
# Or start backend manually:
cd backend && ./mvnw spring-boot:run
```

### Wrong Credentials
**Verify you're using:**
- Correct email format: `role@company.com`
- Password: `pass123` (all lowercase)
- No extra spaces

---

## Customizing Credentials

To change demo credentials, edit:
```
backend/src/main/java/com/unilak/employeeloan/config/DataInitializer.java
```

Example:
```java
admin.setEmail("admin@company.com");
admin.setPassword(passwordEncoder.encode("pass123"));
```

After editing, restart the backend.

---

## Production Deployment

Before production:

1. ✅ Remove or secure DataInitializer
2. ✅ Use environment variables for initial admin
3. ✅ Implement strong password policies
4. ✅ Enable email verification
5. ✅ Add password reset functionality
6. ✅ Use persistent database (PostgreSQL/MySQL)
7. ✅ Enable HTTPS
8. ✅ Configure proper CORS origins

---

**Last Updated:** October 26, 2025  
**System Version:** v1.0  
**Default Password:** `pass123` (demo only)
