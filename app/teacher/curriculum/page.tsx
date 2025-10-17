"use client";

import { useState, useEffect, type FC } from "react";
import { TeacherNav } from "@/components/teacher-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Sparkles, Loader2, Bot, Eye } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prisma } from "@prisma/client";

// --- Type Definitions ---
type LessonPlan = Prisma.LessonPlanGetPayload<{}> | null;

interface Curriculum {
  id: string;
  title: string;
  subject: string;
  grade: string;
  duration?: string | null;
  content: string;
  lessonPlan?: LessonPlan;
}

const CurriculumPage: FC = () => {
  // --- State Management ---
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // AI Curriculum Generation States
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({ subject: "", grade: "", topic: "", duration: "" });

  // AI Lesson Plan Generation State
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [showLessonPlanDialog, setShowLessonPlanDialog] = useState(false);


  // --- Data Fetching ---
  const fetchCurriculums = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // The API route for fetching all curriculums
      const response = await fetch('/api/curriculum/generated');
      if (!response.ok) throw new Error('Failed to fetch curriculums.');
      const data: Curriculum[] = await response.json();
      setCurriculums(data);
      
      if (selectedCurriculum) {
        // After an update (like generating a lesson plan), find the fresh data for the selected curriculum
        setSelectedCurriculum(data.find(c => c.id === selectedCurriculum.id) || data[0] || null);
      } else if (data.length > 0) {
        // On initial load, select the first curriculum by default
        setSelectedCurriculum(data[0]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculums();
  }, []);


  // --- Event Handlers ---
  const handleGenerateCurriculum = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/curriculum/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate curriculum.');
      }
      const newCurriculum = await response.json();
      await fetchCurriculums();
      setSelectedCurriculum(newCurriculum);
      setShowAIDialog(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleGenerateLessonPlan = async () => {
    if (!selectedCurriculum) return;

    setIsGeneratingPlan(true);
    setError(null);
    try {
      const response = await fetch('/api/curriculum/lesson-plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          curriculumId: selectedCurriculum.id,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate lesson plan.');
      }
      await fetchCurriculums(); // Refetch all data to get the newly attached lesson plan
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGeneratingPlan(false);
    }
  };


  return (
    <div className="flex h-screen bg-background">
      <TeacherNav />
      <main className="flex-1 overflow-y-auto">
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6 flex items-center justify-between">
            <div><h1 className="text-3xl font-bold mb-2">Curriculum & Lesson Planner</h1><p className="text-muted-foreground">Design curriculums and generate daily lesson plans with AI.</p></div>
            <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
              <DialogTrigger asChild><Button onClick={() => setError(null)}><Sparkles className="h-4 w-4 mr-2" />AI Generate Curriculum</Button></DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader><DialogTitle>AI Curriculum Generator</DialogTitle><DialogDescription>Describe your teaching goals and let AI create a plan.</DialogDescription></DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2"><Label htmlFor="subject">Subject</Label><Input id="subject" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} placeholder="e.g., Chemistry" /></div>
                  <div className="space-y-2"><Label htmlFor="grade">Grade/Class</Label><Input id="grade" value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} placeholder="e.g., 10th Grade" /></div>
                  <div className="space-y-2"><Label htmlFor="topic">Topics</Label><Input id="topic" value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} placeholder="e.g., chemical reactions, equations" /></div>
                  <div className="space-y-2"><Label htmlFor="duration">Duration</Label><Input id="duration" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} placeholder="e.g., 3 weeks" /></div>
                  {error && <p className="text-sm text-destructive p-2 bg-destructive/10 rounded-md">{error}</p>}
                </div>
                <DialogFooter><Button variant="outline" onClick={() => setShowAIDialog(false)}>Cancel</Button><Button onClick={handleGenerateCurriculum} disabled={isGenerating}>{isGenerating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</> : "Generate"}</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader><CardTitle>Your Curriculums</CardTitle></CardHeader>
              <CardContent>
                {isLoading ? <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div> :
                 curriculums.length === 0 ? <p className="text-muted-foreground text-sm text-center py-4">No curriculums found. Generate one to get started!</p> :
                <div className="space-y-2">
                  {curriculums.map((curriculum) => (
                    <div key={curriculum.id} onClick={() => setSelectedCurriculum(curriculum)} className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedCurriculum?.id === curriculum.id ? 'border-primary bg-primary/10' : 'hover:bg-muted/50'}`}>
                      <h3 className="font-semibold text-sm">{curriculum.title}</h3>
                      <p className="text-xs text-muted-foreground">{curriculum.subject} • {curriculum.grade}</p>
                    </div>
                  ))}
                </div>}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {!selectedCurriculum && !isLoading && (
              <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg"><p className="text-muted-foreground">Select a curriculum to view its content.</p></div>
            )}
            {selectedCurriculum && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle>{selectedCurriculum.title}</CardTitle>
                      <CardDescription>{selectedCurriculum.grade} • {selectedCurriculum.subject} • {selectedCurriculum.duration}</CardDescription>
                    </div>
                    <div className="flex-shrink-0">
                      {/* --- UPDATED BUTTON LOGIC --- */}
                      {selectedCurriculum.lessonPlan ? (
                        <Dialog open={showLessonPlanDialog} onOpenChange={setShowLessonPlanDialog}>
                          <DialogTrigger asChild>
                            <Button variant="default"><Eye className="h-4 w-4 mr-2"/>View Lesson Plan</Button>
                          </DialogTrigger>
                        </Dialog>
                      ) : (
                        <Button variant="secondary" onClick={handleGenerateLessonPlan} disabled={isGeneratingPlan}>
                          {isGeneratingPlan ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</> : <><Bot className="h-4 w-4 mr-2" />Generate Lesson Plan</>}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none prose-headings:font-semibold prose-h3:text-lg prose-p:leading-relaxed prose-li:my-1">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {selectedCurriculum.content}
                  </ReactMarkdown>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* --- NEW: LESSON PLAN MODAL --- */}
      <Dialog open={showLessonPlanDialog} onOpenChange={setShowLessonPlanDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Daily Lesson Plan</DialogTitle>
            <DialogDescription>
              Your AI-generated teaching schedule for "{selectedCurriculum?.title}".
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-6">
            {selectedCurriculum?.lessonPlan ? (
              <div className="prose prose-sm max-w-none prose-table:w-full">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {selectedCurriculum.lessonPlan.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p>No lesson plan available.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLessonPlanDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CurriculumPage;

