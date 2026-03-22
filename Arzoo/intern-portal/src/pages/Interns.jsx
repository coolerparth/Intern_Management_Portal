import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { mockUsers } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { UserPlus, Users, X } from "lucide-react";

export default function Interns() {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [interns, setInterns] = useState(mockUsers.filter((u) => u.role === "intern"));
  const [newIntern, setNewIntern] = useState({ name: "", email: "", password: "" });

  const handleAddIntern = (e) => {
    e.preventDefault();
    const intern = {
      id: Date.now(),
      ...newIntern,
      role: "intern",
      avatar: newIntern.name.split(" ").map((n) => n[0]).join("").toUpperCase(),
    };
    setInterns([...interns, intern]);
    setNewIntern({ name: "", email: "", password: "" });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {user?.role === "admin" ? "All Interns" : "My Interns"}
        </h1>
        {(user?.role === "teamlead" || user?.role === "admin") && (
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Intern
          </Button>
        )}
      </div>

      {/* Add Intern Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Intern</DialogTitle>
            <DialogDescription>Fill in the details to add a new intern to the team.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddIntern} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={newIntern.name}
                onChange={(e) => setNewIntern({ ...newIntern, name: e.target.value })}
                placeholder="Enter name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newIntern.email}
                onChange={(e) => setNewIntern({ ...newIntern, email: e.target.value })}
                placeholder="Enter email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newIntern.password}
                onChange={(e) => setNewIntern({ ...newIntern, password: e.target.value })}
                placeholder="Set password"
                required
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Intern</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Intern List Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interns.map((intern) => (
                <TableRow key={intern.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {intern.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{intern.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{intern.email}</TableCell>
                  <TableCell>
                    <Badge variant="success" className="capitalize">{intern.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="success">Active</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
