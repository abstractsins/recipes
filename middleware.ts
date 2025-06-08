import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// This middleware runs before requests to protected routes
export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // ✅ Allow unauthenticated access to public routes
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
        return NextResponse.next();
    }

    const token = req.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
            role: string;
        };

        // 🛡️ Block non-admins from /admin routes
        if (req.nextUrl.pathname.startsWith('/admin') && decoded.role !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', req.url));
        }

        // ✅ Token is valid, let request continue
        return NextResponse.next();
    } catch (err) {
        // 🔒 Token is invalid
        return NextResponse.redirect(new URL('/login', req.url));
    }
}


export const config = {
    // matcher: ['/admin/:path*'],
};
