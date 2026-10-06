const fs = require('fs');
let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

let badStart = c.indexOf("  } else if (form.type === 'clearance') {");
let logicEnd = c.indexOf("Last update: 22.11.2023\", 105, y + 4, { align: 'center' });");
let endOfMyInjection = c.indexOf("\n", logicEnd) + 1;

let extractedLogic = c.substring(badStart, endOfMyInjection);

// Remove it from the top
c = c.substring(0, badStart) + "  } else {\r\n" + c.substring(endOfMyInjection);

let logoBlockStart = c.indexOf("      if (form.type === 'interviewRating') {");
let logoBlockEnd = c.indexOf("    } catch (e) {", logoBlockStart);
c = c.substring(0, logoBlockStart) + \`      if (form.type === 'interviewRating') {
        docPDF.addImage(wisLogoBase64, 'PNG', 10, 5, 80, 21);
      } else if (form.type === 'clearance') {
        // Skip global logo
      } else {
        docPDF.addImage(wisLogoBase64, 'PNG', 12, 8, 45, 14);
      }\r\n\` + c.substring(logoBlockEnd);

// Use a more robust search for generic fallback
let genericStart = c.search(/ {4}\} else \{\r?\n {6}\/\/ ----------------------------------------------------\r?\n {6}\/\/ GENERIC FALLBACK FORM/);
if (genericStart === -1) {
    console.log("Still could not find generic fallback block");
    process.exit(1);
}

c = c.substring(0, genericStart) + extractedLogic + "\n" + c.substring(genericStart);

fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
