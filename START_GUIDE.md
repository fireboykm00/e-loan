# Quick Start Guide - ELMS

## 🎯 Easiest Way to Run (Recommended)

### Linux/Mac:
```bash
./start-all.sh
```

### Windows:
```cmd
start-all.bat
```

This single command will:
- ✅ Open a new terminal for the backend
- ✅ Open a new terminal for the frontend
- ✅ Build and start both services automatically
- ✅ Show you the URLs to access

**Then:**
1. Wait for both terminals to show "Started" messages
2. Open browser: http://localhost:5173
3. Login with: `admin@unilak.ac.rw` / `admin123`

---

## 🔧 Alternative Methods

### Method 1: Individual Scripts in Separate Terminals

**Terminal 1:**
```bash
./start-backend.sh    # Linux/Mac
start-backend.bat     # Windows
```

**Terminal 2:**
```bash
./start-frontend.sh   # Linux/Mac
start-frontend.bat    # Windows
```

### Method 2: Manual Commands

**Terminal 1 - Backend:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm install  # First time only
pnpm dev
```

---

## 🌐 Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | React application UI |
| **Backend API** | http://localhost:8080 | REST API endpoints |
| **API Docs** | http://localhost:8080/api | API base path |

---

## 👤 Login Credentials

### Admin Account
```
Email: admin@unilak.ac.rw
Password: admin123
```

**Access:**
- Dashboard
- My Loans
- Admin Panel ✨
- Reports ✨

### Employee Account
```
Email: john.doe@unilak.ac.rw
Password: employee123
```

**Access:**
- Dashboard
- My Loans
- Loan Applications

---

## ⚠️ Troubleshooting

### "Port already in use" Error

**Backend (Port 8080):**
```bash
# Linux/Mac
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Frontend (Port 5173):**
```bash
# Linux/Mac
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### "Maven not found" Error
Install Maven:
```bash
# Mac
brew install maven

# Ubuntu/Debian
sudo apt install maven

# Windows
# Download from https://maven.apache.org/download.cgi
```

### "Node not found" Error
Install Node.js 18+ from: https://nodejs.org/

### "pnpm not found" Error
Install pnpm:
```bash
npm install -g pnpm
```

Or use npm instead:
```bash
cd frontend
npm install
npm run dev
```

---

## 🛑 Stopping the Application

### If using start-all script:
- Find the two terminal windows that opened
- Press `Ctrl+C` in each window

### If using individual scripts:
- Press `Ctrl+C` in each terminal

---

## 📊 Verify Everything is Working

### 1. Check Backend
```bash
curl http://localhost:8080/api/loan-types
```
Should return loan types JSON.

### 2. Check Frontend
Open browser: http://localhost:5173
Should show login page.

### 3. Test Login
Use admin credentials to login.
Should redirect to dashboard.

---

## 🎓 First Time Setup Checklist

- [ ] Java 17+ installed (`java -version`)
- [ ] Maven installed (`mvn -version`)
- [ ] Node.js 18+ installed (`node -v`)
- [ ] pnpm installed (`pnpm -v`) or npm (`npm -v`)
- [ ] Scripts are executable (`chmod +x *.sh` on Linux/Mac)
- [ ] No other services on ports 8080 or 5173
- [ ] Both backend and frontend folders exist

---

## 💡 Tips

1. **Backend takes 20-30 seconds to start** - Wait for "Started EmployeeLoanApplication" message
2. **Frontend starts in 2-3 seconds** - Wait for "Local: http://localhost:5173"
3. **Database auto-creates** - `employee_loan.db` appears in backend folder after first run
4. **Demo data auto-loads** - Users and loan types created automatically
5. **Hot reload enabled** - Frontend changes reflect immediately

---

## 🚀 Ready to Go!

Once both services show "Started" or "ready" messages:

1. **Open**: http://localhost:5173
2. **Login**: admin@unilak.ac.rw / admin123
3. **Explore**: Dashboard → Admin Panel → Reports
4. **Test**: Create loan application, approve it, make payment

Enjoy the Employee Loan Management System! 🎉
