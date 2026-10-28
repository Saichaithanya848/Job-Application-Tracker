# 💼 Trackr — Modern Full-Stack Job Application Tracker

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://react.dev/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47A248.svg)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A complete, production-ready, full-stack **Job Application Tracker** web application built with the **MERN stack** (MongoDB, Express, React, Node.js). Designed for students, early-career engineers, and developers navigating internships and full-time job searches to track interviews, assessments, and offers in one centralized, intuitive dashboard.

---

## 🌟 Key Features

### 🔐 1. Authentication & User Isolation
- **User Registration & Login**: Validated registration with encrypted password storage using **bcryptjs** (10 salt rounds).
- **Stateless JWT Authorization**: Secure JSON Web Tokens stored securely in the browser and passed via standard `Authorization: Bearer <token>` headers.
- **Strict Data Isolation**: Multi-tenant database design where every database query is scoped to the authenticated user (`{ user: req.user._id }`). User A can never view, edit, or delete User B's job records.
- **Demo Mode**: Built-in 1-click **"Fill Demo Credentials"** button on the login screen for rapid review and recruiter demonstrations.

### 📋 2. Complete Job Application Management
- **Full CRUD Workflow**: Add, view, edit, and delete job applications with real-time feedback.
- **Rich Data Fields**: Company name, job title, job type (*Full-time, Internship, Part-time, Contract*), location (*Remote, Hybrid, Onsite*), application date, posting URL, job description, and personal notes.
- **Status Pipeline Tracking**: Track applications through 5 standard lifecycle stages:
  - 🟦 `Applied`
  - 🟨 `Assessment`
  - 🟪 `Interview`
  - 🟩 `Offer`
  - 🟥 `Rejected`
- **Safe Deletion**: Deletion confirmation modal preventing accidental data loss.

### 🔍 3. Real-Time Search, Filtering & Sorting
- **Instant Search**: Search across company names and job titles with case-insensitive pattern matching.
- **Multi-Parameter Filtering**: Filter simultaneously by application status and job type.
- **Date & Alphabetical Sorting**: Sort by newest application date, oldest, or company name (A-Z / Z-A).
- **Graceful Empty States**: Contextual empty states with clear calls to action when no applications match search/filters.

### 📊 4. Interactive Dashboard & Analytics
- **Live Key Metrics**: Total applications, pending reviews, active interviews, offers received, and rejections.
- **Visual Distribution Chart**: Accessible visual representation showing the percentage breakdown across all stages.
- **Recent Applications Feed**: Quick overview of the latest 5 opportunities with direct navigation to the full list.

---

## 🛠️ Technology Stack

| Layer | Technologies Used | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 6, React Router DOM 6, Axios, Lucide React, Modern CSS3 | Ultra-fast SPA with client-side routing, modular design tokens, and reactive forms. |
| **Backend** | Node.js, Express.js 4 | RESTful API architecture with centralized error handling and middleware pipelines. |
| **Database** | MongoDB, Mongoose 8 | Document-oriented database with strict schema validation, timestamps, and indexing. |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` | Stateless user authentication and secure password hashing. |
| **Testing** | Jest, Supertest, MongoMemoryServer | End-to-end API integration tests without external database dependencies. |

---

## 📂 Project Architecture & Directory Structure

```text
job-application-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB Mongoose connection & zero-config memory fallback
│   │   ├── controllers/
│   │   │   ├── authController.js   # User registration, login, and profile retrieval
│   │   │   └── jobController.js    # CRUD operations, search/filters, and dashboard stats
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js   # JWT validation & req.user attachment
│   │   │   └── errorMiddleware.js  # 404 handler and centralized API error handler
│   │   ├── models/
│   │   │   ├── User.js             # User schema with bcrypt pre-save hashing & methods
│   │   │   └── Job.js              # Job schema with compound indexing & validation
│   │   ├── routes/
│   │   │   ├── authRoutes.js       # /api/auth routes
│   │   │   └── jobRoutes.js        # /api/jobs routes
│   │   ├── scripts/
│   │   │   └── seed.js             # Demo data population script
│   │   ├── app.js                  # Express application configuration & middleware setup
│   │   └── server.js               # Server entry point
│   ├── tests/
│   │   ├── setup.js                # MongoMemoryServer test environment setup
│   │   ├── auth.test.js            # Authentication API integration tests
│   │   └── jobs.test.js            # Job management and data-isolation tests
│   ├── .env.example
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg             # Application favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Sticky header with active links and user profile
│   │   │   ├── StatCard.jsx        # Metric summary card
│   │   │   ├── StatusBadge.jsx     # Color-coded status badge
│   │   │   ├── StatusChart.jsx     # Visual distribution progress bar and legend
│   │   │   ├── JobCard.jsx         # Application card with metadata and actions
│   │   │   ├── JobModal.jsx        # Add & edit modal form with validation
│   │   │   ├── DeleteModal.jsx     # Confirmation dialog for application deletion
│   │   │   ├── FilterBar.jsx       # Search input, status/type filters, and sort select
│   │   │   ├── Alert.jsx           # Reusable feedback banner (success/error/info)
│   │   │   └── EmptyState.jsx      # Friendly placeholder component
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global authentication provider (user, token, login, logout)
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Sign in page with 1-click demo button
│   │   │   ├── Register.jsx        # Account registration with validation
│   │   │   ├── Dashboard.jsx       # Analytics dashboard and recent applications
│   │   │   └── Applications.jsx    # Full filterable/searchable application catalog
│   │   ├── services/
│   │   │   └── api.js              # Axios instance with request token interceptor
│   │   ├── App.jsx                 # Route guards (ProtectedRoute & PublicRoute)
│   │   ├── App.css                 # Component and layout styling
│   │   ├── index.css               # Design system tokens and resets
│   │   └── main.jsx                # Application root entry point
│   ├── index.html
│   ├── vite.config.js              # Vite server with /api backend proxy
│   └── package.json
│
├── package.json                    # Root orchestrator with unified npm scripts
└── README.md                       # Complete documentation & interview talking points
```

---

## 🚀 Quick Start Guide (Windows & Cross-Platform)

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* **MongoDB**: Local MongoDB Community Server or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster.
  > 💡 **Zero-Setup Feature**: If local MongoDB is not running, the backend automatically launches an embedded in-memory MongoDB instance during development, allowing you to run and test the app immediately without any database installation!

---

### Step 1: Install Dependencies

From the root project directory, run:
```bash
# On Windows PowerShell / Command Prompt:
npm.cmd run install:all

# Or on macOS / Linux:
npm run install:all
```
*(This installs all root, backend, and frontend packages.)*

---

### Step 2: Configure Environment Variables

The backend already includes pre-configured `.env` and `.env.example` files:

`backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job_tracker
JWT_SECRET=super_secret_job_tracker_jwt_key_2026
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

> **Using MongoDB Atlas (Cloud)?**
> Simply update `MONGODB_URI` in `backend/.env` with your connection string:
> `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/job_tracker?retryWrites=true&w=majority`

---

### Step 3: Run the Application

You can start both the backend server and frontend client simultaneously with a single command from the project root:

```bash
# On Windows:
npm.cmd run dev

# Or on macOS / Linux:
npm run dev
```

Alternatively, you can run them in separate terminals:
- **Backend (Port 5000)**: `npm.cmd --prefix backend run dev`
- **Frontend (Port 3000)**: `npm.cmd --prefix frontend run dev`

Open your browser and navigate to:
👉 **`http://localhost:3000`**

---

### Step 4: Populate Sample Data (Optional)

To test the application with realistic data (8 job applications across Stripe, Google, Spotify, Datadog, etc.):

```bash
# On Windows:
npm.cmd run seed

# Or on macOS / Linux:
npm run seed
```

**Demo Account Credentials:**
- **Email:** `alex.dev@example.com`
- **Password:** `password123`
*(Or click the "Fill Demo Credentials" button directly on the login page!)*

---

## 🧪 Running Automated Tests

The backend includes a comprehensive automated test suite written with **Jest** and **Supertest**, using an isolated in-memory database to test all auth endpoints, CRUD operations, and user data isolation:

```bash
# On Windows:
npm.cmd test

# Or directly in the backend directory:
cd backend
npm.cmd test
```

### Test Coverage Highlights:
- ✅ User registration with password hashing verification
- ✅ Duplicate email rejection
- ✅ Login with valid and invalid credentials
- ✅ JWT authentication token verification
- ✅ Job creation with schema validation
- ✅ User data isolation (User B cannot view, edit, or delete User A's jobs)
- ✅ Filtering by status and job type
- ✅ Searching by company name and job title
- ✅ Updating and deleting job applications
- ✅ Aggregated dashboard statistics calculation

---

## 📡 REST API Reference

All protected endpoints require the HTTP header:
`Authorization: Bearer <your_jwt_token>`

### Authentication Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token (`email`, `password`) |
| `GET` | `/api/auth/me` | Private | Retrieve current authenticated user profile |

### Job Application Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Private | Get all jobs for authenticated user (supports `search`, `status`, `jobType`, `sort`) |
| `GET` | `/api/jobs/stats` | Private | Get summary counts, status distribution, and 5 recent applications |
| `GET` | `/api/jobs/:id` | Private | Get single job application by ID |
| `POST` | `/api/jobs` | Private | Create new job application |
| `PUT` | `/api/jobs/:id` | Private | Update an existing job application |
| `DELETE` | `/api/jobs/:id` | Private | Delete a job application |

### Query Parameters for `GET /api/jobs`:
- `search`: Filter by company name or job title (e.g. `?search=google`)
- `status`: Filter by status (`Applied`, `Interview`, `Assessment`, `Offer`, `Rejected`)
- `jobType`: Filter by type (`Full-time`, `Part-time`, `Internship`, `Contract`)
- `sort`: Order results (`newest`, `oldest`, `company-asc`, `company-desc`)

---

## 🎤 Software Engineering Resume & Interview Talking Points

When presenting this project in an internship or new-grad interview, you can highlight several architectural and software engineering decisions:

1. **Separation of Concerns & MVC Pattern**:
   - The backend cleanly decouples database schemas (`models/`), request validation & business logic (`controllers/`), route dispatching (`routes/`), and authentication & error handling (`middleware/`).
   - `app.js` is kept separate from `server.js` so the Express app can be imported directly into Supertest integration tests without occupying network ports.

2. **Security & Data Privacy**:
   - Passwords are never stored in plain text; they are hashed with `bcryptjs` using a cryptographic salt.
   - The user schema specifies `select: false` on the password field so passwords are never accidentally returned in query results.
   - Multi-tenant data isolation is enforced at the database query level: all job queries explicitly filter by `req.user._id`, ensuring users can never access or tamper with records belonging to other users.

3. **Performance & Database Indexing**:
   - Implemented compound Mongoose indexes: `{ user: 1, applicationDate: -1 }` and `{ user: 1, status: 1 }` to optimize sorting and filtering queries across large datasets.

4. **Robust Frontend State & Architecture**:
   - Centralized authentication state using React Context API (`AuthContext`), eliminating prop drilling.
   - Utilized Axios request and response interceptors to automatically attach JWT authorization tokens and handle expired sessions gracefully.
   - Protected route guards (`ProtectedRoute` and `PublicRoute`) provide smooth client-side redirects.
   - Vite proxy configuration (`/api` -> `http://localhost:5000`) prevents CORS issues in local development and mirrors production reverse-proxy setups.

5. **Production Build & Code Quality**:
   - Pure, modular CSS with semantic custom properties (CSS variables) for maintainable themes without heavyweight framework overhead.
   - 100% test coverage for critical business paths using Jest and Supertest.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
