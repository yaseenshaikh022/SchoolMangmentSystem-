import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Calendar, 
  DollarSign, 
  FileText, 
  Download,
  School,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const StaffPortal = () => {
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);

  const staffInfo = {
    name: "Dr. Sarah Johnson",
    employeeId: "EMP-2024-001",
    department: "Science",
    position: "Senior Teacher",
    joiningDate: "2020-03-15",
    email: "sarah.johnson@school.edu",
    phone: "+1 234-567-8900"
  };

  const attendanceData = [
    { date: "2025-01-13", status: "present", checkIn: "08:45 AM", checkOut: "04:30 PM" },
    { date: "2025-01-12", status: "present", checkIn: "08:50 AM", checkOut: "04:25 PM" },
    { date: "2025-01-11", status: "present", checkIn: "08:42 AM", checkOut: "04:35 PM" },
    { date: "2025-01-10", status: "leave", checkIn: "-", checkOut: "-" },
    { date: "2025-01-09", status: "present", checkIn: "08:48 AM", checkOut: "04:28 PM" }
  ];

  const payslips = [
    { month: "December 2024", grossSalary: 5500, deductions: 825, netSalary: 4675, status: "paid" },
    { month: "November 2024", grossSalary: 5500, deductions: 825, netSalary: 4675, status: "paid" },
    { month: "October 2024", grossSalary: 5500, deductions: 825, netSalary: 4675, status: "paid" }
  ];

  const leaveBalance = {
    casual: { total: 12, used: 3, remaining: 9 },
    sick: { total: 10, used: 2, remaining: 8 },
    annual: { total: 20, used: 8, remaining: 12 }
  };

  const complaints = [
    { id: 1, subject: "Classroom AC not working", date: "2025-01-10", status: "resolved" },
    { id: 2, subject: "Request for teaching materials", date: "2025-01-08", status: "pending" }
  ];

  const handleDownloadPayslip = (month: string) => {
    toast.success(`Downloading payslip for ${month}`);
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Complaint submitted successfully!");
    setIsComplaintOpen(false);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Staff Portal</h1>
                <p className="text-sm text-muted-foreground">Welcome, {staffInfo.name}</p>
              </div>
            </div>
            <Link to="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                This Month Salary
              </CardTitle>
              <DollarSign className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${payslips[0].netSalary}</div>
              <p className="text-xs text-muted-foreground mt-1">Net payment</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Attendance Rate
              </CardTitle>
              <Calendar className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Leave Balance
              </CardTitle>
              <Clock className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leaveBalance.casual.remaining}</div>
              <p className="text-xs text-muted-foreground mt-1">Casual leave days</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Requests
              </CardTitle>
              <AlertCircle className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
            </CardContent>
          </Card>
        </div>

        {/* Staff Information Card */}
        <Card className="mb-6 shadow-soft">
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Employee ID</p>
                <p className="font-medium">{staffInfo.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{staffInfo.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Position</p>
                <p className="font-medium">{staffInfo.position}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Joining Date</p>
                <p className="font-medium">{staffInfo.joiningDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{staffInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{staffInfo.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="payslips">Payslips</TabsTrigger>
            <TabsTrigger value="leaves">Leaves</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>

          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>Your recent attendance records</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceData.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{record.date}</TableCell>
                        <TableCell>
                          <Badge variant={record.status === "present" ? "default" : "secondary"}>
                            {record.status === "present" ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{record.checkIn}</TableCell>
                        <TableCell className="text-muted-foreground">{record.checkOut}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {record.status === "present" ? "7h 45m" : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payslips Tab */}
          <TabsContent value="payslips">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Salary Slips</CardTitle>
                <CardDescription>Download your monthly payslips</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Gross Salary</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payslips.map((slip, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{slip.month}</TableCell>
                        <TableCell>${slip.grossSalary}</TableCell>
                        <TableCell className="text-destructive">${slip.deductions}</TableCell>
                        <TableCell className="font-bold text-primary">${slip.netSalary}</TableCell>
                        <TableCell>
                          <Badge variant="default">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {slip.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadPayslip(slip.month)}
                            className="gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaves Tab */}
          <TabsContent value="leaves">
            <div className="grid gap-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Leave Balance</CardTitle>
                  <CardDescription>Your available leave days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <h4 className="font-medium">Casual Leave</h4>
                        <p className="text-sm text-muted-foreground">Used: {leaveBalance.casual.used} / {leaveBalance.casual.total}</p>
                      </div>
                      <div className="text-2xl font-bold text-primary">{leaveBalance.casual.remaining}</div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <h4 className="font-medium">Sick Leave</h4>
                        <p className="text-sm text-muted-foreground">Used: {leaveBalance.sick.used} / {leaveBalance.sick.total}</p>
                      </div>
                      <div className="text-2xl font-bold text-secondary">{leaveBalance.sick.remaining}</div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <h4 className="font-medium">Annual Leave</h4>
                        <p className="text-sm text-muted-foreground">Used: {leaveBalance.annual.used} / {leaveBalance.annual.total}</p>
                      </div>
                      <div className="text-2xl font-bold text-accent">{leaveBalance.annual.remaining}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Leave Requests</CardTitle>
                      <CardDescription>Submit new leave applications</CardDescription>
                    </div>
                    <Button className="gap-2">
                      <Calendar className="h-4 w-4" />
                      Apply for Leave
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests">
            <Card className="shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Complaints & Requests</CardTitle>
                    <CardDescription>Submit and track your requests</CardDescription>
                  </div>
                  <Dialog open={isComplaintOpen} onOpenChange={setIsComplaintOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        New Request
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submit Request</DialogTitle>
                        <DialogDescription>
                          Describe your complaint or request to HR
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmitComplaint}>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <input
                              id="subject"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              placeholder="Brief subject"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              placeholder="Provide detailed information"
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsComplaintOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Submit Request</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaints.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell className="font-medium">{complaint.subject}</TableCell>
                        <TableCell className="text-muted-foreground">{complaint.date}</TableCell>
                        <TableCell>
                          <Badge variant={complaint.status === "resolved" ? "default" : "secondary"}>
                            {complaint.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StaffPortal;