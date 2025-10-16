"use client";

import { useState, useEffect, type FC } from "react";
import { TeacherNav } from "@/components/teacher-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Upload, Camera, Check, X, Download, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Type for a single student's attendance data from the API
interface StudentAttendance {
  id: string;
  name: string;
  rollNo: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

// Type for the local attendance state map
type AttendanceMap = {
  [studentId: string]: 'PRESENT' | 'ABSENT' | 'LATE';
};

const TeacherAttendancePage: FC = () => {
  const [teacherClasses, setTeacherClasses] = useState<string[]>([]); // Holds classes assigned to the teacher
  const [selectedClass, setSelectedClass] = useState(""); // Default is now empty, will be set dynamically
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [attendance, setAttendance] = useState<AttendanceMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // --- NEW STATE FOR THE EXPORT MODAL ---
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportDate, setExportDate] = useState(selectedDate);

  // 1. First, fetch the teacher's assigned classes to populate the dropdown
  useEffect(() => {
    const fetchTeacherClasses = async () => {
      try {
        const response = await fetch('/api/teacher/my-classes');
        const classes: string[] = await response.json();
        setTeacherClasses(classes);
        // If the teacher has classes, select the first one by default
        if (classes.length > 0) {
          setSelectedClass(classes[0]);
        }
      } catch (error) {
        console.error("Failed to fetch teacher's classes", error);
      }
    };
    fetchTeacherClasses();
  }, []); // Runs once on component mount

  // 2. Then, fetch attendance data whenever the selected class or date changes
  useEffect(() => {
    // Don't fetch if no class is selected yet
    if (!selectedClass) {
      setIsLoading(false);
      return;
    }

    const fetchAttendance = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/teacher/attendance?className=${selectedClass}&date=${selectedDate}`);
        const data: StudentAttendance[] = await response.json();
        setStudents(data);
        
        // Initialize the local attendance state from the fetched data
        const initialAttendance = data.reduce((acc, student) => {
          acc[student.id] = student.status;
          return acc;
        }, {} as AttendanceMap);
        setAttendance(initialAttendance);

      } catch (error) {
        console.error("Failed to fetch attendance data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendance();
  }, [selectedClass, selectedDate]); // Re-runs when these dependencies change

  
  // Handle saving the attendance changes to the database
  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/teacher/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className: selectedClass,
          date: selectedDate,
          attendance: attendance,
        }),
      });
      // You can add a success message (e.g., a toast) here
    } catch (error) {
      console.error("Failed to save attendance", error);
      // You can add an error message (e.g., a toast) here
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/teacher/attendance/export?className=${selectedClass}&date=${exportDate}`);
      if (!response.ok) {
        throw new Error('Failed to download file.');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-${selectedClass}-${exportDate}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setIsExportModalOpen(false); // Close modal on success
    } catch (error) {
      console.error("Export failed", error);
      // Optionally show an error message
    }
  };

  // Helper to format class names for display
  const formatClassName = (name: string) => name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Calculate stats dynamically from the current attendance state
  const stats = {
    present: Object.values(attendance).filter((s) => s === "PRESENT").length,
    absent: Object.values(attendance).filter((s) => s === "ABSENT").length,
    late: Object.values(attendance).filter((s) => s === "LATE").length,
    total: students.length,
  };
  const attendanceRate = stats.total > 0 ? Math.round(((stats.present + stats.late) / stats.total) * 100) : 0;

  return (
    <div className="flex h-screen">
      <TeacherNav />
      <main className="flex-1 overflow-y-auto bg-background">
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Attendance Management</h1>
                <p className="text-muted-foreground">Track student attendance for your classes</p>
              </div>
              <div className="flex gap-3">
                {/* <Button variant="outline"><Upload className="h-4 w-4 mr-2" />Upload</Button>
                <Button variant="outline"><Camera className="h-4 w-4 mr-2" />Scan</Button> */}
                
                {/* --- UPDATE: EXPORT BUTTON TRIGGERS THE MODAL --- */}
                <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
                  <DialogTrigger asChild>
                    <Button><Download className="h-4 w-4 mr-2" />Export</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Export Attendance Sheet</DialogTitle>
                      <DialogDescription>
                        Select the class and date to download the attendance sheet for present students.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Class</Label>
                        <p className="px-3 py-2 text-sm rounded-md border bg-muted">{formatClassName(selectedClass)}</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="export-date">Date</Label>
                        <Input id="export-date" type="date" value={exportDate} onChange={(e) => setExportDate(e.target.value)} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsExportModalOpen(false)}>Cancel</Button>
                      <Button onClick={handleExport}>Download Sheet</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* Controls with Dynamic Dropdown */}
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <Select value={selectedClass} onValueChange={setSelectedClass} disabled={teacherClasses.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {teacherClasses.map(className => (
                    <SelectItem key={className} value={className}>
                      {formatClassName(className)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-3 py-2 rounded-md border border-input bg-background text-sm" />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">Present</p><p className="text-3xl font-bold text-green-500">{stats.present}</p></div><Check className="h-8 w-8 text-green-500" /></div></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">Absent</p><p className="text-3xl font-bold text-red-500">{stats.absent}</p></div><X className="h-8 w-8 text-red-500" /></div></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">Late</p><p className="text-3xl font-bold text-yellow-500">{stats.late}</p></div><Calendar className="h-8 w-8 text-yellow-500" /></div></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">Attendance Rate</p><p className="text-3xl font-bold">{attendanceRate}%</p></div></div></CardContent></Card>
          </div>

          {/* Attendance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Mark Attendance</CardTitle>
              {selectedClass && <CardDescription>{formatClassName(selectedClass)} • {new Date(selectedDate).toDateString()}</CardDescription>}
            </CardHeader>
            <CardContent>
              {isLoading ? (<p className="text-center text-muted-foreground py-10">Loading students...</p>) :
               students.length === 0 ? (<p className="text-center text-muted-foreground py-10">No students found for this class. Please assign students or select a different class.</p>) :
              (<div className="space-y-2">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50">
                    <div className="flex items-center gap-4"><span className="text-sm text-muted-foreground w-12">{student.rollNo}</span><span className="font-medium">{student.name}</span></div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant={attendance[student.id] === "PRESENT" ? "default" : "outline"} onClick={() => setAttendance({ ...attendance, [student.id]: "PRESENT" })} className={attendance[student.id] === "PRESENT" ? "bg-green-500 hover:bg-green-600" : ""}><Check className="h-4 w-4 mr-1" />Present</Button>
                      <Button size="sm" variant={attendance[student.id] === "LATE" ? "default" : "outline"} onClick={() => setAttendance({ ...attendance, [student.id]: "LATE" })} className={attendance[student.id] === "LATE" ? "bg-yellow-500 hover:bg-yellow-600" : ""}><Calendar className="h-4 w-4 mr-1" />Late</Button>
                      <Button size="sm" variant={attendance[student.id] === "ABSENT" ? "default" : "outline"} onClick={() => setAttendance({ ...attendance, [student.id]: "ABSENT" })} className={attendance[student.id] === "ABSENT" ? "bg-red-500 hover:bg-red-600" : ""}><X className="h-4 w-4 mr-1" />Absent</Button>
                    </div>
                  </div>
                ))}
              </div>)}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveAttendance} disabled={isSaving || students.length === 0}>
                  {isSaving ? "Saving..." : <><Save className="h-4 w-4 mr-2" />Save Attendance</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeacherAttendancePage;