import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePath = ['/me']
const authPaths = ['/login', '/register']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl
    const  sessionToken = request.cookies.get('sessionToken')

    if (pathname != '/' && (pathname.includes('/edit') || pathname.includes('/add')) && !sessionToken){
        return NextResponse.redirect(new URL(`/login/?returnUrl=${pathname}`, request.url))
    }

    if (privatePath.some(path => path.startsWith(pathname)) && (pathname !== '/') && !sessionToken){
        return NextResponse.redirect(new URL(`/login/?returnUrl=${pathname}`, request.url))
    }
    if (authPaths.some(path => path.startsWith(pathname)) && sessionToken){
        return NextResponse.redirect(new URL('/me', request.url))
    }
    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/:path*'
}