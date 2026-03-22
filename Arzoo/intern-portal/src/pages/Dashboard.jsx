import { useAuth } from "../context/AuthContext";
import { mockUsers, mockTasks, mockReports, mockEvaluations } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, FileText, CheckSquare, BarChart3, Trophy, TrendingUp, Clock, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "admin") return <AdminDashboard />;
  if (user?.role === "teamlead") return <TeamLeadDashboard />;
  if (user?.role === "supervisor") return <SupervisorDashboard />;
  return <InternDashboard />;
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }) {
  const variants = {
    reviewed: "success", completed: "success",
    pending: "warning",
    "in-progress": "info",
  };
  return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
}

function AdminDashboard() {
  const totalInterns = mockUsers.filter((u) => u.role === "intern").length;
  const pendingReports = mockReports.filter((r) => r.status === "pending").length;
  const completedTasks = mockTasks.filter((t) => t.status === "completed").length;
  const avgMarks = Math.round(
    mockEvaluations.reduce((sum, e) => sum + e.totalMarks, 0) / mockEvaluations.length
  );

  const stats = [
    { label: "Total Interns", value: totalInterns, icon: Users, color: "bg-blue-100 text-blue-700" },
    { label: "Pending Reports", value: pendingReports, icon: AlertTriangle, color: "bg-amber-100 text-amber-700" },
    { label: "Completed Tasks", value: completedTasks, icon: CheckSquare, color: "bg-emerald-100 text-emerald-700" },
    { label: "Avg. Score", value: `${avgMarks}%`, icon: BarChart3, color: "bg-purple-100 text-purple-700" },
  ];

  const completed = mockTasks.filter(t => t.status === "completed").length;
  const inProgress = mockTasks.filter(t => t.status === "in-progress").length;
  const pending = mockTasks.filter(t => t.status === "pending").length;
  const total = mockTasks.length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Recent Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockReports.slice(0, 4).map((report) => (
              <div key={report.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{report.title}</p>
                  <p className="text-xs text-muted-foreground">{report.internName}</p>
                </div>
                <StatusBadge status={report.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Task Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Task Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium text-foreground">{completed}</span>
              </div>
              <Progress value={(completed / total) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">In Progress</span>
                <span className="font-medium text-foreground">{inProgress}</span>
              </div>
              <Progress value={(inProgress / total) * 100} className="h-2 [&>div]:bg-blue-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-medium text-foreground">{pending}</span>
              </div>
              <Progress value={(pending / total) * 100} className="h-2 [&>div]:bg-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            Intern Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Task Score</TableHead>
                <TableHead>Report Score</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEvaluations.map((ev) => (
                <TableRow key={ev.id}>
                  <TableCell>
                    <span className={`w-7 h-7 inline-flex items-center justify-center rounded-full text-sm font-semibold ${
                      ev.rank === 1 ? "bg-amber-100 text-amber-700" :
                      ev.rank === 2 ? "bg-slate-100 text-slate-700" :
                      ev.rank === 3 ? "bg-orange-100 text-orange-700" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {ev.rank}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{ev.internName}</TableCell>
                  <TableCell>{ev.taskMarks}</TableCell>
                  <TableCell>{ev.reportMarks}</TableCell>
                  <TableCell>{ev.attendance}%</TableCell>
                  <TableCell>
                    <span className="font-semibold text-primary">{ev.totalMarks}%</span>
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

function TeamLeadDashboard() {
  const myInterns = mockUsers.filter((u) => u.role === "intern");
  const activeTasks = mockTasks.filter((t) => t.status !== "completed").length;
  const pendingReports = mockReports.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Team Lead Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="My Interns" value={myInterns.length} icon={Users} color="bg-blue-100 text-blue-700" />
        <StatCard label="Active Tasks" value={activeTasks} icon={Clock} color="bg-amber-100 text-amber-700" />
        <StatCard label="Pending Reviews" value={pendingReports} icon={FileText} color="bg-purple-100 text-purple-700" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
            Recent Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockTasks.slice(0, 4).map((task) => {
            const intern = mockUsers.find((u) => u.id === task.assignedTo);
            return (
              <div key={task.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{task.title}</p>
                  <p className="text-xs text-muted-foreground">Assigned to: {intern?.name} · Due: {task.deadline}</p>
                </div>
                <StatusBadge status={task.status} />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function SupervisorDashboard() {
  const pendingReports = mockReports.filter((r) => r.status === "pending").length;
  const reviewedReports = mockReports.filter((r) => r.status === "reviewed").length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Supervisor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Interns" value={mockUsers.filter(u => u.role === "intern").length} icon={Users} color="bg-blue-100 text-blue-700" />
        <StatCard label="Pending Reviews" value={pendingReports} icon={AlertTriangle} color="bg-amber-100 text-amber-700" />
        <StatCard label="Reviewed Reports" value={reviewedReports} icon={CheckSquare} color="bg-emerald-100 text-emerald-700" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Reports to Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{report.title}</p>
                <p className="text-xs text-muted-foreground">{report.internName} · {report.submittedAt}</p>
              </div>
              <StatusBadge status={report.status} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function InternDashboard() {
  const { user } = useAuth();
  const myTasks = mockTasks.filter((t) => t.assignedTo === user.id);
  const myReports = mockReports.filter((r) => r.internId === user.id);
  const myEval = mockEvaluations.find((e) => e.internId === user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="My Tasks" value={myTasks.length} icon={CheckSquare} color="bg-blue-100 text-blue-700" />
        <StatCard label="Reports Submitted" value={myReports.length} icon={FileText} color="bg-purple-100 text-purple-700" />
        <StatCard label="My Score" value={`${myEval?.totalMarks}%`} icon={BarChart3} color="bg-emerald-100 text-emerald-700" />
        <StatCard label="My Rank" value={`#${myEval?.rank}`} icon={Trophy} color="bg-amber-100 text-amber-700" />
      </div>

      {/* My Tasks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
            My Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {myTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{task.title}</p>
                <p className="text-xs text-muted-foreground">Deadline: {task.deadline}</p>
              </div>
              <StatusBadge status={task.status} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* My Reports */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            My Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {myReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{report.title}</p>
                <p className="text-xs text-muted-foreground">Submitted: {report.submittedAt}</p>
              </div>
              <div className="text-right flex items-center gap-2">
                <StatusBadge status={report.status} />
                {report.marks && <span className="text-xs text-muted-foreground">{report.marks}/100</span>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
