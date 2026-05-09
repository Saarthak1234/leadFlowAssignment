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

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [MongoDB](https://www.mongodb.com/) running locally, or a [MongoDB Atlas](https://www.mongodb.com/atlas) URI

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

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/leadFlowAssignment.git
cd leadFlowAssignment
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

**Create your `.env` file:**

```bash
cp .env.example .env
```

Then open `.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/leadflow   # or your Atlas URI
JWT_SECRET=your_super_secret_jwt_key
SESSION_SECRET=your_session_secret
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
```

> **Gmail App Password:** Go to your Google Account → Security → 2-Step Verification → App Passwords. Generate a password for "Mail" and paste it as `EMAIL_APP_PASSWORD`. Your regular Gmail password will not work here.

**Start the backend server:**

```bash
npm start
```

The API will run at `http://localhost:5000`.

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

**Start the frontend dev server:**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

> The frontend is pre-configured to proxy API calls to `http://localhost:5173`, and the backend allows CORS from this origin — no extra config needed for local development.

---

## Running the App

You need **both** servers running at the same time. Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd backend
npm start
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment Variables Reference

| Variable | Description | Required |
|---|---|---|
| `PORT` | Port for the Express server | Yes |
| `MONGO_URI` | MongoDB connection string | Yes |
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
Make sure MongoDB is running locally (`mongod`) or your Atlas URI in `.env` is correct and your IP is whitelisted in Atlas.

**OTP emails not sending**
Double-check `EMAIL_USER` and `EMAIL_APP_PASSWORD`. Ensure 2-Step Verification is enabled on your Google account before generating an App Password.

**CORS errors in the browser**
Ensure the backend is running on port `5000` and the frontend on port `5173`. The CORS config in `server.js` is hardcoded to `http://localhost:5173`.