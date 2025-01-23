import { NextResponse } from "next/server"

// Array of paths to check against
const authPaths = ['/account/login', '/account/register']
export async function middleware(request) {
    try {

        const isAuthenticated = request.cookies.get('is_auth')?.value
        const path = request.nextUrl.pathname;
        // If the path is in the array of paths to check for authentication, allow access.
        if (isAuthenticated) {
            if (authPaths.includes(path)) {
                return NextResponse.redirect(new URL('/user/profile', request.url))
            }
        }
        if (!isAuthenticated && !authPaths.includes(path)) {
            return NextResponse.redirect(new URL('/account/login', request.url))
        }
        return NextResponse.next()
    } catch (error) {
        // Handle the error. maybe return a response with status code
        return NextResponse.error()
    }
}
export const config = {
    matcher: ['/user/:path*', '/account/login', '/account/register',]
}