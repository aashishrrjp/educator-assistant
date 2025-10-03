"use client"

import { useState } from "react"
import { TeacherNav } from "@/components/teacher-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Sparkles, BookOpen, Users, ClipboardCheck } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function TeacherChatbotPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hello! I'm your AI teaching assistant. I can help you with curriculum planning, quiz creation, grading strategies, and more. How can I assist you today?",
    },
  ])
  const [input, setInput] = useState("")

  const quickActions = [
    { icon: BookOpen, label: "Create a lesson plan", prompt: "Help me create a lesson plan for quadratic equations" },
    { icon: ClipboardCheck, label: "Generate quiz questions", prompt: "Generate 10 quiz questions on Newton's laws" },
    { icon: Users, label: "Student engagement tips", prompt: "Give me tips to improve student engagement" },
    { icon: Sparkles, label: "Grading rubric", prompt: "Create a grading rubric for a physics essay" },
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
          content:
            "I'd be happy to help you with that! Let me provide you with a comprehensive response based on best teaching practices...",
        },
      ])
    }, 1000)
  }

  return (
    <div className="flex h-screen">
      <TeacherNav />

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-background">
        {/* Header */}
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

        {/* Chat Messages */}
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
              <div
                className={`max-w-2xl rounded-lg p-4 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              {message.role === "user" && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-secondary/10">PS</AvatarFallback>
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
                placeholder="Ask me anything about teaching, curriculum, grading..."
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!input.trim()}>
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
