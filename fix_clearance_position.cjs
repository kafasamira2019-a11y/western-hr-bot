const fs = require('fs');
let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

// The block I injected starts with "  } else if (form.type === 'clearance') {"
// Let's find it.
let badStart = c.indexOf("  } else if (form.type === 'clearance') {");
let badEnd = c.indexOf("    // ----------------------------------------------------", badStart + 100);
// Wait, my clearance logic ends at:
// "    docPDF.text(\"Last update: 22.11.2023\", 105, y + 4, { align: 'center' });"
let logicEnd = c.indexOf("Last update: 22.11.2023\", 105, y + 4, { align: 'center' });");
let endOfMyInjection = c.indexOf("\n", logicEnd) + 1;

let extractedLogic = c.substring(badStart, endOfMyInjection);

// Remove it from the top
c = c.substring(0, badStart) + "  } else {\n" + c.substring(endOfMyInjection);

// But wait, the logo injection for clearance: I still want a custom logo for clearance.
// So let's replace the top logo injection manually.
let logoBlockStart = c.indexOf("      if (form.type === 'interviewRating') {");
let logoBlockEnd = c.indexOf("    } catch (e) {", logoBlockStart);
c = c.substring(0, logoBlockStart) + `      if (form.type === 'interviewRating') {
        docPDF.addImage(wisLogoBase64, 'PNG', 10, 5, 80, 21);
      } else if (form.type === 'clearance') {
        // Skip global logo because we draw it inside the clearance logic manually
      } else {
        docPDF.addImage(wisLogoBase64, 'PNG', 12, 8, 45, 14);
      }
` + c.substring(logoBlockEnd);

// Now, inject extractedLogic BEFORE the GENERIC FALLBACK FORM
let genericStart = c.indexOf("    } else {\n      // ----------------------------------------------------\n      // GENERIC FALLBACK FORM");
if (genericStart === -1) {
    console.log("Could not find generic fallback block");
    process.exit(1);
}

// Ensure the extracted logic doesn't draw the logo again if we already draw it.
// Oh wait, extractedLogic DOES draw the logo!
// "try { docPDF.addImage(wisLogoBase64, 'PNG', 10, 8, 55, 18); } catch (e) { }"
// This is perfect, because we skip it at the top.

c = c.substring(0, genericStart) + extractedLogic + "\n" + c.substring(genericStart);

fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
