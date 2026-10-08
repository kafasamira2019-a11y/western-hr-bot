const fs = require('fs');

const content = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

if (content.includes('generatePromotionTransfer')) {
    console.log('Already exists');
    process.exit(0);
}

const generatorCode = `
const generatePromotionTransfer = (doc: jsPDF, data: any) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("HUMAN RESOURCES DEPARTMENT", 105, 20, { align: "center" });
  doc.text("PAYROLL", 105, 26, { align: "center" });
  doc.text("Promotion / Transfer / Payroll Change Form", 105, 32, { align: "center" });
  doc.setFontSize(10);
  doc.text("HRPR02", 195, 32, { align: "right" });
  
  doc.setLineWidth(0.5);
  doc.line(15, 34, 195, 34);

  // Top Checkboxes
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  drawCheckbox(doc, 30, 38, data.isPromotion);
  doc.text("Promotion", 36, 42);
  drawCheckbox(doc, 75, 38, data.isTransfer);
  doc.text("Employee Transfer", 81, 42);
  drawCheckbox(doc, 125, 38, data.isPayrollChange);
  doc.text("Payroll Change", 131, 42);

  doc.setFontSize(10);
  doc.text("Employee's Information", 15, 52);
  
  doc.setFont("helvetica", "normal");
  doc.text("Employee's Name:", 15, 60);
  doc.setTextColor(0, 0, 255);
  doc.text(data.employeeName || "", 48, 59);
  doc.setTextColor(0, 0, 0);
  doc.line(46, 61, 95, 61);
  
  doc.text("Position:", 100, 60);
  doc.setTextColor(0, 0, 255);
  doc.text(data.positionTitle || "", 116, 59);
  doc.setTextColor(0, 0, 0);
  doc.line(114, 61, 160, 61);
  
  doc.text("Sex:", 165, 60);
  doc.setTextColor(0, 0, 255);
  doc.text(data.sex || "", 175, 59);
  doc.setTextColor(0, 0, 0);
  doc.line(173, 61, 195, 61);

  doc.text("Employment Date:", 15, 68);
  doc.setTextColor(0, 0, 255);
  doc.text(data.employmentDate || "", 45, 67);
  doc.setTextColor(0, 0, 0);
  doc.line(44, 69, 85, 69);
  
  doc.text("Department:", 90, 68);
  doc.setTextColor(0, 0, 255);
  doc.text(data.department || "", 112, 67);
  doc.setTextColor(0, 0, 0);
  doc.line(110, 69, 145, 69);
  
  doc.text("Campus:", 150, 68);
  doc.setTextColor(0, 0, 255);
  doc.text(data.campus || "", 166, 67);
  doc.setTextColor(0, 0, 0);
  doc.line(164, 69, 195, 69);

  doc.text("Employee Status:", 15, 76);
  drawCheckbox(doc, 45, 73, data.employeeStatus === 'Full-time');
  doc.text("Full-time", 50, 76);
  drawCheckbox(doc, 70, 73, data.employeeStatus === 'Semi Full-time');
  doc.text("Semi Full-time", 75, 76);
  drawCheckbox(doc, 105, 73, data.employeeStatus === 'Part-time');
  doc.text("Part-time", 110, 76);
  
  doc.text("Employee's ID:", 135, 76);
  doc.setTextColor(0, 0, 255);
  doc.text(data.employeeId || "", 162, 75);
  doc.setTextColor(0, 0, 0);
  doc.line(160, 77, 195, 77);

  doc.setFont("helvetica", "bold");
  doc.text("Position Effective Date:", 15, 86);
  doc.setTextColor(0, 0, 255);
  doc.text(data.positionEffectiveDate || "", 58, 85);
  doc.setTextColor(0, 0, 0);
  doc.line(56, 87, 100, 87);
  
  doc.text("Salary Effective Date:", 105, 86);
  doc.setTextColor(0, 0, 255);
  doc.text(data.salaryEffectiveDate || "", 145, 85);
  doc.setTextColor(0, 0, 0);
  doc.line(143, 87, 195, 87);

  doc.text("Rate Change:", 15, 96);
  doc.line(40, 97, 65, 97);
  doc.setTextColor(0, 0, 255);
  doc.text(data.rateChange || "", 45, 95);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.text("$ Per", 67, 96);
  drawCheckbox(doc, 78, 93, data.rateChangeType === 'hour');
  doc.text("hour", 83, 96);
  drawCheckbox(doc, 95, 93, data.rateChangeType === 'month');
  doc.text("month", 100, 96);
  
  doc.setFont("helvetica", "bold");
  doc.text("To", 115, 96);
  doc.line(122, 97, 147, 97);
  doc.setTextColor(0, 0, 255);
  doc.text(data.rateChangeTo || "", 125, 95);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.text("$ Per", 149, 96);
  drawCheckbox(doc, 160, 93, data.rateChangeTypeTo === 'hour');
  doc.text("hour", 165, 96);
  drawCheckbox(doc, 177, 93, data.rateChangeTypeTo === 'month');
  doc.text("month", 182, 96);

  let y = 104;
  
  const drawRow = (label, isChecked, fromVal, toVal) => {
    drawCheckbox(doc, 15, y-3, isChecked);
    doc.text(label, 20, y);
    doc.text("From", 55, y);
    doc.setTextColor(0, 0, 255);
    doc.text(fromVal || "", 70, y-1);
    doc.setTextColor(0, 0, 0);
    doc.line(65, y+1, 105, y+1);
    
    doc.text("To", 115, y);
    doc.setTextColor(0, 0, 255);
    doc.text(toVal || "", 130, y-1);
    doc.setTextColor(0, 0, 0);
    doc.line(125, y+1, 195, y+1);
    y += 8;
  };

  drawRow("Reason for change:", data.reasonForChange, data.reasonFrom, data.reasonTo);
  drawRow("Transfer Campus:", data.transferCampus, data.campusFrom, data.campusTo);
  drawRow("Transfer Position:", data.transferPosition, data.positionFrom, data.positionTo);
  drawRow("Promotion:", data.isPromotionCheck, data.promotionFrom, data.promotionTo);
  drawRow("Demotion:", data.isDemotion, data.demotionFrom, data.demotionTo);

  drawCheckbox(doc, 15, y-3, data.statusChange);
  doc.text("Status", 20, y);
  
  drawCheckbox(doc, 35, y-3, data.statusFrom === 'Semi Full-time');
  doc.text("Semi Full-time", 40, y);
  drawCheckbox(doc, 65, y-3, data.statusFrom === 'Part-time');
  doc.text("Part-time", 70, y);
  drawCheckbox(doc, 88, y-3, data.statusFrom === 'Full-time');
  doc.text("Full-time", 93, y);
  
  drawCheckbox(doc, 115, y-3, data.statusTo === 'Semi Full-time');
  doc.text("Semi Full-time", 120, y);
  drawCheckbox(doc, 145, y-3, data.statusTo === 'Part-time');
  doc.text("Part-time", 150, y);
  drawCheckbox(doc, 168, y-3, data.statusTo === 'Full-time');
  doc.text("Full-time", 173, y);
  y += 8;

  drawCheckbox(doc, 15, y-3, data.workingDaysChange);
  doc.text("Working day(s)", 20, y);
  doc.text("From Monday", 48, y);
  doc.setTextColor(0, 0, 255);
  doc.text(data.workingDaysFromEnd || "", 75, y-1);
  doc.setTextColor(0, 0, 0);
  doc.line(72, y+1, 105, y+1);
  
  doc.text("From Monday", 115, y);
  doc.setTextColor(0, 0, 255);
  doc.text(data.workingDaysToEnd || "", 145, y-1);
  doc.setTextColor(0, 0, 0);
  doc.line(140, y+1, 195, y+1);
  y += 8;

  drawCheckbox(doc, 15, y-3, data.workingHoursChange);
  doc.text("Working hour(s)", 20, y);
  doc.text("(AM) From:", 48, y);
  doc.line(66, y+1, 85, y+1);
  doc.setTextColor(0, 0, 255); doc.text(data.hoursAmFromStart || "", 68, y-1); doc.setTextColor(0, 0, 0);
  doc.text("to", 87, y);
  doc.line(92, y+1, 110, y+1);
  doc.setTextColor(0, 0, 255); doc.text(data.hoursAmFromEnd || "", 94, y-1); doc.setTextColor(0, 0, 0);
  
  doc.text("(AM) From:", 115, y);
  doc.line(133, y+1, 155, y+1);
  doc.setTextColor(0, 0, 255); doc.text(data.hoursAmToStart || "", 135, y-1); doc.setTextColor(0, 0, 0);
  doc.text("to", 157, y);
  doc.line(162, y+1, 195, y+1);
  doc.setTextColor(0, 0, 255); doc.text(data.hoursAmToEnd || "", 164, y-1); doc.setTextColor(0, 0, 0);
  y += 8;

  doc.text("(PM) From:", 48, y);
  doc.line(66, y+1, 85, y+1);
  doc.setTextColor(0, 0, 255); doc.text(data.hoursPmFromStart || "", 68, y-1); doc.setTextColor(0, 0, 0);
  doc.text("to", 87, y);
  doc.line(92, y+1, 110, y+1);
  doc.setTextColor(0, 0, 255); doc.text(data.hoursPmFromEnd || "", 94, y-1); doc.setTextColor(0, 0, 0);
  
  doc.text("(PM) From:", 115, y);
  doc.line(133, y+1, 155, y+1);
  doc.setTextColor(0, 0, 255); doc.text(data.hoursPmToStart || "", 135, y-1); doc.setTextColor(0, 0, 0);
  doc.text("to", 157, y);
  doc.line(162, y+1, 195, y+1);
  doc.setTextColor(0, 0, 255); doc.text(data.hoursPmToEnd || "", 164, y-1); doc.setTextColor(0, 0, 0);
  y += 10;
  
  doc.line(15, y, 195, y);

  // Signatures at the bottom (4 sections)
  y = 230; // Position them at the bottom
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  
  // Row 1
  doc.text("Recommended by (SP/Director/ Dept. Head)", 15, y);
  doc.text("Received by (SP/ Director/ Dept. Head)", 105, y);
  y += 10;
  
  doc.setFont("helvetica", "normal");
  doc.text("Signature:", 15, y); doc.line(35, y, 95, y);
  doc.text("Signature:", 105, y); doc.line(125, y, 195, y);
  y += 8;
  
  doc.text("Name:", 15, y); doc.line(35, y, 95, y);
  doc.text("Name:", 105, y); doc.line(125, y, 195, y);
  y += 8;
  
  doc.text("Date:", 15, y); doc.line(35, y, 95, y);
  doc.text("Date:", 105, y); doc.line(125, y, 195, y);
  y += 15;
  
  // Row 2
  doc.setFont("helvetica", "italic");
  doc.text("Checked by (HR Director/ Manager/Supervisor)", 15, y);
  doc.text("Approved by", 105, y);
  y += 10;
  
  doc.setFont("helvetica", "normal");
  doc.text("Signature:", 15, y); doc.line(35, y, 95, y);
  doc.text("Signature:", 105, y); doc.line(125, y, 195, y);
  y += 8;
  
  doc.text("Name:", 15, y); doc.line(35, y, 95, y);
  doc.text("Name:", 105, y); doc.line(125, y, 195, y);
  y += 8;
  
  doc.text("Date:", 15, y); doc.line(35, y, 95, y);
  doc.text("Date:", 105, y); doc.line(125, y, 195, y);
  
};
`;

let newContent = content.replace(/export const generatePDF = /g, generatorCode + "\nexport const generatePDF = ");

// Also we need to inject the case inside generatePDF switch statement
const switchPatch = `
    case 'promotionTransfer':
      generatePromotionTransfer(doc, data);
      break;
    case 'resigned':
`;
newContent = newContent.replace(/case 'resigned':/, switchPatch);

fs.writeFileSync('src/utils/formPdfGenerator.ts', newContent);
console.log('Patched formPdfGenerator.ts successfully.');
