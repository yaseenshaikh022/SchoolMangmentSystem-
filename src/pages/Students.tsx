import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { School, Search, Plus, Eye, Edit, Trash2, Download, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  class: string;
  rollNo: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  admissionDate: string;
}

const Students = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [students] = useState<Student[]>([
    {
      id: "1",
      name: "Emma Johnson",
      class: "Class 10-A",
      rollNo: "2024001",
      email: "emma.j@school.edu",
      phone: "+1 234-567-8901",
      status: "active",
      admissionDate: "2024-01-15"
    },
    {
      id: "2",
      name: "Michael Chen",
      class: "Class 10-A",
      rollNo: "2024002",
      email: "michael.c@school.edu",
      phone: "+1 234-567-8902",
      status: "active",
      admissionDate: "2024-01-16"
    },
    {
      id: "3",
      name: "Sophia Martinez",
      class: "Class 9-B",
      rollNo: "2024003",
      email: "sophia.m@school.edu",
      phone: "+1 234-567-8903",
      status: "active",
      admissionDate: "2024-01-20"
    },
    {
      id: "4",
      name: "James Wilson",
      class: "Class 11-C",
      rollNo: "2024004",
      email: "james.w@school.edu",
      phone: "+1 234-567-8904",
      status: "active",
      admissionDate: "2024-02-01"
    },
    {
      id: "5",
      name: "Olivia Brown",
      class: "Class 10-B",
      rollNo: "2024005",
      email: "olivia.b@school.edu",
      phone: "+1 234-567-8905",
      status: "inactive",
      admissionDate: "2024-02-10"
    }
  ]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Student added successfully!");
    setIsAddDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <School className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Student Management</h1>
                <p className="text-sm text-muted-foreground">Manage student records and information</p>
              </div>
            </div>
            <Link to="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <Card className="mb-6 shadow-soft">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students by name, roll no, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Import
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Student</DialogTitle>
                      <DialogDescription>
                        Enter student information to create a new record
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddStudent}>
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rollNo">Roll Number</Label>
                          <Input id="rollNo" placeholder="2024006" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="class">Class</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10-a">Class 10-A</SelectItem>
                              <SelectItem value="10-b">Class 10-B</SelectItem>
                              <SelectItem value="9-a">Class 9-A</SelectItem>
                              <SelectItem value="9-b">Class 9-B</SelectItem>
                              <SelectItem value="11-a">Class 11-A</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="admission-date">Admission Date</Label>
                          <Input id="admission-date" type="date" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="student@school.edu" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" type="tel" placeholder="+1 234-567-8900" required />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Input id="address" placeholder="123 Main St, City, State" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Add Student</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>
              Student Records ({filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Admission Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.rollNo}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell className="text-muted-foreground">{student.email}</TableCell>
                      <TableCell className="text-muted-foreground">{student.phone}</TableCell>
                      <TableCell>
                        <Badge variant={student.status === "active" ? "default" : "secondary"}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{student.admissionDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toast.info("View student details")}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toast.info("Edit student")}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toast.error("Delete student")}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
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

export default Students;