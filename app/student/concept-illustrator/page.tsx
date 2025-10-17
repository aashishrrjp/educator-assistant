"use client";

import { useState, type FC } from "react";
import { StudentNav } from "@/components/student-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon, Sparkles, Loader2, Wand2, Download } from "lucide-react";

const StudentConceptIllustratorPage: FC = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickPrompts = [
    "A diagram of the water cycle",
    "The structure of a plant cell",
    "Illustration of Newton's third law of motion",
    "A mind map of the French Revolution",
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await fetch('/api/student/concept/illustrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate image.');
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    // Create a safe filename from the prompt
    const filename = prompt.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
    link.download = filename || 'concept-illustration.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen">
      <StudentNav />
      <main className="flex-1 flex flex-col bg-background">
        <header className="border-b border-border bg-card px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Concept Illustrator</h1>
              <p className="text-sm text-muted-foreground">Visualize any concept with the power of AI.</p>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-4xl">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    placeholder="e.g., A colorful diagram of the solar system..."
                    className="flex-1 text-base"
                    disabled={isLoading}
                  />
                  <Button onClick={handleGenerate} disabled={!prompt.trim() || isLoading} size="lg">
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
                    <span className="ml-2">Generate</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {error && <p className="text-destructive text-center mb-4">{error}</p>}

            <div className="aspect-video w-full bg-muted/50 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden relative">
              {isLoading ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p>Generating your image...</p>
                </div>
              ) : imageUrl ? (
                <>
                  <img src={imageUrl} alt={prompt} className="w-full h-full object-contain" />
                  <Button
                    onClick={handleDownload}
                    size="icon"
                    variant="secondary"
                    className="absolute top-4 right-4"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="text-center text-muted-foreground p-4">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                  <p className="font-semibold">Your generated image will appear here.</p>
                  <p className="text-sm mt-4">Need inspiration? Try one of these:</p>
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {quickPrompts.map(p => (
                      <Button key={p} variant="outline" size="sm" onClick={() => setPrompt(p)}>{p}</Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentConceptIllustratorPage;

