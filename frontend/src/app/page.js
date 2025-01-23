import Link from "next/link"
import Navbar from "../components/Navbar"

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white flex flex-col items-center">
      <Navbar />

      <header className="text-center mt-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-400 tracking-wide p-4 animate-fade-in">
          Welcome to Passport JS + JWT Authentication
        </h1>
        <h3 className="text-lg md:text-xl font-medium text-indigo-300 mt-4 animate-slide-in">
          Handle Access Token and Refresh Token on Server with Ease
        </h3>
      </header>

      <div className="flex flex-col items-center mt-8 space-y-4 animate-fade-in-slow">
        <p className="text-center text-sm md:text-base text-gray-400 max-w-2xl">
          Learn how to implement robust authentication using Passport.js with JWTs, securing your application efficiently. Explore access token and refresh token management handled entirely on the server.
        </p>
        <Link href="/account/login">
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-semibold shadow-lg transition duration-300">
            Get Started
          </button>
        </Link>
      </div>
    </div>

  )
}

export default Home
