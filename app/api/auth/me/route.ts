import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        return NextResponse.json({ userId: decoded.userId, role: decoded.role });
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

}
