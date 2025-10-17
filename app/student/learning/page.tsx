"use client";

import { useState, type FC } from "react";
import { useRouter } from "next/navigation";
import { StudentNav } from "@/components/student-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, ImageIcon, Languages, Sparkles, Loader2, MessageSquare, Bot, Repeat } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GeneratedVideo {
  subject: string;
  topic: string;
  url: string;
}

const LearningToolsPage: FC = () => {
  const router = useRouter();
  const [showVideoDialog, setShowVideoDialog] = useState(false);

  // State for the video generator modal
  const [videoSubject, setVideoSubject] = useState("");
  const [videoTopic, setVideoTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State to hold the generated video URL
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);

  const handleGenerateVideo = () => {
    if (!videoTopic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    // This logic now points to local video files
    setTimeout(() => {
      const topicLower = videoTopic.toLowerCase();
      let videoUrl = "";

      // Videos must be in the `public/` directory.
      // The path should be absolute from the root of the site.
      if (topicLower.includes("respiratory")) {
        videoUrl = "/respiratory.mp4"; // Correct path to your local video
      } else if (topicLower.includes("pneumonia")) {
        videoUrl = "/pneumonia.mp4"; // Assuming this video is in a 'videos' subfolder
      } else {
        setError("Sorry, a video for this topic is not available. Please try 'respiratory' or 'pneumonia'.");
        setIsGenerating(false);
        return;
      }

      setGeneratedVideo({
        subject: videoSubject,
        topic: videoTopic,
        url: videoUrl,
      });
      
      setIsGenerating(false);
      setShowVideoDialog(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-background">
      <StudentNav />
      <main className="flex-1 overflow-y-auto">
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold mb-2">Learning Tools</h1>
            <p className="text-muted-foreground">AI-powered tools to help you understand difficult concepts</p>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
              <DialogTrigger asChild>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4"><Video className="h-6 w-6 text-primary" /></div>
                    <h3 className="text-lg font-semibold mb-2">Video Explainer</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Generate AI videos to explain difficult concepts visually</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Generate Explanation Video</DialogTitle>
                  <DialogDescription>Describe the concept you want to understand and AI will create a video explanation.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select onValueChange={setVideoSubject} value={videoSubject}>
                      <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic/Concept</Label>
                    <Input id="topic" value={videoTopic} onChange={(e) => setVideoTopic(e.target.value)} placeholder="e.g., Respiratory System" />
                  </div>
                   {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowVideoDialog(false)}>Cancel</Button>
                  <Button onClick={handleGenerateVideo} disabled={isGenerating}>
                    {isGenerating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</> : <><Sparkles className="h-4 w-4 mr-2" />Generate Video</>}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Card 
              className="hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => router.push('/student/concept-illustrator')}
            >
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4"><ImageIcon className="h-6 w-6 text-primary" /></div>
                <h3 className="text-lg font-semibold mb-2">Visual Diagrams</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Create visual diagrams and illustrations for complex topics</p>
              </CardContent>
            </Card>

            <Card 
              className="hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => router.push('/student/translate')}
            >
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4"><Languages className="h-6 w-6 text-primary" /></div>
                <h3 className="text-lg font-semibold mb-2">Multilingual Support</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Get explanations in your preferred language</p>
              </CardContent>
            </Card>
          </div>

          {generatedVideo && (
            <Card>
              <CardHeader>
                <CardTitle>Your Generated Video</CardTitle>
                <CardDescription>Topic: {generatedVideo.topic} • Subject: {generatedVideo.subject || 'General'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full bg-slate-900 rounded-lg overflow-hidden">
                  <video
                    key={generatedVideo.url}
                    width="100%"
                    height="100%"
                    controls
                    autoPlay
                    className="w-full h-full"
                  >
                    <source src={generatedVideo.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </CardContent>
            </Card>
          )}

          {/* --- UPDATED "HOW IT WORKS" SECTION --- */}
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">How AI Learning Tools Work</h2>
              <p className="text-muted-foreground">A simple three-step process to enhance your learning.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card 
                className="hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => router.push('/student/chatbot')}
              >
                <CardHeader className="items-center text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>1. Describe Your Doubt</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Go to the AI Tutor and ask a question about any concept you're struggling with.
                  </p>
                </CardContent>
              </Card>

              <Card 
                className="hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => router.push('/student/chatbot')}
              >
                <CardHeader className="items-center text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>2. AI Generates Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Our AI creates personalized videos, diagrams, or translations based on your needs.
                  </p>
                </CardContent>
              </Card>

              <Card 
                className="hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => router.push('/student/chatbot')}
              >
                <CardHeader className="items-center text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Repeat className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>3. Learn at Your Pace</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Review the AI-generated content as many times as you need until you understand it.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearningToolsPage;

