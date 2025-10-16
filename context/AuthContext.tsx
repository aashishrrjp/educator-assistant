"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth"; // Can be removed if not used for type hints elsewhere
// import { auth } from "@/lib/firebase/firebase"; // Assuming this is your client-side firebase auth instance

// Define the shape of our User object (from our database)
interface AppUser {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  role: "STUDENT" | "TEACHER";
  grade?: string;
  school?: string;
  subjects?: string[];
}

// Define the shape of the context
interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => { // Use the client-side auth instance
      // This function will check if a user session exists on the backend.
      const checkUserSession = async () => {
        try {
          const res = await fetch("/api/auth/me"); // This endpoint checks the session cookie

          if (res.ok) {
            const profile = await res.json();
            setUser(profile);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error checking user session:", error);
          setUser(null);
        }
        setLoading(false);
      };
      checkUserSession();
    });
    return () => unsubscribe(); // Cleanup the subscription
  }, []);

  useEffect(() => {
    if (loading) return;

    const publicPaths = [
      "/sign-in",
      "/student/sign-up",
      "/teacher/sign-up",
      "/role-select",
      "/",
    ];
    const isPublicPath = pathname ? publicPaths.includes(pathname) : false;

    if (user && isPublicPath) {
      if (user.role === "STUDENT") {
        router.push("/student/dashboard");
      } else if (user.role === "TEACHER") {
        router.push("/teacher/dashboard");
      }
    }
  }, [user, loading, router, pathname]);

  const register = async (data: any) => {
    // Keep loading state here for registration flow if needed, or manage locally
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed.");
      }

      // Automatically log the user in after successful registration
      await login({ email: data.email, password: data.password });
    } catch (error: any) {
      throw error;
    }
  };

  // UPDATED: Login function for email and password
  const login = async (credentials: any) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }

      setUser(data.user);
    } catch (error) {
      throw error; // Re-throw the error to be caught by the UI component
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/sign-in");
  };

  const value = { user, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};