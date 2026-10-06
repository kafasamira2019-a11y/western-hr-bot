const fs = require('fs');
let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

// 1. Remove logo block for jobOffer inside the try block
const tryLogoPattern = "    } else if (form.type === 'clearance') {\n      // Skip global logo\n    } else {";
const tryLogoPatternWindows = "    } else if (form.type === 'clearance') {\r\n      // Skip global logo\r\n    } else {";

if (c.includes(tryLogoPattern)) {
  c = c.replace(tryLogoPattern, "    } else if (form.type === 'clearance') {\n      // Skip global logo\n    } else if (form.type === 'jobOffer') {\n      // Skip global logo for Employment Offer Letter\n    } else {");
} else if (c.includes(tryLogoPatternWindows)) {
  c = c.replace(tryLogoPatternWindows, "    } else if (form.type === 'clearance') {\r\n      // Skip global logo\r\n    } else if (form.type === 'jobOffer') {\r\n      // Skip global logo for Employment Offer Letter\r\n    } else {");
}

// 2. Replace the second jobOffer logic block (the main form)
// We need to find the NEXT occurrence of "else if (form.type === 'jobOffer')" after the try block.
const mainJobOfferStartPattern = "} else if (form.type === 'jobOffer') {";
const genericFallbackStartPattern = "} else {\n    // ----------------------------------------------------\n    // GENERIC FALLBACK FORM";
const genericFallbackStartPatternWindows = "} else {\r\n    // ----------------------------------------------------\r\n    // GENERIC FALLBACK FORM";

let firstIdx = c.indexOf(mainJobOfferStartPattern);
let secondIdx = c.indexOf(mainJobOfferStartPattern, firstIdx + 1);

let startIndex = secondIdx !== -1 ? secondIdx : firstIdx; // fallback just in case
// Wait, if it wasn't replaced yet, it's just one occurrence from my backup?
// No, I added the first occurrence in the try block in step 1 just above!
// But wait, the backup DID have the first occurrence!
// Let's just use regex to match the main block:

let genericIndex = c.indexOf(genericFallbackStartPattern);
if (genericIndex === -1) genericIndex = c.indexOf(genericFallbackStartPatternWindows);

if (genericIndex !== -1) {
    // Find the closest "else if (form.type === 'jobOffer')" BEFORE generic fallback
    startIndex = c.lastIndexOf(mainJobOfferStartPattern, genericIndex);

    if (startIndex !== -1) {
        let newLogic = `} else if (form.type === 'jobOffer') {
    // ----------------------------------------------------
    // EMPLOYMENT OFFER LETTER
    // ----------------------------------------------------
    let y = 20;
    
    docPDF.setFontSize(14);
    docPDF.setFont('times', 'bold');
    docPDF.text("EMPLOYMENT OFFER LETTER", 105, y, { align: 'center' });
    
    // Photo box
    docPDF.setLineWidth(HALF_PT);
    docPDF.rect(150, 15, 40, 50);
    docPDF.setFontSize(9);
    docPDF.setFont('times', 'normal');
    docPDF.setTextColor(150, 150, 150);
    docPDF.text("Photo", 170, 38, { align: 'center' });
    docPDF.text("(4 x 6 cm)", 170, 43, { align: 'center' });
    docPDF.setTextColor(0, 0, 0);

    y += 15;
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
    
    drawCheck("hourly ($/hr)", form.payType === 'hourly', 65, y - 3, 4);
    drawCheck("monthly (salary)", form.payType === 'monthly', 95, y - 3, 4);
    drawCheck("yearly (salary)", form.payType === 'yearly', 135, y - 3, 4);
    
    y += 10;
    docPDF.setFont('times', 'bold');
    docPDF.text("Type of Employment:", 15, y);
    docPDF.setFont('times', 'normal');
    drawCheck("Full-Time", form.offerEmploymentType === 'Full-Time', 60, y - 3, 4);
    drawCheck("Part-Time", form.offerEmploymentType === 'Part-Time', 90, y - 3, 4);
    
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
    drawCheck("binding", true, 60, y - 3, 4);
    drawCheck("non-binding offer and is valid for 3 days. Thank you for considering us.", false, 82, y - 3, 4);
    
    y += 15;
    docPDF.text("Sincerely,", 15, y);
    
    y += 25;
    docPDF.line(15, y, 75, y);
    y += 5;
    docPDF.text("Ms. Kim Saryuth", 15, y);
    y += 5;
    docPDF.text("HR officer", 15, y);
    
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

  `;
        
        c = c.substring(0, startIndex) + newLogic + c.substring(genericIndex);
    }
}

// 3. Fix the JD string
const oldDesc = "export const getStandardJobOfferDescription = () => STANDARD_JOB_RESPONSIBILITIES;";
const newDesc = "export const getStandardJobOfferDescription = (title?: string) => {\\n  const pos = title ? title : 'the position';\\n  return `We are pleased to offer you employment for the position of ${pos} at Western International School. In this role, you will be responsible for executing the core duties and responsibilities of the position, ensuring high-quality performance aligned with school objectives, supporting the team, and maintaining professional standards of ethics and conduct. A detailed operational job description and key performance indicators will be provided upon commencement.`;\\n};";

if (c.includes(oldDesc)) {
    c = c.replace(oldDesc, newDesc);
    c = c.replace(
        "const jdText = form.jobDescription || getStandardJobOfferDescription();",
        "const jdText = form.jobDescription || getStandardJobOfferDescription(form.positionTitle || '');"
    );
}

fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
