const fs = require('fs');
let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

c = c.replace(/docPDF\.addImage\(wisLogoBase64, 'PNG', 12, 8, 45, 14\);/, `if (form.type === 'interviewRating') {
      docPDF.addImage(wisLogoBase64, 'PNG', 10, 8, 55, 18);
    } else {
      docPDF.addImage(wisLogoBase64, 'PNG', 12, 8, 45, 14);
    }`);

fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
