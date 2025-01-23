import transporter from "../config/emailConfig.js";
import EmailVerificationModel from "../models/EmailVerification.js";

const sendEmailVerificationOTP = async (req, user) => {
  // Generate a random 4-digit number
  const otp = Math.floor(1000 + Math.random() * 9000);

  // Store the OTP in the database
  await new EmailVerificationModel({userId: user._id,otp:otp}).save();

  //   OTP verification Link
  const otpVerificationLink = `${process.env.FRONTEND_HOST}/account/verify-email`;

  // Send the email with the OTP
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Email Verification OTP",
    html: `<p>Dear ${user.name},</p>
    <p>Thank you for signing up with our website. To complete your registration, please verify your email address by entering the following one-time password (OTP):</p>
    <h2>OTP: ${otp}</h2>
    <p>This OTP is valid for 15 minutes. If you didn't request this OTP, please ignore this email.</p>
    <p>You can also use the following link: <a href="${otpVerificationLink}">${otpVerificationLink}</a></p>`,

  });

  return otp
}

export default sendEmailVerificationOTP
