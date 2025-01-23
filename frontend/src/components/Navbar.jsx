"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import LoadingIndicator from './LoadingIndicator'
import Cookies from 'js-cookie'
const Navbar = () => {
    const [isAuth, setIsAuth] = useState(null)
    useEffect(() =>{
        const authCookie = Cookies.get('is_auth')
        setIsAuth(authCookie)
    })
    return (
        <>
            {isAuth === null && <LoadingIndicator />}
            <nav className="bg-black p-4 shadow-md w-full">
                <div className="container mx-auto flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="text-white font-bold text-xl">
                        <Link href="/" className="hover:text-gray-400 transition duration-300">
                            MyApp
                        </Link>
                    </div>
    
                    {/* Navigation Links */}
                    <div className="flex items-center space-x-6">
                        <Link
                            href="/"
                            className="text-gray-200 hover:text-gray-400 transition duration-300"
                        >
                            Home
                        </Link>
                        {isAuth ? (
                            <Link
                                href="/user/profile"
                                className="text-gray-200 hover:text-gray-400 transition duration-300"
                            >
                                Profile
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/account/login"
                                    className="text-gray-200 hover:text-gray-400 transition duration-300"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/account/register"
                                    className="text-gray-200 hover:text-gray-400 transition duration-300"
                                >
                                    Registration
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
    
}

export default Navbar
