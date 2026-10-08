const fs = require('fs');
let content = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

const regex = /\} else \{\s*docPDF\.setFont\('helvetica', 'bold'\);\s*docPDF\.setFontSize\(16\);\s*docPDF\.text\('Internal Form: ' \+ getFormTypeLabel\(form\.type\), 14, yPos\);/;

if (content.match(regex)) {
    content = content.replace(regex, `} else if (form.type === 'promotionTransfer') {
    generatePromotionTransfer(docPDF, form);
  } else {
    docPDF.setFont('helvetica', 'bold');
    docPDF.setFontSize(16);
    docPDF.text('Internal Form: ' + getFormTypeLabel(form.type), 14, yPos);`);
    fs.writeFileSync('src/utils/formPdfGenerator.ts', content);
    console.log('Patched correctly!');
} else {
    console.log('Regex did not match!');
}
