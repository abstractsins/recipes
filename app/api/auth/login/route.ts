import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(req: Request) {

  const fd = await req.formData();
  const email = fd.get('email');
  const password = fd.get('password');

  if (typeof email !== 'string' || typeof password !== 'string') {
    return new NextResponse('Missing credentials', { status: 400 })
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not set')
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    console.log(user);
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role, nickname: user.nickname },
    process.env.JWT_SECRET,
    { expiresIn: '3h' }
  )

  const res = NextResponse.json({ user })
  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60,
    path: '/'
  })
  return res
}
