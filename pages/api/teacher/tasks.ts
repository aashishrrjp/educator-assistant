import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/dbConnect';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// This function can be moved to a shared auth helper file
async function getUserIdFromToken(req: NextApiRequest): Promise<string | null> {
  const token = req.cookies.auth_token;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    // You might want to add a role check here in a real app
    return payload.userId as string;
  } catch (error) {
    console.error("JWT Verification failed:", error);
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  switch (req.method) {
    // GET: Fetch all tasks for the logged-in teacher
    case 'GET':
      try {
        const tasks = await prisma.task.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(tasks);
      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tasks' });
      }
      break;

    // POST: Create a new task for the teacher
    case 'POST':
      try {
        const { text, dueDate, priority } = req.body;
        if (!text) {
          return res.status(400).json({ message: 'Task text is required' });
        }
        const newTask = await prisma.task.create({
          data: { text, userId, dueDate, priority },
        });
        res.status(201).json(newTask);
      } catch (error) {
        res.status(500).json({ message: 'Failed to create task' });
      }
      break;

    // PUT: Update a teacher's task
    case 'PUT':
      try {
        const { taskId, completed } = req.body;
        const updatedTask = await prisma.task.update({
          where: { id: taskId, userId }, // Ensures user can only update their own tasks
          data: { completed },
        });
        res.status(200).json(updatedTask);
      } catch (error) {
        res.status(500).json({ message: 'Failed to update task' });
      }
      break;

    // DELETE: Delete a teacher's task
    case 'DELETE':
      try {
        const { taskId } = req.body;
        await prisma.task.delete({
          where: { id: taskId, userId }, // Ensures user can only delete their own tasks
        });
        res.status(204).end(); // Success with no content to return
      } catch (error) {
        res.status(500).json({ message: 'Failed to delete task' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
