//Basic Express server setup
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import connectDB from './utils/db.js';
import dotenv from 'dotenv';
import User from './models/userModel.js';
// import passport from './utils/passport.js';
import session from 'express-session';
import cors from 'cors';

dotenv.config();
connectDB();

import bcrypt from 'bcryptjs';

const initializeTestUser = async () => {
    try {
        const testUserEmail = 'test@example.com';
        const existingUser = await User.findOne({ email: testUserEmail });
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash('test1234', 10);
            await User.create({
                name: 'Test User',
                email: testUserEmail,
                userName: 'testuser',
                password: hashedPassword,
                provider: 'local',
                isVerified: true, // Bypass OTP
                otp: 123456
            });
            console.log('Test user created successfully (test@example.com / test1234)');
        }
    } catch (error) {
        console.error('Error initializing test user:', error);
    }
};

initializeTestUser();

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost", "http://127.0.0.1"], // Support React dev server AND Docker Nginx
    credentials: true,
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        sameSite: 'lax',
    }
}));

// app.use(passport.initialize());
// app.use(passport.session());

app.get('/', (req, res) => {
    console.log("Root endpoint hit");
    res.send('Hello World!');
})

import leadRoutes from './routes/leadRoutes.js';

app.use("/auth",authRoutes);
app.use("/api/leads", leadRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})