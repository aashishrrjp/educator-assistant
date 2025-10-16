"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, ArrowLeft, AlertCircle } from "lucide-react"

export default function StudentSignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    grade: "",
    school: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // CHANGE THIS LINE:
        body: JSON.stringify({
          ...formData, // Send all form data
          role: 'STUDENT',
        }),
      });

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account. Please try again.')
      }

      // On success, redirect to the sign-in page
      router.push('/sign-in')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/role-select"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to role selection</span>
          </Link>
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">SetuNova</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Create Student Account</h1>
            <p className="text-muted-foreground">Start your personalized learning journey</p>
          </div>
        </div>

        {/* Sign Up Form */}
        <div className="bg-card border border-border rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Rahul Kumar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="rahul@student.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>
            {/* Grade Input */}
            <div className="space-y-2">
              <Label htmlFor="grade">Grade/Class</Label>
              <Input
                id="grade"
                placeholder="10th Grade"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>
            {/* School Input */}
            <div className="space-y-2">
              <Label htmlFor="school">School/Institution</Label>
              <Input
                id="school"
                placeholder="Delhi Public School"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>
            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>
            {/* Error Message Display */}
            {error && (
              <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}