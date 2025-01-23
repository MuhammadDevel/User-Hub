"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLogoutUserMutation } from '@/lib/services/auth'

const UserSidebar = () => {
    const [logoutUser] = useLogoutUserMutation()
    const router = useRouter()
    const handleLogout = async () => {
        try {
            const response = await logoutUser()
            if (response.data && response.data.status === 'success') {
                router.push('/')
            }
        } catch (error) {
            console.log(object)
        }
    }
    return (
        <div className="bg-black text-white h-screen flex items-center justify-center p-6">
            {/* Navigation Card */}
            <div className="w-full max-w-sm bg-gray-900 rounded-lg shadow-lg p-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link
                        href="/"
                        className="text-3xl font-extrabold text-indigo-400 hover:text-indigo-300 transition duration-300"
                    >
                        Home
                    </Link>
                </div>
    
                {/* Navigation */}
                <nav>
                    <ul className="space-y-6">
                        <li className="flex items-center">
                            <span className="text-indigo-400 mr-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </span>
                            <Link
                                href="/user/profile"
                                className="text-lg font-medium hover:text-indigo-300 transition duration-300"
                            >
                                Profile
                            </Link>
                        </li>
                        <li className="flex items-center">
                            <span className="text-indigo-400 mr-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 12h6m-6 0a6 6 0 11-12 0 6 6 0 0112 0zm6 0h-6"
                                    />
                                </svg>
                            </span>
                            <Link
                                href="/user/change-password"
                                className="text-lg font-medium hover:text-indigo-300 transition duration-300"
                            >
                                Change Password
                            </Link>
                        </li>
                        <li className="flex items-center">
                            <span className="text-red-400 mr-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7"
                                    />
                                </svg>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-lg font-medium hover:text-red-300 transition duration-300"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
    
}

export default UserSidebar
