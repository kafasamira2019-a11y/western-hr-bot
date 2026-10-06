const fs = require('fs');
let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

c = c.replace(/docPDF\.text\("HUMAN RESOURCES DEPARTMENT", 125, 12, \{ align: 'center' \}\);/g, "docPDF.text(\"HUMAN RESOURCES DEPARTMENT\", 140, 12, { align: 'center' });");
c = c.replace(/docPDF\.text\("RECRUITMENT", 125, 16\.5, \{ align: 'center' \}\);/g, "docPDF.text(\"RECRUITMENT\", 140, 16.5, { align: 'center' });");
c = c.replace(/docPDF\.text\("Interviewing Rating Form for Staff and Teacher", 125, 21\.5, \{ align: 'center' \}\);/g, "docPDF.text(\"Interviewing Rating Form for Staff and Teacher\", 140, 21.5, { align: 'center' });");
c = c.replace(/docPDF\.text\("HRRE03", 125, 25\.5, \{ align: 'center' \}\);/g, "docPDF.text(\"HRRE03\", 140, 25.5, { align: 'center' });");

fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
