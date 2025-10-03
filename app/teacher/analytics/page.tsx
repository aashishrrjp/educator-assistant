"use client"

import { useState } from "react"
import { TeacherNav } from "@/components/teacher-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, Award, Clock, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AnalyticsPage() {
  const [selectedClass, setSelectedClass] = useState("all")
  const [timeRange, setTimeRange] = useState("month")

  const topPerformers = [
    { name: "Ananya Singh", score: 95, improvement: 8 },
    { name: "Diya Patel", score: 92, improvement: 5 },
    { name: "Aarav Sharma", score: 90, improvement: 3 },
  ]

  const needsAttention = [
    { name: "Arjun Kumar", score: 65, decline: -5 },
    { name: "Kabir Reddy", score: 68, decline: -3 },
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
                <h1 className="text-3xl font-bold mb-2">Analytics & Insights</h1>
                <p className="text-muted-foreground">Track student performance and engagement metrics</p>
              </div>
              <div className="flex gap-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="semester">This Semester</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Analytics Content */}
        <div className="p-8 space-y-6">
          {/* Class Filter */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Class:</span>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="10th-grade-a">10th Grade A - Mathematics</SelectItem>
                <SelectItem value="11th-grade-b">11th Grade B - Physics</SelectItem>
                <SelectItem value="9th-grade-c">9th Grade C - Mathematics</SelectItem>
                <SelectItem value="12th-grade-a">12th Grade A - Physics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Class Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">84%</div>
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +3.2% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">92%</div>
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +2.5% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Assignment Completion</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">88%</div>
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  -1.2% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Study Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">6.5h</div>
                <p className="text-xs text-muted-foreground mt-1">Per student per week</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Students showing excellent progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-green-500 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />+{student.improvement}% improvement
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-500">{student.score}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Needs Attention */}
            <Card>
              <CardHeader>
                <CardTitle>Needs Attention</CardTitle>
                <CardDescription>Students who may need extra support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {needsAttention.map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold text-sm">
                          !
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <TrendingDown className="h-3 w-3" />
                            {student.decline}% decline
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-yellow-500">{student.score}%</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full bg-transparent">
                    View All Students
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subject Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Performance</CardTitle>
              <CardDescription>Average scores across different subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">Mathematics</p>
                      <p className="text-xs text-muted-foreground">10th Grade A</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">85%</p>
                      <p className="text-xs text-green-500">+4%</p>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">Physics</p>
                      <p className="text-xs text-muted-foreground">11th Grade B</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">78%</p>
                      <p className="text-xs text-green-500">+2%</p>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "78%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">Mathematics</p>
                      <p className="text-xs text-muted-foreground">9th Grade C</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">82%</p>
                      <p className="text-xs text-red-500">-1%</p>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "82%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">Physics</p>
                      <p className="text-xs text-muted-foreground">12th Grade A</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">90%</p>
                      <p className="text-xs text-green-500">+6%</p>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "90%" }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Participation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">94%</div>
                  <p className="text-sm text-muted-foreground">Students actively participating</p>
                  <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "94%" }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Tool Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">67%</div>
                  <p className="text-sm text-muted-foreground">Students using AI learning tools</p>
                  <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: "67%" }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Doubt Clearing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">156</div>
                  <p className="text-sm text-muted-foreground">Questions asked this month</p>
                  <p className="text-xs text-green-500 mt-2">+23% from last month</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
