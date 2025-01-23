import * as Yup from "yup";
export const registerSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(8).required("Password is required"),
    password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required("Confirm Password is required"),
})

export const loginSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().required("Password is required"),
})

export const resetPasswordLinkSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required")
})

export const resetPasswordSchema = Yup.object({
    password: Yup.string().min(8).required("Password is required"),
    password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], "Password and Confirm Password doesn't match").required("Confirm Password is required"),
})

export const verifyEmailSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    otp: Yup.string().required("OTP is required")
})

export const changePasswordSchema = Yup.object({
    password: Yup.string().min(8).required("Password is required"),
    password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], "Password and Confirm Password doesn't match").required("Confirm Password is required"),
})