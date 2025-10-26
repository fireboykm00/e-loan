# Employee Loan Management System (ELMS)

💼 Employee Loan Management System (ELMS)

---

**University of Lay Adventists of Kigali (UNILAK)**

**Faculty of Computing and Information Technology**

**Module:** MSIT6120 – Advanced Programming Concepts and Emerging Technologies

**FINAL PROJECT REPORT**

**Project Title:** Employee Loan Management System (ELMS)**

**Submitted by:** [Your Name]

**Date:** October 2025

---

## **Abstract**

The **Employee Loan Management System (ELMS)** is a full-stack web-based application designed to simplify and automate employee loan processing within an organization.

It provides structured loan management — from application to approval and repayment — while ensuring transparency and accountability between employees, accountants, and loan officers.

Developed using **Spring Boot (backend)**, **React + Vite + shadcn/ui (frontend)**, and **SQLite (database)**, this project implements role-based access for **Admin**, **Employee**, **Loan Officer**, and **Accountant**, each managing specific workflows within the loan lifecycle.

---

## **Introduction**

In many organizations, the management of employee loans is manual — leading to miscommunication, errors, and lack of visibility into repayments and outstanding balances.

The **Employee Loan Management System (ELMS)** solves this by introducing an automated platform that standardizes all operations.

It enables employees to apply for loans, loan officers to review applications, accountants to manage disbursements and repayments, and administrators to monitor the overall loan portfolio.

---

## **Objectives**

- To automate the entire loan lifecycle: application, approval, disbursement, and repayment.
- To define clear access levels for different staff roles.
- To provide financial transparency through reporting and analytics.
- To eliminate manual paperwork and ensure data consistency.
- To generate reports for pending, approved, and repaid loans.

---

## **System Description**

The system architecture consists of **three major layers** — backend, frontend, and database:

1. **Backend (Spring Boot):**
    - Implements RESTful APIs for loan operations, repayments, and user management.
    - Provides JWT-based authentication and role-based access control.
    - Uses **Spring Data JPA** with **SQLite** for persistent storage.
2. **Frontend (React + Vite + shadcn/ui):**
    - Modern, responsive dashboard interfaces for each user role.
    - Handles form submissions, data visualization, and role-based navigation.
    - Built using **TailwindCSS**, **shadcn/ui**, and **React Router**.
3. **Database (SQLite):**
    - Lightweight local database with auto-generated schema.
    - Stores employee, loan, repayment, and role information.

**User Roles and Functions:**

| Role | Responsibility |
| --- | --- |
| **Admin** | Creates accounts, manages roles, and monitors system activity. |
| **Employee** | Applies for loans, checks status, and views repayment history. |
| **LoanOfficer** | Reviews, approves, or rejects loan requests. |
| **Accountant** | Manages loan disbursements, repayments, and balances. |

---

## **System Design**

### **Entity Relationship Diagram (ERD)**

| Entity | Description |
| --- | --- |
| **Employee** | Represents organization employees eligible for loans |
| **Admin** | Manages users and oversees loan operations |
| **LoanOfficer** | Reviews loan applications and approves/disapproves requests |
| **Accountant** | Handles financial records, disbursements, and repayments |
| **LoanApplication** | Stores details about loan requests and approval status |
| **Repayment** | Tracks payments made towards loans |
| **LoanType** | Defines loan categories (e.g., personal, education, emergency) |

**Relationships:**

- Employee → LoanApplication: **1–N**
- LoanOfficer → LoanApplication: **1–N**
- LoanApplication → Repayment: **1–N**
- Accountant → Repayment: **1–N**
- Admin oversees all (logical supervisory link, not FK).

🧩 *ERD created using dbdiagram.io (see Figure 1)*

**dbdiagram.io Code Example:**

```sql
Table Employee {
  employee_id int [pk, increment]
  name varchar
  email varchar [unique]
  password varchar
  department varchar
}

Table Admin {
  admin_id int [pk, increment]
  name varchar
  email varchar [unique]
  password varchar
  role varchar
}

Table LoanOfficer {
  officer_id int [pk, increment]
  name varchar
  email varchar [unique]
  password varchar
}

Table Accountant {
  accountant_id int [pk, increment]
  name varchar
  email varchar [unique]
  password varchar
}

Table LoanType {
  loan_type_id int [pk, increment]
  name varchar
  description varchar
  max_amount decimal
  interest_rate decimal
}

Table LoanApplication {
  loan_id int [pk, increment]
  employee_id int [ref: > Employee.employee_id]
  officer_id int [ref: > LoanOfficer.officer_id]
  loan_type_id int [ref: > LoanType.loan_type_id]
  amount decimal
  status varchar
  application_date date
  approval_date date
  remarks text
}

Table Repayment {
  repayment_id int [pk, increment]
  loan_id int [ref: > LoanApplication.loan_id]
  accountant_id int [ref: > Accountant.accountant_id]
  amount_paid decimal
  payment_date date
  balance decimal
}

Ref: Employee.employee_id < LoanApplication.employee_id
Ref: LoanOfficer.officer_id < LoanApplication.officer_id
Ref: LoanApplication.loan_id < Repayment.loan_id
Ref: Accountant.accountant_id < Repayment.accountant_id
Ref: LoanType.loan_type_id < LoanApplication.loan_type_id

```

---

### **System Architecture Diagram**

```
[React + Vite + shadcn/ui Frontend]
       │  (Axios HTTP Requests)
       ▼
[Spring Boot REST API Layer]
       │  (JPA Repository)
       ▼
[SQLite Database]

```

🧩 *Architecture diagram created using draw.io (see Figure 2).*

---

## **Implementation**

### **Backend (Spring Boot)**

**Structure:**

```
com.elms
 ├── controller/
 ├── service/
 ├── repository/
 ├── model/
 ├── config/
 └── dto/

```

**Key Features:**

- Authentication: JWT-based, role-aware login.
- CRUD for LoanApplications and Repayments.
- Approval workflow handled by LoanOfficer.
- Repayment management handled by Accountant.
- Daily overdue check scheduler using `@Scheduled`.
- Data validation with `@Email`, `@NotNull`, and `@Positive`.

**Endpoints:**

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/login` | Authenticate user |
| POST | `/api/loans` | Submit new loan request |
| GET | `/api/loans` | View all loan requests |
| PUT | `/api/loans/{id}/approve` | Approve or reject loan |
| POST | `/api/repayments` | Record a repayment |
| GET | `/api/reports/outstanding` | Outstanding loans report |

**Dependencies:**

- `spring-boot-starter-web`
- `spring-boot-starter-data-jpa`
- `spring-boot-starter-security`
- `org.xerial:sqlite-jdbc`
- `lombok`

---

### **Frontend (React + Vite + shadcn/ui)**

**Pages:**

- `Login.jsx` — Role-based authentication (Employee, LoanOfficer, Accountant, Admin).
- `Dashboard.jsx` — Overview of active loans, totals, and pending approvals.
- `LoanApplication.jsx` — Form for applying and managing loan requests.
- `ApprovalPanel.jsx` — Used by LoanOfficer to process loan approvals.
- `Repayments.jsx` — Used by Accountant to record repayments.
- `Reports.jsx` — Used by Admin to view outstanding balances.

**UI Design:**

- Dashboard layout with sidebar navigation.
- Consistent visual theme using **shadcn/ui + TailwindCSS**.
- Tables for listing loans, repayments, and employees.
- Dialog modals for forms (loan submission, repayments).
- Charts via **Chart.js** for loan distribution and repayment rates.

**Frontend Tools:**

- React Router
- Axios
- TailwindCSS
- shadcn/ui
- Chart.js

---

### **Database (SQLite)**

**Configuration (application.properties):**

```
spring.datasource.url=jdbc:sqlite:employee_loans.db
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.SQLiteDialect

```

**Entities:**

Employee, Admin, Accountant, LoanOfficer, LoanType, LoanApplication, Repayment

All generated automatically by **Hibernate ORM**.

---

## **Testing**

**Backend:**

- Tested each API via **Postman**.
- Verified JWT authentication for all roles.
- Checked status transitions (Pending → Approved → Repaid).

**Frontend:**

- Tested protected routes and dashboard logic.
- Verified UI for each role type.
- Confirmed proper data updates via Axios requests.

📸 *Included screenshots:*

- API test results.
- React dashboards for each role.
- Loan approval workflow demonstration.

---

## **Challenges and Solutions**

| Challenge | Solution |
| --- | --- |
| Multiple roles with similar fields | Used inheritance in JPA (`@MappedSuperclass`) |
| Role-based route protection | Implemented conditional routing using token role claims |
| Loan balance calculation errors | Added transaction-safe update logic |
| SQLite locks during concurrent access | Configured pooled connections (HikariCP) |

---

## **Conclusion and Recommendations**

The **Employee Loan Management System** effectively integrates role-based workflow management for employee loans.

It simplifies financial administration, increases transparency, and provides data-driven decision support.