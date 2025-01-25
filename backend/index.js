import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/connectdb.js'
import passport from 'passport'
import userRoutes from './routes/userRoutes.js'
import './config/passport-jwt-strategy.js'
import setTokensCookies from './utils/setTokensCookies.js'
import './config/google-strategy.js'
import googleAuthRoute from './routes/googleAuthRoute.js'

dotenv.config()
const app = express();

// Load environment variables
const DATABASE_URL = process.env.DATABASE_URL;
const FRONTEND_HOST = process.env.FRONTEND_HOST;

// Database connection
connectDB(DATABASE_URL);

// CORS Configuration
const corsOptions = {
    origin: FRONTEND_HOST, // Frontend URL
    credentials: true,     // Allow cookies
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

// Routes
app.use("/api/user", userRoutes);
app.use("/auth", googleAuthRoute);

// Export app (no app.listen)
export default app;
