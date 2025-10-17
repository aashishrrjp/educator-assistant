"use client";

import { useState, useEffect, type FC } from "react"; // FIX: Changed import to TeacherNav
import { useRouter } from "next/navigation"; // Import the router
import { TeacherNav } from "@/components/teacher-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, ClipboardCheck, TrendingUp, Plus, Calendar, Loader2, HelpCircle } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

// --- Type Definitions for Dashboard Data ---
interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  activeQuizzes: number;
  avgAttendance: number;
}

interface ClassOverview {
  name: string;
  studentCount: number;
  subject: string;
  progress: number;
}

interface RecentActivity {
  type: string;
  description: string;
  time: string;
}

interface DashboardData {
  teacherName: string;
  stats: DashboardStats;
  classesOverview: ClassOverview[];
  recentActivity: RecentActivity[];
}

const TeacherDashboard: FC = () => {
  const router = useRouter(); // Initialize the router
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/teacher/dashboard');
        if (!response.ok) {
          throw new Error('Failed to load dashboard data.');
        }
        const responseData = await response.json();
        setData(responseData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <TeacherNav />
        <main className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
        <div className="flex h-screen">
            <TeacherNav />
            <main className="flex-1 flex items-center justify-center text-destructive">
                {error || "Could not load dashboard data."}
            </main>
        </div>
    );
  }

  return (
    <div className="flex h-screen">
      <TeacherNav />
      <main className="flex-1 overflow-y-auto bg-background">
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {data.teacherName}</h1>
              <p className="text-muted-foreground">Here's what's happening with your classes today.</p>
            </div>
            <Button asChild variant="outline" size="icon">
              <a href="https://notebooklm.google.com/notebook/065b8764-34db-4ac5-b46e-123ebfc295ea" target="_blank" rel="noopener noreferrer">
                <HelpCircle className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
              <CardContent><div className="text-3xl font-bold">{data.stats.totalStudents}</div><p className="text-xs text-muted-foreground mt-1">Across {data.stats.totalClasses} classes</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Active Quizzes</CardTitle><ClipboardCheck className="h-4 w-4 text-muted-foreground" /></CardHeader>
              <CardContent><div className="text-3xl font-bold">{data.stats.activeQuizzes}</div><p className="text-xs text-muted-foreground mt-1">Ready for students</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Avg. Attendance</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader>
              <CardContent><div className="text-3xl font-bold">{data.stats.avgAttendance}%</div><p className="text-xs text-muted-foreground mt-1">This semester</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Curriculum Progress</CardTitle><BookOpen className="h-4 w-4 text-muted-foreground" /></CardHeader>
              <CardContent><div className="text-3xl font-bold">~{Math.round(data.classesOverview.reduce((acc, c) => acc + c.progress, 0) / data.classesOverview.length)}%</div><p className="text-xs text-muted-foreground mt-1">Average across classes</p></CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-auto py-6 flex-col gap-2 cursor-pointer" variant="outline" onClick={() => router.push('/teacher/quiz')}>
                <Plus className="h-5 w-5" />
                <span>Create Quiz</span>
              </Button>
              <Button className="h-auto py-6 flex-col gap-2 cursor-pointer" variant="outline" onClick={() => router.push('/teacher/attendance')}>
                <Users className="h-5 w-5" />
                <span>Mark Attendance</span>
              </Button>
              <Button className="h-auto py-6 flex-col gap-2 cursor-pointer" variant="outline" onClick={() => router.push('/teacher/curriculum')}>
                <BookOpen className="h-5 w-5" />
                <span>Plan Lesson</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Recent Activity</CardTitle><CardDescription>Latest updates from your classes</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                {data.recentActivity.length > 0 ? data.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.type}</p>
                      <p className="text-xs text-muted-foreground">{activity.description} - {formatDistanceToNow(new Date(activity.time))} ago</p>
                    </div>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No recent activity to show.</p>}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader><CardTitle>Today's Schedule</CardTitle><CardDescription>Your classes for today (Demo)</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-lg border border-border">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1"><p className="text-sm font-medium">10th Grade A - Mathematics</p><span className="text-xs text-muted-foreground">9:00 AM</span></div>
                    <p className="text-xs text-muted-foreground">Room 204 • Quadratic Equations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Your Classes</CardTitle><CardDescription>Overview of all your teaching assignments</CardDescription></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.classesOverview.map(cls => (
                  <div key={cls.name} className="p-4 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-3"><h3 className="font-semibold">{cls.name}</h3><span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{cls.studentCount} students</span></div>
                    <p className="text-sm text-muted-foreground mb-2">{cls.subject}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex-1 bg-secondary rounded-full h-1.5"><div className="bg-primary h-1.5 rounded-full" style={{ width: `${cls.progress}%` }} /></div>
                      <span>{cls.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;