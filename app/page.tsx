import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, BookOpen, Brain, Users, BarChart3, MessageSquare } from "lucide-react"


export default function LandingPage() {
  return (
    
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">SetuNova</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/role-select">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-balance mb-6">
              The AI-Powered Platform for <span className="text-primary">Indian Educators</span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty mb-8 leading-relaxed">
              Automate non-teaching tasks and empower student learning with AI-driven tools for curriculum design,
              grading, attendance, and personalized education.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/role-select">
                <Button size="lg" className="text-base">
                  Start Building
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-base bg-transparent">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-sm text-muted-foreground mb-8">Trusted by educators across India</p>
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-60">
            <span className="text-lg font-semibold">CBSE Schools</span>
            <span className="text-lg font-semibold">ICSE Boards</span>
            <span className="text-lg font-semibold">State Boards</span>
            <span className="text-lg font-semibold">Private Institutions</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need to teach smarter</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful AI tools designed specifically for Indian educators and students
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature Card 1 */}
          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Curriculum Builder</h3>
            <p className="text-muted-foreground leading-relaxed">
              Generate comprehensive curriculum plans with AI assistance tailored to your subject and grade level.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Grading</h3>
            <p className="text-muted-foreground leading-relaxed">
              Automated grading for objective and subjective answers using OCR and NLP technology.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Attendance Management</h3>
            <p className="text-muted-foreground leading-relaxed">
              Track attendance with manual entry, spreadsheet upload, or image extraction capabilities.
            </p>
          </div>

          {/* Feature Card 4 */}
          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multilingual Support</h3>
            <p className="text-muted-foreground leading-relaxed">
              Students can get explanations in their preferred language with AI-powered translation.
            </p>
          </div>

          {/* Feature Card 5 */}
          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground leading-relaxed">
              Track student progress, engagement, and performance with comprehensive analytics.
            </p>
          </div>

          {/* Feature Card 6 */}
          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Video Generation</h3>
            <p className="text-muted-foreground leading-relaxed">
              Generate explanatory videos for difficult concepts using Gemini AI technology.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="bg-gradient-to-br from-primary/20 via-primary/20 to-accent/20 rounded-2xl p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to transform your teaching?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of educators using AI to focus on what matters most - mentoring students.
            </p>
            <Link href="/role-select">
              <Button size="lg" className="text-base">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-semibold">SetuNova</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 SetuNova. Built for Indian educators.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
