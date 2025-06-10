// middleware.ts (Edge-safe)
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

export const config = { matcher: ['/admin/:path*'] };

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // do not enforce auth
    if (pathname.startsWith('/login') || pathname.startsWith('/register') || pathname === '/') {
        return NextResponse.next()
    }

    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.redirect(new URL('/login', req.url))

    try {
        const { payload } = await jwtVerify(token, secret)  // ✅ edge-compatible
        const role = payload.role as string | undefined

        if (pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', req.url))
        }

        return NextResponse.next()
    } catch {
        return NextResponse.redirect(new URL('/login', req.url))
    }
}
