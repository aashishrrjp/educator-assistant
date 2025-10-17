"use client";

import { useState, useRef, useEffect, type FC } from "react";
import { TeacherNav } from "@/components/teacher-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, BookOpen, Users, ClipboardCheck, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const TeacherChatbotPage: FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I'm your AI teaching assistant. I can help with lesson plans, quizzes, and more. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickActions = [
    { icon: BookOpen, label: "Create a lesson plan", prompt: "Help me create a lesson plan for quadratic equations" },
    { icon: ClipboardCheck, label: "Generate quiz questions", prompt: "Generate 10 quiz questions on Newton's laws" },
    { icon: Users, label: "Student engagement tips", prompt: "Give me tips to improve student engagement" },
    { icon: Sparkles, label: "Grading rubric", prompt: "Create a grading rubric for a physics essay" },
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMessage: Message = { id: Date.now(), role: "user", content: input };
    setMessages(prev => [...prev, newUserMessage]);
    const currentInput = input;
    setInput("");
    setIsSending(true);
    setError(null);
    
    // Prepare history for the API call (all messages except the initial greeting)
    const historyForApi = messages.slice(1).map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    try {
      const response = await fetch('/api/chatbot/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput, history: historyForApi }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "The AI assistant failed to respond.");
      }

      const data = await response.json();
      
      // The AI response can be in `reply` (for direct answers) or `followUpQuestion` (for agentic steps).
      const assistantResponseContent = data.reply || data.followUpQuestion || "I have completed the request. How else can I help?";
      const assistantResponse: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: assistantResponseContent,
      };
      
      setMessages(prev => [...prev, assistantResponse]);

    } catch (err: any) {
      const errorMessage = `Sorry, I encountered an error: ${err.message}`;
      setError(errorMessage);
      // Add the error as a message in the chat for visibility
      setMessages(prev => [...prev, { id: Date.now() + 1, role: "assistant", content: errorMessage }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-screen">
      <TeacherNav />
      <main className="flex-1 flex flex-col bg-background">
        <header className="border-b border-border bg-card px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Teaching Assistant</h1>
              <p className="text-sm text-muted-foreground">Your intelligent helper for all teaching tasks</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-4 ${message.role === "user" ? "justify-end" : ""}`}>
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-2xl rounded-lg p-4 prose prose-sm ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border"}`}>
                 <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
              {message.role === "user" && (
                <Avatar className="h-8 w-8 flex-shrink-0"><AvatarFallback>You</AvatarFallback></Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
          
          {messages.length === 1 && (
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-muted-foreground mb-4 text-center">Or try one of these quick actions:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto py-4 justify-start text-left bg-transparent"
                      onClick={() => setInput(action.prompt)}
                    >
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
                placeholder="Ask me to create a lesson plan, generate a quiz, or find resources..."
                className="flex-1"
                disabled={isSending}
              />
              <Button onClick={handleSend} disabled={!input.trim() || isSending}>
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            {error && <p className="text-xs text-destructive mt-2 text-center">{error}</p>}
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI can make mistakes. Please verify important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherChatbotPage;
