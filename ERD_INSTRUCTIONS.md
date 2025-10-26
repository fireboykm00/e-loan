# Entity Relationship Diagram (ERD) - Usage Guide

## How to Generate ERD on dbdiagram.io

### Step 1: Access dbdiagram.io
Visit: **https://dbdiagram.io/d**

### Step 2: Copy the Schema Code
Open the `ERD.dbml` file in this project and copy all its contents.

### Step 3: Paste in dbdiagram.io
1. Click on the editor panel on the left side
2. Delete any existing code
3. Paste the copied code from `ERD.dbml`
4. The diagram will automatically generate on the right side

### Step 4: Customize (Optional)
- Click and drag tables to rearrange them
- Use the zoom controls to adjust view
- Click "Export" to download as PNG/PDF/SVG

---

## Alternative: Quick Preview

You can also copy this complete schema code directly:

```dbml
// Employee Loan Management System (ELMS) - Database Schema

Table employees {
  id bigint [pk, increment]
  name varchar [not null]
  email varchar [unique, not null]
  password varchar [not null]
  department varchar
}

Table admins {
  id bigint [pk, increment]
  name varchar [not null]
  email varchar [unique, not null]
  password varchar [not null]
  admin_role varchar
}

Table loan_officers {
  id bigint [pk, increment]
  name varchar [not null]
  email varchar [unique, not null]
  password varchar [not null]
}

Table accountants {
  id bigint [pk, increment]
  name varchar [not null]
  email varchar [unique, not null]
  password varchar [not null]
}

Table loan_types {
  loan_type_id bigint [pk, increment]
  name varchar [not null]
  description text
  max_amount decimal [not null]
}

Table loan_applications {
  loan_id bigint [pk, increment]
  employee_id bigint [not null, ref: > employees.id]
  loan_type_id bigint [not null, ref: > loan_types.loan_type_id]
  officer_id bigint [ref: > loan_officers.id]
  amount decimal [not null]
  status varchar [not null]
  application_date date [not null]
  approved_date date
  remarks text
  rejection_reason text
}

Table repayments {
  repayment_id bigint [pk, increment]
  loan_id bigint [not null, ref: > loan_applications.loan_id]
  accountant_id bigint [ref: > accountants.id]
  amount_paid decimal [not null]
  payment_date date [not null]
  balance decimal [not null]
}
```

---

## Database Schema Overview

### User Types (4 Separate Tables)
1. **employees** - Users who apply for loans
2. **admins** - System administrators with full access
3. **loan_officers** - Users who approve/reject applications
4. **accountants** - Users who process repayments

### Core Business Tables
- **loan_types** - Predefined loan categories
- **loan_applications** - Loan requests from employees
- **repayments** - Payment records for approved loans

### Key Relationships
- `Employee → Loan Application` (One employee can have many loans)
- `Loan Officer → Loan Application` (One officer processes many applications)
- `Loan Type → Loan Application` (One loan type can be used in many applications)
- `Loan Application → Repayment` (One loan can have many payments)
- `Accountant → Repayment` (One accountant processes many repayments)

### Calculated Fields (Not stored in DB)
These are computed dynamically:
- **total_paid** = SUM(repayments.amount_paid) for a loan
- **outstanding_balance** = loan.amount - total_paid

---

## Export Options

Once generated on dbdiagram.io, you can:

1. **Export as PNG** - For documentation
2. **Export as PDF** - For reports
3. **Export as SVG** - For presentations
4. **Share Link** - Share with team members
5. **Generate SQL** - Get CREATE TABLE statements

---

## Tips for Best Results

- Arrange tables logically (users at top, transactions at bottom)
- Group related tables together
- Use the "Auto Arrange" feature for quick layout
- Add color themes for better visualization
- Use the fullscreen mode for better view

---

## Schema Notes

### Loan Status Flow
```
PENDING → APPROVED → COMPLETED
        ↘ REJECTED
```

### Workflow
1. **Employee** submits application (status: PENDING)
2. **Loan Officer** reviews and approves/rejects
3. If approved, **Accountant** processes repayments
4. When fully paid, status changes to COMPLETED

### Security
- All passwords are encrypted with BCrypt
- Each user type has distinct permissions
- Foreign keys maintain referential integrity
- Cascade deletes configured appropriately
