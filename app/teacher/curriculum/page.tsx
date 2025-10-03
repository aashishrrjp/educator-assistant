"use client"

import { useState } from "react"
import { TeacherNav } from "@/components/teacher-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Sparkles, BookOpen, FileText, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function CurriculumPage() {
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")

  const curriculums = [
    {
      id: 1,
      title: "Quadratic Equations - Complete Unit",
      subject: "Mathematics",
      grade: "10th Grade A",
      topics: 8,
      duration: "3 weeks",
      progress: 75,
    },
    {
      id: 2,
      title: "Newton's Laws of Motion",
      subject: "Physics",
      grade: "11th Grade B",
      topics: 6,
      duration: "2 weeks",
      progress: 100,
    },
    {
      id: 3,
      title: "Geometry Fundamentals",
      subject: "Mathematics",
      grade: "9th Grade C",
      topics: 10,
      duration: "4 weeks",
      progress: 45,
    },
  ]

  return (
    <div className="flex h-screen">
      <TeacherNav />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Curriculum Builder</h1>
                <p className="text-muted-foreground">Create and manage your teaching curriculum with AI assistance</p>
              </div>
              <div className="flex gap-3">
                <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Generate
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>AI Curriculum Generator</DialogTitle>
                      <DialogDescription>
                        Describe what you want to teach and let AI create a comprehensive curriculum plan
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="e.g., Mathematics, Physics, Chemistry" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="grade">Grade/Class</Label>
                        <Input id="grade" placeholder="e.g., 10th Grade" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="topic">Topic/Chapter</Label>
                        <Input id="topic" placeholder="e.g., Quadratic Equations" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input id="duration" placeholder="e.g., 3 weeks" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ai-prompt">Additional Instructions (Optional)</Label>
                        <Textarea
                          id="ai-prompt"
                          rows={3}
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="e.g., Focus on practical applications, include real-world examples..."
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setShowAIDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setShowAIDialog(false)}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Curriculum
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Manual
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Curriculum Content */}
        <div className="p-8 space-y-6">
          {/* Curriculum List */}
          <div className="grid grid-cols-1 gap-4">
            {curriculums.map((curriculum) => (
              <Card key={curriculum.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">{curriculum.title}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span>{curriculum.subject}</span>
                        <span>•</span>
                        <span>{curriculum.grade}</span>
                        <span>•</span>
                        <span>{curriculum.topics} topics</span>
                        <span>•</span>
                        <span>{curriculum.duration}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-xs">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>{curriculum.progress}%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${curriculum.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sample Curriculum Detail */}
          <Card>
            <CardHeader>
              <CardTitle>Quadratic Equations - Complete Unit</CardTitle>
              <CardDescription>10th Grade A • Mathematics • 3 weeks duration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Week 1 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">Week 1: Introduction & Basics</h4>
                </div>
                <div className="space-y-2 ml-6">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary mt-0.5">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Introduction to Quadratic Equations</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Define quadratic equations, standard form, and basic terminology
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary mt-0.5">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Solving by Factoring</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Teach factoring methods and solving simple quadratic equations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary mt-0.5">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Practice Problems & Quiz</p>
                      <p className="text-xs text-muted-foreground mt-1">Hands-on practice and assessment</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Week 2 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">Week 2: Advanced Methods</h4>
                </div>
                <div className="space-y-2 ml-6">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary mt-0.5">
                      4
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Quadratic Formula</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Derive and apply the quadratic formula for all cases
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary mt-0.5">
                      5
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Completing the Square</p>
                      <p className="text-xs text-muted-foreground mt-1">Alternative solving method and applications</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Week 3 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">Week 3: Applications & Assessment</h4>
                </div>
                <div className="space-y-2 ml-6">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary mt-0.5">
                      6
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Real-World Applications</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Projectile motion, area problems, and practical examples
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary mt-0.5">
                      7
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Review & Practice Test</p>
                      <p className="text-xs text-muted-foreground mt-1">Comprehensive review of all concepts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary mt-0.5">
                      8
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Unit Test & Assessment</p>
                      <p className="text-xs text-muted-foreground mt-1">Final evaluation of learning outcomes</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
