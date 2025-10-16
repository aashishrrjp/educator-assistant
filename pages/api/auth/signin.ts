import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/dbConnect'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { serialize } from 'cookie'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-jwt-key-that-is-at-least-32-chars-long')
const COOKIE_NAME = 'auth_token'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body
    console.log('[Sign-In] Received request for email:', email);

    if (!email || !password) {
      console.log('[Sign-In] Failed: Missing email or password.');
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // 1. Find the user by their unique email address.
    const user = await prisma.user.findUnique({ where: { email } })

    // If no user is found, or if the user exists but has no password (e.g., from a social login)
    if (!user || !user.password) {
      console.log(`[Sign-In] Failed: User not found or no password set for ${email}.`);
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    console.log(`[Sign-In] User found for ${email}. Comparing passwords...`);

    // 2. Compare the provided password with the hashed password from the database.
    console.log(`[Sign-In] Comparing provided password with stored hash for ${email}.`, user.password);
    console.log(`[Sign-In] Provided password: ${password}`);
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      console.log(`[Sign-In] Failed: Invalid password for ${email}.`);
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Create JWT
    const token = await new SignJWT({ userId: user.id, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d') // Token expires in 1 day
      .sign(JWT_SECRET)

    // Set cookie
    const cookie = serialize(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    })

    res.setHeader('Set-Cookie', cookie)
    console.log(`[Sign-In] Success: JWT cookie set for ${email} with role ${user.role}.`);
    res.status(200).json({ role: user.role })
  } catch (error) {
    console.error('Signin Error:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}