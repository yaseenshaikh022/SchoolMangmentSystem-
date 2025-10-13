import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserCheck, LogIn, LogOut, School, Clock, User, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Visitor {
  id: string;
  name: string;
  phone: string;
  purpose: string;
  visitingPerson: string;
  department: string;
  checkIn: string;
  checkOut: string | null;
  status: "checked-in" | "checked-out";
  badgeNumber: string;
}

const VisitorManagement = () => {
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [visitors, setVisitors] = useState<Visitor[]>([
    {
      id: "1",
      name: "Robert Smith",
      phone: "+1 555-0101",
      purpose: "Parent-Teacher Meeting",
      visitingPerson: "Ms. Johnson",
      department: "Academic",
      checkIn: "09:15 AM",
      checkOut: null,
      status: "checked-in",
      badgeNumber: "V001"
    },
    {
      id: "2",
      name: "Lisa Anderson",
      phone: "+1 555-0102",
      purpose: "Equipment Delivery",
      visitingPerson: "Mr. Wilson",
      department: "Administration",
      checkIn: "08:30 AM",
      checkOut: "10:45 AM",
      status: "checked-out",
      badgeNumber: "V002"
    },
    {
      id: "3",
      name: "John Davis",
      phone: "+1 555-0103",
      purpose: "Admission Inquiry",
      visitingPerson: "Mrs. Martinez",
      department: "Admissions",
      checkIn: "11:00 AM",
      checkOut: null,
      status: "checked-in",
      badgeNumber: "V003"
    }
  ]);

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newVisitor: Visitor = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      purpose: formData.get("purpose") as string,
      visitingPerson: formData.get("visitingPerson") as string,
      department: formData.get("department") as string,
      checkIn: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      checkOut: null,
      status: "checked-in",
      badgeNumber: `V${String(visitors.length + 1).padStart(3, '0')}`
    };

    setVisitors([newVisitor, ...visitors]);
    toast.success(`${newVisitor.name} checked in successfully! Badge: ${newVisitor.badgeNumber}`);
    setIsCheckInOpen(false);
  };

  const handleCheckOut = (visitorId: string) => {
    setVisitors(visitors.map(v => 
      v.id === visitorId 
        ? { ...v, checkOut: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), status: "checked-out" as const }
        : v
    ));
    toast.success("Visitor checked out successfully!");
  };

  const activeVisitors = visitors.filter(v => v.status === "checked-in");

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Visitor Management</h1>
                <p className="text-sm text-muted-foreground">Track and manage all visitors</p>
              </div>
            </div>
            <Link to="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Visitors
              </CardTitle>
              <LogIn className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeVisitors.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently on premises</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Today
              </CardTitle>
              <User className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{visitors.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Visitors registered</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Visit Time
              </CardTitle>
              <Clock className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">45m</div>
              <p className="text-xs text-muted-foreground mt-1">Average duration</p>
            </CardContent>
          </Card>
        </div>

        {/* Check-In Form */}
        <Card className="mb-6 shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Visitor Check-In</CardTitle>
                <CardDescription>Register new visitors and issue badges</CardDescription>
              </div>
              <Dialog open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <LogIn className="h-4 w-4" />
                    New Check-In
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Visitor Check-In</DialogTitle>
                    <DialogDescription>
                      Enter visitor details for check-in and badge generation
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCheckIn}>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" name="name" placeholder="John Doe" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="+1 555-0100" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="visitingPerson">Visiting Person *</Label>
                        <Input id="visitingPerson" name="visitingPerson" placeholder="Staff/Teacher Name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department *</Label>
                        <Select name="department" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Academic">Academic</SelectItem>
                            <SelectItem value="Administration">Administration</SelectItem>
                            <SelectItem value="Admissions">Admissions</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="HR">Human Resources</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="purpose">Purpose of Visit *</Label>
                        <Textarea id="purpose" name="purpose" placeholder="Describe the purpose of visit" required />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsCheckInOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Check In & Generate Badge</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
        </Card>

        {/* Visitors Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Today's Visitors</CardTitle>
            <CardDescription>All visitor entries for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Badge</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Visiting</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitors.map((visitor) => (
                    <TableRow key={visitor.id}>
                      <TableCell className="font-mono font-medium">{visitor.badgeNumber}</TableCell>
                      <TableCell className="font-medium">{visitor.name}</TableCell>
                      <TableCell className="text-muted-foreground">{visitor.phone}</TableCell>
                      <TableCell>{visitor.purpose}</TableCell>
                      <TableCell>{visitor.visitingPerson}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{visitor.department}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{visitor.checkIn}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {visitor.checkOut || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={visitor.status === "checked-in" ? "default" : "secondary"}>
                          {visitor.status === "checked-in" ? "Active" : "Completed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {visitor.status === "checked-in" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCheckOut(visitor.id)}
                            className="gap-2"
                          >
                            <LogOut className="h-4 w-4" />
                            Check Out
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisitorManagement;