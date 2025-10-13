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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  DollarSign, 
  FileText,
  Download,
  School,
  Calculator,
  TrendingUp,
  CheckCircle2,
  Send
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  basicSalary: number;
  attendance: number;
  workingDays: number;
}

interface Payslip {
  employeeId: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: "generated" | "sent" | "paid";
}

const HRPayroll = () => {
  const [selectedMonth, setSelectedMonth] = useState("January 2025");
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isAutomating, setIsAutomating] = useState(false);

  const employees: Employee[] = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      employeeId: "EMP-2024-001",
      department: "Science",
      position: "Senior Teacher",
      basicSalary: 5000,
      attendance: 20,
      workingDays: 22
    },
    {
      id: "2",
      name: "Mr. Michael Chen",
      employeeId: "EMP-2024-002",
      department: "Mathematics",
      position: "Teacher",
      basicSalary: 4500,
      attendance: 22,
      workingDays: 22
    },
    {
      id: "3",
      name: "Ms. Emily Brown",
      employeeId: "EMP-2024-003",
      department: "English",
      position: "Teacher",
      basicSalary: 4200,
      attendance: 21,
      workingDays: 22
    },
    {
      id: "4",
      name: "Mr. David Wilson",
      employeeId: "EMP-2024-004",
      department: "Administration",
      position: "Admin Staff",
      basicSalary: 3800,
      attendance: 22,
      workingDays: 22
    }
  ];

  const [payslips, setPayslips] = useState<Payslip[]>([
    {
      employeeId: "EMP-2024-001",
      month: "December 2024",
      basicSalary: 5000,
      allowances: 500,
      deductions: 825,
      netSalary: 4675,
      status: "paid"
    },
    {
      employeeId: "EMP-2024-002",
      month: "December 2024",
      basicSalary: 4500,
      allowances: 450,
      deductions: 743,
      netSalary: 4207,
      status: "paid"
    }
  ]);

  const calculateSalary = (employee: Employee) => {
    const attendancePercentage = (employee.attendance / employee.workingDays);
    const earnedBasic = employee.basicSalary * attendancePercentage;
    const allowances = earnedBasic * 0.1; // 10% allowances
    const grossSalary = earnedBasic + allowances;
    const tax = grossSalary * 0.1; // 10% tax
    const insurance = 200; // Fixed insurance
    const deductions = tax + insurance;
    const netSalary = Math.round(grossSalary - deductions);

    return {
      basicSalary: Math.round(earnedBasic),
      allowances: Math.round(allowances),
      grossSalary: Math.round(grossSalary),
      tax: Math.round(tax),
      insurance,
      deductions: Math.round(deductions),
      netSalary
    };
  };

  const handleAutoGeneratePayslips = () => {
    setIsAutomating(true);
    
    setTimeout(() => {
      const newPayslips: Payslip[] = employees.map(emp => {
        const calculated = calculateSalary(emp);
        return {
          employeeId: emp.employeeId,
          month: selectedMonth,
          basicSalary: calculated.basicSalary,
          allowances: calculated.allowances,
          deductions: calculated.deductions,
          netSalary: calculated.netSalary,
          status: "generated" as const
        };
      });

      setPayslips([...newPayslips, ...payslips]);
      toast.success(`Generated ${newPayslips.length} payslips automatically!`);
      setIsAutomating(false);
      setIsGenerateOpen(false);
    }, 2000);
  };

  const handleSendPayslip = (employeeId: string) => {
    setPayslips(payslips.map(p => 
      p.employeeId === employeeId && p.month === selectedMonth
        ? { ...p, status: "sent" as const }
        : p
    ));
    toast.success("Payslip sent to employee via email!");
  };

  const handleDownloadPayslip = (employeeId: string) => {
    toast.success(`Downloading payslip for ${employeeId}`);
  };

  const currentMonthPayslips = payslips.filter(p => p.month === selectedMonth);
  const totalPayroll = currentMonthPayslips.reduce((sum, p) => sum + p.netSalary, 0);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">HR & Payroll Management</h1>
                <p className="text-sm text-muted-foreground">Automated salary processing & payslip generation</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Staff
              </CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{employees.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active employees</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Payroll
              </CardTitle>
              <DollarSign className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalPayroll.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">For {selectedMonth}</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Payslips Generated
              </CardTitle>
              <FileText className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentMonthPayslips.length}</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Attendance
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">96%</div>
              <p className="text-xs text-muted-foreground mt-1">Staff attendance</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="generate" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">Generate Payslips</TabsTrigger>
            <TabsTrigger value="payslips">Payslip Records</TabsTrigger>
            <TabsTrigger value="employees">Employee Salary</TabsTrigger>
          </TabsList>

          {/* Generate Tab */}
          <TabsContent value="generate">
            <Card className="shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Automated Payslip Generation</CardTitle>
                    <CardDescription>
                      Automatically calculate salaries based on attendance and generate payslips
                    </CardDescription>
                  </div>
                  <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Calculator className="h-4 w-4" />
                        Auto-Generate Payslips
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Generate Payslips Automatically</DialogTitle>
                        <DialogDescription>
                          System will calculate salaries based on attendance records and generate payslips for all employees
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Select Month</Label>
                          <Select defaultValue={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="January 2025">January 2025</SelectItem>
                              <SelectItem value="December 2024">December 2024</SelectItem>
                              <SelectItem value="November 2024">November 2024</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                          <h4 className="font-medium">Calculation Formula:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Basic Salary × (Attendance Days / Working Days)</li>
                            <li>• Allowances: 10% of earned basic</li>
                            <li>• Tax: 10% of gross salary</li>
                            <li>• Insurance: $200 (fixed)</li>
                            <li>• Net Salary = Gross - Deductions</li>
                          </ul>
                        </div>
                        <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
                          <p className="text-sm font-medium text-primary">
                            📊 {employees.length} employees will be processed
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsGenerateOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAutoGeneratePayslips} disabled={isAutomating}>
                          {isAutomating ? "Generating..." : "Generate All Payslips"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-4">Employee Attendance Summary</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Attendance</TableHead>
                          <TableHead>Basic Salary</TableHead>
                          <TableHead>Calculated Net</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employees.map((emp) => {
                          const calc = calculateSalary(emp);
                          return (
                            <TableRow key={emp.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{emp.name}</div>
                                  <div className="text-xs text-muted-foreground">{emp.employeeId}</div>
                                </div>
                              </TableCell>
                              <TableCell>{emp.department}</TableCell>
                              <TableCell>
                                <Badge variant={emp.attendance === emp.workingDays ? "default" : "secondary"}>
                                  {emp.attendance}/{emp.workingDays} days
                                </Badge>
                              </TableCell>
                              <TableCell>${emp.basicSalary}</TableCell>
                              <TableCell className="font-bold text-primary">${calc.netSalary}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payslips Tab */}
          <TabsContent value="payslips">
            <Card className="shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Generated Payslips</CardTitle>
                    <CardDescription>View and manage payslip records</CardDescription>
                  </div>
                  <Select defaultValue={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="January 2025">January 2025</SelectItem>
                      <SelectItem value="December 2024">December 2024</SelectItem>
                      <SelectItem value="November 2024">November 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead>Basic Salary</TableHead>
                      <TableHead>Allowances</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentMonthPayslips.map((slip, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono">{slip.employeeId}</TableCell>
                        <TableCell>{slip.month}</TableCell>
                        <TableCell>${slip.basicSalary}</TableCell>
                        <TableCell className="text-primary">${slip.allowances}</TableCell>
                        <TableCell className="text-destructive">${slip.deductions}</TableCell>
                        <TableCell className="font-bold">${slip.netSalary}</TableCell>
                        <TableCell>
                          <Badge variant={
                            slip.status === "paid" ? "default" :
                            slip.status === "sent" ? "secondary" : "outline"
                          }>
                            {slip.status === "paid" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                            {slip.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadPayslip(slip.employeeId)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            {slip.status === "generated" && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleSendPayslip(slip.employeeId)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Employee Salary Structure</CardTitle>
                <CardDescription>Manage employee salary information</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Basic Salary</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{emp.name}</div>
                            <div className="text-xs text-muted-foreground">{emp.employeeId}</div>
                          </div>
                        </TableCell>
                        <TableCell>{emp.department}</TableCell>
                        <TableCell>{emp.position}</TableCell>
                        <TableCell className="font-bold">${emp.basicSalary}</TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
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

export default HRPayroll;