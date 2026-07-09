# Job Portal

A full-stack role-based job portal built with **React**, **Vite**,
**FastAPI**, **PostgreSQL**, **SQLAlchemy**, and **Alembic**.

The application supports two roles:

-   **Candidate** --- manage a professional profile, upload and manage
    resumes, browse jobs, apply for jobs, and track application status.
-   **Admin** --- manage jobs and skills, review applications by job,
    and update candidate application status.

## Features

### Authentication and Authorization

-   Candidate signup and login
-   OAuth2 password-form login flow
-   JWT-based authentication
-   Protected frontend routes
-   Role-based access control for candidate and admin functionality
-   Backend authorization checks for admin-only operations

### Candidate Features

-   View and update profile information
-   Manage professional headline, phone, bio, experience, location,
    LinkedIn, and GitHub details
-   Upload PDF resumes
-   Maintain multiple resume versions
-   Set a default resume
-   Delete resumes
-   Browse available jobs
-   Apply to jobs using a selected resume
-   Prevent duplicate applications to the same job
-   View submitted applications
-   Track application status: `pending`, `shortlisted`, or `rejected`

### Admin Features

-   Admin dashboard
-   Create, view, edit, and delete jobs
-   Create, view, edit, and delete skills
-   Prevent duplicate skill creation
-   View applications for a selected job
-   Shortlist candidates
-   Reject candidates
-   Reset application status to pending

## Tech Stack

### Frontend

-   React
-   Vite
-   React Router
-   Axios
-   CSS

### Backend

-   FastAPI
-   SQLAlchemy
-   Alembic
-   Pydantic
-   JWT authentication with `python-jose`
-   Password hashing with `passlib` and `bcrypt`
-   Uvicorn

### Database and Deployment

-   PostgreSQL
-   Render PostgreSQL
-   Render Web Service for the FastAPI API
-   Render Static Site for the React frontend

## Architecture

``` text
Browser
   |
   v
React + Vite Frontend
   |
   | HTTPS / REST API / JWT Bearer Token
   v
FastAPI Backend
   |
   | SQLAlchemy ORM
   v
PostgreSQL Database
```

The frontend stores the JWT in browser local storage and attaches it to
protected API requests through an Axios request interceptor. The backend
validates the token, loads the authenticated user, and applies
role-based authorization where required.

## Project Structure

``` text
Job-Portal/
├── backend/
│   ├── alembic/
│   │   ├── versions/
│   │   └── env.py
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── applications.py
│   │   │   ├── jobs.py
│   │   │   └── skills.py
│   │   ├── core/
│   │   ├── database/
│   │   ├── dependencies/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── main.py
│   ├── alembic.ini
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Core API Routes

### Authentication

  Method   Endpoint         Purpose
  -------- ---------------- -------------------------------
  POST     `/auth/signup`   Register a candidate
  POST     `/auth/login`    Authenticate and return a JWT

### User Profile

  Method   Endpoint           Purpose
  -------- ------------------ --------------------------------
  GET      `/users/me`        Get authenticated user details
  GET      `/users/profile`   Get candidate profile
  PUT      `/users/profile`   Update candidate profile

### Resumes

  Method   Endpoint                               Purpose
  -------- -------------------------------------- ---------------------------------------
  POST     `/users/resumes/upload`                Upload a PDF resume
  GET      `/users/resumes`                       List the authenticated user's resumes
  PUT      `/users/resumes/{resume_id}/default`   Set a resume as default
  DELETE   `/users/resumes/{resume_id}`           Delete a resume

### Jobs

  Method   Endpoint           Purpose
  -------- ------------------ -----------------------------
  GET      `/jobs/`           List jobs
  GET      `/jobs/{job_id}`   View one job
  POST     `/jobs/`           Create a job --- admin only
  PUT      `/jobs/{job_id}`   Update a job --- admin only
  DELETE   `/jobs/{job_id}`   Delete a job --- admin only

### Skills

  Method   Endpoint               Purpose
  -------- ---------------------- -------------------------------
  GET      `/skills/`             List skills
  POST     `/skills/`             Create a skill --- admin only
  PUT      `/skills/{skill_id}`   Update a skill --- admin only
  DELETE   `/skills/{skill_id}`   Delete a skill --- admin only

### Applications

  -----------------------------------------------------------------------------------------
  Method                  Endpoint                                  Purpose
  ----------------------- ----------------------------------------- -----------------------
  POST                    `/applications/`                          Apply for a job

  GET                     `/applications/my`                        View the candidate's
                                                                    applications

  GET                     `/applications/job/{job_id}`              View applications for a
                                                                    job --- admin only

  PUT                     `/applications/{application_id}/status`   Update application
                                                                    status --- admin only
  -----------------------------------------------------------------------------------------

## Local Setup

### Prerequisites

Install:

-   Python 3
-   Node.js and npm
-   PostgreSQL
-   Git

### 1. Clone the Repository

``` bash
git clone <YOUR_REPOSITORY_URL>
cd Job-Portal
```

### 2. Backend Setup

``` bash
cd backend
python -m venv venv
```

Activate the virtual environment.

Windows PowerShell:

``` powershell
.\venv\Scripts\Activate.ps1
```

macOS/Linux:

``` bash
source venv/bin/activate
```

Install dependencies:

``` bash
pip install -r requirements.txt
```

Create `backend/.env`:

``` env
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
SECRET_KEY=REPLACE_WITH_A_STRONG_RANDOM_SECRET
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:5173
```

Apply migrations:

``` bash
alembic upgrade head
```

Start the API:

``` bash
uvicorn app.main:app --reload
```

The local API runs on port `8000`. Interactive API documentation is
available at the `/docs` route.

### 3. Frontend Setup

Open another terminal:

``` bash
cd frontend
npm install
```

Create `frontend/.env`:

``` env
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend:

``` bash
npm run dev
```

The Vite development server normally runs on port `5173`.

## Environment Variables

### Backend

  Variable                        Description
  ------------------------------- -------------------------------------------
  `DATABASE_URL`                  PostgreSQL connection string
  `SECRET_KEY`                    Secret used to sign JWTs
  `ALGORITHM`                     JWT signing algorithm
  `ACCESS_TOKEN_EXPIRE_MINUTES`   Access-token lifetime
  `FRONTEND_URL`                  Allowed deployed frontend origin for CORS

### Frontend

  Variable         Description
  ---------------- ---------------------------------
  `VITE_API_URL`   Base URL of the FastAPI backend

Never commit `.env` files, database credentials, JWT secrets, or
uploaded user resumes.

## Database Migrations

Alembic is used to version and apply schema changes.

Create a migration:

``` bash
alembic revision --autogenerate -m "describe migration"
```

Apply migrations:

``` bash
alembic upgrade head
```

View migration history:

``` bash
alembic history
```

For deployment, Alembic reads `DATABASE_URL` from the environment so
migrations target the production database rather than a local PostgreSQL
instance.

## Application Workflow

### Candidate

``` text
Sign Up
  -> Login
  -> Update Profile
  -> Upload Resume
  -> Browse Jobs
  -> Apply
  -> Track Application Status
```

### Admin

``` text
Login
  -> Manage Jobs
  -> Manage Skills
  -> Review Applications
  -> Shortlist / Reject / Reset to Pending
```

## Security Design

-   Passwords are stored as hashes rather than plaintext.
-   JWTs protect authenticated API routes.
-   Admin-only routes use backend authorization dependencies.
-   Resume ownership is checked before a resume can be used for an
    application.
-   Duplicate applications to the same job are rejected.
-   Uploaded files are restricted to PDF content type.
-   Secrets and database credentials are provided through environment
    variables.
-   CORS origins are configured explicitly.

## Production Deployment

The deployed architecture uses:

``` text
Render Static Site
        |
        v
Render FastAPI Web Service
        |
        v
Render PostgreSQL
```

Production configuration requires:

1.  `VITE_API_URL` on the frontend to point to the deployed API origin.
2.  `FRONTEND_URL` on the backend to point to the deployed frontend
    origin.
3.  `DATABASE_URL` on the backend to use the hosted PostgreSQL
    connection string.
4.  A strong production `SECRET_KEY`.
5.  `alembic upgrade head` to run against the production database.

## Known Limitation

The current resume implementation stores uploaded PDF files on the
backend filesystem. On hosting platforms with ephemeral filesystems,
uploaded files can disappear after redeployment or instance replacement
even if their database records remain.

For a production-scale version, resume files should be stored in
persistent object storage such as an S3-compatible service, while
PostgreSQL stores only file metadata and object keys.

## Future Improvements

-   Persistent object storage for resumes
-   Resume download/view endpoint with authorization
-   Job search, filtering, sorting, and pagination
-   Candidate skill assignment and job-skill matching
-   Email notifications for application status changes
-   Password reset and email verification
-   Refresh-token flow
-   Admin analytics dashboard
-   Automated backend and frontend tests
-   Docker-based local development
-   CI/CD validation for tests, linting, and production builds

## Production Workflow Verified

The deployed application has been tested through the complete workflow:

``` text
Admin creates a job
        ->
Candidate views the job
        ->
Candidate uploads/selects a resume
        ->
Candidate applies
        ->
Application appears as pending
        ->
Admin reviews the application
        ->
Admin changes the status
        ->
Candidate sees the updated status
```

## Author

**Rudraksh**

B.Tech Computer Science and Engineering

------------------------------------------------------------------------

If you find this project useful, consider starring the repository.
