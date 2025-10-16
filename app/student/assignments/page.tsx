"use client";

import { useState, useEffect, type FC } from "react";
import { StudentNav } from "@/components/student-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BookOpen, CheckCircle, Clock, Loader2 } from "lucide-react";

// --- Type Definitions ---
interface Question {
  text: string;
  options: string[];
  correct: number;
}

interface UnifiedAssignment {
  id: string;
  title: string;
  subject: string;
  description?: string | null;
  dueDate: string;
  status: string;
  score?: number | null;
  totalPoints?: number | null;
  type: 'assignment' | 'quiz';
  questions?: Question[];
  studentAnswers?: Record<number, number>; // Holds the student's answers
}

const StudentAssignmentsPage: FC = () => {
  // --- State ---
  const [assignments, setAssignments] = useState<UnifiedAssignment[]>([]);
  const [filter, setFilter] = useState<'pending' | 'completed'>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuiz, setCurrentQuiz] = useState<UnifiedAssignment | null>(null);
  const [viewingSubmission, setViewingSubmission] = useState<UnifiedAssignment | null>(null); // ✨ NEW STATE
  const [studentAnswers, setStudentAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true);
      const response = await fetch('/api/student/assignments');
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      }
      setIsLoading(false);
    };
    fetchAssignments();
  }, []);

  // --- Handlers ---
  const handleStartQuiz = (quiz: UnifiedAssignment) => {
    setCurrentQuiz(quiz);
    setStudentAnswers({});
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    setStudentAnswers(prev => ({ ...prev, [questionIndex]: answerIndex }));
  };

  const handleSubmitQuiz = async () => {
    if (!currentQuiz) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/student/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: currentQuiz.id, answers: studentAnswers }),
      });

      if (!response.ok) throw new Error('Failed to submit quiz.');
      
      const submission = await response.json();
      
      setAssignments(prev => prev.map(a => 
        a.id === currentQuiz.id
          ? { ...a, status: 'COMPLETED', score: submission.score, totalPoints: submission.totalPoints, studentAnswers: submission.answers }
          : a
      ));
      
      setCurrentQuiz(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- UI Helpers ---
  const getDueDateInfo = (dueDateStr: string, status: string) => {
    if (status !== 'PENDING') return { text: `Graded`, color: 'bg-green-500/10 text-green-500' };
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { text: 'Overdue', color: 'bg-red-500/10 text-red-500 font-bold' };
    if (diffDays <= 1) return { text: 'Due Soon', color: 'bg-yellow-500/10 text-yellow-500' };
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
            <h1 className="text-3xl font-bold mb-2">My Assignments & Quizzes</h1>
            <p className="text-muted-foreground">Track your progress and complete your work.</p>
          </div>
        </header>

        <div className="p-8 space-y-6">
          <div className="flex border-b">
            <Button variant="ghost" onClick={() => setFilter('pending')} className={`rounded-none ${filter === 'pending' ? 'border-b-2 border-primary' : ''}`}><Clock className="h-4 w-4 mr-2" /> Pending ({pendingAssignments.length})</Button>
            <Button variant="ghost" onClick={() => setFilter('completed')} className={`rounded-none ${filter === 'completed' ? 'border-b-2 border-primary' : ''}`}><CheckCircle className="h-4 w-4 mr-2" /> Completed ({completedAssignments.length})</Button>
          </div>

          {isLoading ? (<p className="text-center text-muted-foreground">Loading...</p>) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayedAssignments.length === 0 && (<p className="lg:col-span-2 text-center text-muted-foreground">{filter === 'pending' ? "All caught up!" : "No completed work yet."}</p>)}
              {displayedAssignments.map(item => {
                const dueDateInfo = getDueDateInfo(item.dueDate, item.status);
                return (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${dueDateInfo.color}`}>{dueDateInfo.text}</span>
                      </div>
                      <CardDescription>{item.subject} • {item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {item.status === 'PENDING' ? (
                        <Button className="w-full" onClick={() => item.type === 'quiz' ? handleStartQuiz(item) : alert('Starting assignment...')}>
                          {item.type === 'quiz' ? 'Start Quiz' : 'Start Assignment'}
                        </Button>
                      ) : (
                        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                          <div>
                            <p className="text-xs text-muted-foreground">Your Score</p>
                            <p className={`text-2xl font-bold ${getScoreColor(item.score, item.totalPoints)}`}>{item.score ?? '-'}/{item.totalPoints ?? '-'}</p>
                          </div>
                          {/* ✨ UPDATED BUTTON */}
                          <Button variant="secondary" className="cursor-pointer" onClick={() => item.type === 'quiz' ? setViewingSubmission(item) : alert('Viewing submission...')}>View Submission</Button>
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

      {/* Quiz Attempt Modal */}
      <Dialog open={!!currentQuiz} onOpenChange={() => setCurrentQuiz(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{currentQuiz?.title}</DialogTitle>
            <DialogDescription>{currentQuiz?.description}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-6 space-y-6">
            {currentQuiz?.questions?.map((q, qIndex) => (
              <div key={qIndex} className="space-y-3">
                <p className="font-semibold">{qIndex + 1}. {q.text}</p>
                <RadioGroup onValueChange={(value) => handleAnswerChange(qIndex, parseInt(value))}>
                  {q.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-2">
                      <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                      <Label htmlFor={`q${qIndex}-o${oIndex}`} className="font-normal">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCurrentQuiz(null)}>Cancel</Button>
            <Button onClick={handleSubmitQuiz} disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Submit Quiz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* ✨ NEW: View Submission Modal */}
      <Dialog open={!!viewingSubmission} onOpenChange={() => setViewingSubmission(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Review: {viewingSubmission?.title}</DialogTitle>
            <DialogDescription>Your final score was <span className="font-bold">{viewingSubmission?.score}/{viewingSubmission?.totalPoints}</span>.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-6 space-y-6">
            {viewingSubmission?.questions?.map((q, qIndex) => {
              const studentAnswer = viewingSubmission.studentAnswers?.[qIndex];
              const correctAnswer = q.correct;
              
              return (
                <div key={qIndex} className="space-y-3">
                  <p className="font-semibold">{qIndex + 1}. {q.text}</p>
                  <div className="space-y-2">
                    {q.options.map((option, oIndex) => {
                      const isCorrect = oIndex === correctAnswer;
                      const isStudentChoice = oIndex === studentAnswer;
                      
                      let styles = "border p-2 rounded-md text-sm";
                      if (isCorrect) {
                        styles += " border-green-500 bg-green-500/10 font-medium";
                      }
                      if (isStudentChoice && !isCorrect) {
                        styles += " border-red-500 bg-red-500/10";
                      }

                      return (
                        <div key={oIndex} className={styles}>
                          {option}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button onClick={() => setViewingSubmission(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentAssignmentsPage;