import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/dbConnect';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getAuthPayload(req: NextApiRequest) {
    const token = req.cookies.auth_token;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as { userId: string; role: string };
    } catch (error) {
        return null;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const auth = await getAuthPayload(req);
    if (!auth || auth.role !== 'TEACHER') {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        const { title, description, url, className } = req.body;

        if (!title || !url || !className) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const newActivity = await prisma.activity.create({
            data: {
                title,
                description: description || 'Interactive Activity',
                url,
                className,
                teacherId: auth.userId,
            },
        });

        res.status(201).json(newActivity);
    } catch (error) {
        console.error('Failed to assign activity:', error);
        res.status(500).json({ message: 'Failed to assign activity.' });
    }
}
