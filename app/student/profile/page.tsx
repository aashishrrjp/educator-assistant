"use client";

import { useState, useEffect, useRef, type FC, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { StudentNav } from "@/components/student-nav"; // Assuming you have a StudentNav
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Camera, Save, AlertCircle, CheckCircle } from "lucide-react";

// 1. Add rollNo and className to the state interface
interface StudentProfileState {
  name: string;
  email: string;
  phone: string;
  school: string;
  grade: string;
  rollNo: string;     
  className: string;  
  bio: string;
  avatarUrl: string;
}

const StudentProfile: FC = () => {
  const router = useRouter();
  
  // 2. Initialize the new fields in the state
  const [profile, setProfile] = useState<StudentProfileState>({
    name: "", email: "", phone: "", school: "", grade: "",
    rollNo: "",
    className: "",
    bio: "", avatarUrl: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // 3. Update useEffect to fetch and set the new fields
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/user/studentProfile");
        if (!response.ok) {
          if (response.status === 401) router.push("/sign-in");
          throw new Error("Failed to fetch profile data.");
        }
        const data = await response.json();
        
        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          school: data.school || "",
          grade: data.grade || "",
          rollNo: data.rollNo || "",        
          className: data.className || "", 
          bio: data.bio || "",
          avatarUrl: data.avatarUrl || "",
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [router]);

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to upload avatar.');

      setProfile({ ...profile, avatarUrl: data.avatarUrl });
      setSuccess("Avatar updated! Click 'Save Changes' to make it permanent.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/user/studentProfile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile), // Sends the entire profile state, including new fields
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update profile.");
      
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading profile...</div>;
  }

  return (
    <div className="flex h-screen">
      <StudentNav />
      <main className="flex-1 overflow-y-auto bg-background">
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your account information and learning preferences</p>
          </div>
        </header>

        <div className="p-8 max-w-4xl">
          <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
          <form onSubmit={handleSaveChanges} className="space-y-6">
            {/* Avatar Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Update your profile picture</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="relative cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.avatarUrl || "/placeholder.svg?height=96&width=96"} />
                      <AvatarFallback className="text-2xl">{profile.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{profile.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">Student at {profile.school}</p>
                    <Button variant="outline" size="sm" className="cursor-pointer" type="button" onClick={() => avatarInputRef.current?.click()}>
                      <Camera className="h-4 w-4 mr-2" />
                      Upload New Picture
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal and Academic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>Update your personal and class details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (cannot be changed)</Label>
                    <Input id="email" type="email" value={profile.email} readOnly disabled />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school">School/Institution</Label>
                    <Input id="school" value={profile.school} onChange={(e) => setProfile({ ...profile, school: e.target.value })} />
                  </div>
                </div>
                
                {/* --- 4. ADDED NEW INPUTS FOR ATTENDANCE --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="className">Class Name (e.g., 10th-grade-a)</Label>
                    <Input id="className" value={profile.className} onChange={(e) => setProfile({ ...profile, className: e.target.value })} placeholder="10th-grade-a" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rollNo">Roll Number</Label>
                    <Input id="rollNo" value={profile.rollNo} onChange={(e) => setProfile({ ...profile, rollNo: e.target.value })} placeholder="101" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Grade/Standard</Label>
                  <Input id="grade" value={profile.grade} onChange={(e) => setProfile({ ...profile, grade: e.target.value })} placeholder="10th" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" rows={4} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell us about your learning goals..." />
                </div>
              </CardContent>
            </Card>
            
            {error && (<Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>)}
            {success && (<Alert variant="default" className="bg-green-100 dark:bg-green-900"><CheckCircle className="h-4 w-4" /><AlertTitle>Success</AlertTitle><AlertDescription>{success}</AlertDescription></Alert>)}

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" className="cursor-pointer" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : <><Save className="h-4 w-4 mr-2 cursor-pointer" />Save Changes</>}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default StudentProfile;