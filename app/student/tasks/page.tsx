"use client"

import { useState } from "react"
import { StudentNav } from "@/components/student-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Check, Trash2, Calendar } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function TasksPage() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete Quadratic Equations Quiz", completed: false, dueDate: "Tomorrow", priority: "high" },
    { id: 2, title: "Review Newton's Laws notes", completed: false, dueDate: "Today", priority: "medium" },
    { id: 3, title: "Practice Geometry problems", completed: true, dueDate: "Yesterday", priority: "low" },
    { id: 4, title: "Submit Physics lab report", completed: false, dueDate: "In 3 days", priority: "high" },
    { id: 5, title: "Read Chapter 5 - Thermodynamics", completed: false, dueDate: "In 5 days", priority: "medium" },
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const pendingTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  return (
    <div className="flex h-screen">
      <StudentNav />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
                <p className="text-muted-foreground">Organize and track your study tasks and goals</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </header>

        {/* Tasks Content */}
        <div className="p-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pending Tasks</p>
                    <p className="text-3xl font-bold">{pendingTasks.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Completed</p>
                    <p className="text-3xl font-bold text-green-500">{completedTasks.length}</p>
                  </div>
                  <Check className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
                    <p className="text-3xl font-bold">{Math.round((completedTasks.length / tasks.length) * 100)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Task */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input placeholder="What do you need to do?" className="flex-1" />
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
              <CardDescription>Tasks you need to complete</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {task.dueDate}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            task.priority === "high"
                              ? "bg-red-500/10 text-red-500"
                              : task.priority === "medium"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-green-500/10 text-green-500"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Completed Tasks</CardTitle>
                <CardDescription>Well done! Keep up the good work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border bg-accent/20 opacity-60"
                    >
                      <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
                      <div className="flex-1">
                        <p className="font-medium line-through">{task.title}</p>
                        <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
