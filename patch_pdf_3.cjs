const fs = require('fs');
let content = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

const regex = /\} else \{\s*\/\/\s*-+\s*\/\/\s*GENERIC FALLBACK FORM\s*\/\/\s*-+/;
if (content.match(regex)) {
    content = content.replace(regex, `} else if (form.type === 'promotionTransfer') {
    generatePromotionTransfer(docPDF, form);
  } else {
    // ----------------------------------------------------
    // GENERIC FALLBACK FORM
    // ----------------------------------------------------`);
    fs.writeFileSync('src/utils/formPdfGenerator.ts', content);
    console.log('Patched');
} else {
    console.log('Not found');
}
