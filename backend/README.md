# Employee Loan Management System - Backend

Spring Boot REST API for the Employee Loan Management System.

## Technologies

- **Spring Boot 3.2.0**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA**
- **SQLite Database**
- **Lombok**
- **Maven**

## Project Structure

```
backend/
├── src/main/java/com/unilak/employeeloan/
│   ├── config/          # Security, JWT, and data initialization
│   ├── controller/      # REST API endpoints
│   ├── dto/             # Data Transfer Objects
│   ├── model/           # JPA Entities
│   ├── repository/      # Data access layer
│   └── service/         # Business logic
└── src/main/resources/
    └── application.properties
```

## Setup and Run

### Prerequisites

- Java 17 or higher
- Maven 3.6+

### Running the Application

```bash
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend API will start on **http://localhost:8080**

## Default Credentials

The application initializes with the following users:

**Admin:**
- Email: `admin@unilak.ac.rw`
- Password: `admin123`

**Employee:**
- Email: `john.doe@unilak.ac.rw`
- Password: `employee123`

**Employee:**
- Email: `jane.smith@unilak.ac.rw`
- Password: `employee123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user

### Loan Types
- `GET /api/loan-types` - Get all loan types
- `POST /api/loan-types` - Create loan type (Admin only)
- `PUT /api/loan-types/{id}` - Update loan type (Admin only)

### Loan Applications
- `GET /api/loans` - Get all loans
- `GET /api/loans/user/{userId}` - Get loans by user
- `POST /api/loans` - Create loan application
- `PUT /api/loans/{id}/approve` - Approve loan (Admin only)
- `PUT /api/loans/{id}/reject` - Reject loan (Admin only)

### Repayments
- `GET /api/repayments` - Get all repayments
- `GET /api/repayments/loan/{loanId}` - Get repayments by loan
- `POST /api/repayments` - Record payment

### Reports
- `GET /api/reports/summary` - Get summary report (Admin only)
- `GET /api/reports/outstanding` - Get outstanding loans report (Admin only)

## Database

The application uses SQLite with the database file `employee_loan.db` created in the project root.

## Features

- ✅ JWT-based authentication
- ✅ Role-based access control (Admin/Employee)
- ✅ Automatic loan balance calculation
- ✅ Loan approval workflow
- ✅ Repayment tracking
- ✅ Report generation
- ✅ Data validation
