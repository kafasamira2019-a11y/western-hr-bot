const fs = require('fs');
let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

// The block:
// docPDF.text("Department/Items Checklist (Tick)", 30, y + 4);
// docPDF.text("Authorized Signatory", 130, y + 4);
// Let's change X coordinates and font sizes.
c = c.replace(/docPDF\.text\("Department\/Items Checklist \(Tick\)", 30, y \+ 4\);/, "docPDF.text(\"Department/Items Checklist (Tick)\", 15, y + 4);");
c = c.replace(/docPDF\.text\("Authorized Signatory", 130, y \+ 4\);/, "docPDF.text(\"Authorized Signatory\", 110, y + 4);");

// And for the titles inside `drawSection`:
// docPDF.text(title, 35, y + 4, { align: 'center' });
// Change 35 to 55 to be perfectly centered in the left column (10 to 105)
c = c.replace(/docPDF\.text\(title, 35, y \+ 4, \{ align: 'center' \}\);/, "docPDF.text(title, 55, y + 4, { align: 'center' });");

// And for col mapping:
// let ix = item.col === 1 ? 20 : item.col === 2 ? 45 : 70;
// Make it a bit tighter to fit inside 10 to 105 (width 95)
// col 1: 15, col 2: 45, col 3: 75
c = c.replace(/let ix = item\.col === 1 \? 20 : item\.col === 2 \? 45 : 70;/, "let ix = item.col === 1 ? 15 : item.col === 2 ? 45 : 75;");

// Signature section inside drawSection:
// docPDF.text("Name:", 107, sigY + 6);
// The space for two col signatory is 105 to 200 (width 95)
// 107 to 152 for col 1 (width 45), 155 to 200 for col 2 (width 45)
// My lines were: docPDF.line(118, sigY + 6, 150, sigY + 6); docPDF.line(166, sigY + 6, 198, sigY + 6);
// This is already perfectly fine.

// Bottom signatures:
// "Prepared by (HR/GEP (Officer, Supervisor, Manager, Director" at 10
// "Approved by (SP/Director of Dept.)" at 110
// Reduce font size to 9 to prevent overlapping:
c = c.replace(/docPDF\.text\("Prepared by \(HR\/GEP \(Officer, Supervisor, Manager, Director", 10, y\);/, "docPDF.setFontSize(9);\n    docPDF.text(\"Prepared by (HR/GEP (Officer, Supervisor, Manager, Director)\", 10, y);\n    docPDF.setFontSize(10.5);");

fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
