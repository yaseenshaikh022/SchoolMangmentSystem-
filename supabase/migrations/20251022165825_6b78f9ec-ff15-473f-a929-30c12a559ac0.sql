-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  department TEXT NOT NULL,
  position TEXT NOT NULL,
  basic_salary DECIMAL(10,2) NOT NULL,
  joining_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT NOT NULL REFERENCES public.employees(employee_id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  attendance_days INTEGER NOT NULL,
  working_days INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(employee_id, month)
);

-- Create salary components table for customizable payslip
CREATE TABLE public.salary_components (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  component_name TEXT NOT NULL,
  component_type TEXT NOT NULL CHECK (component_type IN ('allowance', 'deduction')),
  calculation_type TEXT NOT NULL CHECK (calculation_type IN ('percentage', 'fixed')),
  value DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payslips table
CREATE TABLE public.payslips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT NOT NULL REFERENCES public.employees(employee_id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  basic_salary DECIMAL(10,2) NOT NULL,
  earned_basic DECIMAL(10,2) NOT NULL,
  total_allowances DECIMAL(10,2) NOT NULL,
  gross_salary DECIMAL(10,2) NOT NULL,
  total_deductions DECIMAL(10,2) NOT NULL,
  net_salary DECIMAL(10,2) NOT NULL,
  components JSONB NOT NULL,
  status TEXT DEFAULT 'generated' CHECK (status IN ('generated', 'sent', 'paid')),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(employee_id, month)
);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payslips ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allowing all operations for now, should be restricted based on user roles later)
CREATE POLICY "Allow all operations on employees" ON public.employees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on attendance" ON public.attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on salary_components" ON public.salary_components FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on payslips" ON public.payslips FOR ALL USING (true) WITH CHECK (true);

-- Insert default salary components
INSERT INTO public.salary_components (component_name, component_type, calculation_type, value) VALUES
  ('HRA', 'allowance', 'percentage', 10.00),
  ('Transport Allowance', 'allowance', 'fixed', 1500.00),
  ('Professional Tax', 'deduction', 'fixed', 200.00),
  ('Income Tax', 'deduction', 'percentage', 10.00),
  ('Provident Fund', 'deduction', 'percentage', 12.00);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();