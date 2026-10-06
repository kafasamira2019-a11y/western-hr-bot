const fs = require('fs');

let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

c = c.replace(
  "    } else if (form.type === 'clearance') {\r\n      // Skip global logo\r\n    } else {",
  "    } else if (form.type === 'clearance') {\n      // Skip global logo\n    } else if (form.type === 'jobOffer') {\n      docPDF.addImage(wisLogoBase64, 'PNG', 10, 5, 80, 21);\n    } else {"
);
c = c.replace(
  "    } else if (form.type === 'clearance') {\n      // Skip global logo\n    } else {",
  "    } else if (form.type === 'clearance') {\n      // Skip global logo\n    } else if (form.type === 'jobOffer') {\n      docPDF.addImage(wisLogoBase64, 'PNG', 10, 5, 80, 21);\n    } else {"
);

const jobOfferLogic = `
  } else if (form.type === 'jobOffer') {
    // ----------------------------------------------------
    // JOB OFFER APPROVAL FORM
    // ----------------------------------------------------
    docPDF.setFontSize(13);
    docPDF.setFont('times', 'bold');
    docPDF.text("HUMAN RESOURCES DEPARTMENT", 140, 12, { align: 'center' });
    docPDF.text("RECRUITMENT", 140, 18, { align: 'center' });
    docPDF.setFontSize(11);
    docPDF.text("Job Offer Approval Form", 140, 24, { align: 'center' });
    docPDF.setFontSize(10);
    docPDF.text("HRRE04", 140, 29, { align: 'center' });
    docPDF.setFontSize(7);
    docPDF.setTextColor(0, 0, 255);
    docPDF.text("BACK TO HOME", 185, 29, { align: 'right' });
    docPDF.setTextColor(0, 0, 0);

    docPDF.setLineWidth(HALF_PT);
    docPDF.line(10, 33, 200, 33);
    docPDF.setLineWidth(0.8);
    docPDF.line(10, 34, 200, 34);
    docPDF.setLineWidth(HALF_PT);

    let y = 42;
    docPDF.setFontSize(11);
    docPDF.setFont('times', 'bold');
    docPDF.text("CANDIDATE & OFFER DETAILS", 10, y);
    y += 8;

    docPDF.setFont('times', 'normal');
    docPDF.text("Candidate Name:", 10, y);
    docPDF.line(40, y + 1, 100, y + 1);
    docPDF.text(form.candidateName || '', 42, y);

    docPDF.text("Date of Offer:", 110, y);
    docPDF.line(135, y + 1, 195, y + 1);
    docPDF.text(form.offerDate || '', 137, y);
    y += 8;

    docPDF.text("Position Title:", 10, y);
    docPDF.line(40, y + 1, 100, y + 1);
    docPDF.text(form.positionTitle || '', 42, y);

    docPDF.text("Start Date:", 110, y);
    docPDF.line(135, y + 1, 195, y + 1);
    docPDF.text(form.startDate || '', 137, y);
    y += 8;

    const payStr = (form.payAmount || '') + (form.payType ? \` (\${form.payType})\` : '');
    docPDF.text("Salary Offer:", 10, y);
    docPDF.line(40, y + 1, 100, y + 1);
    docPDF.text(payStr, 42, y);

    docPDF.text("Employment Type:", 110, y);
    docPDF.line(145, y + 1, 195, y + 1);
    docPDF.text(form.offerEmploymentType || '', 147, y);
    y += 8;

    docPDF.text("Working Day:", 10, y);
    docPDF.line(40, y + 1, 100, y + 1);
    docPDF.text(form.workingDay || '', 42, y);

    docPDF.text("Location:", 110, y);
    docPDF.line(135, y + 1, 195, y + 1);
    docPDF.text(form.location || '', 137, y);
    y += 8;

    docPDF.text("Benefits:", 10, y);
    docPDF.line(30, y + 1, 195, y + 1);
    docPDF.text(form.benefits || '', 32, y);
    y += 15;

    docPDF.setFont('times', 'bold');
    docPDF.text("JOB DESCRIPTION / NOTIFICATION", 10, y);
    y += 4;
    docPDF.setFont('times', 'normal');

    const jdFit = fitTextToBox(docPDF, form.jobDescription || '', 175, { initialFontSize: 10, minFontSize: 8, lineSpacingFactor: 1.5 });
    const jdBoxH = Math.max(40, jdFit.totalHeight + 12);
    docPDF.rect(10, y, 185, jdBoxH);
    docPDF.setFontSize(jdFit.fontSize);
    docPDF.text(jdFit.lines, 14, y + 6);
    y += jdBoxH + 20;

    // Signatures
    docPDF.setFontSize(11);
    docPDF.setFont('times', 'bold');
    docPDF.text("APPROVALS", 10, y);
    y += 10;
    docPDF.setFont('times', 'normal');

    const col1 = 15;
    const col2 = 80;
    const col3 = 145;

    docPDF.text("Requested By:", col1, y);
    docPDF.text("Reviewed By:", col2, y);
    docPDF.text("Approved By:", col3, y);
    y += 15;

    docPDF.line(col1, y, col1 + 45, y);
    docPDF.line(col2, y, col2 + 45, y);
    docPDF.line(col3, y, col3 + 45, y);
    y += 6;

    docPDF.text("Date: ___________", col1, y);
    docPDF.text("Date: ___________", col2, y);
    docPDF.text("Date: ___________", col3, y);
`;

c = c.replace(
  "  } else {\r\n    // ----------------------------------------------------\r\n    // GENERIC FALLBACK FORM",
  jobOfferLogic + "\n  } else {\n    // ----------------------------------------------------\n    // GENERIC FALLBACK FORM"
);
c = c.replace(
  "  } else {\n    // ----------------------------------------------------\n    // GENERIC FALLBACK FORM",
  jobOfferLogic + "\n  } else {\n    // ----------------------------------------------------\n    // GENERIC FALLBACK FORM"
);


let wmStart = c.indexOf("  // Apply subtle diagonal watermark");
let wmEnd = c.indexOf("return docPDF;");
if (wmStart !== -1 && wmEnd !== -1) {
  let wmLogic = c.substring(wmStart, wmEnd);
  
  const newWmLogic = `
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
`;

  // Remove old watermark
  c = c.substring(0, wmStart) + c.substring(wmEnd);
  
  // Insert new watermark right after docPDF creation
  let insertPos = c.indexOf("const HALF_PT = 0.5 / 2.83465;");
  c = c.substring(0, insertPos) + newWmLogic + "\n  " + c.substring(insertPos);
}

fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
