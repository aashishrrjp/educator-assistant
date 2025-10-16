import { StudentNav } from "@/components/student-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, CheckCircle, TrendingUp, Video, MessageSquare } from "lucide-react"

export default function StudentDashboard() {
  return (
    <div className="flex h-screen">
      <StudentNav />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold mb-2">Welcome back, Student!</h1>
            <p className="text-muted-foreground">Here's your learning progress and upcoming tasks</p>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Assignments</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5</div>
                <p className="text-xs text-muted-foreground mt-1">2 due this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <p className="text-xs text-green-500 mt-1">+3 this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">85%</div>
                <p className="text-xs text-green-500 mt-1">+5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Study Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8.5h</div>
                <p className="text-xs text-muted-foreground mt-1">This week</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-auto py-6 flex-col gap-2 bg-transparent" variant="outline">
                <Video className="h-5 w-5" />
                <span>Generate Video</span>
              </Button>
              <Button className="h-auto py-6 flex-col gap-2 bg-transparent" variant="outline">
                <MessageSquare className="h-5 w-5" />
                <span>Ask AI Tutor</span>
              </Button>
              <Button className="h-auto py-6 flex-col gap-2 bg-transparent" variant="outline">
                <BookOpen className="h-5 w-5" />
                <span>View Assignments</span>
              </Button>
            </div>
          </div>

          {/* Pending Assignments & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Assignments */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Assignments</CardTitle>
                <CardDescription>Complete these before the deadline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg border border-border hover:border-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">Quadratic Equations Quiz</h4>
                    <span className="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded">Due Tomorrow</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Mathematics • 15 questions</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">30 minutes</span>
                    <Button size="sm">Start Quiz</Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border hover:border-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">Newton's Laws Essay</h4>
                    <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded">Due in 3 days</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Physics • Subjective</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">500 words</span>
                    <Button size="sm">Start Writing</Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border hover:border-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">Geometry Practice Test</h4>
                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">Due in 1 week</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Mathematics • 20 questions</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">45 minutes</span>
                    <Button size="sm">Start Test</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Grades */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Grades</CardTitle>
                <CardDescription>Your latest assessment results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-1">Algebra Basics Quiz</p>
                    <p className="text-xs text-muted-foreground">Mathematics • 2 days ago</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-500">92%</p>
                    <p className="text-xs text-muted-foreground">14/15</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-1">Motion & Forces Test</p>
                    <p className="text-xs text-muted-foreground">Physics • 5 days ago</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-500">88%</p>
                    <p className="text-xs text-muted-foreground">18/20</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-1">Trigonometry Assignment</p>
                    <p className="text-xs text-muted-foreground">Mathematics • 1 week ago</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-500">75%</p>
                    <p className="text-xs text-muted-foreground">15/20</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-1">Chemistry Lab Report</p>
                    <p className="text-xs text-muted-foreground">Chemistry • 1 week ago</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-500">95%</p>
                    <p className="text-xs text-muted-foreground">19/20</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subject Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Progress</CardTitle>
              <CardDescription>Your performance across different subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Mathematics</span>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Physics</span>
                    <span className="text-sm text-muted-foreground">78%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: "78%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Chemistry</span>
                    <span className="text-sm text-muted-foreground">92%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: "92%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">English</span>
                    <span className="text-sm text-muted-foreground">88%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: "88%" }} />
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
