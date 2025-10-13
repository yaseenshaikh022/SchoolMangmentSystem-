import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  ArrowRight,
  CheckCircle2,
  School
} from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const modules = [
    {
      icon: UserCheck,
      title: "Visitor Management",
      description: "Digital check-in/out, visitor badges, and security clearance workflows"
    },
    {
      icon: ClipboardList,
      title: "Admission & Enquiry",
      description: "Lead capture, application processing, and admission pipeline management"
    },
    {
      icon: Calendar,
      title: "Attendance System",
      description: "Real-time tracking, biometric integration, and comprehensive reports"
    },
    {
      icon: GraduationCap,
      title: "Student Information",
      description: "Complete student profiles, documents, ID cards, and academic records"
    },
    {
      icon: Users,
      title: "HR & Payroll",
      description: "Staff management, salary processing, and performance tracking"
    },
    {
      icon: FileText,
      title: "Academic Management",
      description: "Timetables, exams, grade management, and subject allocation"
    },
    {
      icon: DollarSign,
      title: "Finance & Accounting",
      description: "Fee collection, invoicing, expense tracking, and financial reports"
    },
    {
      icon: ShoppingCart,
      title: "Procurement",
      description: "Vendor management, quotations, work orders, and purchase tracking"
    },
    {
      icon: GitBranch,
      title: "Workflow & Approvals",
      description: "Multi-level approval chains and request management"
    },
    {
      icon: CalendarClock,
      title: "Meeting Scheduler",
      description: "Calendar system, room booking, and automated reminders"
    },
    {
      icon: Briefcase,
      title: "Recruitment",
      description: "Job posting, application tracking, and interview management"
    },
    {
      icon: School,
      title: "Staff Portal",
      description: "Personal dashboard, attendance, salary, and HR requests"
    }
  ];

  const features = [
    "Role-based access control",
    "Real-time notifications",
    "Comprehensive reporting",
    "Mobile responsive design",
    "Cloud-based storage",
    "Multi-language support"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
            <School className="h-5 w-5 text-white" />
            <span className="text-sm font-medium text-white">Open Source School Management System</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Complete School
            <br />
            Management Solution
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Streamline your educational institution with our comprehensive, open-source management platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-elegant">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                View Demo Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground text-lg">Everything you need to manage your institution efficiently</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Modules</h2>
            <p className="text-muted-foreground text-lg">All the tools you need in one integrated platform</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <Card key={index} className="shadow-soft hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border/50 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-3">
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Institution?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Join thousands of schools already using our platform
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 School Management System. Open Source & Free to Use.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;