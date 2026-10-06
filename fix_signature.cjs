const fs = require('fs');
let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

c = c.replace(/export const generatePDF = \(form: InternalFormData\) => \{/, 'export const generatePDF = (form: InternalFormData, options?: any) => {');

fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
