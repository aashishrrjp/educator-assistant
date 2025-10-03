"use client"

import { useState } from "react"
import { TeacherNav } from "@/components/teacher-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save } from "lucide-react"

export default function TeacherProfile() {
  const [profile, setProfile] = useState({
    name: "Dr. Priya Sharma",
    email: "priya.sharma@dps.edu",
    phone: "+91 98765 43210",
    school: "Delhi Public School",
    subjects: "Mathematics, Physics",
    experience: "12 years",
    bio: "Passionate educator with over a decade of experience in teaching Mathematics and Physics. Committed to making complex concepts accessible to all students.",
  })

  return (
    <div className="flex h-screen">
      <TeacherNav />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </div>
        </header>

        {/* Profile Content */}
        <div className="p-8 max-w-4xl">
          <div className="space-y-6">
            {/* Avatar Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Update your profile picture and display name</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" />
                      <AvatarFallback className="text-2xl">PS</AvatarFallback>
                    </Avatar>
                    <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full" variant="secondary">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{profile.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">Teacher at {profile.school}</p>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Upload New Picture
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school">School/Institution</Label>
                    <Input
                      id="school"
                      value={profile.school}
                      onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subjects">Subjects</Label>
                    <Input
                      id="subjects"
                      value={profile.subjects}
                      onChange={(e) => setProfile({ ...profile, subjects: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      value={profile.experience}
                      onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Teaching Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Teaching Preferences</CardTitle>
                <CardDescription>Customize your teaching experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="grading-style">Preferred Grading Style</Label>
                  <Input id="grading-style" placeholder="e.g., Percentage, Letter Grade, Points" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Input id="language" placeholder="e.g., English, Hindi, Tamil" />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <Button variant="outline">Cancel</Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
