import UserModel from "../models/User.js";
import bcrypt from 'bcrypt'
import sendEmailVerificationOTP from "../utils/sendEmailVerificationOTP.js";
import EmailVerificationModel from "../models/EmailVerification.js";
import setTokensCookies from "../utils/setTokensCookies.js";
import generateTokens from "../utils/generateTokens.js";
import refreshAccessToken from "../utils/refreshAccessToken.js";
import UserRefreshTokenModel from "../models/UserRefreshToken.js";
import jwt from "jsonwebtoken"
import transporter from "../config/emailConfig.js";

class UserController {
    // User Registration
    static userRegistration = async (req, res) => {
        try {
            // Extract request body parameters
            const { name, email, password, password_confirmation } = req.body;

            // Check if all required fields are provided
            if (!name || !email || !password || !password_confirmation) {
                return res.status(400).json({ status: "failed", message: 'All fields are required' });
            }

            // Check if password and password_confirmation match
            if (password !== password_confirmation) {
                return res.status(400).json({ status: "failed", message: "Password and Confirm Password don't match" });
            }
            // Check if email already exists
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ status: "failed", message: 'Email already exists' });
            }

            // generate salt and hash password
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashedPassword = await bcrypt.hash(password, salt);

            // create new user
            const newUser = await new UserModel({ name, email, password: hashedPassword }).save();

            sendEmailVerificationOTP(req, newUser);

            // Send success response
            res.status(201).json({
                status: "success",
                message: 'Registration Success',
                user: { id: newUser._id, email: newUser.email }
            });

        } catch (error) {
            console.error(error)
            res.status(500).json({ status: "failed", message: 'Unable to Registration, please try again later' })
        }
    }

    // User Email Verification
    static verifyEmail = async (req, res) => {
        try {
            // Extract request body parameters
            const { email, otp } = req.body;

            // Check if all required fields are provided
            if (!email || !otp) {
                return res.status(400).json({ status: "failed", message: 'All fields are required' });
            }
            // Check user is existing
            const existingUser = await UserModel.findOne({ email });
            // if email is doesn't exist
            if (!existingUser) {
                return res.status(400).json({ status: "failed", message: 'User not found' });
            }

            // Check if email is already verified
            if (existingUser.is_verified) {
                return res.status(400).json({ status: "failed", message: 'Email is already verified' });
            }

            // Check if there is a matching email verification OTP
            const emailVerification = await EmailVerificationModel.findOne({ userId: existingUser._id, otp })
            if (!emailVerification) {
                if (!existingUser.is_verified) {
                    // console.log(existingUser)
                    await sendEmailVerificationOTP(req, existingUser);
                    return res.status(400).json({ status: "failed", message: 'Invalid OTP, new OTP sent to your email' });
                }
                return res.status(400).json({ status: "failed", message: "Invalid OTP" })
            }

            // Check if OTP is expired
            const currentTime = new Date();
            // 15 * 60 * 1000 calculates the expiration period in milliseconds(15 minutes)
            const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);
            if (currentTime > expirationTime) {
                // OTP expired, send new OTP
                await sendEmailVerificationOTP(req, existingUser);
                return res.status(400).json({ status: "failed", message: 'OTP has expired, new OTP sent to your email' });
            }

            // OTP is valid and not expired, mark email as verified
            existingUser.is_verified = true;
            await existingUser.save();

            // Delete email verification document
            await EmailVerificationModel.deleteMany({ user: existingUser._id })

            // Send success response
            res.status(200).json({
                status: "success",
                message: 'Email verification successful',
            });

        } catch (error) {
            console.error(error)
            res.status(500).json({ status: "failed", message: 'Unable to Verify Email, please try again later' })
        }
    }

    // User Login
    static userLogin = async (req, res) => {
        try {
            // Extract request body parameters
            const { email, password } = req.body;

            // Check if email and password are provided
            if (!email || !password) {
                return res.status(400).json({ status: "failed", message: 'Email and Password are required' });
            }

            // Find user by email
            const user = await UserModel.findOne({ email });

            // If user not found
            if (!user) {
                return res.status(404).json({ status: "failed", message: 'Invalid Email or Password' });
            }
            // If user found
            if (!user.is_verified) {
                return res.status(401).json({ status: "failed", message: 'Your account is not verified' });
            }
            // Check if password is correct
            const isMatch = await bcrypt.compare(password, user.password);
            // If password is incorrect
            if (!isMatch) {
                return res.status(401).json({ status: "failed", message: 'Invalid Email or Password' });
            }
            // Generate token
            const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = await generateTokens(user)

            // Set Cookies
            setTokensCookies(res, accessToken, refreshToken, accessTokenExp, refreshTokenExp)
            // Send Success Response with tokens
            res.status(200).json({
                user: { id: user.id, email: user.email, name: user.name, roles: user.roles[0] },
                status: "success",
                message: "Login successfully",
                access_token: accessToken,
                refresh_Token: refreshToken,
                access_token_exp: accessTokenExp,
                is_auth: true,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ status: "failed", message: 'Unable to Login, please try again later' })
        }
    }

    // Get New Access Token or Refresh Token
    static getNewAccessToken = async (req, res) => {
        try {
            // Get the new access token using the refresh Token
            const { newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp } = await refreshAccessToken(req, res);

            // set new token to cookie
            setTokensCookies(res, newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp)

            res.status(200).send({
                status: "success",
                message: 'New Tokens generated successfully',
                access_token: newAccessToken,
                refresh_token: newRefreshToken,
                access_token_exp: newAccessTokenExp,
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "failed", message: 'Unable to generate new token, please try again later' });
        }
    }

    // Profile or Logged in User
    static userProfile = async (req, res) => {
        // console.log(req.user)
        res.send({ "user": req.user })
    }
    // Change Password
    static changeUserPassword = async (req, res) => {
        try {
            // Extract request body parameters
            const { password, password_confirmation } = req.body;

            // Check if both password and password_confirmation are provider
            if (!password || !password_confirmation) {
                return res.status(400).json({ status: "failed", message: 'Password and Confirm Password are required' });
            }
            // Check if password and password_confirmation match
            if (password !== password_confirmation) {
                return res.status(400).json({ status: "failed", message: "New Password and Confirm New Password don't match" });
            }

            // Generate salt and hash new password
            const salt = await bcrypt.genSalt(10);
            const newHashPassword = await bcrypt.hash(password, salt);

            // Update user's password
            await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })

            // Send success response
            res.status(200).json({ status: "success", message: "Password changed successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "failed", message: 'Unable to change password, please try again later' });
        }
    }

    // Send Password Reset Link via Email
    static sendUserPasswordResetEmail = async (req, res) => {
        try {
            // Extract request body parameters
            const { email } = req.body;

            // Check if email is provided
            if (!email) {
                return res.status(400).json({ status: "failed", message: 'Email is required' });
            }

            // Find user by email
            const user = await UserModel.findOne({ email });

            // If user not found
            if (!user) {
                return res.status(404).json({ status: "failed", message: "Email doesn't exist" });
            }

            // Generate password reset token
            const secret = user._id + process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
            const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '15m' });

            // Reset Link
            const resetLink = `${process.env.FRONTEND_HOST}/account/reset-password-confirm/${user._id}/${token}`;

            // Send password reset email
            await transporter.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: user.email,
                    subject: 'Password Reset - Your Account',
                    html: `<p>Hello ${user.name},</p><p>Please <a href="${resetLink}">click here</a> to reset your password.</p>`,
                })
                // send success response
                res.status(200).json({ status: "success", message: 'Password reset link sent to your email' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "failed", message: 'Unable to send password reset email, please try again later.' });
        }
    }

    // Password Reset
    static userPasswordReset = async (req, res) => {
        try {
            // Extract request body parameters
            const { password, password_confirmation } = req.body;
            const { id, token } = req.params;
            // Find user by ID
            const user = await UserModel.findById(id);
            // Check if user found
            if (!user) {
                return res.status(404).json({ status: "failed", message: 'User not Found' });
            }
            // Validate token
            const new_secret = user._id + process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
            jwt.verify(token, new_secret)

            // Check if password and password_confirmation are provided
            if (!password || !password_confirmation) {
                return res.status(400).json({ status: "failed", message: "New Password and Confirm New Password are required" });
            }

            // Check if password and password_confirmation match
            if (password!== password_confirmation) {
                return res.status(400).json({ status: "failed", message: "New Password and Confirm New Password don't match" });
            }

            // Generate salt and hash new password
            const salt = await bcrypt.genSalt(10);
            const newHashPassword = await bcrypt.hash(password, salt);

            // Update user's password
            await UserModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })

            // Send success response
            res.status(200).json({ status: "success", message: "Password reset successfully" });

        } catch(error) {
            if (error.name === "tokenExpiredError") {
                return res.status(400).json({ status: "failed", message: "Token expired. Please request a new password reset link." });
            }
            return res.status(500).json({status:"failed", message: "unable to reset password. Please try again later."});
        };
    }

    // Logout
    static userLogout = async (req, res) => {
        try {
            // Optionally, you can blacklist the refresh token in the database
            const RefreshToken = req.cookies.refreshToken;
            await UserRefreshTokenModel.findOneAndUpdate(
                { token: RefreshToken },
                { $set: { blacklisted: true } }
            )

            // Clear access token and refresh token cookies
            res.clearCookie('accessToken')
            res.clearCookie('refreshToken');
            res.clearCookie('is_auth')

            res.status(200).json({ status: "success", message: "Logged out successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "failed", message: 'Unable to Logout, please try again later' });
        }
    }
}

export default UserController;