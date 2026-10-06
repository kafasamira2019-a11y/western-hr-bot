const fs = require('fs');
let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

let blockStart = c.indexOf('// INTERVIEW RATING FORM (HRRE03)');
let blockEnd = c.indexOf('// GENERIC FALLBACK FORM', blockStart);

let ratingBlock = c.substring(blockStart, blockEnd);

// Shrink header
ratingBlock = ratingBlock.replace(/docPDF\.text\("HUMAN RESOURCES DEPARTMENT", 125, 14/, 'docPDF.text("HUMAN RESOURCES DEPARTMENT", 125, 12');
ratingBlock = ratingBlock.replace(/docPDF\.text\("RECRUITMENT", 125, 20/, 'docPDF.text("RECRUITMENT", 125, 16.5');
ratingBlock = ratingBlock.replace(/docPDF\.text\("Interviewing Rating Form for Staff and Teacher", 125, 26/, 'docPDF.text("Interviewing Rating Form for Staff and Teacher", 125, 21.5');
ratingBlock = ratingBlock.replace(/docPDF\.text\("HRRE03", 125, 31/, 'docPDF.text("HRRE03", 125, 25.5');
ratingBlock = ratingBlock.replace(/docPDF\.text\("BACK TO HOME", 185, 31/, 'docPDF.text("BACK TO HOME", 185, 25.5');

// Shrink fake header lines
ratingBlock = ratingBlock.replace(/docPDF\.line\(10, 33, 200, 33\);/, 'docPDF.line(10, 27, 200, 27);');
ratingBlock = ratingBlock.replace(/docPDF\.line\(10, 34, 200, 34\);/, 'docPDF.line(10, 28, 200, 28);');

// Shrink Candidate Info
ratingBlock = ratingBlock.replace(/let y = 39;/, 'let y = 32;');
ratingBlock = ratingBlock.replace(/y \+= 6;/g, 'y += 4.5;');
ratingBlock = ratingBlock.replace(/y \+= 7;/g, 'y += 5.5;');
ratingBlock = ratingBlock.replace(/y \+= 5;/g, 'y += 4;');
ratingBlock = ratingBlock.replace(/docPDF\.circle\(cx, rowY \+ 3, 2\.5\);/g, 'docPDF.circle(cx, rowY + 2.5, 2);');
ratingBlock = ratingBlock.replace(/y \+= 4;/g, 'y += 3.5;');
ratingBlock = ratingBlock.replace(/y \+= 2;/g, 'y += 1.5;');

// Table headers (y+4 -> y+3)
ratingBlock = ratingBlock.replace(/docPDF\.rect\(10, y, 190, 6\);/g, 'docPDF.rect(10, y, 190, 5);');
ratingBlock = ratingBlock.replace(/docPDF\.text\("Categories", 40, y \+ 4/g, 'docPDF.text("Categories", 40, y + 3.5');
ratingBlock = ratingBlock.replace(/docPDF\.text\("Items", 110, y \+ 4/g, 'docPDF.text("Items", 110, y + 3.5');
ratingBlock = ratingBlock.replace(/y \+ 4, \{ align: 'center' \}/g, 'y + 3.5, { align: \'center\' }');

// Row Height 6 -> 4.5
ratingBlock = ratingBlock.replace(/let rowY = y \+ 6;/, 'let rowY = y + 5;');
ratingBlock = ratingBlock.replace(/docPDF\.rect\(70, rowY, endX - 70, 6\);/g, 'docPDF.rect(70, rowY, endX - 70, 4.5);');
ratingBlock = ratingBlock.replace(/docPDF\.text\(label, 72, rowY \+ 4\);/g, 'docPDF.text(label, 72, rowY + 3.2);');
ratingBlock = ratingBlock.replace(/rowY \+ 6\);/g, 'rowY + 4.5);');
ratingBlock = ratingBlock.replace(/rowY \+ 4, \{ align: 'center' \}/g, 'rowY + 3.2, { align: \'center\' }');
ratingBlock = ratingBlock.replace(/rowY \+= 6;/g, 'rowY += 4.5;');

// Appearance rect 24 -> 18
ratingBlock = ratingBlock.replace(/docPDF\.rect\(10, appearanceStartY, 60, 24\);/, 'docPDF.rect(10, appearanceStartY, 60, 18);');
ratingBlock = ratingBlock.replace(/appearanceStartY \+ 12/, 'appearanceStartY + 10');

// Qual rect 42 -> 31.5
ratingBlock = ratingBlock.replace(/docPDF\.rect\(10, qualStartY, 60, 42\);/, 'docPDF.rect(10, qualStartY, 60, 31.5);');
ratingBlock = ratingBlock.replace(/qualStartY \+ 21/, 'qualStartY + 16');

// Comp rect 54 -> 40.5
ratingBlock = ratingBlock.replace(/docPDF\.rect\(10, compStartY, 60, 54\);/, 'docPDF.rect(10, compStartY, 60, 40.5);');
ratingBlock = ratingBlock.replace(/compStartY \+ 27/, 'compStartY + 20');

// Overall score 
ratingBlock = ratingBlock.replace(/docPDF\.rect\(10, rowY, 150, 6\);/, 'docPDF.rect(10, rowY, 150, 5);');
ratingBlock = ratingBlock.replace(/docPDF\.rect\(160, rowY, 40, 6\);/, 'docPDF.rect(160, rowY, 40, 5);');
ratingBlock = ratingBlock.replace(/rowY \+ 4, \{ align: 'center' \}/g, 'rowY + 3.5, { align: \'center\' }');
ratingBlock = ratingBlock.replace(/rowY \+= 10;/g, 'rowY += 7;');
ratingBlock = ratingBlock.replace(/rowY \+= 18;/g, 'rowY += 12;');
ratingBlock = ratingBlock.replace(/rowY \+= 12;/g, 'rowY += 9;');
ratingBlock = ratingBlock.replace(/rowY \+= 8;/g, 'rowY += 6;');

c = c.substring(0, blockStart) + ratingBlock + c.substring(blockEnd);
fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
