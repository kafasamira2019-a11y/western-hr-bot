const fs = require('fs');
let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');
c = c.replace(/form\.type === \\'interviewRating\\'/g, "form.type === 'interviewRating'");
fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
