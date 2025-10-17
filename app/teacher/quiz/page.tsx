"use client";

import { useState, useEffect, type FC } from "react";
import { TeacherNav } from "@/components/teacher-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Sparkles, ClipboardCheck, Users, Loader2, Trash2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Type Definitions ---
interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
}

interface Submission {
  id: string;
  score: number;
  totalPoints: number;
  submittedAt: string;
  student: {
    name: string;
    email: string;
  };
}

interface Quiz {
  id: string;
  title: string;
  subject: string;
  className: string;
  questions: Question[];
  submissionCount: number;
}

const QuizBuilderPage: FC = () => {
  // --- State Management ---
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [viewingResultsQuiz, setViewingResultsQuiz] = useState<Quiz | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States for modals
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizSubject, setQuizSubject] = useState("");
  const [quizClassName, setQuizClassName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [aiSubject, setAiSubject] = useState("");
  const [aiTopics, setAiTopics] = useState("");
  const [aiNumQuestions, setAiNumQuestions] = useState(5);
  const [aiDifficulty, setAiDifficulty] = useState("easy");
  const [isGenerating, setIsGenerating] = useState(false);

  // --- Data Fetching ---
  const fetchQuizzes = async () => {
    setIsLoadingQuizzes(true);
    try {
      const response = await fetch('/api/quiz/generate');
      if (!response.ok) throw new Error('Failed to fetch quizzes');
      const data = await response.json();
      setQuizzes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingQuizzes(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // --- Event Handlers ---
  const handleViewResults = async (quiz: Quiz) => {
    setViewingResultsQuiz(quiz);
    setIsLoadingSubmissions(true);
    setError(null);
    try {
      const response = await fetch(`/api/teacher/quiz/results?quizId=${quiz.id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch submissions.");
      }
      const data = await response.json();
      setSubmissions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quiz_type: "objective",
          total_questions: aiNumQuestions,
          subject: aiSubject,
          difficulty: aiDifficulty,
          topics: aiTopics.split(',').map(topic => topic.trim()).filter(Boolean),
        }),
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || 'Failed to generate quiz.');

      const formattedQuestions = responseData.map((q: any, index: number) => ({ ...q, id: Date.now() + index }));
      setQuestions(formattedQuestions);
      setQuizTitle(`AI Quiz: ${aiSubject} - ${aiTopics}`);
      setQuizSubject(aiSubject);
      setShowAiDialog(false);
      setShowCreateDialog(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQuiz = async () => {
    if (!quizClassName || !quizTitle || !quizSubject) {
      setError("Title, Subject, and Class Name are required.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: quizTitle,
          subject: quizSubject,
          className: quizClassName,
          questions: questions,
        }),
      });
      const newQuiz = await response.json();
      if (!response.ok) throw new Error(newQuiz.message || 'Failed to save quiz.');

      await fetchQuizzes();
      setShowCreateDialog(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Manual Question Handlers ---
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      text: "",
      options: ["", "", "", ""],
      correct: 0,
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const handleQuestionChange = (id: number, field: 'text' | 'option' | 'correct', value: string | number, optionIndex?: number) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== id) return q;
      if (field === 'text') return { ...q, text: value as string };
      if (field === 'correct') return { ...q, correct: value as number };
      if (field === 'option' && optionIndex !== undefined) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value as string;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleDeleteQuestion = (id: number) => setQuestions(prev => prev.filter(q => q.id !== id));


  return (
    <div className="flex h-screen bg-background">
      <TeacherNav />
      <main className="flex-1 overflow-y-auto">
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Quiz Builder</h1>
              <p className="text-muted-foreground">Create, manage, and review quizzes.</p>
            </div>
            <div className="flex gap-3">
              <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
                <DialogTrigger asChild><Button variant="outline"><Sparkles className="h-4 w-4 mr-2" />AI Generate Quiz</Button></DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader><DialogTitle>Generate Quiz with AI</DialogTitle><DialogDescription>Describe the quiz you want to create.</DialogDescription></DialogHeader>
                  <form onSubmit={handleGenerateQuiz} className="space-y-4 py-4">
                    <div className="space-y-2"><Label htmlFor="ai-subject">Subject</Label><Input id="ai-subject" placeholder="e.g., Chemistry" value={aiSubject} onChange={e => setAiSubject(e.target.value)} required /></div>
                    <div className="space-y-2"><Label htmlFor="ai-topics">Topics (comma-separated)</Label><Input id="ai-topics" placeholder="e.g., Acids, Bases, Salts" value={aiTopics} onChange={e => setAiTopics(e.target.value)} required /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label htmlFor="ai-num-questions"># of Questions</Label><Input id="ai-num-questions" type="number" min="1" max="20" value={aiNumQuestions} onChange={e => setAiNumQuestions(parseInt(e.target.value, 10))} required/></div>
                      <div className="space-y-2"><Label htmlFor="ai-difficulty">Difficulty</Label><Select value={aiDifficulty} onValueChange={setAiDifficulty}><SelectTrigger id="ai-difficulty"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem></SelectContent></Select></div>
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <DialogFooter><Button type="submit" disabled={isGenerating}>{isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : "Generate"}</Button></DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild><Button onClick={() => { setQuestions([]); setQuizTitle(""); setQuizSubject(""); setQuizClassName(""); setError(null); setShowCreateDialog(true); }}><Plus className="h-4 w-4 mr-2" />Create Quiz</Button></DialogTrigger>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>Create New Quiz</DialogTitle><DialogDescription>Build a custom quiz for your students.</DialogDescription></DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label htmlFor="quiz-title">Quiz Title</Label><Input id="quiz-title" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="e.g., Algebra Mid-Term" /></div>
                      <div className="space-y-2"><Label htmlFor="quiz-subject">Subject</Label><Input id="quiz-subject" value={quizSubject} onChange={(e) => setQuizSubject(e.target.value)} placeholder="e.g., Mathematics" /></div>
                      <div className="space-y-2 col-span-2"><Label htmlFor="quiz-class">Class Name</Label><Input id="quiz-class" placeholder="e.g., 10th Grade - Section A" value={quizClassName} onChange={(e) => setQuizClassName(e.target.value)} required/></div>
                    </div>
                    {/* --- FIX STARTS HERE: Interactive Question Editor --- */}
                    <div className="space-y-2">
                        <Label>Questions ({questions.length})</Label>
                        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-4 border-t pt-4">
                            {questions.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">Click "Add Question" to start building your quiz.</p>
                            )}
                            {questions.map((question, index) => (
                            <Card key={question.id}>
                                <CardContent className="pt-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor={`q-text-${question.id}`} className="font-medium">Question {index + 1}</Label>
                                    <Button variant="ghost" size="icon" className="text-destructive h-7 w-7" onClick={() => handleDeleteQuestion(question.id)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                                <Textarea id={`q-text-${question.id}`} placeholder="Enter question text..." value={question.text} onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)} />
                                <RadioGroup value={String(question.correct)} onValueChange={(val) => handleQuestionChange(question.id, 'correct', parseInt(val, 10))} className="space-y-2 pt-2">
                                    {question.options.map((opt, optIndex) => (
                                    <div key={optIndex} className="flex items-center gap-3">
                                        <RadioGroupItem value={String(optIndex)} id={`q-${question.id}-opt-${optIndex}`} />
                                        <Input placeholder={`Option ${optIndex + 1}`} value={opt} onChange={(e) => handleQuestionChange(question.id, 'option', e.target.value, optIndex)} />
                                    </div>
                                    ))}
                                </RadioGroup>
                                </CardContent>
                            </Card>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4" onClick={handleAddQuestion}><Plus className="h-4 w-4 mr-2" />Add Question</Button>
                    </div>
                    {/* --- FIX ENDS HERE --- */}
                  </div>
                  <DialogFooter>
                    {error && <p className="text-sm text-destructive mr-auto">{error}</p>}
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveQuiz} disabled={isSaving}>{isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Quiz"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {isLoadingQuizzes ? (<div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>) : 
            (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="flex flex-col hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div className="cursor-pointer" onClick={() => setSelectedQuiz(quiz)}>
                      <div className="flex items-center gap-3 mb-2"><ClipboardCheck className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold">{quiz.title}</h3></div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span>{quiz.className}</span><span>•</span><span>{quiz.subject}</span><span>•</span><span>{Array.isArray(quiz.questions) ? quiz.questions.length : 0} questions</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4 mt-4">
                      <div className="flex items-center gap-2"><Users className="h-4 w-4" /><span>{quiz.submissionCount} Submissions</span></div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewResults(quiz)}>View Results</Button>
                        <Button size="sm" onClick={() => setSelectedQuiz(quiz)}>View Quiz</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>)
          }
        </div>
      </main>

      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedQuiz && (<>
            <DialogHeader><DialogTitle>{selectedQuiz.title}</DialogTitle><DialogDescription>{selectedQuiz.className} • {selectedQuiz.subject} • {selectedQuiz.questions.length} Questions</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
              {selectedQuiz.questions.map((question, index) => (
                <Card key={index}><CardContent className="pt-6"><p className="font-semibold mb-3">Question {index + 1}: {question.text}</p>
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className={`p-2 border rounded-md text-sm ${question.correct === optIndex ? 'border-green-500 bg-green-500/10 text-green-700 font-medium' : 'border-border'}`}>{option}</div>
                    ))}
                  </div>
                </CardContent></Card>
              ))}
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setSelectedQuiz(null)}>Close</Button></DialogFooter>
          </>)}
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingResultsQuiz} onOpenChange={() => setViewingResultsQuiz(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Results for: {viewingResultsQuiz?.title}</DialogTitle>
            <DialogDescription>Review student submissions and grades for this quiz.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {isLoadingSubmissions ? (<div className="flex justify-center items-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>)
            : error ? (<p className="text-center text-destructive py-8">{error}</p>)
            : submissions.length === 0 ? (<p className="text-center text-muted-foreground py-8">No students have submitted this quiz yet.</p>)
            : (
              <Table>
                <TableHeader><TableRow><TableHead>Student Name</TableHead><TableHead>Email</TableHead><TableHead>Submitted At</TableHead><TableHead className="text-right">Score</TableHead></TableRow></TableHeader>
                <TableBody>
                  {submissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{sub.student.name}</TableCell>
                      <TableCell>{sub.student.email}</TableCell>
                      <TableCell>{new Date(sub.submittedAt).toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">{sub.score}/{sub.totalPoints}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setViewingResultsQuiz(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizBuilderPage;

