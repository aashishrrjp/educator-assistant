"use client";

import { useState, useEffect, type FC } from "react";
import { TeacherNav } from "@/components/teacher-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Sparkles, BookOpen, FileText, Calendar, Loader2 } from "lucide-react";
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

  const [formData, setFormData] = useState({
    subject: "",
    grade: "",
    topic: "",
    duration: "",
  });

  // Fetch all existing curriculums on page load
  useEffect(() => {
    const fetchCurriculums = async () => {
      setIsLoading(true);
      try {
        // --- FIX: This URL was incorrect. It now points to the correct GET API. ---
        const response = await fetch('/api/curriculum');
        
        if (!response.ok) throw new Error('Failed to fetch curriculums.');
        
        const data = await response.json();
        setCurriculums(data);
        if (data.length > 0) {
          setSelectedCurriculum(data[0]); // Select the first one by default
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurriculums();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // This fetch call is correct for generating a new curriculum
      const response = await fetch('/api/teacher/curriculum/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to generate curriculum from API.');
      
      const newCurriculum = await response.json();
      setCurriculums(prev => [newCurriculum, ...prev]);
      setSelectedCurriculum(newCurriculum);
      setShowAIDialog(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen">
      <TeacherNav />
      <main className="flex-1 overflow-y-auto bg-background">
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Curriculum Builder</h1>
                <p className="text-muted-foreground">Create and manage your teaching curriculum</p>
              </div>
              <div className="flex gap-3">
                <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
                  <DialogTrigger asChild><Button><Sparkles className="h-4 w-4 mr-2" />AI Generate</Button></DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>AI Curriculum Generator</DialogTitle>
                      <DialogDescription>Describe what you want to teach and let AI create a plan.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2"><Label htmlFor="subject">Subject</Label><Input id="subject" value={formData.subject} onChange={handleInputChange} placeholder="e.g., Chemistry" /></div>
                      <div className="space-y-2"><Label htmlFor="grade">Grade/Class (Target Class)</Label><Input id="grade" value={formData.grade} onChange={handleInputChange} placeholder="e.g., 10" /></div>
                      <div className="space-y-2"><Label htmlFor="topic">Topics (comma-separated)</Label><Input id="topic" value={formData.topic} onChange={handleInputChange} placeholder="e.g., chemical reactions,equations" /></div>
                      <div className="space-y-2"><Label htmlFor="duration">Duration</Label><Input id="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g., 3 weeks" /></div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setShowAIDialog(false)}>Cancel</Button>
                      <Button onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</> : <><Sparkles className="h-4 w-4 mr-2" />Generate Curriculum</>}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline"><Plus className="h-4 w-4 mr-2" />Create Manual</Button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6">
          <Card>
            <CardHeader><CardTitle>Your Curriculums</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? <p>Loading...</p> :
               curriculums.length === 0 ? <p className="text-muted-foreground">No curriculums found. Generate one to get started!</p> :
              <div className="grid grid-cols-1 gap-4">
                {curriculums.map((curriculum) => (
                  <div key={curriculum.id} onClick={() => setSelectedCurriculum(curriculum)} className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedCurriculum?.id === curriculum.id ? 'border-primary bg-muted/50' : 'hover:bg-muted/50'}`}>
                    <h3 className="font-semibold">{curriculum.title}</h3>
                    <p className="text-sm text-muted-foreground">{curriculum.subject} • {curriculum.grade}</p>
                  </div>
                ))}
              </div>}
            </CardContent>
          </Card>

          {selectedCurriculum && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedCurriculum.title}</CardTitle>
                <CardDescription>{selectedCurriculum.grade} • {selectedCurriculum.subject} • {selectedCurriculum.duration}</CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none prose-headings:font-semibold prose-h3:text-lg">
                <ReactMarkdown>{selectedCurriculum.content}</ReactMarkdown>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default CurriculumPage;