// pages/api/auth/signup.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/dbConnect'
import bcrypt from 'bcryptjs'
import { UserRole } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Destructure all the expected fields from the request body
    const { email, password, role, name, school, grade, subjects } = req.body

    console.log('[Sign-Up] Received request for email:', email, 'with role:', role);

    // Basic validation
    if (!email || !password || !role || !name || !school) {
      console.log('[Sign-Up] Failed: Missing required fields.');
      return res.status(400).json({ message: 'Name, email, password, school, and role are required' })
    }

    if (!Object.values(UserRole).includes(role)) {
      console.log(`[Sign-Up] Failed: Invalid role specified: ${role}.`);
      return res.status(400).json({ message: 'Invalid role specified' })
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      console.log(`[Sign-Up] Failed: User already exists with email: ${email}`);
      return res.status(409).json({ message: 'User already exists with this email' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Prepare the data for user creation
    const userData: any = {
      email,
      password: hashedPassword,
      role,
      name,
      school,
    }

    // Add role-specific fields
    if (role === 'STUDENT') {
      userData.grade = grade;
    } else if (role === 'TEACHER' && subjects) {
      // Convert comma-separated string to an array
      userData.subjects = subjects.split(',').map((s: string) => s.trim());
    }

    console.log(`[Sign-Up] Creating new user in database with data:`, userData);
    await prisma.user.create({
      data: userData,
    })

    console.log(`[Sign-Up] Success: User created for ${email}.`);
    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    console.error('Signup Error:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}