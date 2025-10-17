"use client";

import { useState, useEffect } from "react";
import { TeacherNav } from "@/components/teacher-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, GameRound, Loader2 } from "lucide-react";

// Pre-defined activities based on the Wordwall links
const activityOptions = [
  { 
    value: 'hots', 
    label: 'Higher Order Thinking (Respiration)', 
    title: 'HOTS - Respiration in Organisms',
    url: 'https://wordwall.net/embed/play/99918/734/562' 
  },
  { 
    value: 'neuro-diverse', 
    label: 'Neuro-Diverse Assessment (Respiration)',
    title: 'Neuro-Diverse Periodic Assessment',
    url: 'https://wordwall.net/embed/play/99918/187/222'
  },
  { 
    value: 'periodic-assessment', 
    label: 'Periodic Assessment (Respiratory System)',
    title: 'Respiratory System Periodic Assessment',
    url: 'https://wordwall.net/embed/play/99902/598/449'
  },
];

const TeacherActivitiesPage = () => {
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [myClasses, setMyClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the teacher's classes to populate the dropdown
    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/teacher/my-classes'); // Assumes this API exists
        if (!response.ok) throw new Error('Failed to fetch classes.');
        const data = await response.json();
        setMyClasses(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClasses();
  }, []);

  const handleAssignActivity = async () => {
    if (!selectedClass || !selectedActivity) {
      setError("Please select a class and an activity.");
      return;
    }
    setIsLoading(true);
    setError(null);

    const activityData = activityOptions.find(opt => opt.value === selectedActivity);
    if (!activityData) {
      setError("Invalid activity selected.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/teacher/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activityData.title,
          description: activityData.label,
          url: activityData.url,
          className: selectedClass,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign the activity.');
      }
      setShowAssignDialog(false);
      // You could add a success toast notification here
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <TeacherNav />
      <main className="flex-1 overflow-y-auto">
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Assign Activities</h1>
              <p className="text-muted-foreground">Assign interactive activities to your classes.</p>
            </div>
            <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
              <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Assign Activity</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign an Interactive Activity</DialogTitle>
                  <DialogDescription>Select an activity and a class to assign it to.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="class-select">Select Class</Label>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger id="class-select"><SelectValue placeholder="Choose a class..." /></SelectTrigger>
                      <SelectContent>
                        {myClasses.map(cls => <SelectItem key={cls} value={cls}>{cls}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activity-select">Select Activity</Label>
                    <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                      <SelectTrigger id="activity-select"><SelectValue placeholder="Choose an activity..." /></SelectTrigger>
                      <SelectContent>
                        {activityOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAssignDialog(false)}>Cancel</Button>
                  <Button onClick={handleAssignActivity} disabled={isLoading}>
                    {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Assigning...</> : "Assign"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>
        <div className="p-8">
            <Card>
                <CardHeader><CardTitle>Available Activities</CardTitle><CardDescription>These are the interactive Wordwall activities you can assign.</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                    {activityOptions.map(opt => (
                        <div key={opt.value} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-semibold">{opt.title}</h4>
                                <p className="text-sm text-muted-foreground">{opt.label}</p>
                            </div>
                            <Button variant="secondary" asChild><a href={opt.url.replace('/embed', '')} target="_blank" rel="noopener noreferrer">Preview</a></Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
};

export default TeacherActivitiesPage;
