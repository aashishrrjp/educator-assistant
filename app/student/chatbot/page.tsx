"use client";

import { useState, useEffect, useRef, type FC } from "react";
import { StudentNav } from "@/components/student-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, BookOpen, HelpCircle, Calculator, Lightbulb, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from 'react-markdown';

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const StudentChatbotPage: FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hi! I'm your AI tutor. I'm here to help you understand difficult concepts, solve problems, and answer your questions. What would you like to learn about today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickActions = [
    { icon: HelpCircle, label: "Explain a concept", prompt: "Can you explain how photosynthesis works?" },
    { icon: Calculator, label: "Solve a problem", prompt: "Help me solve this quadratic equation: x² - 5x + 6 = 0" },
    { icon: BookOpen, label: "Study tips", prompt: "What are the best ways to study for exams?" },
    { icon: Lightbulb, label: "Real-world examples", prompt: "Give me real-world examples of Newton's laws" },
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMessage: Message = { id: Date.now(), role: "user", content: input };
    const currentInput = input;
    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    setIsSending(true);

    const historyForApi = messages.slice(1).map(({ role, content }) => ({ role, content }));

    try {
      const response = await fetch('/api/student/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput, history: historyForApi }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong.");
      }

      const data = await response.json();
      
      const assistantResponse: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.reply,
      };
      
      setMessages(prev => [...prev, assistantResponse]);

    } catch (err: any) {
      const errorMessage = `Sorry, an error occurred: ${err.message}`;
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: errorMessage }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-screen">
      <StudentNav />
      <main className="flex-1 flex flex-col bg-background">
        <header className="border-b border-border bg-card px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Tutor</h1>
              <p className="text-sm text-muted-foreground">Get instant help with your studies</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-4 ${message.role === "user" ? "justify-end" : ""}`}>
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-secondary/10 text-secondary"><Sparkles className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-2xl rounded-lg p-4 prose prose-sm ${
                  message.role === "user"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-card border"
                }`}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
              {message.role === "user" && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10">You</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isSending && (
            <div className="flex gap-4">
              <Avatar className="h-8 w-8 flex-shrink-0"><AvatarFallback className="bg-secondary/10 text-secondary"><Sparkles className="h-4 w-4" /></AvatarFallback></Avatar>
              <div className="max-w-2xl rounded-lg p-4 bg-card border flex items-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />

          {messages.length === 1 && (
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-muted-foreground mb-4 text-center">Try asking about:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button key={index} variant="outline" className="h-auto py-4 justify-start text-left bg-transparent" onClick={() => setInput(action.prompt)}>
                      <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span className="text-sm">{action.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border bg-card p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isSending && handleSend()}
                placeholder="Ask me anything about your studies..."
                className="flex-1"
                disabled={isSending}
              />
              <Button onClick={handleSend} disabled={!input.trim() || isSending}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">AI can make mistakes. Please verify important information.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentChatbotPage;
