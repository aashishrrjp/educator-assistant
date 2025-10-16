import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/dbConnect"; // We use the new singleton connection

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // The prisma.$connect() method explicitly opens a connection to the database.
    // This is the most direct way to test if the credentials and network access are correct.
    await prisma.$connect();
    
    // If the connection is successful, send a success response.
    res.status(200).json({ 
      status: 'success', 
      message: 'Database connection successful!' 
    });

  } catch (error: any) {
    // If an error occurs, it means the connection failed.
    console.error("DATABASE CONNECTION FAILED:", error);
    
    // Send a detailed error response.
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed.',
      // We include the error message for easier debugging.
      error: error.message 
    });

  } finally {
    // It's a good practice to disconnect after the check.
    await prisma.$disconnect();
  }
}
