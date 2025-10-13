import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  UserCheck, 
  Calendar, 
  GraduationCap, 
  DollarSign, 
  FileText,
  ShoppingCart,
  GitBranch,
  CalendarClock,
  Briefcase,
  ClipboardList,
  School,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const stats = [
    { label: "Total Students", value: "2,547", change: "+12%", icon: GraduationCap, color: "text-primary" },
    { label: "Active Staff", value: "142", change: "+3%", icon: Users, color: "text-secondary" },
    { label: "Attendance Today", value: "94%", change: "+2%", icon: UserCheck, color: "text-accent" },
    { label: "Revenue (Month)", value: "$84,320", change: "+18%", icon: DollarSign, color: "text-primary" },
  ];

  const quickActions = [
    { title: "Manage Students", icon: GraduationCap, path: "/students", description: "View and manage student records", color: "bg-primary" },
    { title: "Visitor Entry", icon: UserCheck, path: "/visitors", description: "Check-in/out visitors", color: "bg-secondary" },
    { title: "Staff Portal", icon: Users, path: "/staff-portal", description: "Staff attendance & payslips", color: "bg-accent" },
    { title: "HR & Payroll", icon: DollarSign, path: "/hr-payroll", description: "Generate payslips automatically", color: "bg-primary" },
  ];

  const recentActivities = [
    { action: "New student admitted", time: "5 minutes ago", icon: GraduationCap },
    { action: "Fee payment received", time: "12 minutes ago", icon: DollarSign },
    { action: "Staff attendance marked", time: "1 hour ago", icon: UserCheck },
    { action: "Exam schedule updated", time: "2 hours ago", icon: Calendar },
  ];

  const pendingTasks = [
    { task: "Review 12 admission applications", priority: "high" },
    { task: "Approve 5 leave requests", priority: "medium" },
    { task: "Process vendor invoices", priority: "low" },
    { task: "Update exam timetable", priority: "medium" },
  ];

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
                <h1 className="text-xl font-bold">School Management</h1>
                <p className="text-sm text-muted-foreground">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/students">
                <Button>Student Portal</Button>
              </Link>
              <Link to="/">
                <Button variant="outline">Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Administrator</h2>
          <p className="text-muted-foreground">Here's what's happening in your school today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-soft hover:shadow-elegant transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-primary">
                  <TrendingUp className="h-3 w-3" />
                  <span>{stat.change} from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path}>
                <Card className="shadow-soft hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full animate-fade-in" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                  <CardHeader>
                    <div className={`h-12 w-12 rounded-lg ${action.color} bg-gradient-to-br flex items-center justify-center mb-3`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                    <CardDescription className="text-sm">{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity and Pending Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="shadow-soft animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your institution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <activity.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card className="shadow-soft animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
              <CardDescription>Items requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTasks.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <AlertCircle className={`h-5 w-5 flex-shrink-0 ${
                      item.priority === 'high' ? 'text-destructive' : 
                      item.priority === 'medium' ? 'text-accent' : 'text-muted-foreground'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.task}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.priority === 'high' ? 'bg-destructive/10 text-destructive' : 
                      item.priority === 'medium' ? 'bg-accent/10 text-accent' : 'bg-muted-foreground/10 text-muted-foreground'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;