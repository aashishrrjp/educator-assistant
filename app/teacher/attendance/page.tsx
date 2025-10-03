"use client"

import { useState } from "react"
import { TeacherNav } from "@/components/teacher-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Upload, Camera, Check, X, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState("10th-grade-a")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  const students = [
    { id: 1, name: "Aarav Sharma", rollNo: "101", status: "present" },
    { id: 2, name: "Diya Patel", rollNo: "102", status: "present" },
    { id: 3, name: "Arjun Kumar", rollNo: "103", status: "absent" },
    { id: 4, name: "Ananya Singh", rollNo: "104", status: "present" },
    { id: 5, name: "Rohan Verma", rollNo: "105", status: "present" },
    { id: 6, name: "Priya Gupta", rollNo: "106", status: "present" },
    { id: 7, name: "Kabir Reddy", rollNo: "107", status: "late" },
    { id: 8, name: "Ishaan Mehta", rollNo: "108", status: "present" },
  ]

  const [attendance, setAttendance] = useState(
    students.reduce(
      (acc, student) => ({
        ...acc,
        [student.id]: student.status,
      }),
      {},
    ),
  )

  const stats = {
    present: Object.values(attendance).filter((s) => s === "present").length,
    absent: Object.values(attendance).filter((s) => s === "absent").length,
    late: Object.values(attendance).filter((s) => s === "late").length,
    total: students.length,
  }

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
                <h1 className="text-3xl font-bold mb-2">Attendance Management</h1>
                <p className="text-muted-foreground">Track and manage student attendance with multiple input methods</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Spreadsheet
                </Button>
                <Button variant="outline">
                  <Camera className="h-4 w-4 mr-2" />
                  Scan Image
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Attendance Content */}
        <div className="p-8 space-y-6">
          {/* Controls */}
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10th-grade-a">10th Grade A - Mathematics</SelectItem>
                  <SelectItem value="11th-grade-b">11th Grade B - Physics</SelectItem>
                  <SelectItem value="9th-grade-c">9th Grade C - Mathematics</SelectItem>
                  <SelectItem value="12th-grade-a">12th Grade A - Physics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 rounded-md border border-border bg-background text-sm"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Present</p>
                    <p className="text-3xl font-bold text-green-500">{stats.present}</p>
                  </div>
                  <Check className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Absent</p>
                    <p className="text-3xl font-bold text-red-500">{stats.absent}</p>
                  </div>
                  <X className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Late</p>
                    <p className="text-3xl font-bold text-yellow-500">{stats.late}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Attendance Rate</p>
                    <p className="text-3xl font-bold">
                      {Math.round(((stats.present + stats.late) / stats.total) * 100)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Mark Attendance</CardTitle>
              <CardDescription>10th Grade A - Mathematics • {selectedDate}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground w-12">{student.rollNo}</span>
                      <span className="font-medium">{student.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={attendance[student.id] === "present" ? "default" : "outline"}
                        onClick={() => setAttendance({ ...attendance, [student.id]: "present" })}
                        className={attendance[student.id] === "present" ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={attendance[student.id] === "late" ? "default" : "outline"}
                        onClick={() => setAttendance({ ...attendance, [student.id]: "late" })}
                        className={attendance[student.id] === "late" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Late
                      </Button>
                      <Button
                        size="sm"
                        variant={attendance[student.id] === "absent" ? "default" : "outline"}
                        onClick={() => setAttendance({ ...attendance, [student.id]: "absent" })}
                        className={attendance[student.id] === "absent" ? "bg-red-500 hover:bg-red-600" : ""}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Absent
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
                <Button variant="outline">Cancel</Button>
                <Button>Save Attendance</Button>
              </div>
            </CardContent>
          </Card>

          {/* Attendance History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance Records</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: "2025-01-09", present: 36, absent: 2, rate: 95 },
                  { date: "2025-01-08", present: 35, absent: 3, rate: 92 },
                  { date: "2025-01-07", present: 37, absent: 1, rate: 97 },
                  { date: "2025-01-06", present: 34, absent: 4, rate: 89 },
                  { date: "2025-01-05", present: 36, absent: 2, rate: 95 },
                ].map((record) => (
                  <div
                    key={record.date}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{record.date}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-green-500">
                        {record.present} <span className="text-muted-foreground">present</span>
                      </span>
                      <span className="text-red-500">
                        {record.absent} <span className="text-muted-foreground">absent</span>
                      </span>
                      <span className="font-medium">{record.rate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
