import { TeacherNav } from "@/components/teacher-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, ClipboardCheck, TrendingUp, Plus, Calendar } from "lucide-react"

export default function TeacherDashboard() {
  return (
    <div className="flex h-screen">
      <TeacherNav />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold mb-2">Welcome back, Dr. Priya Sharma</h1>
            <p className="text-muted-foreground">Here's what's happening with your classes today</p>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">156</div>
                <p className="text-xs text-muted-foreground mt-1">Across 4 classes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Quizzes</CardTitle>
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8</div>
                <p className="text-xs text-muted-foreground mt-1">3 pending grading</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Attendance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">92%</div>
                <p className="text-xs text-green-500 mt-1">+2.5% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Curriculum Progress</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground mt-1">On track for semester</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-auto py-6 flex-col gap-2 bg-transparent cursor-pointer" variant="outline">
                <Plus className="h-5 w-5" />
                <span>Create Quiz</span>
              </Button>
              <Button className="h-auto py-6 flex-col gap-2 bg-transparent cursor-pointer" variant="outline">
                <Users className="h-5 w-5" />
                <span>Mark Attendance</span>
              </Button>
              <Button className="h-auto py-6 flex-col gap-2 bg-transparent cursor-pointer" variant="outline">
                <BookOpen className="h-5 w-5" />
                <span>Plan Lesson</span>
              </Button>
            </div>
          </div>

          {/* Recent Activity & Upcoming */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your classes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Quiz submitted by 10th Grade A</p>
                    <p className="text-xs text-muted-foreground">
                      32 students completed "Algebra Basics" - 2 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Attendance marked for 9th Grade B</p>
                    <p className="text-xs text-muted-foreground">28/30 students present - 4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New curriculum plan created</p>
                    <p className="text-xs text-muted-foreground">Physics Chapter 5: Thermodynamics - Yesterday</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Grading completed for 11th Grade</p>
                    <p className="text-xs text-muted-foreground">Midterm exam results published - 2 days ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Classes */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your classes for today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">10th Grade A - Mathematics</p>
                      <span className="text-xs text-muted-foreground">9:00 AM</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Room 204 • Quadratic Equations</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 rounded-lg border border-border">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">11th Grade B - Physics</p>
                      <span className="text-xs text-muted-foreground">11:00 AM</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Lab 3 • Newton's Laws Practical</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 rounded-lg border border-border">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">9th Grade C - Mathematics</p>
                      <span className="text-xs text-muted-foreground">2:00 PM</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Room 201 • Geometry Basics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Classes Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Your Classes</CardTitle>
              <CardDescription>Overview of all your teaching assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">10th Grade A</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">38 students</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Mathematics</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex-1 bg-secondary rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: "75%" }} />
                    </div>
                    <span>75%</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">11th Grade B</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">42 students</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Physics</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex-1 bg-secondary rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: "62%" }} />
                    </div>
                    <span>62%</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">9th Grade C</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">36 students</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Mathematics</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex-1 bg-secondary rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: "58%" }} />
                    </div>
                    <span>58%</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">12th Grade A</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">40 students</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Physics</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex-1 bg-secondary rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: "82%" }} />
                    </div>
                    <span>82%</span>
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
