"use client";

import {
  useState,
  useEffect,
  useRef,
  type FC,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import { TeacherNav } from "@/components/teacher-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Camera, Save, AlertCircle, CheckCircle } from "lucide-react";

// Defines the shape of the profile data for type safety
interface ProfileState {
  name: string;
  email: string;
  phone: string;
  school: string;
  subjects: string;
  classesTaught: string;
  experience: string;
  bio: string;
  avatarUrl: string;
}

const TeacherProfile: FC = () => {
  const router = useRouter();

  // Initialize state with a typed, empty object
  const [profile, setProfile] = useState<ProfileState>({
    name: "",
    email: "",
    phone: "",
    school: "",
    subjects: "",
    classesTaught: "",
    experience: "",
    bio: "",
    avatarUrl: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Create a ref to programmatically trigger the hidden file input
  const avatarInputRef = useRef<HTMLInputElement>(null);

  console.log("Component rendered. State:", {
    profile,
    isLoading,
    isSubmitting,
    error,
    success,
  });

  // Fetch profile data when the component first loads
  useEffect(() => {
    const fetchProfileData = async () => {
      console.log("useEffect triggered: Fetching profile data...");
      setIsLoading(true);
      try {
        const response = await fetch("/api/user/teacherProfile");
        if (!response.ok) {
          if (response.status === 401) {
            console.log("Authentication error (401), redirecting to sign-in.");
            router.push("/sign-in");
            return;
          }
          throw new Error("Failed to fetch profile data.");
        }
        const data = await response.json();

        console.log("API response data received:", data);
        // Sanitize incoming data to prevent null values in the form fields
        const newProfileState = {
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          school: data.school || "",
          subjects: Array.isArray(data.subjects)
            ? data.subjects.join(", ")
            : data.subjects || "",
          classesTaught: Array.isArray(data.classesTaught)
            ? data.classesTaught.join(", ")
            : data.classesTaught || "",
          experience: data.experience || "",
          bio: data.bio || "",
          avatarUrl: data.avatarUrl || "",
        };
        setProfile(newProfileState);
        console.log("Profile state updated:", newProfileState);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching profile data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [router]);

  // Handles the file selection and upload to the `/api/user/upload-avatar` endpoint
  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log("Avatar file selected:", file);

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      console.log("Uploading avatar...");
      const response = await fetch("/api/user/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to upload avatar.");
      }

      console.log("Avatar upload successful, response:", data);
      // Update local state to show a preview of the new avatar
      setProfile({ ...profile, avatarUrl: data.avatarUrl });
      setSuccess("Avatar updated! Click 'Save Changes' to make it permanent.");
    } catch (err: any) {
      setError(err.message);
      console.error("Error uploading avatar:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Saves all profile changes (including the new avatarUrl) to the database
  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    console.log("Saving profile changes with data:", profile);
    try {
      const response = await fetch("/api/user/teacherProfile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }
      console.log("Profile update successful, response:", data);
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message);
      console.error("Error updating profile:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <TeacherNav />
      <main className="flex-1 overflow-y-auto bg-background">
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>
        </header>

        <div className="p-8 max-w-4xl">
          {/* This hidden file input is triggered by the visible buttons */}
          <input
            type="file"
            ref={avatarInputRef}
            onChange={handleAvatarChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />

          <form onSubmit={handleSaveChanges} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  Update your profile picture and display name
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  {/* The clickable avatar area */}
                  <div
                    className="relative cursor-pointer"
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={
                          profile.avatarUrl ||
                          "/placeholder.svg?height=96&width=96"
                        }
                      />
                      <AvatarFallback className="text-2xl">
                        {profile.name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{profile.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Teacher at {profile.school}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="cursor-pointer"
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Upload New Picture
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (cannot be changed)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      readOnly
                      disabled
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school">School/Institution</Label>
                    <Input
                      id="school"
                      value={profile.school}
                      onChange={(e) =>
                        setProfile({ ...profile, school: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classesTaught">
                    Classes Taught (comma-separated)
                  </Label>
                  <Input
                    id="classesTaught"
                    placeholder="e.g., 10th-grade-a, 11th-grade-b"
                    value={profile.classesTaught}
                    onChange={(e) =>
                      setProfile({ ...profile, classesTaught: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subjects">Subjects (comma-separated)</Label>
                    <Input
                      id="subjects"
                      value={profile.subjects}
                      onChange={(e) =>
                        setProfile({ ...profile, subjects: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      value={profile.experience}
                      onChange={(e) =>
                        setProfile({ ...profile, experience: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status Messages for user feedback */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert
                variant="default"
                className="bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                type="button"
                className="cursor-pointer"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer"  disabled={isSubmitting}>
                {isSubmitting ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2 cursor-pointer" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default TeacherProfile;
