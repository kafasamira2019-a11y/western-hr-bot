const fs = require('fs');
let content = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

// Fix Checkboxes Y
content = content.replace(/drawCheckbox\(doc, 30, 38, data\.isPromotion\);/, 'drawCheckbox(doc, 30, 42, data.isPromotion);');
content = content.replace(/drawCheckbox\(doc, 75, 38, data\.isTransfer\);/, 'drawCheckbox(doc, 75, 42, data.isTransfer);');
content = content.replace(/drawCheckbox\(doc, 125, 38, data\.isPayrollChange\);/, 'drawCheckbox(doc, 125, 42, data.isPayrollChange);');

// Let's also check if there is any other place. Wait, I also need to make sure 38 was actually present!
// In the output above, it said `drawCheckbox(doc, 30, 38, data.isPromotion);`
// Fix Signatures Y
content = content.replace(/y = 230; \/\/ Position them at the bottom/, 'y = 200; // Position them at the bottom');

// Also, the user mentioned: "សូមធ្វើការចុះ១បន្ទាត់រវាល បន្ទាត់បែងចែកចំណងជើង និង ប្រអប់ ដែលមានជួរអក្សរ promotion, employee transfer, payroll change"
// "Please make 1 line spacing between the title divider line and the checkboxes containing promotion, employee transfer, payroll change"
// Title divider line is at y = 34. Checkboxes are at 42. So they are 8 units apart.
// Maybe I should move them down to 45 so there is more space.
content = content.replace(/drawCheckbox\(doc, 30, 42, data\.isPromotion\);/, 'drawCheckbox(doc, 30, 45, data.isPromotion);');
content = content.replace(/doc\.text\("Promotion", 36, 42\);/, 'doc.text("Promotion", 36, 45);');

content = content.replace(/drawCheckbox\(doc, 75, 42, data\.isTransfer\);/, 'drawCheckbox(doc, 75, 45, data.isTransfer);');
content = content.replace(/doc\.text\("Employee Transfer", 81, 42\);/, 'doc.text("Employee Transfer", 81, 45);');

content = content.replace(/drawCheckbox\(doc, 125, 42, data\.isPayrollChange\);/, 'drawCheckbox(doc, 125, 45, data.isPayrollChange);');
content = content.replace(/doc\.text\("Payroll Change", 131, 42\);/, 'doc.text("Payroll Change", 131, 45);');

// And if it was currently 38, move to 45:
content = content.replace(/drawCheckbox\(doc, 30, 38, data\.isPromotion\);/, 'drawCheckbox(doc, 30, 45, data.isPromotion);');
content = content.replace(/drawCheckbox\(doc, 75, 38, data\.isTransfer\);/, 'drawCheckbox(doc, 75, 45, data.isTransfer);');
content = content.replace(/drawCheckbox\(doc, 125, 38, data\.isPayrollChange\);/, 'drawCheckbox(doc, 125, 45, data.isPayrollChange);');

content = content.replace(/doc\.text\("Promotion", 36, 42\);/, 'doc.text("Promotion", 36, 45);');
content = content.replace(/doc\.text\("Employee Transfer", 81, 42\);/, 'doc.text("Employee Transfer", 81, 45);');
content = content.replace(/doc\.text\("Payroll Change", 131, 42\);/, 'doc.text("Payroll Change", 131, 45);');

// And adjust Employee's Information text down so it doesn't overlap
content = content.replace(/doc\.text\("Employee's Information", 15, 52\);/, 'doc.text("Employee\'s Information", 15, 54);');

fs.writeFileSync('src/utils/formPdfGenerator.ts', content);
console.log('Fixed alignments!');
