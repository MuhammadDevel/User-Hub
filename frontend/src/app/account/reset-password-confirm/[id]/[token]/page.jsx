"use client"
import { useFormik } from "formik"
import { useParams, useRouter } from "next/navigation"
import { resetPasswordSchema } from "@/validation/schemas"
import { useResetPasswordMutation } from "@/lib/services/auth"
import { useState } from "react"

const initialValues = {
    password: "",
    password_confirmation: "",
}

const ResetPasswordConfirm = () => {
    const [serverErrorMessage, setServerErrorMessage] = useState('')
    const [serverSuccessMessage, setServerSuccessMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [resetPassword] = useResetPasswordMutation()
    const { id, token } = useParams()
    const { handleSubmit, handleChange, values, errors } = useFormik({
        initialValues,
        validationSchema: resetPasswordSchema,
        onSubmit: async (values,action) => {
            setLoading(true);
            try {
                const data = { ...values, id, token }
                const response = await resetPassword(data);

                if (response.data && response.data.status === "success") {
                    setServerSuccessMessage(response.data.message);
                    setServerErrorMessage('')
                    action.resetForm();
                    router.push('/account/login');
                    setLoading(false);
                }

                if (response.error && response.error.data.status === "failed") {
                    setServerErrorMessage(response.error.data.message);
                    setServerSuccessMessage('')
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
    })
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block font-medium mb-2" htmlFor="newPassword">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                            placeholder="Enter your new password"
                        />
                        {errors.password && <div className="text-red-500 text-xs px-2">{errors.password}</div>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password_confirmation" className="block font-medium mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={values.password_confirmation}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                            placeholder="Confirm your new password"
                        />
                        {errors.password_confirmation && <div className="text-xs text-red-500 pc-2">{errors.password_confirmation}</div>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 disabled:bg-gray-400" disabled={loading}
                    >Reset Password</button>
                </form>
                {serverSuccessMessage && <div className="text-sm text-green-500 px-2 font-semibold text-center">{serverSuccessMessage}</div>}
                {serverErrorMessage && <div className="text-sm text-red-500 px-2 font-semibold text-center">{serverErrorMessage}</div>}
            </div>
        </div>
    )
}

export default ResetPasswordConfirm