const fs = require('fs');
let content = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

const regex = /const generatePromotionTransfer = \(doc: jsPDF, data: any\) => \{/;
if (content.match(regex)) {
    content = content.replace(regex, `const generatePromotionTransfer = (doc: jsPDF, data: any) => {
  const drawCheckbox = (docPDF: any, xOffset: number, yOffset: number, checked: boolean, boxSize = 4) => {
    docPDF.setLineWidth(0.5 / 2.83465);
    docPDF.setLineDashPattern([], 0);
    const boxTop = yOffset - boxSize + 1;
    docPDF.rect(xOffset, boxTop, boxSize, boxSize);
    if (checked) {
      docPDF.line(xOffset + boxSize * 0.2, boxTop + boxSize * 0.5, xOffset + boxSize * 0.4, boxTop + boxSize * 0.8);
      docPDF.line(xOffset + boxSize * 0.4, boxTop + boxSize * 0.8, xOffset + boxSize * 0.9, boxTop + boxSize * 0.2);
    }
  };`);
    fs.writeFileSync('src/utils/formPdfGenerator.ts', content);
    console.log('Patched');
} else {
    console.log('Not found');
}
