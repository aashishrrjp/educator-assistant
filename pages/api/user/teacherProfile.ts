import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/dbConnect";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// Helper function to verify JWT and get user ID
async function getUserIdFromToken(req: NextApiRequest): Promise<string | null> {
  const token = req.cookies.auth_token;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.userId as string;
  } catch (error) {
    console.error("JWT Verification failed:", error);
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = await getUserIdFromToken(req);

  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // === HANDLE FETCHING PROFILE DATA (GET) ===
  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          email: true,
          school: true,
          subjects: true,
          classesTaught: true,
          phone: true,
          experience: true,
          bio: true,
          avatarUrl: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // === HANDLE UPDATING PROFILE DATA (PUT) ===
  if (req.method === "PUT") {
    try {
      // Destructure classesTaught from the request body
      const { subjects, classesTaught, ...profileData } = req.body;

      // Prevent sensitive fields from being updated
      delete profileData.email;
      delete profileData.role;
      delete profileData.password;

      const dataToUpdate: any = { ...profileData };

      // Safely handle the subjects field
      if (typeof subjects === "string") {
        dataToUpdate.subjects = subjects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      // Safely handle the classesTaught field
      if (typeof classesTaught === "string") {
        dataToUpdate.classesTaught = classesTaught
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      await prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
      });

      return res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Failed to update profile:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
