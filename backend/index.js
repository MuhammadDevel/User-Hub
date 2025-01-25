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
import googleAuthRoute from './routes/googleAuthRoute.js';

dotenv.config()
const app = express();
const port = process.env.PORT

const DATABASE_URL = process.env.DATABASE_URL
console.log(DATABASE_URL)

// This will solve CORS Police error
const corsOptions = {
    origin: "https://user-hub-git-main-muhammaddevels-projects.vercel.app",
    credentials: true,
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));

// Database connection
connectDB(DATABASE_URL)

// JSON
app.use(express.json());

// Passport Middleware
app.use(passport.initialize());

// Cookies Parser
app.use(cookieParser());

// Google Auth Routes
app.use("/api/user", userRoutes);
app.use("/auth", googleAuthRoute);

app.get('/',(req,res)=>{
    res.send({
        activeStatus:true,
        error:false,
    })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});