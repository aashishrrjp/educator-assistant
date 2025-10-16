"use client";

import { useState, useEffect, type FC, type FormEvent } from "react";
import { StudentNav } from "@/components/student-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Check, Trash2, Calendar } from "lucide-react";

// Update the Task interface to include the new optional fields
interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string | null;
  priority?: string | null;
}

const StudentTasksPage: FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ text: "", dueDate: "", priority: "medium" });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      const response = await fetch('/api/student/tasks');
      const data = await response.json();
      setTasks(data);
      setIsLoading(false);
    };
    fetchTasks();
  }, []);

  // Handle adding a new task with all details
  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTask.text.trim()) return;

    const response = await fetch('/api/student/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });

    if (response.ok) {
      const addedTask = await response.json();
      setTasks([addedTask, ...tasks]);
      setNewTask({ text: "", dueDate: "", priority: "medium" }); // Reset form
    }
  };
  
  // Handle toggling task completion
  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    await fetch('/api/student/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, completed: !currentStatus }),
    });
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !currentStatus } : task
    ));
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId: string) => {
    await fetch('/api/student/tasks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId }),
    });
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  // Helper function for styling the priority badge
  const getPriorityClasses = (priority: string | null | undefined) => {
    switch (priority) {
      case "high": return "bg-red-500/10 text-red-500";
      case "medium": return "bg-yellow-500/10 text-yellow-500";
      case "low": return "bg-green-500/10 text-green-500";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  // Filter tasks for display and calculate stats
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <div className="flex h-screen">
      <StudentNav />
      <main className="flex-1 overflow-y-auto bg-background">
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
            <p className="text-muted-foreground">Organize and track your study tasks and goals</p>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">Pending Tasks</p><p className="text-3xl font-bold">{pendingTasks.length}</p></div><Calendar className="h-8 w-8 text-yellow-500" /></div></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">Completed</p><p className="text-3xl font-bold text-green-500">{completedTasks.length}</p></div><Check className="h-8 w-8 text-green-500" /></div></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">Completion Rate</p><p className="text-3xl font-bold">{completionRate}%</p></div></div></CardContent></Card>
          </div>

          {/* Add Task Form */}
          <Card>
            <CardHeader><CardTitle>Add New Task</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleAddTask} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Input value={newTask.text} onChange={(e) => setNewTask({ ...newTask, text: e.target.value })} placeholder="What do you need to do?" className="sm:col-span-2" />
                <Input value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} type="date" className="block" />
                <div className="flex gap-3 sm:col-span-1">
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                    <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                    <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
                  </Select>
                  <Button type="submit" className="w-10"><Plus className="h-4 w-4" /></Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Pending Tasks List */}
          <Card>
            <CardHeader><CardTitle>Pending Tasks</CardTitle><CardDescription>Tasks you need to complete</CardDescription></CardHeader>
            <CardContent>
              {isLoading ? <p>Loading...</p> : 
              <div className="space-y-3">
                {pendingTasks.length === 0 && <p className="text-muted-foreground text-center py-4">No pending tasks. Well done!</p>}
                {pendingTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/50">
                    <Checkbox checked={task.completed} onCheckedChange={() => handleToggleTask(task.id, task.completed)} />
                    <div className="flex-1"><p className="font-medium">{task.text}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {task.dueDate && <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{task.dueDate}</span>}
                        {task.priority && <span className={`text-xs capitalize px-2 py-0.5 rounded-full ${getPriorityClasses(task.priority)}`}>{task.priority}</span>}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>}
            </CardContent>
          </Card>

          {/* Completed Tasks List */}
          {completedTasks.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Completed Tasks</CardTitle><CardDescription>Keep up the good work!</CardDescription></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-4 p-4 rounded-lg border bg-accent/20 opacity-70">
                      <Checkbox checked={task.completed} onCheckedChange={() => handleToggleTask(task.id, task.completed)} />
                      <div className="flex-1"><p className="font-medium line-through">{task.text}</p>{task.dueDate && <span className="text-xs text-muted-foreground">{task.dueDate}</span>}</div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentTasksPage;