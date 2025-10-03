"use client"

import { useState } from "react"
import { StudentNav } from "@/components/student-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Video, ImageIcon, Languages, Sparkles, Play } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LearningToolsPage() {
  const [showVideoDialog, setShowVideoDialog] = useState(false)
  const [showTranslateDialog, setShowTranslateDialog] = useState(false)

  return (
    <div className="flex h-screen">
      <StudentNav />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold mb-2">Learning Tools</h1>
            <p className="text-muted-foreground">AI-powered tools to help you understand difficult concepts</p>
          </div>
        </header>

        {/* Learning Tools Content */}
        <div className="p-8 space-y-8">
          {/* Main Tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Video Generator */}
            <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
              <DialogTrigger asChild>
                <Card className="hover:border-secondary/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                      <Video className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Video Explainer</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Generate AI videos to explain difficult concepts visually
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Generate Explanation Video</DialogTitle>
                  <DialogDescription>
                    Describe the concept you want to understand and AI will create a video explanation
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
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
                    <Input id="topic" placeholder="e.g., Quadratic Formula, Newton's Third Law" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="details">Additional Details (Optional)</Label>
                    <Textarea
                      id="details"
                      rows={3}
                      placeholder="Describe what you're struggling with or what you want to focus on..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowVideoDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowVideoDialog(false)}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Video
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Visual Generator */}
            <Card className="hover:border-secondary/50 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Visual Diagrams</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Create visual diagrams and illustrations for complex topics
                </p>
              </CardContent>
            </Card>

            {/* Translator */}
            <Dialog open={showTranslateDialog} onOpenChange={setShowTranslateDialog}>
              <DialogTrigger asChild>
                <Card className="hover:border-secondary/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                      <Languages className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Multilingual Support</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Get explanations in your preferred language
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Translate & Explain</DialogTitle>
                  <DialogDescription>Get concepts explained in your preferred language</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="translate-text">Text to Translate</Label>
                    <Textarea id="translate-text" rows={4} placeholder="Paste the text you want to understand..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>From Language</Label>
                      <Select defaultValue="english">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="hindi">Hindi</SelectItem>
                          <SelectItem value="tamil">Tamil</SelectItem>
                          <SelectItem value="telugu">Telugu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>To Language</Label>
                      <Select defaultValue="hindi">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="hindi">Hindi</SelectItem>
                          <SelectItem value="tamil">Tamil</SelectItem>
                          <SelectItem value="telugu">Telugu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowTranslateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowTranslateDialog(false)}>
                    <Languages className="h-4 w-4 mr-2" />
                    Translate
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Recent Generated Content */}
          <Card>
            <CardHeader>
              <CardTitle>Recently Generated</CardTitle>
              <CardDescription>Your AI-generated learning materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border hover:border-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Video className="h-8 w-8 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-1">Quadratic Formula Explained</h4>
                      <p className="text-sm text-muted-foreground mb-2">Mathematics • 2 days ago</p>
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-2" />
                        Watch Video
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border hover:border-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-1">Newton's Laws Diagram</h4>
                      <p className="text-sm text-muted-foreground mb-2">Physics • 3 days ago</p>
                      <Button size="sm" variant="outline">
                        View Image
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border hover:border-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Video className="h-8 w-8 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-1">Photosynthesis Process</h4>
                      <p className="text-sm text-muted-foreground mb-2">Biology • 5 days ago</p>
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-2" />
                        Watch Video
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border hover:border-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Languages className="h-8 w-8 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-1">Thermodynamics in Hindi</h4>
                      <p className="text-sm text-muted-foreground mb-2">Physics • 1 week ago</p>
                      <Button size="sm" variant="outline">
                        View Translation
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle>How AI Learning Tools Work</CardTitle>
              <CardDescription>Understanding the technology behind your learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center mb-3 text-secondary font-bold">
                    1
                  </div>
                  <h4 className="font-semibold mb-2">Describe Your Doubt</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Tell us what concept you're struggling with or what you want to learn
                  </p>
                </div>
                <div>
                  <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center mb-3 text-secondary font-bold">
                    2
                  </div>
                  <h4 className="font-semibold mb-2">AI Generates Content</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Our AI creates personalized videos, diagrams, or translations based on your needs
                  </p>
                </div>
                <div>
                  <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center mb-3 text-secondary font-bold">
                    3
                  </div>
                  <h4 className="font-semibold mb-2">Learn at Your Pace</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Review the generated content as many times as you need until you understand
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
