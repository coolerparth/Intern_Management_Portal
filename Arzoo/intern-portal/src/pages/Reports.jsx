import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { mockReports } from "../data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Upload, Eye, FileText, X } from "lucide-react";

export default function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState(mockReports);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: "", file: null });
  const [previewReport, setPreviewReport] = useState(null);

  const visibleReports = user?.role === "intern"
    ? reports.filter((r) => r.internId === user.id)
    : reports;

  const handleUpload = (e) => {
    e.preventDefault();
    const report = {
      id: Date.now(),
      title: uploadForm.title,
      internId: user.id,
      internName: user.name,
      submittedAt: new Date().toISOString().split("T")[0],
      status: "pending",
      fileName: uploadForm.file?.name || "report.pdf",
      marks: null,
    };
    setReports([...reports, report]);
    setUploadForm({ title: "", file: null });
    setShowUpload(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {user?.role === "intern" ? "My Reports" : "Report Management"}
        </h1>
        {user?.role === "intern" && (
          <Button onClick={() => setShowUpload(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Report
          </Button>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Report</DialogTitle>
            <DialogDescription>Submit your report as a PDF file.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label>Report Title</Label>
              <Input
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                placeholder="Enter report title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Upload PDF</Label>
              <div className="border-2 border-dashed border-input rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-foreground font-medium">
                    {uploadForm.file ? uploadForm.file.name : "Click to upload PDF file"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PDF files only, max 10MB</p>
                </label>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowUpload(false)}>Cancel</Button>
              <Button type="submit">Submit Report</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewReport} onOpenChange={() => setPreviewReport(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewReport?.title}</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-3 py-4">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
            <div className="space-y-1 text-sm">
              <p><strong>File:</strong> {previewReport?.fileName}</p>
              <p><strong>Submitted by:</strong> {previewReport?.internName}</p>
              <p><strong>Date:</strong> {previewReport?.submittedAt}</p>
              <p><strong>Status:</strong> <Badge variant={previewReport?.status === "reviewed" ? "success" : "warning"}>{previewReport?.status}</Badge></p>
            </div>
            {previewReport?.marks !== null && previewReport?.marks !== undefined && (
              <p className="text-lg font-bold text-primary">Marks: {previewReport?.marks}/100</p>
            )}
            <div className="mt-6 bg-muted rounded-lg p-10">
              <p className="text-sm text-muted-foreground">PDF Preview Area</p>
              <p className="text-xs text-muted-foreground">(In production, the PDF would be rendered here)</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reports Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Title</TableHead>
                {user?.role !== "intern" && <TableHead>Submitted By</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.title}</TableCell>
                  {user?.role !== "intern" && <TableCell className="text-muted-foreground">{report.internName}</TableCell>}
                  <TableCell className="text-muted-foreground">{report.submittedAt}</TableCell>
                  <TableCell className="text-muted-foreground">{report.fileName}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === "reviewed" ? "success" : "warning"}>{report.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {report.marks !== null ? `${report.marks}/100` : "—"}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setPreviewReport(report)} className="gap-1 text-primary">
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Button>
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
