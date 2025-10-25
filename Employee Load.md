# 💼 Employee Loan Management System (ELMS)

**University of Lay Adventists of Kigali (UNILAK)**
**Faculty of Computing and Information Technology**
**Module:** MSIT6120 – Advanced Programming Concepts and Emerging Technologies

**FINAL PROJECT REPORT**
**Project Title:** Employee Loan Management System (ELMS)\*\*
**Submitted by:** [Your Name]
**Date:** October 2025

---

## **Abstract**

The **Employee Loan Management System (ELMS)** is a web-based platform designed to streamline the process of managing employee loan requests, approvals, and repayments within an organization. The system enables employees to apply for loans online, while administrators can review, approve, and track repayment schedules efficiently. Developed using **Spring Boot (backend)**, **React + Vite + shadcn/ui (frontend)**, and **SQLite (database)**, ELMS provides a clean, secure, and user-friendly solution that automates what is typically a manual HR process.

---

## **Introduction**

In many organizations, managing employee loans manually leads to inconsistencies, poor record-keeping, and delays in approval or repayment tracking. The **Employee Loan Management System (ELMS)** aims to digitize and automate these processes by introducing a centralized loan management platform.

The system provides role-based access for HR managers and employees, automated repayment tracking, and report generation. It improves transparency, ensures timely repayments, and supports informed decision-making by management.

---

## **Objectives**

- To automate employee loan application, approval, and repayment processes.
- To maintain accurate digital records of all loans and payments.
- To provide real-time dashboards for administrators and employees.
- To generate repayment reports and outstanding loan summaries.
- To ensure data security through role-based authentication.

---

## **System Description**

**ELMS** is a three-tier system comprising backend, frontend, and database layers:

1. **Backend (Spring Boot REST API):**

   - Handles loan applications, repayment records, and user roles.
   - Provides secured APIs using **Spring Security + JWT**.
   - Uses **Spring Data JPA** for SQLite persistence.

2. **Frontend (React + Vite + shadcn/ui):**

   - Implements an intuitive UI for employees and administrators.
   - Provides dashboards, loan forms, approval panels, and reports.
   - Uses **Axios** for API communication and **Tailwind CSS** for styling.

3. **Database (SQLite):**

   - Stores user, loan, and repayment data in normalized tables.
   - Lightweight, easy to deploy, and suitable for local environments.

**User Roles:**

- **Admin/HR:** Manage users, approve/reject loan requests, generate reports.
- **Employee:** Submit loan applications, view repayment status, and track approvals.

---

## **System Design**

### **Entity Relationship Diagram (ERD)**

| Entity              | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| **User**            | Employee or admin, with credentials and roles                |
| **LoanApplication** | Contains loan request details                                |
| **Repayment**       | Tracks installment payments                                  |
| **LoanType**        | Defines loan categories (e.g., salary, emergency, education) |

**Relationships:**

- User → LoanApplication: **1–N**
- LoanApplication → Repayment: **1–N**
- LoanType → LoanApplication: **1–N**

🧩 _ERD created with dbdiagram.io (see Figure 1)_

**dbdiagram.io Code Example:**

```sql
Table User {
  user_id int [pk, increment]
  name varchar
  email varchar [unique]
  password varchar
  role varchar
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
  status varchar
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

Ref: User.user_id < LoanApplication.user_id
Ref: LoanType.loan_type_id < LoanApplication.loan_type_id
Ref: LoanApplication.loan_id < Repayment.loan_id
```

---

### **System Architecture Diagram**

```
[React + Vite + shadcn/ui Frontend]
       │ (Axios API calls)
       ▼
[Spring Boot Backend API Layer]
       │ (JPA)
       ▼
[SQLite Database]
```

🧩 _Architecture diagram designed using draw.io (see Figure 2)_

---

## **Implementation**

### **Backend (Spring Boot)**

**Core Packages:**

```
controller/
service/
repository/
model/
config/
dto/
```

**API Endpoints:**

| Method | Endpoint                   | Description                         |
| ------ | -------------------------- | ----------------------------------- |
| POST   | `/api/auth/login`          | Authenticate user & issue JWT       |
| GET    | `/api/loans`               | List all loan applications          |
| POST   | `/api/loans`               | Submit new loan application         |
| PUT    | `/api/loans/{id}/approve`  | Approve loan                        |
| POST   | `/api/repayments`          | Record payment                      |
| GET    | `/api/reports/outstanding` | Generate outstanding balance report |

**Key Features:**

- JWT authentication and role-based access (`ADMIN`, `EMPLOYEE`).
- Loan approval workflow (status: Pending → Approved → Completed).
- Automatic repayment balance update.
- Validation using `@NotNull`, `@Positive`, `@Email`.
- Simple scheduler (`@Scheduled`) for overdue loan detection.

**Technologies:**

- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- SQLite JDBC
- Lombok

---

### **Frontend (React + Vite + shadcn/ui)**

**Main Pages:**

- **Login:** Authentication screen for all users.
- **Dashboard:** Overview of active loans, repayments, and totals.
- **Loan Application:** Form for submitting or editing applications.
- **Admin Panel:** Approve/reject loans, view employees, generate reports.
- **Repayment Tracker:** List of all repayment activities.

**UI Tools:**

- **shadcn/ui** → for polished components (`Card`, `Table`, `Dialog`, `Button`).
- **TailwindCSS** → for layout and responsiveness.
- **Chart.js** → visualize loan distribution and repayments.
- **Axios** → for backend API calls.
- **React Router** → for page navigation.

**State Management:** React Hooks only (`useState`, `useEffect`).

---

### **Database (SQLite)**

**Configuration (application.properties):**

```properties
spring.datasource.url=jdbc:sqlite:employee_loan.db
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.SQLiteDialect
```

**Tables:**

- `users`
- `loan_types`
- `loan_applications`
- `repayments`

---

## **Testing**

**Backend:**

- Used **Postman** to verify all CRUD endpoints and authentication.
- Tested loan submission, approval, and repayment APIs.

**Frontend:**

- Verified all pages for correct data rendering via Axios.
- Tested login flow and token-based access protection.

**Integration:**

- Confirmed successful link between frontend (React) and backend (Spring Boot).

📸 _Screenshots attached:_

- Spring Boot running
- Postman API tests
- React Dashboard view

---

## **Challenges and Solutions**

| Challenge                                    | Solution                                       |
| -------------------------------------------- | ---------------------------------------------- |
| JWT authentication failing in Axios requests | Added Authorization header interceptor         |
| SQLite foreign key issues                    | Ensured proper `@OneToMany` mapping            |
| UI responsiveness                            | Used Tailwind grid layouts and shadcn/ui Cards |
| Loan balance calculation                     | Implemented service-level helper method        |

---

## **Conclusion and Recommendations**

The **Employee Loan Management System** successfully demonstrates how a simple full-stack system can automate loan operations, from requests to repayments. It improves HR workflow efficiency and provides accurate financial insights.
