"use client"

import { useState } from "react"
import { TeacherNav } from "@/components/teacher-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Sparkles, ClipboardCheck, Trash2, GripVertical } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function QuizBuilderPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [quizType, setQuizType] = useState("objective")
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "What is the solution to x² - 5x + 6 = 0?",
      options: ["x = 2, 3", "x = 1, 6", "x = -2, -3", "x = 0, 5"],
      correct: 0,
    },
  ])

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        text: "",
        options: ["", "", "", ""],
        correct: 0,
      },
    ])
  }

  const quizzes = [
    {
      id: 1,
      title: "Quadratic Equations - Mid-term Quiz",
      class: "10th Grade A",
      questions: 15,
      type: "Objective",
      status: "Active",
      submissions: 32,
      total: 38,
    },
    {
      id: 2,
      title: "Newton's Laws - Conceptual Understanding",
      class: "11th Grade B",
      questions: 10,
      type: "Subjective",
      status: "Grading",
      submissions: 42,
      total: 42,
    },
    {
      id: 3,
      title: "Geometry Basics - Practice Test",
      class: "9th Grade C",
      questions: 20,
      type: "Mixed",
      status: "Draft",
      submissions: 0,
      total: 36,
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
                <h1 className="text-3xl font-bold mb-2">Quiz Builder</h1>
                <p className="text-muted-foreground">Create and manage quizzes with AI-powered question generation</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Generate Quiz
                </Button>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Quiz
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Quiz</DialogTitle>
                      <DialogDescription>Build a custom quiz for your students</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      {/* Quiz Details */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="quiz-title">Quiz Title</Label>
                          <Input id="quiz-title" placeholder="e.g., Quadratic Equations - Mid-term Quiz" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="class">Class</Label>
                            <Input id="class" placeholder="e.g., 10th Grade A" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input id="duration" type="number" placeholder="30" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Quiz Type</Label>
                          <RadioGroup value={quizType} onValueChange={setQuizType}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="objective" id="objective" />
                              <Label htmlFor="objective" className="font-normal cursor-pointer">
                                Objective (Multiple Choice)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="subjective" id="subjective" />
                              <Label htmlFor="subjective" className="font-normal cursor-pointer">
                                Subjective (Written Answers)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="mixed" id="mixed" />
                              <Label htmlFor="mixed" className="font-normal cursor-pointer">
                                Mixed (Both Types)
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>

                      {/* Questions */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Questions</Label>
                          <Button variant="outline" size="sm" onClick={addQuestion}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Question
                          </Button>
                        </div>

                        {questions.map((question, index) => (
                          <Card key={question.id}>
                            <CardContent className="pt-6">
                              <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                  <GripVertical className="h-5 w-5 text-muted-foreground mt-2 cursor-move" />
                                  <div className="flex-1 space-y-3">
                                    <div className="space-y-2">
                                      <Label>Question {index + 1}</Label>
                                      <Textarea placeholder="Enter your question..." value={question.text} rows={2} />
                                    </div>
                                    {quizType === "objective" && (
                                      <div className="space-y-2">
                                        <Label className="text-sm">Options</Label>
                                        {question.options.map((option, optIndex) => (
                                          <div key={optIndex} className="flex items-center gap-2">
                                            <RadioGroupItem
                                              value={optIndex.toString()}
                                              checked={question.correct === optIndex}
                                            />
                                            <Input placeholder={`Option ${optIndex + 1}`} value={option} />
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setShowCreateDialog(false)}>Create Quiz</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </header>

        {/* Quiz Content */}
        <div className="p-8 space-y-6">
          {/* Quiz List */}
          <div className="grid grid-cols-1 gap-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <ClipboardCheck className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">{quiz.title}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            quiz.status === "Active"
                              ? "bg-green-500/10 text-green-500"
                              : quiz.status === "Grading"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-gray-500/10 text-gray-500"
                          }`}
                        >
                          {quiz.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span>{quiz.class}</span>
                        <span>•</span>
                        <span>{quiz.questions} questions</span>
                        <span>•</span>
                        <span>{quiz.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Submissions:</span>
                        <span className="font-medium">
                          {quiz.submissions}/{quiz.total}
                        </span>
                        <div className="flex-1 max-w-xs ml-2">
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${(quiz.submissions / quiz.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Results
                      </Button>
                      <Button size="sm">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
