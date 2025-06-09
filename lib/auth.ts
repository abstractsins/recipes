import { cookies, headers } from 'next/headers'
import { jwtVerify, SignJWT } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function getUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return null
    try {
        const { payload } = await jwtVerify(token, secret)
        return payload as { userId: string; role: string; nickname: string }
    } catch {
        return null
    }
}

export async function signToken(data: { userId: string; role: string }) {
    return await new SignJWT(data).setExpirationTime('1h').sign(secret)
}
