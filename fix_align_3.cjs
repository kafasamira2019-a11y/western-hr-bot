const fs = require('fs');
let content = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

// The fixed numeric ones
content = content.replace(/drawCheckbox\(doc, 45, 73,/g, 'drawCheckbox(doc, 45, 76,');
content = content.replace(/drawCheckbox\(doc, 70, 73,/g, 'drawCheckbox(doc, 70, 76,');
content = content.replace(/drawCheckbox\(doc, 105, 73,/g, 'drawCheckbox(doc, 105, 76,');
content = content.replace(/drawCheckbox\(doc, 78, 93,/g, 'drawCheckbox(doc, 78, 96,');
content = content.replace(/drawCheckbox\(doc, 95, 93,/g, 'drawCheckbox(doc, 95, 96,');
content = content.replace(/drawCheckbox\(doc, 160, 93,/g, 'drawCheckbox(doc, 160, 96,');
content = content.replace(/drawCheckbox\(doc, 177, 93,/g, 'drawCheckbox(doc, 177, 96,');

// The y-3 ones inside drawRow and below
content = content.replace(/drawCheckbox\(doc, 15, y-3,/g, 'drawCheckbox(doc, 15, y,');
content = content.replace(/drawCheckbox\(doc, 35, y-3,/g, 'drawCheckbox(doc, 35, y,');
content = content.replace(/drawCheckbox\(doc, 65, y-3,/g, 'drawCheckbox(doc, 65, y,');
content = content.replace(/drawCheckbox\(doc, 88, y-3,/g, 'drawCheckbox(doc, 88, y,');
content = content.replace(/drawCheckbox\(doc, 115, y-3,/g, 'drawCheckbox(doc, 115, y,');
content = content.replace(/drawCheckbox\(doc, 145, y-3,/g, 'drawCheckbox(doc, 145, y,');
content = content.replace(/drawCheckbox\(doc, 168, y-3,/g, 'drawCheckbox(doc, 168, y,');

fs.writeFileSync('src/utils/formPdfGenerator.ts', content);
console.log('Fixed alignments again!');
