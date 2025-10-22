import { jsPDF } from "jspdf";

interface PayslipData {
  employeeName: string;
  employeeId: string;
  department: string;
  position: string;
  month: string;
  basicSalary: number;
  earnedBasic: number;
  components: {
    allowances: Array<{ name: string; amount: number }>;
    deductions: Array<{ name: string; amount: number }>;
  };
  totalAllowances: number;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
}

export const generatePayslipPDF = (data: PayslipData) => {
  const doc = new jsPDF();
  
  // Company Header
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('SCHOOL MANAGEMENT SYSTEM', 105, 15, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text('Salary Slip', 105, 25, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Month: ${data.month}`, 105, 33, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Employee Information
  let yPos = 50;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Employee Information', 15, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  
  doc.text(`Name: ${data.employeeName}`, 15, yPos);
  doc.text(`Employee ID: ${data.employeeId}`, 120, yPos);
  
  yPos += 6;
  doc.text(`Department: ${data.department}`, 15, yPos);
  doc.text(`Position: ${data.position}`, 120, yPos);
  
  // Earnings Section
  yPos += 15;
  doc.setFont(undefined, 'bold');
  doc.setFillColor(240, 240, 240);
  doc.rect(15, yPos - 5, 180, 8, 'F');
  doc.text('EARNINGS', 20, yPos);
  doc.text('AMOUNT (₹)', 160, yPos);
  
  yPos += 10;
  doc.setFont(undefined, 'normal');
  
  doc.text('Basic Salary', 20, yPos);
  doc.text(`₹${data.basicSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 160, yPos);
  
  yPos += 6;
  doc.text('Earned Basic (Based on Attendance)', 20, yPos);
  doc.text(`₹${data.earnedBasic.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 160, yPos);
  
  // Allowances
  data.components.allowances.forEach((allowance) => {
    yPos += 6;
    doc.text(allowance.name, 20, yPos);
    doc.text(`₹${allowance.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 160, yPos);
  });
  
  yPos += 8;
  doc.setFont(undefined, 'bold');
  doc.text('Total Allowances:', 20, yPos);
  doc.text(`₹${data.totalAllowances.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 160, yPos);
  
  yPos += 6;
  doc.setFillColor(230, 240, 255);
  doc.rect(15, yPos - 3, 180, 7, 'F');
  doc.text('Gross Salary:', 20, yPos);
  doc.text(`₹${data.grossSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 160, yPos);
  
  // Deductions Section
  yPos += 15;
  doc.setFont(undefined, 'bold');
  doc.setFillColor(240, 240, 240);
  doc.rect(15, yPos - 5, 180, 8, 'F');
  doc.text('DEDUCTIONS', 20, yPos);
  doc.text('AMOUNT (₹)', 160, yPos);
  
  yPos += 10;
  doc.setFont(undefined, 'normal');
  
  // Deductions
  data.components.deductions.forEach((deduction) => {
    yPos += 6;
    doc.text(deduction.name, 20, yPos);
    doc.text(`₹${deduction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 160, yPos);
  });
  
  yPos += 8;
  doc.setFont(undefined, 'bold');
  doc.text('Total Deductions:', 20, yPos);
  doc.text(`₹${data.totalDeductions.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 160, yPos);
  
  // Net Salary
  yPos += 10;
  doc.setFillColor(46, 204, 113);
  doc.rect(15, yPos - 5, 180, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('NET SALARY:', 20, yPos);
  doc.text(`₹${data.netSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 160, yPos);
  
  // Footer
  doc.setTextColor(128, 128, 128);
  doc.setFontSize(8);
  doc.text('This is a computer-generated document. No signature is required.', 105, 280, { align: 'center' });
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 105, 285, { align: 'center' });
  
  // Save the PDF
  doc.save(`Payslip_${data.employeeId}_${data.month.replace(/\s+/g, '_')}.pdf`);
};
