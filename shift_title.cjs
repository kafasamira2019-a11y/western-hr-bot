const fs = require('fs');
let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

const regex = /docPDF\.text\("HUMAN RESOURCES DEPARTMENT", 105, 14, \{ align: 'center' \}\);\s*docPDF\.text\("RECRUITMENT", 105, 20, \{ align: 'center' \}\);\s*docPDF\.setFontSize\(11\);\s*docPDF\.text\("Interviewing Rating Form for Staff and Teacher", 105, 26, \{ align: 'center' \}\);\s*docPDF\.setFontSize\(10\);\s*docPDF\.text\("HRRE03", 105, 31, \{ align: 'center' \}\);/;

const replacement = `docPDF.text("HUMAN RESOURCES DEPARTMENT", 125, 14, { align: 'center' });
    docPDF.text("RECRUITMENT", 125, 20, { align: 'center' });
    docPDF.setFontSize(11);
    docPDF.text("Interviewing Rating Form for Staff and Teacher", 125, 26, { align: 'center' });
    docPDF.setFontSize(10);
    docPDF.text("HRRE03", 125, 31, { align: 'center' });`;

c = c.replace(regex, replacement);

c = c.replace(/if \(form\.type === 'interviewRating'\) \{\s*docPDF\.addImage\(wisLogoBase64, 'PNG', 10, 8, 55, 18\);\s*\}/, `if (form.type === 'interviewRating') {
      docPDF.addImage(wisLogoBase64, 'PNG', 10, 8, 70, 23);
    }`);

fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
