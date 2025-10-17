"use client";

import { useState, useEffect, type FC } from "react";
import { useRouter } from "next/navigation";
import { StudentNav } from "@/components/student-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, CheckCircle, TrendingUp, Video, MessageSquare, Loader2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

// --- Type Definitions for Dashboard Data ---
interface Stats {
  activeAssignments: number;
  completedAssignments: number;
  avgScore: number;
}
interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  type: 'assignment' | 'quiz';
  score?: number;
  totalPoints?: number;
}
interface SubjectProgress {
  name: string;
  avg: number;
}
interface DashboardData {
  studentName: string;
  stats: Stats;
  pendingAssignments: Assignment[];
  recentGrades: Assignment[];
  subjectProgress: SubjectProgress[];
}

const StudentDashboard: FC = () => {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/student/dashboard');
        if (!response.ok) throw new Error('Failed to load dashboard data.');
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

  const getDueDateInfo = (dueDateStr: string) => {
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    // Reset time part to compare dates only
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Overdue', color: 'bg-red-500/10 text-red-500 font-bold' };
    if (diffDays === 0) return { text: 'Due Today', color: 'bg-red-500/10 text-red-500' };
    if (diffDays === 1) return { text: 'Due Tomorrow', color: 'bg-yellow-500/10 text-yellow-500' };
    return { text: `Due in ${diffDays} days`, color: 'bg-blue-500/10 text-blue-500' };
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (isLoading) {
    return (
      <div className="flex h-screen"><StudentNav /><main className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></main></div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen"><StudentNav /><main className="flex-1 flex items-center justify-center text-destructive">{error || "Could not load dashboard data."}</main></div>
    );
  }

  return (
    <div className="flex h-screen">
      <StudentNav />
      <main className="flex-1 overflow-y-auto bg-background">
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {data.studentName}!</h1>
            <p className="text-muted-foreground">Here's your learning progress and upcoming tasks.</p>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Active Assignments</CardTitle><BookOpen className="h-4 w-4 text-muted-foreground" /></CardHeader>
              <CardContent><div className="text-3xl font-bold">{data.stats.activeAssignments}</div><p className="text-xs text-muted-foreground mt-1">Check the list below</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Completed</CardTitle><CheckCircle className="h-4 w-4 text-muted-foreground" /></CardHeader>
              <CardContent><div className="text-3xl font-bold">{data.stats.completedAssignments}</div><p className="text-xs text-muted-foreground mt-1">tasks and quizzes</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Avg. Score</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader>
              <CardContent><div className={`text-3xl font-bold ${getScoreColor(data.stats.avgScore)}`}>{data.stats.avgScore}%</div><p className="text-xs text-muted-foreground mt-1">across all subjects</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Study Time</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader>
              <CardContent><div className="text-3xl font-bold">8.5hr ~</div><p className="text-xs text-muted-foreground mt-1">This week</p></CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-auto py-6 flex-col gap-2 cursor-pointer" variant="outline" onClick={() => router.push('/student/concept-illustrator')}><Video className="h-5 w-5" /><span>Concept Illustrator</span></Button>
              <Button className="h-auto py-6 flex-col gap-2 cursor-pointer" variant="outline" onClick={() => router.push('/student/chatbot')}><MessageSquare className="h-5 w-5" /><span>Ask AI Tutor</span></Button>
              <Button className="h-auto py-6 flex-col gap-2 cursor-pointer" variant="outline" onClick={() => router.push('/student/assignments')}><BookOpen className="h-5 w-5" /><span>View All Assignments</span></Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Pending Assignments</CardTitle><CardDescription>Complete these before the deadline</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                {data.pendingAssignments.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">You're all caught up!</p> : data.pendingAssignments.map(item => {
                  const dueDateInfo = getDueDateInfo(item.dueDate);
                  return (
                    <div key={item.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => router.push('/student/assignments')}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{item.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${dueDateInfo.color}`}>{dueDateInfo.text}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{item.subject} • {item.description}</p>
                      <div className="flex items-center justify-end"><Button size="sm">Start {item.type === 'quiz' ? 'Quiz' : 'Assignment'}</Button></div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Recent Grades</CardTitle><CardDescription>Your latest assessment results</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                {data.recentGrades.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No graded assignments yet.</p> : data.recentGrades.map(item => {
                  const percentage = item.totalPoints ? Math.round(((item.score || 0) / item.totalPoints) * 100) : 0;
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-1">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.subject} • Graded {formatDistanceToNow(new Date(item.dueDate))} ago</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getScoreColor(percentage)}`}>{percentage}%</p>
                        <p className="text-xs text-muted-foreground">{item.score}/{item.totalPoints}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Subject Progress</CardTitle><CardDescription>Your average performance across subjects</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.subjectProgress.length === 0 ? <p className="text-sm text-muted-foreground">Complete some assignments to see your progress.</p> : data.subjectProgress.map(subject => (
                  <div key={subject.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{subject.name}</span>
                      <span className="text-sm text-muted-foreground">{subject.avg}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${subject.avg}%` }} />
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

export default StudentDashboard;

