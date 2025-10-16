import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-jwt-key-that-is-at-least-32-chars-long');

interface UserJwtPayload {
  userId: string;
  role: 'STUDENT' | 'TEACHER';
  iat: number;
  exp: number;
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  const { pathname } = req.nextUrl

  const isAuthPage = ['/sign-in', '/sign-up', '/role-select'].includes(pathname)

  if (!token) {
    // If no token and not on an auth page, redirect to sign-in
    if (!isAuthPage) {
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }
    return NextResponse.next()
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET) as { payload: UserJwtPayload };
    const { role } = payload;

    const studentDashboard = new URL('/student/dashboard', req.url);
    const teacherDashboard = new URL('/teacher/dashboard', req.url);

    if (isAuthPage) return NextResponse.redirect(role === 'STUDENT' ? studentDashboard : teacherDashboard);
    if (pathname.startsWith('/student') && role !== 'STUDENT') return NextResponse.redirect(teacherDashboard);
    if (pathname.startsWith('/teacher') && role !== 'TEACHER') return NextResponse.redirect(studentDashboard);

  } catch (error) {
    // Token is invalid, redirect to sign-in and clear cookie
    const response = NextResponse.redirect(new URL('/sign-in', req.url));
    response.cookies.delete('auth_token');
    return response;
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/student/:path*', '/teacher/:path*', '/sign-in', '/sign-up', '/role-select'],
}