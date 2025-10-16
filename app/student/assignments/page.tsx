"use client";

import { useState, useEffect, type FC } from "react";
import { StudentNav } from "@/components/student-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, Clock } from "lucide-react";

// Define the shape of an assignment object
interface Assignment {
  id: string;
  title: string;
  subject: string;
  description?: string | null;
  dueDate: string;
  status: string;
  score?: number | null;
  totalPoints?: number | null;
}

const StudentAssignmentsPage: FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filter, setFilter] = useState<'pending' | 'completed'>('pending');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true);
      const response = await fetch('/api/student/assignments');
      const data = await response.json();
      setAssignments(data);
      setIsLoading(false);
    };
    fetchAssignments();
  }, []);
  
  // Helper to format due date and get badge color
  const getDueDateInfo = (dueDateStr: string, status: string) => {
    if (status !== 'PENDING') return { text: `Graded`, color: 'bg-green-500/10 text-green-500' };
    
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Overdue', color: 'bg-red-500/10 text-red-500 font-bold' };
    if (diffDays === 0) return { text: 'Due Today', color: 'bg-red-500/10 text-red-500' };
    if (diffDays === 1) return { text: 'Due Tomorrow', color: 'bg-yellow-500/10 text-yellow-500' };
    return { text: `Due in ${diffDays} days`, color: 'bg-blue-500/10 text-blue-500' };
  };

  const getScoreColor = (score?: number | null, total?: number | null) => {
    if (typeof score !== 'number' || typeof total !== 'number' || total === 0) return 'text-gray-500';
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'text-green-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  const pendingAssignments = assignments.filter(a => a.status === 'PENDING');
  const completedAssignments = assignments.filter(a => a.status !== 'PENDING');

  const displayedAssignments = filter === 'pending' ? pendingAssignments : completedAssignments;

  return (
    <div className="flex h-screen">
      <StudentNav />
      <main className="flex-1 overflow-y-auto bg-background">
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold mb-2">My Assignments</h1>
            <p className="text-muted-foreground">Track your progress and stay on top of your deadlines.</p>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* Tabs */}
          <div className="flex border-b">
            <Button variant="ghost" onClick={() => setFilter('pending')} className={`rounded-none ${filter === 'pending' ? 'border-b-2 border-primary' : ''}`}>
              <Clock className="h-4 w-4 mr-2" /> Pending ({pendingAssignments.length})
            </Button>
            <Button variant="ghost" onClick={() => setFilter('completed')} className={`rounded-none ${filter === 'completed' ? 'border-b-2 border-primary' : ''}`}>
              <CheckCircle className="h-4 w-4 mr-2" /> Completed ({completedAssignments.length})
            </Button>
          </div>

          {/* Assignments List */}
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading assignments...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayedAssignments.length === 0 && (
                <p className="lg:col-span-2 text-center text-muted-foreground">
                  {filter === 'pending' ? "You have no pending assignments. Great job!" : "You have not completed any assignments yet."}
                </p>
              )}

              {displayedAssignments.map(assignment => {
                const dueDateInfo = getDueDateInfo(assignment.dueDate, assignment.status);
                return (
                  <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${dueDateInfo.color}`}>
                          {dueDateInfo.text}
                        </span>
                      </div>
                      <CardDescription>{assignment.subject} • {assignment.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {assignment.status === 'PENDING' ? (
                        <Button className="w-full">Start Assignment</Button>
                      ) : (
                        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                          <div>
                            <p className="text-xs text-muted-foreground">Your Score</p>
                            <p className={`text-2xl font-bold ${getScoreColor(assignment.score, assignment.totalPoints)}`}>
                              {assignment.score ?? '-'}/{assignment.totalPoints ?? '-'}
                            </p>
                          </div>
                          <Button variant="secondary">View Submission</Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentAssignmentsPage;