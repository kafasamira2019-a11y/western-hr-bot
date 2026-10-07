import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { InternalFormData } from '../types';
import { wisLogoBase64 } from './wisLogoBase64';


const fitTextToBox = (doc: any, text: string, maxWidth: number, options?: any) => {
  const initialFontSize = options?.initialFontSize || 11;
  const minFontSize = options?.minFontSize || 7.5;
  const lineSpacingFactor = options?.lineSpacingFactor || 1.22;
  
  let fontSize = initialFontSize;
  doc.setFontSize(fontSize);
  let lines = doc.splitTextToSize(text || '', maxWidth);
  
  return {
    fontSize,
    lines,
    totalHeight: lines.length * fontSize * lineSpacingFactor * 0.3527
  };
};


const generatePromotionTransfer = (doc: jsPDF, data: any) => {
  const drawCheckbox = (docPDF: any, xOffset: number, yOffset: number, checked: boolean, boxSize = 4) => {
    docPDF.setLineWidth(0.5 / 2.83465);
    docPDF.setLineDashPattern([], 0);
    const boxTop = yOffset - boxSize + 0.5;
    docPDF.rect(xOffset, boxTop, boxSize, boxSize);
    if (checked) {
      docPDF.line(xOffset + boxSize * 0.2, boxTop + boxSize * 0.5, xOffset + boxSize * 0.4, boxTop + boxSize * 0.8);
      docPDF.line(xOffset + boxSize * 0.4, boxTop + boxSize * 0.8, xOffset + boxSize * 0.9, boxTop + boxSize * 0.2);
    }
  };
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
  drawCheckbox(doc, 30, 45, data.isPromotion);
  doc.text("Promotion", 36, 45);
  drawCheckbox(doc, 75, 45, data.isTransfer);
  doc.text("Employee Transfer", 81, 45);
  drawCheckbox(doc, 125, 45, data.isPayrollChange);
  doc.text("Payroll Change", 131, 45);

  doc.setFontSize(10);
  doc.text("Employee's Information", 15, 54);
  
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
  drawCheckbox(doc, 45, 76, data.employeeStatus === 'Full-time');
  doc.text("Full-time", 50, 76);
  drawCheckbox(doc, 70, 76, data.employeeStatus === 'Semi Full-time');
  doc.text("Semi Full-time", 75, 76);
  drawCheckbox(doc, 105, 76, data.employeeStatus === 'Part-time');
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
  drawCheckbox(doc, 78, 96, data.rateChangeType === 'hour');
  doc.text("hour", 83, 96);
  drawCheckbox(doc, 95, 96, data.rateChangeType === 'month');
  doc.text("month", 100, 96);
  
  doc.setFont("helvetica", "bold");
  doc.text("To", 115, 96);
  doc.line(122, 97, 147, 97);
  doc.setTextColor(0, 0, 255);
  doc.text(data.rateChangeTo || "", 125, 95);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.text("$ Per", 149, 96);
  drawCheckbox(doc, 160, 96, data.rateChangeTypeTo === 'hour');
  doc.text("hour", 165, 96);
  drawCheckbox(doc, 177, 96, data.rateChangeTypeTo === 'month');
  doc.text("month", 182, 96);

  let y = 104;
  
  const drawRow = (label, isChecked, fromVal, toVal) => {
    drawCheckbox(doc, 15, y, isChecked);
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

  drawCheckbox(doc, 15, y, data.statusChange);
  doc.text("Status", 20, y);
  
  drawCheckbox(doc, 35, y, data.statusFrom === 'Semi Full-time');
  doc.text("Semi Full-time", 40, y);
  drawCheckbox(doc, 65, y, data.statusFrom === 'Part-time');
  doc.text("Part-time", 70, y);
  drawCheckbox(doc, 88, y, data.statusFrom === 'Full-time');
  doc.text("Full-time", 93, y);
  
  drawCheckbox(doc, 115, y, data.statusTo === 'Semi Full-time');
  doc.text("Semi Full-time", 120, y);
  drawCheckbox(doc, 145, y, data.statusTo === 'Part-time');
  doc.text("Part-time", 150, y);
  drawCheckbox(doc, 168, y, data.statusTo === 'Full-time');
  doc.text("Full-time", 173, y);
  y += 8;

  drawCheckbox(doc, 15, y, data.workingDaysChange);
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

  drawCheckbox(doc, 15, y, data.workingHoursChange);
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
  y = 200; // Position them at the bottom
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

export const generatePDF = (form: InternalFormData, options?: any) => {
  const docPDF = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4', compress: true
  });

  
  // Apply subtle diagonal watermark FIRST so it's behind text
  if (options?.watermark !== false) {
    const watermarkText = options?.watermarkText || 'Confidential';
    const pageWidth = docPDF.internal.pageSize.getWidth();
    const pageHeight = docPDF.internal.pageSize.getHeight();

    // Use light gray for background watermark
    docPDF.setFont('times', 'bold');
    docPDF.setFontSize(60);
    docPDF.setTextColor(235, 235, 240);
    
    docPDF.text(watermarkText, pageWidth / 2, pageHeight / 2, {
      align: 'center',
      angle: 45,
      baseline: 'middle',
    });
    
    // Reset color to black
    docPDF.setTextColor(0, 0, 0);
  }

  const HALF_PT = 0.5 / 2.83465;

  const drawCheck = (label: string, checked: boolean, xOffset: number, yOffset: number, boxSize = 4) => {
    docPDF.setLineWidth(HALF_PT);
    docPDF.setLineDashPattern([], 0);
    const boxTop = yOffset - boxSize + 0.5;
    docPDF.rect(xOffset, boxTop, boxSize, boxSize);
    if (checked) {
      // Draw checkmark
      docPDF.line(xOffset + boxSize * 0.2, boxTop + boxSize * 0.5, xOffset + boxSize * 0.4, boxTop + boxSize * 0.8);
      docPDF.line(xOffset + boxSize * 0.4, boxTop + boxSize * 0.8, xOffset + boxSize * 0.9, boxTop + boxSize * 0.2);
    }
    docPDF.setFontSize(11);
    docPDF.text(label, xOffset + boxSize + 2, yOffset);
  };

  try {
    if (form.type === 'interviewRating') {
      docPDF.addImage(wisLogoBase64, 'PNG', 10, 5, 80, 21);
    } else if (form.type === 'clearance') {
      // Skip global logo
    } else if (form.type === 'jobOffer') {
      docPDF.addImage(wisLogoBase64, 'PNG', 10, 5, 80, 21);
    } else {
      docPDF.addImage(wisLogoBase64, 'PNG', 12, 8, 45, 14);
    }
  } catch (e) {
    console.warn("Failed to add logo to PDF:", e);
  }

  // The rest of the file...

      if (form.type === 'interviewRating') {
    // Header Logo Simulation (Left Side)
    docPDF.setLineWidth(HALF_PT);
    docPDF.line(10, 33, 200, 33);
    docPDF.setLineWidth(0.8);
    docPDF.line(10, 34, 200, 34); // Double line effect
    docPDF.setLineWidth(HALF_PT);

    let y = 39;
    docPDF.setFontSize(11);
    docPDF.setFont('times', 'bold');
    docPDF.text("CANDIDATE INFORMATION:", 10, y);
    y += 8; // Extra space after Candidate Information

    docPDF.setFont('times', 'normal');
    docPDF.text("Candidate Name", 10, y);
    docPDF.line(38, y + 1, 95, y + 1);
    docPDF.text(form.candidateName || '', 40, y);

    docPDF.text("Tel:", 100, y);
    docPDF.line(108, y + 1, 155, y + 1);
    docPDF.text(form.contactNo || '', 110, y);

    docPDF.text("Gender", 160, y);
    drawCheck("F", form.gender === 'F' || form.gender === 'Female', 172, y - 3, 3.5);
    drawCheck("M", form.gender === 'M' || form.gender === 'Male', 188, y - 3, 3.5);
    y += 8; // Extra space between lines

    docPDF.text("Staff:", 10, y);
    drawCheck("", form.staffType === 'Staff', 20, y - 3, 3.5);

    docPDF.text("Teachers:", 30, y);
    drawCheck("FT", form.staffType === 'Teachers (FT)', 46, y - 3, 3.5);
    drawCheck("PT", form.staffType === 'Teachers (PT)', 64, y - 3, 3.5);
    drawCheck("SFT", form.staffType === 'Teachers (SFT)', 82, y - 3, 3.5);
    drawCheck("INTERN", form.staffType === 'Teachers (INTERN)', 103, y - 3, 3.5);

    docPDF.text("Nationality:", 125, y);
    docPDF.line(145, y + 1, 200, y + 1);
    docPDF.text(form.nationality || 'Khmer', 150, y);
    y += 8; // Extra space between lines

    docPDF.text("Apply for (position):", 10, y);
    docPDF.line(45, y + 1, 105, y + 1);
    docPDF.text(form.positionTitle || '', 47, y);

    docPDF.text("Interview Date:", 110, y);
    docPDF.line(135, y + 1, 200, y + 1);
    docPDF.text(form.interviewDate || '', 137, y);
    y += 8; // Extra space between lines

    docPDF.text("Current Salary:", 10, y);
    docPDF.line(35, y + 1, 85, y + 1);
    docPDF.text(form.currentSalary || '', 37, y);

    docPDF.text("USD  Expected Salary:", 87, y);
    docPDF.line(125, y + 1, 160, y + 1);
    docPDF.text(form.expectedSalary || '', 127, y);

    docPDF.text("Date Available:", 162, y);
    docPDF.line(185, y + 1, 200, y + 1);
    docPDF.text(form.dateAvailable || '', 187, y);
    y += 6;

    docPDF.line(10, y, 200, y);
    y += 5;
    
    docPDF.setFontSize(10);
    docPDF.text("Rating Scale: The interviewer should give the candidate a numerical scoring. The numerical scoring is based on", 10, y);
    y += 4;
    docPDF.text("following: 1 = Poor      2 = Fair    3 = Average      4= Good     5 = Excellent", 10, y);
    y += 2;

    // Table Header
    docPDF.rect(10, y, 190, 5);
    docPDF.setFont('times', 'bold');
    docPDF.text("Categories", 40, y + 3.5, { align: 'center' });
    docPDF.text("Items", 110, y + 3.5, { align: 'center' });
    docPDF.text("P", 163, y + 3.5, { align: 'center' });
    docPDF.text("F", 170, y + 3.5, { align: 'center' });
    docPDF.text("A", 177, y + 3.5, { align: 'center' });
    docPDF.text("G", 184, y + 3.5, { align: 'center' });
    docPDF.text("E", 191, y + 3.5, { align: 'center' });

    const colP = 160;
    const colF = 167;
    const colA = 174;
    const colG = 181;
    const colE = 188;
    const endX = 200;

    let rowY = y + 5;
    docPDF.setFont('times', 'normal');

    const drawRow = (label, rating) => {
      docPDF.rect(70, rowY, endX - 70, 5);
      docPDF.text(label, 72, rowY + 3.5);
      docPDF.line(colP, rowY, colP, rowY + 5);
      docPDF.line(colF, rowY, colF, rowY + 5);
      docPDF.line(colA, rowY, colA, rowY + 5);
      docPDF.line(colG, rowY, colG, rowY + 5);
      docPDF.line(colE, rowY, colE, rowY + 5);

      if (rating === '1') docPDF.text("1", colP + 3, rowY + 3.5, { align: 'center' }); else docPDF.text("1", colP + 3, rowY + 3.5, { align: 'center' });
      if (rating === '2') docPDF.text("2", colF + 3, rowY + 3.5, { align: 'center' }); else docPDF.text("2", colF + 3, rowY + 3.5, { align: 'center' });
      if (rating === '3') docPDF.text("3", colA + 3, rowY + 3.5, { align: 'center' }); else docPDF.text("3", colA + 3, rowY + 3.5, { align: 'center' });
      if (rating === '4') docPDF.text("4", colG + 3, rowY + 3.5, { align: 'center' }); else docPDF.text("4", colG + 3, rowY + 3.5, { align: 'center' });
      if (rating === '5') docPDF.text("5", colE + 3, rowY + 3.5, { align: 'center' }); else docPDF.text("5", colE + 3, rowY + 3.5, { align: 'center' });

      // Draw circle over selected
      if (rating) {
        const cx = rating === '1' ? colP + 3 : rating === '2' ? colF + 3 : rating === '3' ? colA + 3 : rating === '4' ? colG + 3 : colE + 3;
        docPDF.circle(cx, rowY + 2.5, 2);
      }
      rowY += 5;
    };

    // Appearance (4 rows)
    const appearanceStartY = rowY;
    drawRow("Dress", form.r_dress);
    drawRow("Grooming", form.r_grooming);
    drawRow("Body Language", form.r_bodyLang);
    drawRow("Eye Contact", form.r_eye);
    docPDF.rect(10, appearanceStartY, 60, 20);
    docPDF.setFont('times', 'bold');
    docPDF.text("Appearance", 40, appearanceStartY + 10, { align: 'center' });
    docPDF.setFont('times', 'normal');

    // Qualifications (7 rows)
    const qualStartY = rowY;
    drawRow("Education/Training", form.r_education);
    drawRow("Technical Qualifications", form.r_technical);
    drawRow("Relevant Experiences", form.r_experience);
    drawRow("Accomplishments", form.r_accomplish);
    drawRow("Computer Skills", form.r_computer);
    drawRow(`Language Skills (English, ${form.language || ''})`, form.r_language);
    drawRow("Interpersonal/Communication skills", form.r_interpersonal);
    docPDF.rect(10, qualStartY, 60, 35);
    docPDF.setFont('times', 'bold');
    docPDF.text("Qualifications", 40, qualStartY + 17.5, { align: 'center' });
    docPDF.setFont('times', 'normal');

    // Competencies (9 rows)
    const compStartY = rowY;
    drawRow("Creativity", form.r_creativity);
    drawRow("Logic", form.r_logic);
    drawRow("Decision making/Problem-solving", form.r_decision);
    drawRow("Commitment", form.r_commitment);
    drawRow("Potential", form.r_potential);
    drawRow("Knowledge of organization", form.r_knowledgeOrg);
    drawRow("Interest in and knowledge of the position", form.r_interestPos);
    drawRow("Flexibility/Ability to answer questions", form.r_flexibility);
    drawRow("Candidate Enthusiasm", form.r_enthusiasm);
    docPDF.rect(10, compStartY, 60, 45);
    docPDF.setFont('times', 'bold');
    docPDF.text("Competencies", 40, compStartY + 22.5, { align: 'center' });
    
    // Total Overall Score
    docPDF.rect(10, rowY, 150, 5.5);
    docPDF.text("Total Overall Score", 85, rowY + 4, { align: 'center' });
    docPDF.rect(160, rowY, 40, 5.5);
    docPDF.text(form.totalScore || '', 180, rowY + 4, { align: 'center' });
    rowY += 9;
    docPDF.setFont('times', 'normal');

    docPDF.text("CONFIRMATION OF CANDIDATE'S RELATIVE WORKING IN WIS (IF ANY?):", 10, rowY);
    rowY += 6;
    docPDF.text("Name: " + (form.relativeName || ''), 10, rowY);
    docPDF.line(22, rowY + 1, 90, rowY + 1);
    docPDF.text("Gender: " + (form.relativeGender || ''), 95, rowY);
    docPDF.line(110, rowY + 1, 130, rowY + 1);
    docPDF.text("Position: " + (form.relativePosition || ''), 135, rowY);
    docPDF.line(152, rowY + 1, 200, rowY + 1);
    rowY += 7;

    docPDF.text("SUMMARY COMMENTS TO SUPPORT RECOMMENDATION OF CANDIDATE:", 10, rowY);
    rowY += 5;
    docPDF.setLineDashPattern([1, 1], 0);
    docPDF.line(10, rowY, 200, rowY);
    docPDF.text(form.summaryComments || '', 12, rowY + 4);
    docPDF.line(10, rowY + 6, 200, rowY + 6);
    docPDF.line(10, rowY + 12, 200, rowY + 12);
    docPDF.setLineDashPattern([], 0);
    rowY += 21; // Increased space before Interview Decision

    docPDF.text("Interview decision:", 10, rowY);
    drawCheck("HIRE (Confirmed Salary                 USD)", form.decision === 'HIRE', 50, rowY - 3, 4);
    if (form.decision === 'HIRE') docPDF.text(form.hireSalary || '', 102, rowY);
    drawCheck("CONSIDER", form.decision === 'CONSIDER', 135, rowY - 3, 4);
    drawCheck("REJECT", form.decision === 'REJECT', 175, rowY - 3, 4);
    rowY += 12;

    docPDF.setFont('times', 'bold');
    docPDF.text("Interviewed by:", 10, rowY);
    docPDF.text("Interviewed by:", 85, rowY);
    docPDF.text("Interviewed by:", 155, rowY);
    rowY += 14;
    
    docPDF.setFont('times', 'normal');
    docPDF.text("HR Representative", 10, rowY);
    rowY += 5;
    
    const drawSigBlock = (x, nName, pPos, dDate) => {
      docPDF.text("Name:", x, rowY);
      docPDF.line(x + 10, rowY + 1, x + 60, rowY + 1);
      docPDF.text(nName || '', x + 12, rowY);
      
      docPDF.text("Position:", x, rowY + 6);
      docPDF.line(x + 13, rowY + 7, x + 60, rowY + 7);
      docPDF.text(pPos || '', x + 15, rowY + 6);

      docPDF.text("Date:", x, rowY + 12);
      docPDF.line(x + 10, rowY + 13, x + 60, rowY + 13);
      docPDF.text(dDate || '', x + 12, rowY + 12);
    };

    drawSigBlock(10, form.hrName, form.hrPosition, form.hrDate);
    drawSigBlock(80, form.interviewer2Name, form.interviewer2Pos, form.interviewer2Date);
    drawSigBlock(140, form.interviewer3Name, form.interviewer3Pos, form.interviewer3Date);

    rowY += 22; // Increased space between Date and the footer message
    docPDF.setFontSize(8);
    docPDF.setFont('times', 'bold');
    docPDF.text("PLEASE RETURN THIS FORM TO HR DEPARTMENT", 105, rowY, { align: 'center' });
    docPDF.text("Last update: October 2026", 105, rowY + 4, { align: 'center' });

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
    docPDF.text("Department/Items Checklist (Tick)", 15, y + 4);
    docPDF.text("Authorized Signatory", 110, y + 4);

    y += 6;
    docPDF.setFont('times', 'normal');

    const drawSection = (title, items, isTwoColSignatory, sigLabels) => {
      const startY = y;
      
      docPDF.setFont('times', 'bold');
      docPDF.text(title, 55, y + 4, { align: 'center' });
      docPDF.setFont('times', 'normal');
      y += 6;

      let itemY = y;
      items.forEach(item => {
        // Col mapping: 1 -> 20, 2 -> 50, 3 -> 80
        let ix = item.col === 1 ? 15 : item.col === 2 ? 45 : 75;
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
    docPDF.setFontSize(9);
    docPDF.text("Prepared by (HR/GEP (Officer, Supervisor, Manager, Director)", 10, y);
    docPDF.setFontSize(10.5);
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


  } else if (form.type === 'jobOffer') {
    // ----------------------------------------------------
    // EMPLOYMENT OFFER LETTER
    // ----------------------------------------------------
    let y = 35;
    
    docPDF.setFontSize(14);
    docPDF.setFont('times', 'bold');
    docPDF.text("EMPLOYMENT OFFER LETTER", 105, y, { align: 'center' });

    y += 10;
    docPDF.setFontSize(11);
    docPDF.setFont('times', 'bold');
    docPDF.text("Date:", 15, y);
    docPDF.setFont('times', 'normal');
    const displayDate = form.offerDate ? format(new Date(form.offerDate), 'dd-MMM-yyyy') : format(new Date(), 'dd-MMM-yyyy');
    docPDF.text(displayDate, 30, y);
    
    y += 15;
    docPDF.setFont('times', 'bold');
    docPDF.text("RE: OFFER OF EMPLOYMENT", 15, y);
    
    y += 10;
    docPDF.setFont('times', 'normal');
    docPDF.text("Dear " + (form.candidateName || '').toUpperCase() + ",", 15, y);
    
    y += 15;
    docPDF.text("We are writing you to offer employment and to join our organization under the following terms:", 15, y);
    
    y += 10;
    docPDF.setFont('times', 'bold');
    docPDF.text("Title:", 15, y);
    docPDF.setFont('times', 'normal');
    docPDF.text((form.positionTitle || '').toUpperCase(), 30, y);
    
    y += 10;
    docPDF.setFont('times', 'bold');
    docPDF.text("Job Description:", 15, y);
    y += 5;
    docPDF.setFont('times', 'normal');
    
    const jdText = form.jobDescription || getStandardJobOfferDescription(form.positionTitle || 'the position');
    const jdFit = fitTextToBox(docPDF, jdText, 175, { initialFontSize: 11, minFontSize: 9, lineSpacingFactor: 1.15 });
    docPDF.setFontSize(jdFit.fontSize);
    docPDF.text(jdFit.lines, 15, y);
    y += jdFit.totalHeight + 8;
    
    docPDF.setFontSize(11);
    docPDF.setFont('times', 'bold');
    docPDF.text("Start Date (est.):", 15, y);
    docPDF.setFont('times', 'normal');
    const startStr = form.startDate ? format(new Date(form.startDate), 'dd-MMM-yyyy') : '';
    docPDF.text(startStr, 50, y);
    
    y += 10;
    docPDF.setFont('times', 'bold');
    docPDF.text("Salary offer:", 15, y);
    docPDF.setFont('times', 'normal');
    docPDF.text(form.payAmount || '', 40, y);
    
    drawCheck("hourly ($/hr)", form.payType === 'hourly', 65, y, 4);
    drawCheck("monthly (salary)", form.payType === 'monthly', 95, y, 4);
    drawCheck("yearly (salary)", form.payType === 'yearly', 135, y, 4);
    
    y += 10;
    docPDF.setFont('times', 'bold');
    docPDF.text("Type of Employment:", 15, y);
    docPDF.setFont('times', 'normal');
    drawCheck("Full-Time", form.offerEmploymentType === 'Full-Time', 60, y, 4);
    drawCheck("Semi-Full-Time", form.offerEmploymentType === 'Semi-Full-Time', 90, y, 4);
    drawCheck("Part-Time", form.offerEmploymentType === 'Part-Time', 130, y, 4);
    
    y += 10;
    docPDF.setFont('times', 'bold');
    docPDF.text("Working Day:", 15, y);
    docPDF.setFont('times', 'normal');
    docPDF.text(form.workingDay || '', 45, y);
    
    y += 10;
    docPDF.setFont('times', 'bold');
    docPDF.text("Lunch Break:", 15, y);
    docPDF.setFont('times', 'normal');
    docPDF.text("12:00 PM - 1:00 PM (1 Hour)", 42, y);
    
    y += 10;
    docPDF.setFont('times', 'bold');
    docPDF.text("Benefits:", 15, y);
    docPDF.setFont('times', 'normal');
    docPDF.text(form.benefits || '', 35, y);
    
    y += 10;
    docPDF.setFont('times', 'bold');
    docPDF.text("Time-Off:", 15, y);
    docPDF.setFont('times', 'normal');
    
    y += 10;
    docPDF.setFont('times', 'bold');
    docPDF.text("Location:", 15, y);
    docPDF.setFont('times', 'normal');
    docPDF.text(form.location || '', 35, y);
    
    y += 15;
    docPDF.text("This letter represents a", 15, y);
    drawCheck("binding", true, 60, y, 4);
    drawCheck("non-binding offer and is valid for 3 days. Thank you for considering us.", false, 82, y, 4);
    
    y += 15;
    docPDF.text("Sincerely,", 15, y);
    
    y += 25;
    docPDF.line(15, y, 75, y);
    y += 5;
    docPDF.text(form.companySignatory || "Ms. Kim Saryuth", 15, y);
    y += 5;
    docPDF.text(form.companySignatoryTitle || "HR officer", 15, y);
    
    y += 15;
    docPDF.line(10, y, 200, y);
    y += 10;
    
    // Acceptance Box
    docPDF.setFillColor(225, 240, 225); // light green
    docPDF.rect(15, y, 180, 8, 'FD');
    docPDF.setFont('times', 'bold');
    docPDF.text("Acceptance", 105, y + 5, { align: 'center' });
    
    y += 15;
    docPDF.setFont('times', 'normal');
    docPDF.text("I formally accept the position offered in this letter and agree to authorize a legally", 15, y);
    y += 6;
    docPDF.text("binding employment contract within a reasonable time period.", 15, y);
    
    y += 15;
    docPDF.text("Signature: __________________________", 15, y);
    y += 10;
    docPDF.text("Print Name: __________________________", 15, y);

  } else if (form.type === 'promotionTransfer') {
    generatePromotionTransfer(docPDF, form);
  } else {
    // ----------------------------------------------------
    // GENERIC FALLBACK FORM
    // ----------------------------------------------------
    docPDF.setFont('times', 'bold');
    docPDF.setFontSize(14);
    docPDF.text(`Internal Form: ${getFormTypeLabel(form.type)}`, 14, 20);
    
    docPDF.setFontSize(11);
    docPDF.text(`Title: ${form.title || 'Untitled'}`, 14, 30);
    docPDF.setFont('times', 'normal');
    docPDF.text(`Requested By: ${form.createdBy || 'Staff'}`, 14, 38);
    const dateStr = form.createdAt ? format(new Date(form.createdAt), 'PP') : '';
    docPDF.text(`Date: ${dateStr}`, 14, 46);
    
    docPDF.setFont('times', 'bold');
    docPDF.text('Details / Description:', 14, 58);
    docPDF.setFont('times', 'normal');
    
    const detailsFit = fitTextToBox(docPDF, form.details || '', 176, { initialFontSize: 11, minFontSize: 8 });
    const boxH = Math.max(25, detailsFit.totalHeight + 8);
    docPDF.rect(14, 63, 182, boxH);
    docPDF.setFontSize(detailsFit.fontSize);
    let dty = 70;
    detailsFit.lines.forEach(l => {
      docPDF.text(l, 17, dty);
      dty += detailsFit.lineHeight;
    });
    docPDF.setFontSize(11);
  }
    
return docPDF;
};


export const getFormTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    manpower: "Manpower Request",
    jobDescription: "Job Description Form",
    salary: "Salary Approval",
    jobOffer: "Job Offer Approval",
    staffProfile: "Staff Profile",
    interviewRating: "Interview Rating",
    clearance: "Clearance",
    unpaidMaternity: "Unpaid-Maternity",
    promotionTransfer: "Promotion-Transfer-adjustment",
    resigned: "Resigned"
  };
  return map[type] || type;
};

export const STANDARD_JOB_RESPONSIBILITIES = "The candidate will be responsible for executing the core duties and responsibilities of the position, ensuring high-quality performance aligned with school objectives, supporting the team, and maintaining professional standards of ethics and conduct. A detailed operational job description and key performance indicators will be provided upon commencement.";

export const getStandardJobOfferDescription = (title?: string) => {
  const pos = title ? title.toUpperCase() : 'the position';
  return `We are pleased to offer you employment for the position of ${pos} at Western International School. In this role, you will be responsible for executing the core duties and responsibilities of the position, ensuring high-quality performance aligned with school objectives, supporting the team, and maintaining professional standards of ethics and conduct. A detailed operational job description and key performance indicators will be provided upon commencement.`;
};

