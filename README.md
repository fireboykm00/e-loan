# 💼 Employee Loan Management System (ELMS)

**University of Lay Adventists of Kigali (UNILAK)**  
**Module:** MSIT6120 – Advanced Programming Concepts and Emerging Technologies

A comprehensive full-stack web application for managing employee loan applications, approvals, and repayments within an organization.

## 🚀 Technologies

### Backend
- Spring Boot 3.2.0
- Spring Security (JWT Authentication)
- Spring Data JPA
- SQLite Database
- Maven

### Frontend
- React 19 with TypeScript
- Vite
- shadcn/ui Components
- TailwindCSS
- React Router
- Axios
- Sonner (Toasts)

## 📁 Project Structure

```
employee-loan/
├── backend/              # Spring Boot REST API
│   ├── src/
│   │   └── main/
│   │       ├── java/com/unilak/employeeloan/
│   │       └── resources/
│   └── pom.xml
├── frontend/             # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── lib/
│   │   └── pages/
│   └── package.json
└── README.md
```

## 🎯 Features

### For Employees
- ✅ Apply for loans online
- ✅ View loan application status
- ✅ Track repayment history
- ✅ Make loan payments
- ✅ Dashboard with statistics

### For Administrators
- ✅ Review and approve/reject loan applications
- ✅ View all employee loans
- ✅ Generate reports
- ✅ Track outstanding balances
- ✅ Comprehensive admin panel

### General
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Beautiful and responsive UI
- ✅ Real-time balance calculation
- ✅ Automated repayment tracking

## 🛠️ Setup and Installation

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.6+
- pnpm (or npm)

### Backend Setup

```bash
cd backend

# Build the project
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run
```

Backend will start on **http://localhost:8080**

### Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Frontend will start on **http://localhost:5173**

## 👤 Default Login Credentials

### Admin Account
- Email: `admin@unilak.ac.rw`
- Password: `admin123`

### Employee Accounts
- Email: `john.doe@unilak.ac.rw` | Password: `employee123`
- Email: `jane.smith@unilak.ac.rw` | Password: `employee123`

## 📊 Database Schema

### Tables
- **users** - Employee and admin information
- **loan_types** - Different loan categories
- **loan_applications** - Loan requests and status
- **repayments** - Payment history

### Default Loan Types
1. **Salary Advance** - Max: 500,000 RWF
2. **Emergency Loan** - Max: 1,000,000 RWF
3. **Education Loan** - Max: 2,000,000 RWF
4. **Personal Loan** - Max: 1,500,000 RWF

## 🔗 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/loans` | Get all loans | Protected |
| POST | `/api/loans` | Apply for loan | Protected |
| PUT | `/api/loans/{id}/approve` | Approve loan | Admin |
| POST | `/api/repayments` | Record payment | Protected |
| GET | `/api/reports/summary` | Get summary | Admin |

## 🎨 UI Pages

1. **Login** - Authentication page
2. **Dashboard** - Overview with statistics
3. **My Loans** - Employee loan management
4. **New Application** - Loan application form
5. **Admin Panel** - Loan approval interface
6. **Reports** - Financial insights (Admin only)

## 📦 Frontend Components

Built with **shadcn/ui**:
- Button, Card, Input, Label
- Table, Dialog, Select, Badge
- Tabs, Alert, Dropdown Menu
- Form, Textarea

## 🔒 Security

- JWT token-based authentication
- Password encryption with BCrypt
- Role-based route protection
- Secured API endpoints
- CORS configuration

## 🏃 Quick Start

### Using Single Start Script (Easiest)

**Linux/Mac:**
```bash
./start-all.sh
```

**Windows:**
```cmd
start-all.bat
```

This will open two separate terminal windows - one for backend and one for frontend.

### Using Individual Scripts

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

### Manual Start

```bash
# Terminal 1 - Start Backend
cd backend && mvn spring-boot:run

# Terminal 2 - Start Frontend
cd frontend && pnpm dev
```

Navigate to **http://localhost:5173** and login with provided credentials.

## 📝 Testing

### Backend
Test API endpoints using Postman or curl:
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@unilak.ac.rw","password":"admin123"}'
```

### Frontend
All pages are accessible through the navigation menu after authentication.

## 🎓 Academic Context

This project demonstrates:
- Full-stack web development
- RESTful API design
- Modern frontend frameworks
- Database design and ORM
- Authentication and authorization
- State management
- Responsive UI design

## 📚 Documentation

- **[START_GUIDE.md](./START_GUIDE.md)** - Quick start guide with troubleshooting tips
- **[PROJECT_REPORT.md](./PROJECT_REPORT.md)** - Complete project report with architecture, design decisions, and challenges
- **[SCREENSHOTS_GUIDE.md](./SCREENSHOTS_GUIDE.md)** - Guide for capturing application screenshots
- **[Backend README](./backend/README.md)** - Backend-specific documentation
- **[WORKFLOW.md](./WORKFLOW.md)** - Development workflow and standards

## 📄 License

Academic Project - UNILAK © 2025
