"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const roleFromQuery = searchParams?.get('role')
    if (roleFromQuery && ['STUDENT', 'TEACHER'].includes(roleFromQuery)) {
      setRole(roleFromQuery)
    } else {
      // Redirect if role is invalid or not present
      router.replace('/role-select')
    }
  }, [searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to sign up')
      }

      // On success, redirect to the sign-in page
      router.push('/sign-in')
    } catch (err: any) {
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  if (!role) {
    // Render nothing or a loading spinner while redirecting
    return null
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">SetuNova</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create a {role === 'STUDENT' ? 'Student' : 'Teacher'} Account</h1>
          <p className="text-muted-foreground">Welcome! Please fill in the details below.</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}