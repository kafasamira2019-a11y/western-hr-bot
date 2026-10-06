const fs = require('fs');
let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

c = c.replace(/    \/\/ Photo box[\s\S]*?docPDF\.setTextColor\(0, 0, 0\);/g, '');

c = c.replace(/let y = 20;\s*docPDF\.setFontSize\(14\);\s*docPDF\.setFont\('times', 'bold'\);\s*docPDF\.text\("EMPLOYMENT OFFER LETTER", 105, y, \{ align: 'center' \}\);/g, 
`let y = 35;
    
    docPDF.setFontSize(14);
    docPDF.setFont('times', 'bold');
    docPDF.text("EMPLOYMENT OFFER LETTER", 105, y, { align: 'center' });`);

// To fix spacing where "y += 15" was immediately after photo box
c = c.replace(/EMPLOYMENT OFFER LETTER", 105, y, { align: 'center' }\);\s*y \+= 15;/g, 
`EMPLOYMENT OFFER LETTER", 105, y, { align: 'center' });

    y += 10;`);

fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
