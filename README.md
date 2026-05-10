# LeadFlow — Lead Management Application

A full-stack lead management app built with **React + Vite** on the frontend and **Express + MongoDB** on the backend. Supports JWT-based authentication, OTP email verification, lead CRUD with assignment, and real-time timeline tracking.

---

## Tech Stack

**Frontend**
- React 19, Vite 8, React Router v7
- Tailwind CSS v4, Radix UI primitives
- `lucide-react` for icons
- `sonner` for toast notifications
- `date-fns` for timeline formatting
- Fetch API for HTTP requests

**Backend**
- Node.js, Express 5 (ESM)
- MongoDB via Mongoose
- JWT + express-session for auth
- Nodemailer for OTP emails
- bcrypt for password hashing

---

## Project Structure

```
leadFlowAssignment/
├── backend/          # Express API server
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env          # Your local env file (not committed)
│   ├── .env.example
│   └── server.js
└── frontend/         # React + Vite app
    └── src/
        ├── authPages/
        ├── components/
        └── utils/
```

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [MongoDB](https://www.mongodb.com/) running locally, or a [MongoDB Atlas](https://www.mongodb.com/atlas) URI
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Optional, if running via Docker)

---

## Setup & Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/your-username/leadFlowAssignment.git
cd leadFlowAssignment
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in your values. Then start the backend:
```bash
npm start
```
The API will run at `http://localhost:5000`.

### 3. Frontend Setup

Open a **new terminal window**:
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

> **Note:** You need **both** the frontend and backend servers running simultaneously for the app to function locally.

---

## Running with Docker

If you prefer using Docker to run the entire stack (Database, Backend, Frontend) without installing Node or MongoDB locally:

1. Copy and fill in your env file:
```bash
cp backend/.env.example backend/.env
```
   > **Important:** When using Docker, you must change your Mongo URI in `.env` to point to the container:
   > `MONGO_URI=mongodb://mongo:27017/leadflow`

2. Start all services from the root folder:
```bash
docker-compose up --build
```

3. Open your browser to `http://localhost:80`

To stop the containers: `docker-compose down`  
To wipe the database volume entirely: `docker-compose down -v`

---

## 🧪 Test Environment & Seed Data

To make testing the application easy and to bypass the OTP email verification flow, the backend automatically provisions a **Test User** on startup.

**Test Credentials (Bypasses OTP):**
- **Email:** `test@example.com`
- **Password:** `test1234`

### Generating Seed Data
When you log in using the Test Credentials above, you will see a special green **"Generate Seed Data"** button on the dashboard. 

Clicking this button will:
1. Automatically generate 5-10 random leads with various statuses.
2. Mix up the follow-up dates to demonstrate the `Overdue`, `Today`, and `Future` filtering mechanics.
3. Automatically attach random placeholder discussion histories to the leads so you can test the Timeline UI.

*(Note: If you log in with a normally registered account, this button is hidden).*

---

## Architecture Note: Global vs. Private Leads

By default, **all leads in this application are global**. This means that regardless of which user account you log into, you will see the exact same pool of leads. This is a common design for a centralized CRM where a team of sales representatives all collaborate on the same shared data pool.

If you wish to update this functionality so that **leads are strictly private to the user who created them**, you would need to modify the following areas:
1. **The Database Model:** Update the `Lead.js` schema to include a reference to the `User` who created it.
2. **Lead Creation:** Update the `createLead` controller to automatically attach the logged-in user's ID to the new lead.
3. **Lead Fetching:** Update the `getLeads` controller to filter the database query so it only returns leads that match the currently authenticated user's ID.

---

## Environment Variables Reference

| Variable | Description | Required |
|---|---|---|
| `PORT` | Port for the Express server | Yes |
| `MONGO_URI` | MongoDB connection string. Use `mongodb://localhost:27017/leadflow` for local dev, or `mongodb://mongo:27017/leadflow` when running via Docker. | Yes |
| `JWT_SECRET` | Secret key for signing JWTs | Yes |
| `SESSION_SECRET` | Secret key for express-session | Yes |
| `EMAIL_USER` | Gmail address used to send OTPs | Yes |
| `EMAIL_APP_PASSWORD` | Gmail App Password (not your login password) | Yes |

---

## Available Scripts

**Backend** (run from `/backend`):

| Script | Description |
|---|---|
| `npm start` | Start the server with nodemon (auto-restarts on changes) |

**Frontend** (run from `/frontend`):

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Build for production (output in `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Common Issues

**MongoDB connection error**
Make sure MongoDB is running locally (`mongod`) or your Atlas URI in `.env` is correct. If using Docker, ensure your `MONGO_URI` is pointing to `mongo` and not `localhost`.

**OTP emails not sending**
Double-check `EMAIL_USER` and `EMAIL_APP_PASSWORD`. Ensure 2-Step Verification is enabled on your Google account before generating an App Password.

**CORS errors in the browser**
Ensure the backend is running on port `5000` and the frontend on port `5173`. The CORS config in `server.js` is hardcoded to `http://localhost:5173`.