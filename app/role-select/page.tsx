import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users, BookOpen } from "lucide-react"

export default function RoleSelectPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">SetuNova</span>
          </Link>
          <h1 className="text-4xl font-bold mb-4">Choose Your Role</h1>
          <p className="text-lg text-muted-foreground">Select how you'll be using SetuNova</p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Teacher Card */}
          <Link href="/teacher/sign-up">
            <div className="bg-card border-2 border-border rounded-xl p-8 hover:border-primary transition-all cursor-pointer group h-full">
              <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">I'm a Teacher</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Access AI-powered tools for curriculum design, grading, attendance management, and student analytics.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>AI Curriculum Builder</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Automated Grading</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Attendance Management</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Analytics Dashboard</span>
                </li>
              </ul>
              <Button className="w-full" size="lg">
                Continue as Teacher
              </Button>
            </div>
          </Link>

          {/* Student Card */}
          <Link href="/student/sign-up">
            <div className="bg-card border-2 border-border rounded-xl p-8 hover:border-secondary transition-all cursor-pointer group h-full">
              <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">I'm a Student</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Get personalized learning support with AI-powered explanations, video generation, and doubt clearing.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>AI Video Explanations</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Multilingual Support</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Doubt Clearing Chatbot</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Task Management</span>
                </li>
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                Continue as Student
              </Button>
            </div>
          </Link>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-8">
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
