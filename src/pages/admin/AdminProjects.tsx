
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, Clock, RefreshCw, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ProjectRequest = {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  project_title: string;
  project_description: string;
  budget: number;
  status: string;
  created_at: string;
};

const statusColorMap: Record<string, string> = {
  pending: "bg-yellow-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
  "in-progress": "bg-blue-500",
  completed: "bg-purple-500",
};

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const AdminProjects = () => {
  const [projects, setProjects] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("project_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load project requests");
    } finally {
      setLoading(false);
    }
  }

  async function refreshData() {
    setRefreshing(true);
    await fetchProjects();
    setRefreshing(false);
  }

  function openStatusDialog(project: ProjectRequest) {
    setSelectedProject(project);
    setNewStatus(project.status);
    setIsDialogOpen(true);
  }

  async function updateStatus() {
    if (!selectedProject) return;
    
    try {
      const { error } = await supabase
        .from("project_requests")
        .update({ status: newStatus })
        .eq("id", selectedProject.id);

      if (error) throw error;
      
      setProjects(projects.map(project => 
        project.id === selectedProject.id 
          ? { ...project, status: newStatus } 
          : project
      ));
      
      toast.success(`Project status updated to ${newStatus}`);
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating project status:", error);
      toast.error("Failed to update project status");
    }
  }

  function getStatusIcon(status: string) {
    switch(status) {
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      default: return null;
    }
  }

  return (
    <AdminLayout title="Project Requests">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Project Requests</h1>
            <p className="text-muted-foreground">View and manage client project requests.</p>
          </div>
          <Button 
            variant="outline" 
            onClick={refreshData} 
            disabled={refreshing || loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.filter(project => project.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.filter(project => project.status === "approved" || project.status === "in-progress" || project.status === "completed").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.filter(project => project.status === "rejected").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Project Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="animate-spin h-8 w-8 text-muted-foreground" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No project requests found</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Project Title</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-muted-foreground">{project.email}</div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {project.project_title}
                        </TableCell>
                        <TableCell>
                          ${project.budget?.toLocaleString() || "Not specified"}
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={statusColorMap[project.status] || "bg-gray-500"}
                          >
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openStatusDialog(project)}
                          >
                            Update Status
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Project Status</DialogTitle>
            <DialogDescription>
              Change the status of the project request by {selectedProject?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Project Title</h3>
                <p>{selectedProject?.project_title}</p>
              </div>
              <div>
                <h3 className="font-medium">Current Status</h3>
                <Badge 
                  variant="outline"
                  className={selectedProject?.status ? statusColorMap[selectedProject.status] || "bg-gray-500" : ""}
                >
                  {selectedProject?.status.charAt(0).toUpperCase() + selectedProject?.status.slice(1) || ""}
                </Badge>
              </div>
              <div>
                <h3 className="font-medium">Select New Status</h3>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center">
                          {getStatusIcon(status.value)}
                          <span className="ml-2">{status.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={updateStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProjects;
