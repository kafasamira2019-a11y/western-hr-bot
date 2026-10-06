const fs = require('fs');
let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

c = c.replace(
  "    } else if (form.type === 'jobOffer') {\n      docPDF.addImage(wisLogoBase64, 'PNG', 10, 5, 80, 21);\n    } else {",
  "    } else if (form.type === 'jobOffer') {\n      // Skip global logo for Employment Offer Letter\n    } else {"
);

let startPattern = "  } else if (form.type === 'jobOffer') {";
let endPattern = "  } else {\n    // ----------------------------------------------------\n    // GENERIC FALLBACK FORM";

let startIndex = c.indexOf(startPattern);
let endIndex = c.indexOf(endPattern);

if (startIndex !== -1 && endIndex !== -1) {
  let newLogic = `  } else if (form.type === 'jobOffer') {
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
    
    const jdText = form.jobDescription || getStandardJobOfferDescription();
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
\n`;
  c = c.substring(0, startIndex) + newLogic + c.substring(endIndex);
}

fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
