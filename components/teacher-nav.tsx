"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Users,
  BarChart3,
  MessageSquare,
  User,
  LogOut,
  FileCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function TeacherNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/teacher/curriculum", label: "Curriculum", icon: BookOpen },
    { href: "/teacher/quiz", label: "Quiz Builder", icon: FileCheck },
    { href: "/teacher/attendance", label: "Attendance", icon: Users },
    { href: "/teacher/grading", label: "Grading", icon: ClipboardCheck },
    { href: "/teacher/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/teacher/chatbot", label: "AI Assistant", icon: MessageSquare },
  ]

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        {/* Logo */}
        <div className="h-16 border-b border-border flex items-center px-6">
          <Link href="/teacher/dashboard" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">SetuNova</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-border p-4 space-y-2">
          <Link href="/teacher/profile">
            <Button variant="ghost" className="w-full justify-start cursor-pointer" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="ghost" className="w-full justify-start text-destructive cursor-pointer hover:text-destructive" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </Link>
        </div>
      </aside>
    </div>
  )
}
