import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'

async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return { valid: true, payload }
  } catch (error) {
    console.log('Token verification failed:', error.message)
    return { valid: false, payload: null }
  }
}

export async function middleware(request) {

  const token = request.cookies.get('token')?.value

  // Define protected routes (add your protected paths here)
  const protectedRoutes = ['/dashboard', '/history', '/test']
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    const { valid, payload } = await verifyToken(token)
    
    if (!valid) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('token')
      return response
    }

    return NextResponse.next()
  }

  if (request.nextUrl.pathname === '/login' && token) {
    const { valid } = await verifyToken(token)
    if (valid) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      const response = NextResponse.next()
      response.cookies.delete('token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/history/:path*', 
    '/test/:path*',
  ]
}
