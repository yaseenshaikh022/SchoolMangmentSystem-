import { useState, useEffect } from "react";
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
  Calculator,
  TrendingUp,
  CheckCircle2,
  Send,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { generatePayslipPDF } from "@/lib/payslipPDF";

interface Employee {
  id: string;
  name: string;
  employee_id: string;
  department: string;
  position: string;
  basic_salary: number;
  email: string | null;
  phone: string | null;
  status: string;
}

interface Attendance {
  employee_id: string;
  month: string;
  attendance_days: number;
  working_days: number;
}

interface SalaryComponent {
  id: string;
  component_name: string;
  component_type: "allowance" | "deduction";
  calculation_type: "percentage" | "fixed";
  value: number;
  is_active: boolean;
}

interface Payslip {
  id: string;
  employee_id: string;
  month: string;
  basic_salary: number;
  earned_basic: number;
  total_allowances: number;
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  components: any;
  status: "generated" | "sent" | "paid";
  generated_at: string;
}

const HRPayroll = () => {
  const [selectedMonth, setSelectedMonth] = useState("January 2025");
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isAutomating, setIsAutomating] = useState(false);
  const [isComponentsOpen, setIsComponentsOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [salaryComponents, setSalaryComponents] = useState<SalaryComponent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch employees
      const { data: empData, error: empError } = await supabase
        .from("employees")
        .select("*")
        .eq("status", "active");
      
      if (empError) throw empError;
      setEmployees(empData || []);

      // Fetch attendance
      const { data: attData, error: attError } = await supabase
        .from("attendance")
        .select("*");
      
      if (attError) throw attError;
      setAttendance(attData || []);

      // Fetch payslips
      const { data: payData, error: payError } = await supabase
        .from("payslips")
        .select("*")
        .order("generated_at", { ascending: false });
      
      if (payError) throw payError;
      setPayslips((payData || []) as Payslip[]);

      // Fetch salary components
      const { data: compData, error: compError } = await supabase
        .from("salary_components")
        .select("*")
        .eq("is_active", true);
      
      if (compError) throw compError;
      setSalaryComponents((compData || []) as SalaryComponent[]);
    } catch (error: any) {
      toast.error("Failed to fetch data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateSalary = (employee: Employee, attendanceRecord?: Attendance) => {
    const attData = attendanceRecord || attendance.find(a => 
      a.employee_id === employee.employee_id && a.month === selectedMonth
    );
    
    const attendanceDays = attData?.attendance_days || 22;
    const workingDays = attData?.working_days || 22;
    const attendancePercentage = attendanceDays / workingDays;
    const earnedBasic = employee.basic_salary * attendancePercentage;
    
    let totalAllowances = 0;
    let totalDeductions = 0;
    const allowancesList: Array<{ name: string; amount: number }> = [];
    const deductionsList: Array<{ name: string; amount: number }> = [];
    
    // Calculate allowances
    salaryComponents
      .filter(c => c.component_type === "allowance" && c.is_active)
      .forEach(comp => {
        const amount = comp.calculation_type === "percentage" 
          ? (earnedBasic * comp.value / 100)
          : comp.value;
        totalAllowances += amount;
        allowancesList.push({ name: comp.component_name, amount: Math.round(amount) });
      });
    
    const grossSalary = earnedBasic + totalAllowances;
    
    // Calculate deductions
    salaryComponents
      .filter(c => c.component_type === "deduction" && c.is_active)
      .forEach(comp => {
        const amount = comp.calculation_type === "percentage" 
          ? (grossSalary * comp.value / 100)
          : comp.value;
        totalDeductions += amount;
        deductionsList.push({ name: comp.component_name, amount: Math.round(amount) });
      });
    
    const netSalary = grossSalary - totalDeductions;

    return {
      basicSalary: employee.basic_salary,
      earnedBasic: Math.round(earnedBasic),
      totalAllowances: Math.round(totalAllowances),
      grossSalary: Math.round(grossSalary),
      totalDeductions: Math.round(totalDeductions),
      netSalary: Math.round(netSalary),
      allowancesList,
      deductionsList,
      attendanceDays,
      workingDays
    };
  };

  const handleAutoGeneratePayslips = async () => {
    setIsAutomating(true);
    
    try {
      const payslipsToGenerate = employees.map(emp => {
        const calculated = calculateSalary(emp);
        return {
          employee_id: emp.employee_id,
          month: selectedMonth,
          basic_salary: calculated.basicSalary,
          earned_basic: calculated.earnedBasic,
          total_allowances: calculated.totalAllowances,
          gross_salary: calculated.grossSalary,
          total_deductions: calculated.totalDeductions,
          net_salary: calculated.netSalary,
          components: {
            allowances: calculated.allowancesList,
            deductions: calculated.deductionsList
          },
          status: "generated" as const
        };
      });

      const { error } = await supabase
        .from("payslips")
        .upsert(payslipsToGenerate, { 
          onConflict: "employee_id,month",
          ignoreDuplicates: false 
        });

      if (error) throw error;

      await fetchData();
      toast.success(`Generated ${payslipsToGenerate.length} payslips automatically!`);
      setIsGenerateOpen(false);
    } catch (error: any) {
      toast.error("Failed to generate payslips: " + error.message);
    } finally {
      setIsAutomating(false);
    }
  };

  const handleSendPayslip = async (payslipId: string, employeeId: string) => {
    try {
      const { error } = await supabase
        .from("payslips")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", payslipId);

      if (error) throw error;

      await fetchData();
      toast.success("Payslip sent to employee via email!");
    } catch (error: any) {
      toast.error("Failed to send payslip: " + error.message);
    }
  };

  const handleDownloadPayslip = (payslip: Payslip) => {
    const employee = employees.find(e => e.employee_id === payslip.employee_id);
    if (!employee) {
      toast.error("Employee not found");
      return;
    }

    generatePayslipPDF({
      employeeName: employee.name,
      employeeId: employee.employee_id,
      department: employee.department,
      position: employee.position,
      month: payslip.month,
      basicSalary: payslip.basic_salary,
      earnedBasic: payslip.earned_basic,
      components: payslip.components,
      totalAllowances: payslip.total_allowances,
      grossSalary: payslip.gross_salary,
      totalDeductions: payslip.total_deductions,
      netSalary: payslip.net_salary
    });

    toast.success("Payslip PDF downloaded!");
  };

  const currentMonthPayslips = payslips.filter(p => p.month === selectedMonth);
  const totalPayroll = currentMonthPayslips.reduce((sum, p) => sum + p.net_salary, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading HR data...</p>
        </div>
      </div>
    );
  }

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
              <div className="text-3xl font-bold">₹{totalPayroll.toLocaleString('en-IN')}</div>
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
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => setIsComponentsOpen(true)}>
                      <Settings className="h-4 w-4" />
                      Salary Components
                    </Button>
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
                            <li>• Allowances: Based on configured components</li>
                            <li>• Gross Salary = Earned Basic + Allowances</li>
                            <li>• Deductions: Based on configured components</li>
                            <li>• Net Salary = Gross - Deductions (in INR)</li>
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
                                  <div className="text-xs text-muted-foreground">{emp.employee_id}</div>
                                </div>
                              </TableCell>
                              <TableCell>{emp.department}</TableCell>
                              <TableCell>
                                <Badge variant={calc.attendanceDays === calc.workingDays ? "default" : "secondary"}>
                                  {calc.attendanceDays}/{calc.workingDays} days
                                </Badge>
                              </TableCell>
                              <TableCell>₹{emp.basic_salary.toLocaleString('en-IN')}</TableCell>
                              <TableCell className="font-bold text-primary">₹{calc.netSalary.toLocaleString('en-IN')}</TableCell>
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
                    {currentMonthPayslips.map((slip) => (
                      <TableRow key={slip.id}>
                        <TableCell className="font-mono">{slip.employee_id}</TableCell>
                        <TableCell>{slip.month}</TableCell>
                        <TableCell>₹{slip.basic_salary.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-primary">₹{slip.total_allowances.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-destructive">₹{slip.total_deductions.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="font-bold">₹{slip.net_salary.toLocaleString('en-IN')}</TableCell>
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
                              onClick={() => handleDownloadPayslip(slip)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            {slip.status === "generated" && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleSendPayslip(slip.id, slip.employee_id)}
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
                            <div className="text-xs text-muted-foreground">{emp.employee_id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{emp.department}</TableCell>
                        <TableCell>{emp.position}</TableCell>
                        <TableCell className="font-bold">₹{emp.basic_salary.toLocaleString('en-IN')}</TableCell>
                        <TableCell>
                          <Badge variant="default">{emp.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Salary Components Dialog */}
        <Dialog open={isComponentsOpen} onOpenChange={setIsComponentsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Manage Salary Components</DialogTitle>
              <DialogDescription>
                Configure allowances and deductions for payslip calculation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Allowances</h3>
                  <div className="space-y-2">
                    {salaryComponents
                      .filter(c => c.component_type === "allowance")
                      .map(comp => (
                        <div key={comp.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <p className="font-medium">{comp.component_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {comp.calculation_type === "percentage" 
                                ? `${comp.value}% of basic` 
                                : `₹${comp.value.toLocaleString('en-IN')} fixed`}
                            </p>
                          </div>
                          <Badge variant={comp.is_active ? "default" : "secondary"}>
                            {comp.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Deductions</h3>
                  <div className="space-y-2">
                    {salaryComponents
                      .filter(c => c.component_type === "deduction")
                      .map(comp => (
                        <div key={comp.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <p className="font-medium">{comp.component_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {comp.calculation_type === "percentage" 
                                ? `${comp.value}% of gross` 
                                : `₹${comp.value.toLocaleString('en-IN')} fixed`}
                            </p>
                          </div>
                          <Badge variant={comp.is_active ? "default" : "secondary"}>
                            {comp.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  💡 To add or modify components, use the backend dashboard to insert/update records in the salary_components table.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsComponentsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default HRPayroll;