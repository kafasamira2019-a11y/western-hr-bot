const fs = require('fs');
let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');
c = c.replace(/docPDF\.addImage\(wisLogoBase64, 'PNG', 10, 8, 70, 23\);/, "docPDF.addImage(wisLogoBase64, 'PNG', 10, 5, 80, 21);");
fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
