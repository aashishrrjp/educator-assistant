"use client"

import { useState } from "react"
import { StudentNav } from "@/components/student-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Sparkles, BookOpen, HelpCircle, Calculator, Lightbulb } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function StudentChatbotPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi! I'm your AI tutor. I'm here to help you understand difficult concepts, solve problems, and answer your questions. What would you like to learn about today?",
    },
  ])
  const [input, setInput] = useState("")

  const quickActions = [
    { icon: HelpCircle, label: "Explain a concept", prompt: "Can you explain how photosynthesis works?" },
    { icon: Calculator, label: "Solve a problem", prompt: "Help me solve this quadratic equation: x² - 5x + 6 = 0" },
    { icon: BookOpen, label: "Study tips", prompt: "What are the best ways to study for exams?" },
    { icon: Lightbulb, label: "Real-world examples", prompt: "Give me real-world examples of Newton's laws" },
  ]

  const handleSend = () => {
    if (!input.trim()) return

    setMessages([...messages, { id: messages.length + 1, role: "user", content: input }])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: "assistant",
          content: "Great question! Let me break this down for you step by step so it's easier to understand...",
        },
      ])
    }, 1000)
  }

  return (
    <div className="flex h-screen">
      <StudentNav />

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-background">
        {/* Header */}
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

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-4 ${message.role === "user" ? "justify-end" : ""}`}>
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-secondary/10 text-secondary">
                    <Sparkles className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-2xl rounded-lg p-4 ${
                  message.role === "user"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-card border border-border text-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              {message.role === "user" && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10">RK</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-muted-foreground mb-4 text-center">Try asking about:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
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
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-card p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything about your studies..."
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!input.trim()} className="bg-secondary hover:bg-secondary/90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI can make mistakes. Please verify important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
