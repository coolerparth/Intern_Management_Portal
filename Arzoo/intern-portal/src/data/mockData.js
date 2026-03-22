// Mock data for the Intern Management Portal

export const mockUsers = [
  { id: 1, name: "Admin User", email: "admin@portal.com", password: "admin123", role: "admin", avatar: "AU" },
  { id: 2, name: "Rahul Sharma", email: "rahul@portal.com", password: "lead123", role: "teamlead", avatar: "RS" },
  { id: 3, name: "Priya Gupta", email: "priya@portal.com", password: "super123", role: "supervisor", avatar: "PG" },
  { id: 4, name: "Amit Kumar", email: "amit@portal.com", password: "intern123", role: "intern", avatar: "AK" },
  { id: 5, name: "Sneha Patel", email: "sneha@portal.com", password: "intern123", role: "intern", avatar: "SP" },
  { id: 6, name: "Rohan Verma", email: "rohan@portal.com", password: "intern123", role: "intern", avatar: "RV" },
  { id: 7, name: "Neha Singh", email: "neha@portal.com", password: "intern123", role: "intern", avatar: "NS" },
  { id: 8, name: "Vikram Joshi", email: "vikram@portal.com", password: "intern123", role: "intern", avatar: "VJ" },
];

export const mockTasks = [
  { id: 1, title: "Build Login Page UI", description: "Create a responsive login page using React and Tailwind CSS", assignedTo: 4, assignedBy: 2, deadline: "2026-03-25", status: "in-progress", priority: "high", createdAt: "2026-03-10" },
  { id: 2, title: "Database Schema Design", description: "Design MongoDB schema for the intern portal project", assignedTo: 5, assignedBy: 2, deadline: "2026-03-22", status: "completed", priority: "medium", createdAt: "2026-03-08" },
  { id: 3, title: "API Documentation", description: "Write comprehensive API documentation for all endpoints", assignedTo: 6, assignedBy: 2, deadline: "2026-03-28", status: "pending", priority: "low", createdAt: "2026-03-12" },
  { id: 4, title: "Unit Testing Setup", description: "Set up Jest and React Testing Library for frontend testing", assignedTo: 4, assignedBy: 2, deadline: "2026-03-30", status: "pending", priority: "high", createdAt: "2026-03-15" },
  { id: 5, title: "Dashboard Charts", description: "Implement Chart.js charts for the admin dashboard", assignedTo: 7, assignedBy: 2, deadline: "2026-03-20", status: "completed", priority: "medium", createdAt: "2026-03-05" },
  { id: 6, title: "File Upload Module", description: "Build PDF upload and preview functionality", assignedTo: 8, assignedBy: 2, deadline: "2026-03-26", status: "in-progress", priority: "high", createdAt: "2026-03-11" },
];

export const mockReports = [
  { id: 1, title: "Week 1 Progress Report", internId: 4, internName: "Amit Kumar", submittedAt: "2026-03-14", status: "reviewed", fileName: "week1_report.pdf", marks: 85 },
  { id: 2, title: "Database Design Document", internId: 5, internName: "Sneha Patel", submittedAt: "2026-03-16", status: "pending", fileName: "db_design.pdf", marks: null },
  { id: 3, title: "Week 1 Progress Report", internId: 6, internName: "Rohan Verma", submittedAt: "2026-03-15", status: "reviewed", fileName: "week1_rohan.pdf", marks: 72 },
  { id: 4, title: "API Spec Draft", internId: 7, internName: "Neha Singh", submittedAt: "2026-03-17", status: "pending", fileName: "api_spec.pdf", marks: null },
  { id: 5, title: "Week 2 Progress Report", internId: 4, internName: "Amit Kumar", submittedAt: "2026-03-18", status: "pending", fileName: "week2_amit.pdf", marks: null },
];

export const mockEvaluations = [
  { id: 1, internId: 4, internName: "Amit Kumar", taskMarks: 88, reportMarks: 85, attendance: 92, totalMarks: 88, rank: 1 },
  { id: 2, internId: 5, internName: "Sneha Patel", taskMarks: 82, reportMarks: 78, attendance: 95, totalMarks: 85, rank: 2 },
  { id: 3, internId: 7, internName: "Neha Singh", taskMarks: 79, reportMarks: 80, attendance: 88, totalMarks: 82, rank: 3 },
  { id: 4, internId: 6, internName: "Rohan Verma", taskMarks: 75, reportMarks: 72, attendance: 90, totalMarks: 79, rank: 4 },
  { id: 5, internId: 8, internName: "Vikram Joshi", taskMarks: 70, reportMarks: 68, attendance: 85, totalMarks: 74, rank: 5 },
];

export const mockNotifications = [
  { id: 1, message: "New task assigned: Build Login Page UI", type: "task", read: false, createdAt: "2026-03-18T10:30:00" },
  { id: 2, message: "Marks released for Week 1 Progress Report: 85/100", type: "marks", read: false, createdAt: "2026-03-17T14:00:00" },
  { id: 3, message: "Feedback received on Database Design Document", type: "feedback", read: true, createdAt: "2026-03-16T09:15:00" },
  { id: 4, message: "New task assigned: Unit Testing Setup", type: "task", read: true, createdAt: "2026-03-15T11:00:00" },
  { id: 5, message: "Deadline approaching: Dashboard Charts - Mar 20", type: "deadline", read: false, createdAt: "2026-03-18T08:00:00" },
];

export const mockForms = [
  { id: 1, title: "Intern Feedback Form", description: "Monthly feedback form for all interns", createdBy: 1, status: "active", responses: 3, createdAt: "2026-03-01", link: "/forms/1" },
  { id: 2, title: "Project Preference Survey", description: "Survey to understand intern project preferences", createdBy: 1, status: "active", responses: 5, createdAt: "2026-03-10", link: "/forms/2" },
  { id: 3, title: "Exit Survey", description: "Feedback form for completing interns", createdBy: 1, status: "closed", responses: 2, createdAt: "2026-02-15", link: "/forms/3" },
];
