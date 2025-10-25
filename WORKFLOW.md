
-
## 🧭 **AI Project Building Rules (for All MSIT Projects)**

### ⚙️ 1. **General Project Rules**

* The goal is to **demonstrate functionality**, not deploy to production.
* Code should be **clear, short, and modular** — no unnecessary complexity.
* Use **SQLite** as the database (no external server setup).
* Must have **role-based authentication (JWT)** but kept **minimal**.
* Each project must be **standalone** — one backend, one frontend, no shared dependencies.

✅ **Stack for All Projects**

| Layer            | Technology                                  |
| ---------------- | ------------------------------------------- |
| **Backend**      | Spring Boot 3.x (REST API + JPA + Security) |
| **Frontend**     | React 18 + Vite + shadcn/ui                 |
| **Database**     | SQLite                                      |
| **ORM**          | Spring Data JPA                             |
| **Auth**         | Spring Security + JWT                       |
| **UI Framework** | shadcn/ui + Tailwind CSS                    |
| **HTTP Client**  | Axios                                       |
| **Build Tools**  | Maven (backend) + Vite (frontend)           |

---

### 🧩 2. **Backend Rules (Spring Boot)**

#### **Structure**

```
src/main/java/com/projectname/
 ├── controller/
 ├── service/
 ├── repository/
 ├── model/
 ├── config/
 └── dto/
```

#### **Implementation Rules**

* Use **Spring Boot Starter Web**, **Data JPA**, and **Security** only.
* Use **SQLite JDBC** driver (`org.xerial:sqlite-jdbc`).
* No external dependencies unless absolutely necessary.
* Create clean **RESTful APIs** following `/api/resource` convention.
* All CRUD endpoints return JSON responses.
* Add **simple validation** using `@NotNull`, `@Email`, etc.
* Use **Lombok** for model boilerplate (`@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`).
* Keep **DTOs** light and map manually (no MapStruct or heavy frameworks).

#### **Authentication**

* Implement **JWT-based login**.
* Users have simple roles: `"ADMIN"`, `"USER"`, or `"STAFF"`.
* Secure APIs with role-based access using `@PreAuthorize` or method-level security.
* Use an **in-memory admin** for testing:

  ```java
  spring.security.user.name=admin
  spring.security.user.password=1234
  ```
* For SQLite setup, use:

  ```properties
  spring.datasource.url=jdbc:sqlite:projectname.db
  spring.datasource.driver-class-name=org.sqlite.JDBC
  spring.jpa.hibernate.ddl-auto=update
  spring.jpa.database-platform=org.hibernate.dialect.SQLiteDialect
  ```

#### **Testing**

* Use **Postman** to test endpoints.
* Include screenshots in docs.

---

### 🖥️ 3. **Frontend Rules (React + Vite + shadcn/ui)**

#### **Project Setup**

```bash
npm create vite@latest frontend --template react
cd frontend
npm install axios react-router-dom @radix-ui/react-icons
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Add **shadcn/ui**:

```bash
npx shadcn-ui@latest init
```

#### **File Structure**

```
src/
 ├── components/
 ├── pages/
 ├── services/
 ├── routes/
 └── App.jsx
```

#### **Implementation Rules**

* Use **Axios** for API calls.
* Use **React Router v6+** for navigation.
* Apply **shadcn/ui** components (Cards, Tables, Buttons, Inputs).
* Use **React Hooks (useState, useEffect)** only — no Redux.
* Keep forms simple, using controlled components.
* Implement **token-based authentication** (store JWT in `localStorage`).
* Add minimal pages:

  * `Login.jsx`
  * `Dashboard.jsx`
  * `EntityList.jsx`
  * `EntityForm.jsx`
* Create a **responsive layout** with sidebar/topbar using `shadcn/ui` layout primitives.
* Style with **Tailwind** for consistency.
* Include at least **one Chart.js component** (optional).

#### **Example API Service**

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

---

### 🧮 4. **Database Rules (SQLite)**

* Each project gets a unique database file (e.g., `restaurant.db`, `hospital.db`).
* Use **Hibernate auto-generation** (`ddl-auto=update`) to create tables.
* No manual SQL scripts.
* Define relationships via JPA annotations (`@OneToMany`, `@ManyToOne`).
* Test data inserted via API or a small `data.sql` file.

---

### 🧱 5. **Design & UI Rules**

* Use **shadcn/ui** components for consistent, modern look:

  * `Button`, `Card`, `Input`, `Table`, `Dialog`, `Tabs`.
* Layout: clean **dashboard-style UI** with a sidebar for navigation.
* Colors: use default Tailwind theme (no custom design system).
* All pages should look **professional, minimal, and symmetrical**.

Example:

```
Dashboard
 ├── Total Items
 ├── Active Users
 ├── Chart of Activity
```

---

### 📄 6. **Documentation Rules**

Each project must have a `REPORT.docx` or `.pdf` including:

1. Title Page
2. Abstract
3. Introduction
4. Objectives
5. System Description
6. System Design (ERD + Architecture Diagrams)
7. Implementation
8. Screenshots (backend + frontend)
9. Challenges & Solutions
10. Conclusion & Recommendations
11. References

**All diagrams:**

* Draw ERD using `dbdiagram.io`.
* Draw architecture using `draw.io`.
* Export both as PNGs and insert them as labeled figures.

---

### 🧰 7. **AI Instructions Summary (Short Form)**

If you tell another AI (like ChatGPT, Claude, or Cursor) to build your projects, use these exact rules:

> **Prompt Template:**
>
> “Build a simple educational full-stack app using Spring Boot + React + SQLite based on this project description: [paste project idea].
>
> Follow these rules:
>
> * Use SQLite (JPA auto-creation).
> * Role-based JWT authentication with Admin and User.
> * No external APIs or over-engineering.
> * RESTful API with CRUD endpoints.
> * Frontend built with React + Vite + Tailwind + shadcn/ui.
> * Include pages: Login, Dashboard, Entity List, Entity Form.
> * Keep UI clean and functional — use cards, tables, and forms.
> * Provide the code for backend and frontend separately.
> * No Docker or CI/CD — just runnable locally.
> * Include brief README with how to run backend and frontend.”

That’s your **golden instruction prompt** — it guarantees every project will be consistent, easy to test, and beautiful.

---

### ⚡ Example Output You Should Expect

Each project should end up with:

| Component       | Example Output                                              |
| --------------- | ----------------------------------------------------------- |
| **Backend**     | Folder with `src/main/java/...` Spring Boot app + `pom.xml` |
| **Frontend**    | Vite React app with `/src` folder using shadcn/ui           |
| **Database**    | `projectname.db` SQLite file                                |
| **Docs**        | `.docx` or `.pdf` following MSIT format                     |
| **Diagrams**    | ERD from dbdiagram.io, Architecture from draw.io            |

