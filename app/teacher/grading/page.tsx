"use client"

import { useState } from "react"
import { TeacherNav } from "@/components/teacher-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sparkles, FileText, CheckCircle, Clock } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function GradingPage() {
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  const submissions = [
    {
      id: 1,
      quiz: "Quadratic Equations - Mid-term Quiz",
      student: "Aarav Sharma",
      rollNo: "101",
      submitted: "2 hours ago",
      type: "Objective",
      status: "graded",
      score: 14,
      total: 15,
    },
    {
      id: 2,
      quiz: "Newton's Laws - Conceptual Understanding",
      student: "Diya Patel",
      rollNo: "102",
      submitted: "1 hour ago",
      type: "Subjective",
      status: "pending",
      score: null,
      total: 20,
    },
    {
      id: 3,
      quiz: "Quadratic Equations - Mid-term Quiz",
      student: "Arjun Kumar",
      rollNo: "103",
      submitted: "3 hours ago",
      type: "Objective",
      status: "graded",
      score: 12,
      total: 15,
    },
    {
      id: 4,
      quiz: "Newton's Laws - Conceptual Understanding",
      student: "Ananya Singh",
      rollNo: "104",
      submitted: "30 minutes ago",
      type: "Subjective",
      status: "pending",
      score: null,
      total: 20,
    },
  ]

  const pendingCount = submissions.filter((s) => s.status === "pending").length
  const gradedCount = submissions.filter((s) => s.status === "graded").length

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
                <h1 className="text-3xl font-bold mb-2">Grading Center</h1>
                <p className="text-muted-foreground">Review and grade student submissions with AI assistance</p>
              </div>
              <Button>
                <Sparkles className="h-4 w-4 mr-2" />
                AI Auto-Grade All
              </Button>
            </div>
          </div>
        </header>

        {/* Grading Content */}
        <div className="p-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
                    <p className="text-3xl font-bold text-yellow-500">{pendingCount}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Graded</p>
                    <p className="text-3xl font-bold text-green-500">{gradedCount}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg. Score</p>
                    <p className="text-3xl font-bold">87%</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submissions List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Review and grade student work</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-medium">{submission.student}</span>
                        <span className="text-sm text-muted-foreground">({submission.rollNo})</span>
                        {submission.status === "pending" ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500">
                            Pending
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500">Graded</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{submission.quiz}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{submission.type}</span>
                        <span>•</span>
                        <span>Submitted {submission.submitted}</span>
                        {submission.status === "graded" && (
                          <>
                            <span>•</span>
                            <span className="font-medium text-foreground">
                              Score: {submission.score}/{submission.total}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {submission.status === "pending" && (
                        <Button size="sm" variant="outline">
                          <Sparkles className="h-4 w-4 mr-2" />
                          AI Grade
                        </Button>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">{submission.status === "pending" ? "Review" : "View"}</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {submission.student} - {submission.quiz}
                            </DialogTitle>
                            <DialogDescription>
                              Roll No: {submission.rollNo} • Submitted {submission.submitted}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6 py-4">
                            {/* Sample Question & Answer */}
                            <div className="space-y-4">
                              <div className="p-4 rounded-lg bg-accent/50 border border-border">
                                <p className="text-sm font-medium mb-2">Question 1:</p>
                                <p className="text-sm">
                                  Explain Newton's First Law of Motion and provide a real-world example.
                                </p>
                              </div>
                              <div className="p-4 rounded-lg border border-border">
                                <p className="text-sm font-medium mb-2">Student Answer:</p>
                                <p className="text-sm leading-relaxed">
                                  Newton's First Law states that an object at rest stays at rest and an object in motion
                                  stays in motion with the same speed and direction unless acted upon by an unbalanced
                                  force. For example, when a car suddenly stops, passengers continue moving forward due
                                  to inertia, which is why seatbelts are important.
                                </p>
                              </div>
                              {submission.type === "Subjective" && (
                                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                  <div className="flex items-start gap-2 mb-3">
                                    <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                                    <p className="text-sm font-medium">AI Grading Suggestion</p>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    The answer correctly defines Newton's First Law and provides a relevant real-world
                                    example. The explanation of inertia is accurate and well-connected to the example.
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Suggested Score:</span> 9/10
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Grading Section */}
                            <div className="space-y-4 pt-4 border-t border-border">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Score</label>
                                <div className="flex items-center gap-2">
                                  <Input type="number" placeholder="0" className="w-24" />
                                  <span className="text-sm text-muted-foreground">/ {submission.total}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Feedback (Optional)</label>
                                <Textarea
                                  rows={3}
                                  placeholder="Provide feedback to the student..."
                                  className="resize-none"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button variant="outline">Cancel</Button>
                            <Button>Submit Grade</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Grading Tips */}
          <Card>
            <CardHeader>
              <CardTitle>AI Grading Features</CardTitle>
              <CardDescription>How AI assists with grading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-border">
                  <CheckCircle className="h-8 w-8 text-green-500 mb-3" />
                  <h4 className="font-semibold mb-2">Objective Questions</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatically graded with 100% accuracy for multiple choice and true/false questions.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <Sparkles className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">Subjective Answers</h4>
                  <p className="text-sm text-muted-foreground">
                    AI analyzes written responses using NLP to suggest scores and provide feedback.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <FileText className="h-8 w-8 text-secondary mb-3" />
                  <h4 className="font-semibold mb-2">OCR Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Extract text from handwritten submissions for easier grading and analysis.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
