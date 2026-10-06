const fs = require('fs');
let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

let blockStart = c.indexOf('  } else if (form.type === \'clearance\') {');
if (blockStart !== -1) {
    let blockEnd = c.indexOf('  } else {', blockStart);
    c = c.substring(0, blockStart) + c.substring(blockEnd);
}

blockStart = c.indexOf('  } else {');
const clearanceLogic = `
  } else if (form.type === 'clearance') {
    // ----------------------------------------------------
    // CLEARANCE FORM (HRPRO3)
    // ----------------------------------------------------
    
    // Header
    docPDF.setFontSize(13);
    docPDF.setFont('times', 'bold');
    docPDF.text("HUMAN RESOURCES DEPARTMENT", 130, 14, { align: 'center' });
    docPDF.text("PAYROLL", 130, 20, { align: 'center' });
    
    docPDF.setFontSize(14);
    docPDF.text("Clearance Form", 110, 28, { align: 'center' });
    docPDF.setFontSize(12);
    docPDF.text("HRPRO3", 185, 28, { align: 'right' });

    docPDF.setFontSize(7);
    docPDF.setTextColor(0, 0, 255);
    docPDF.text("BACK TO HOME", 185, 20, { align: 'right' });
    docPDF.setTextColor(0, 0, 0);

    // PERFECT LOGO FOR CLEARANCE
    try {
      docPDF.addImage(wisLogoBase64, 'PNG', 10, 8, 55, 18);
    } catch (e) { }

    let y = 32;

    // Disclaimer Box
    docPDF.setLineWidth(HALF_PT);
    docPDF.rect(10, y, 190, 20);
    docPDF.setFontSize(9.5);
    docPDF.setFont('times', 'normal');
    const disclaimer1 = "The Employee Clearance Form is designed to help all WIS departments track records and verify the return of WIS property by departing";
    const disclaimer2 = "employees, whether due to resignation or termination. It also confirms that the employee has effectively transferred their tasks and";
    const disclaimer3 = "responsibilities to a successor. This form must be thoroughly reviewed, filled out, and submitted to the Central HR Department on the";
    const disclaimer4 = "employee's final workday.";
    docPDF.text(disclaimer1, 12, y + 4.5);
    docPDF.text(disclaimer2, 12, y + 9);
    docPDF.text(disclaimer3, 12, y + 13.5);
    docPDF.text(disclaimer4, 12, y + 18);
    
    y += 24;

    // Employee Details
    docPDF.setLineDashPattern([1, 1], 0);
    docPDF.setFontSize(10.5);

    docPDF.text("Employee's ID:", 10, y);
    docPDF.line(34, y + 1, 65, y + 1);
    docPDF.text(form.employeeId || '', 35, y);

    docPDF.text("Employee's Name:", 68, y);
    docPDF.line(97, y + 1, 140, y + 1);
    docPDF.text(form.employeeName || '', 98, y);

    docPDF.text("Starting Date:", 145, y);
    docPDF.line(168, y + 1, 200, y + 1);
    docPDF.text(form.startDate || '', 169, y);
    y += 6;

    docPDF.text("Position:", 10, y);
    docPDF.line(24, y + 1, 80, y + 1);
    docPDF.text(form.positionTitle || '', 25, y);

    docPDF.text("Campus:", 83, y);
    docPDF.line(98, y + 1, 130, y + 1);
    docPDF.text(form.campus || '', 99, y);

    docPDF.text("Phone number:", 135, y);
    docPDF.line(160, y + 1, 200, y + 1);
    docPDF.text(form.contactNo || '', 161, y);
    y += 6;

    docPDF.text("Last day of work:", 10, y);
    docPDF.line(38, y + 1, 200, y + 1);
    docPDF.text(form.lastDayOfWork || '', 39, y);

    docPDF.setLineDashPattern([], 0);

    y += 4;
    // Main Table
    docPDF.setLineWidth(1.0);
    docPDF.rect(10, y, 190, 6);
    docPDF.setLineWidth(HALF_PT);
    docPDF.line(105, y, 105, y + 6);
    
    docPDF.setFont('times', 'bold');
    docPDF.text("Department/Items Checklist (Tick)", 30, y + 4);
    docPDF.text("Authorized Signatory", 130, y + 4);

    y += 6;
    docPDF.setFont('times', 'normal');

    const drawSection = (title, items, isTwoColSignatory, sigLabels) => {
      const startY = y;
      
      docPDF.setFont('times', 'bold');
      docPDF.text(title, 35, y + 4, { align: 'center' });
      docPDF.setFont('times', 'normal');
      y += 6;

      let itemY = y;
      items.forEach(item => {
        // Col mapping: 1 -> 20, 2 -> 50, 3 -> 80
        let ix = item.col === 1 ? 20 : item.col === 2 ? 45 : 70;
        if (item.isLine) {
           docPDF.setLineDashPattern([1, 1], 0);
           docPDF.line(ix + 6, itemY + 4, ix + 6 + 60, itemY + 4);
           docPDF.setLineDashPattern([], 0);
        } else {
           docPDF.rect(ix, itemY, 3.5, 3.5); // Checkbox
           docPDF.setFontSize(9);
           docPDF.text(item.label, ix + 5, itemY + 3);
           docPDF.setFontSize(10.5);
        }
        if (item.forceRow) {
           itemY += 5;
        }
      });

      let itemsHeight = itemY - y;
      let totalHeight = Math.max(itemsHeight + 5, isTwoColSignatory ? 22 : 18) + 8;
      
      docPDF.setLineWidth(1.0);
      docPDF.rect(10, startY, 190, totalHeight);
      docPDF.setLineWidth(HALF_PT);
      docPDF.line(105, startY, 105, startY + totalHeight);

      let sigY = startY + totalHeight - 16;
      docPDF.setFontSize(9);
      if (isTwoColSignatory) {
        docPDF.text(sigLabels[0], 107, sigY);
        docPDF.text(sigLabels[1], 155, sigY);
        
        docPDF.setLineDashPattern([1, 1], 0);
        docPDF.text("Name:", 107, sigY + 6);
        docPDF.line(118, sigY + 6, 150, sigY + 6);
        docPDF.text("Name:", 155, sigY + 6);
        docPDF.line(166, sigY + 6, 198, sigY + 6);

        docPDF.text("Date:", 107, sigY + 12);
        docPDF.line(116, sigY + 12, 150, sigY + 12);
        docPDF.text("Date:", 155, sigY + 12);
        docPDF.line(164, sigY + 12, 198, sigY + 12);
        docPDF.setLineDashPattern([], 0);
      } else {
        docPDF.text(sigLabels[0], 107, sigY);
        docPDF.setLineDashPattern([1, 1], 0);
        docPDF.text("Name:", 107, sigY + 6);
        docPDF.line(118, sigY + 6, 198, sigY + 6);
        docPDF.text("Date:", 107, sigY + 12);
        docPDF.line(116, sigY + 12, 198, sigY + 12);
        docPDF.setLineDashPattern([], 0);
      }
      docPDF.setFontSize(10.5);

      y = startY + totalHeight;
    };

    drawSection("HUMAN RESOURCES", [
      { label: "WIS ID Card", col: 1, forceRow: true },
      { label: "Request Deleting Email", col: 1, forceRow: true },
      { label: "", isLine: true, col: 1, forceRow: true }
    ], false, ["HR/GEP Officer"]);

    drawSection("ADMINISTRATION", [
      { label: "Computer", col: 1, forceRow: false },
      { label: "Hard Disk", col: 2, forceRow: false },
      { label: "Uniform", col: 3, forceRow: true },
      
      { label: "USB Drive", col: 1, forceRow: false },
      { label: "Phone", col: 2, forceRow: false },
      { label: "CCTV", col: 3, forceRow: true },

      { label: "Camera", col: 1, forceRow: false },
      { label: "Text Book", col: 2, forceRow: true },

      { label: "", isLine: true, col: 1, forceRow: true }
    ], true, ["Admin Officer/Supervisor", "Inventory Controller"]);

    drawSection("ACADEMICS", [
      { label: "Lesson Plan", col: 1, forceRow: false },
      { label: "E-Grade Book", col: 2, forceRow: true },
      { label: "", isLine: true, col: 1, forceRow: true }
    ], true, ["Academic Coordinator/VSP", "Registrar Supervisor/Officer"]);

    drawSection("FINANCE", [
      { label: "Sale Receipt Money Exchange", col: 1, forceRow: true },
      { label: "Emergency Cash Expense", col: 1, forceRow: true },
      { label: "", isLine: true, col: 1, forceRow: true }
    ], false, ["Accountants/Finance( Officer, Supervisor, Manager, Director)"]);

    y += 6;
    docPDF.setFont('times', 'bold');
    docPDF.text("Confirm that all WIS properties in my possession have been returned to WIS.", 15, y);

    y += 18;
    docPDF.setLineDashPattern([1, 1], 0);
    docPDF.line(15, y, 90, y);
    docPDF.line(110, y, 185, y);
    docPDF.setLineDashPattern([], 0);

    y += 4;
    docPDF.setFont('times', 'normal');
    docPDF.text("Employee's signature", 52.5, y, { align: 'center' });
    docPDF.text("Date", 147.5, y, { align: 'center' });

    y += 6;
    docPDF.setFont('times', 'bold');
    docPDF.text("Immediate supervisors confirm that", 15, y);
    y += 6;
    docPDF.setFont('times', 'normal');
    docPDF.text("- All school properties have been returned.", 20, y);
    y += 6;
    docPDF.text("- All assigned duties and responsibilities have been completely giving handover.", 20, y);

    y += 10;
    docPDF.setFont('times', 'bold');
    docPDF.text("Prepared by (HR/GEP (Officer, Supervisor, Manager, Director", 10, y);
    docPDF.text("Approved by (SP/Director of Dept.)", 110, y);

    y += 10;
    docPDF.setFont('times', 'bold');
    docPDF.text("Signature:", 10, y);
    docPDF.text("Signature:", 110, y);
    docPDF.setLineDashPattern([1, 1], 0);
    docPDF.line(28, y, 90, y);
    docPDF.line(128, y, 190, y);

    y += 8;
    docPDF.text("Name:", 10, y);
    docPDF.text("Name:", 110, y);
    docPDF.line(28, y, 90, y);
    docPDF.line(128, y, 190, y);

    y += 8;
    docPDF.text("Date:", 10, y);
    docPDF.text("Date:", 110, y);
    docPDF.line(28, y, 90, y);
    docPDF.line(128, y, 190, y);
    docPDF.setLineDashPattern([], 0);

    y += 6;
    docPDF.setFont('times', 'italic');
    docPDF.text("Note: The form shall be passed to the Finance Department.", 10, y);

    y += 6;
    docPDF.setFont('times', 'bold');
    docPDF.setFontSize(10);
    docPDF.text("PLEASE RETURN THIS FORM TO HR DEPARTMENT", 105, y, { align: 'center' });
    docPDF.setFont('times', 'normal');
    docPDF.text("Last update: 22.11.2023", 105, y + 4, { align: 'center' });
`;

c = c.substring(0, blockStart) + clearanceLogic + '\n' + c.substring(blockStart);
fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
