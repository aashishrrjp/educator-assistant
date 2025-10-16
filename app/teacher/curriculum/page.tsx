"use client";

import { useState, useEffect, type FC } from "react";
import { TeacherNav } from "@/components/teacher-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface Curriculum {
  id: string;
  title: string;
  subject: string;
  grade: string;
  duration?: string | null;
  content: string;
}

const CurriculumPage: FC = () => {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    subject: "",
    grade: "",
    topic: "",
    duration: "",
  });

  const fetchCurriculums = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/curriculum/generated');
      if (!response.ok) throw new Error('Failed to fetch curriculums.');
      const data = await response.json();
      setCurriculums(data);
      if (data.length > 0 && !selectedCurriculum) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleGenerate = async () => {
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
      setError(err.message); // Display the error in the modal
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen">
      <TeacherNav />
      <main className="flex-1 overflow-y-auto bg-background">
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Curriculum Builder</h1>
              <p className="text-muted-foreground">Create and manage your teaching curriculum with AI.</p>
            </div>
            <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
              <DialogTrigger asChild><Button onClick={() => setError(null)}><Sparkles className="h-4 w-4 mr-2" />AI Generate</Button></DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>AI Curriculum Generator</DialogTitle>
                  <DialogDescription>Describe what you want to teach and let AI create a plan.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2"><Label htmlFor="subject">Subject</Label><Input id="subject" value={formData.subject} onChange={handleInputChange} placeholder="e.g., Chemistry" /></div>
                  <div className="space-y-2"><Label htmlFor="grade">Grade/Class</Label><Input id="grade" value={formData.grade} onChange={handleInputChange} placeholder="e.g., 10th Grade" /></div>
                  <div className="space-y-2"><Label htmlFor="topic">Topics (comma-separated)</Label><Input id="topic" value={formData.topic} onChange={handleInputChange} placeholder="e.g., chemical reactions, equations" /></div>
                  <div className="space-y-2"><Label htmlFor="duration">Duration</Label><Input id="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g., 3 weeks" /></div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowAIDialog(false)}>Cancel</Button>
                  <Button onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</> : <><Sparkles className="h-4 w-4 mr-2" />Generate Curriculum</>}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader><CardTitle>Your Curriculums</CardTitle></CardHeader>
              <CardContent>
                {isLoading ? <p>Loading...</p> :
                 curriculums.length === 0 ? <p className="text-muted-foreground text-sm">No curriculums found. Generate one to get started!</p> :
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

          <div className="lg:col-span-2">
            {selectedCurriculum ? (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedCurriculum.title}</CardTitle>
                  <CardDescription>{selectedCurriculum.grade} • {selectedCurriculum.subject} • {selectedCurriculum.duration}</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none prose-headings:font-semibold prose-h3:text-lg prose-p:leading-relaxed prose-li:my-1">
                  <ReactMarkdown>{selectedCurriculum.content}</ReactMarkdown>
                </CardContent>
              </Card>
            ) : !isLoading && (
              <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Select a curriculum to view its content.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CurriculumPage;