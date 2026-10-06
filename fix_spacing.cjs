const fs = require('fs');
let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

let blockStart = c.indexOf('  } else if (form.type === \'interviewRating\') {');
let blockEnd = c.indexOf('  } else {', blockStart);

if (blockStart === -1 || blockEnd === -1) {
  console.log("Could not find blocks!");
  process.exit(1);
}

const interviewRatingLogic = `
  } else if (form.type === 'interviewRating') {
    // ----------------------------------------------------
    // INTERVIEW RATING FORM (HRRE03)
    // ----------------------------------------------------
    docPDF.setFontSize(13);
    docPDF.setFont('times', 'bold');
    
    // Adjusted title positions to fit logo
    docPDF.text("HUMAN RESOURCES DEPARTMENT", 140, 12, { align: 'center' });
    docPDF.text("RECRUITMENT", 140, 18, { align: 'center' });
    docPDF.setFontSize(11);
    docPDF.text("Interviewing Rating Form for Staff and Teacher", 140, 24, { align: 'center' });
    docPDF.setFontSize(10);
    docPDF.text("HRRE03", 140, 29, { align: 'center' });

    docPDF.setFontSize(7);
    docPDF.setTextColor(0, 0, 255);
    docPDF.text("BACK TO HOME", 185, 29, { align: 'right' });
    docPDF.setTextColor(0, 0, 0);

    // PERFECT LOGO FOR INTERVIEW RATING
    try {
      docPDF.addImage(wisLogoBase64, 'PNG', 10, 5, 80, 21);
    } catch (e) { }

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
    y += 6;

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
    y += 7;

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
    y += 7;

    docPDF.text("Apply for (position):", 10, y);
    docPDF.line(45, y + 1, 105, y + 1);
    docPDF.text(form.positionTitle || '', 47, y);

    docPDF.text("Interview Date:", 110, y);
    docPDF.line(135, y + 1, 200, y + 1);
    docPDF.text(form.interviewDate || '', 137, y);
    y += 7;

    docPDF.text("Current Salary:", 10, y);
    docPDF.line(35, y + 1, 85, y + 1);
    docPDF.text(form.currentSalary || '', 37, y);

    docPDF.text("USD  Expected Salary:", 87, y);
    docPDF.line(125, y + 1, 160, y + 1);
    docPDF.text(form.expectedSalary || '', 127, y);

    docPDF.text("Date Available:", 162, y);
    docPDF.line(185, y + 1, 200, y + 1);
    docPDF.text(form.dateAvailable || '', 187, y);
    y += 5;

    docPDF.line(10, y, 200, y);
    y += 4;
    
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

    // VERY GENTLE VERTICAL COMPRESSION FOR THE TABLE ONLY
    // A standard y increment of 5.5 instead of 6 saves 11mm overall in the table
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
    drawRow(\`Language Skills (English, \${form.language || ''})\`, form.r_language);
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
    rowY += 6;

    docPDF.text("SUMMARY COMMENTS TO SUPPORT RECOMMENDATION OF CANDIDATE:", 10, rowY);
    rowY += 4;
    docPDF.setLineDashPattern([1, 1], 0);
    docPDF.line(10, rowY, 200, rowY);
    docPDF.text(form.summaryComments || '', 12, rowY + 4);
    docPDF.line(10, rowY + 6, 200, rowY + 6);
    docPDF.line(10, rowY + 12, 200, rowY + 12);
    docPDF.setLineDashPattern([], 0);
    rowY += 16;

    docPDF.text("Interview decision:", 10, rowY);
    drawCheck("HIRE (Confirmed Salary                 USD)", form.decision === 'HIRE', 50, rowY - 3, 4);
    if (form.decision === 'HIRE') docPDF.text(form.hireSalary || '', 102, rowY);
    drawCheck("CONSIDER", form.decision === 'CONSIDER', 135, rowY - 3, 4);
    drawCheck("REJECT", form.decision === 'REJECT', 175, rowY - 3, 4);
    rowY += 8;

    docPDF.setFont('times', 'bold');
    docPDF.text("Interviewed by:", 10, rowY);
    docPDF.text("Interviewed by:", 85, rowY);
    docPDF.text("Interviewed by:", 155, rowY);
    rowY += 14;
    
    docPDF.setFont('times', 'normal');
    docPDF.text("HR Representative", 10, rowY);
    rowY += 4;
    
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

    rowY += 16;
    docPDF.setFontSize(8);
    docPDF.setFont('times', 'bold');
    docPDF.text("PLEASE RETURN THIS FORM TO HR DEPARTMENT", 105, rowY, { align: 'center' });
    docPDF.text("Last update: 25.02.2025", 105, rowY + 4, { align: 'center' });
\n`;

c = c.substring(0, blockStart) + interviewRatingLogic + c.substring(blockEnd);
fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
