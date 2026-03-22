import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { mockTasks, mockUsers } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CalendarDays, User } from "lucide-react";

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(mockTasks);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
    priority: "medium",
  });

  const interns = mockUsers.filter((u) => u.role === "intern");
  const visibleTasks = user?.role === "intern"
    ? tasks.filter((t) => t.assignedTo === user.id)
    : tasks;

  const handleAddTask = (e) => {
    e.preventDefault();
    const task = {
      id: Date.now(),
      ...newTask,
      assignedTo: Number(newTask.assignedTo),
      assignedBy: user.id,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTasks([...tasks, task]);
    setNewTask({ title: "", description: "", assignedTo: "", deadline: "", priority: "medium" });
    setShowAddForm(false);
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
  };

  const priorityVariant = (p) => p === "high" ? "destructive" : p === "medium" ? "warning" : "info";
  const statusVariant = (s) => s === "completed" ? "success" : s === "in-progress" ? "info" : "warning";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {user?.role === "intern" ? "My Tasks" : "Task Management"}
        </h1>
        {user?.role === "teamlead" && (
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Assign Task
          </Button>
        )}
      </div>

      {/* Add Task Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign New Task</DialogTitle>
            <DialogDescription>Fill in the details to assign a new task to an intern.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Task Title</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Select value={newTask.assignedTo} onValueChange={(val) => setNewTask({ ...newTask, assignedTo: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Intern" />
                  </SelectTrigger>
                  <SelectContent>
                    {interns.map((intern) => (
                      <SelectItem key={intern.id} value={String(intern.id)}>{intern.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={newTask.priority} onValueChange={(val) => setNewTask({ ...newTask, priority: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Describe the task..."
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button type="submit">Assign Task</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleTasks.map((task) => {
          const intern = mockUsers.find((u) => u.id === task.assignedTo);
          return (
            <Card key={task.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
                  <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{task.title}</h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{task.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {intern?.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {task.deadline}
                  </span>
                </div>
                {user?.role === "intern" && task.status !== "completed" && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="w-full px-3 py-1.5 border border-input rounded-md text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
