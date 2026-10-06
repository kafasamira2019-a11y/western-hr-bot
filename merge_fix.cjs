const fs = require('fs');

let top = fs.readFileSync('reconstruct_top.ts', 'utf8');
let current = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

// current starts with "      if (form.type === 'interviewRating') {"
// Let's replace the corrupted start with `top`.
// Find the first line in current that matches what we expect
let startIdx = current.indexOf("    // Header Logo Simulation (Left Side)");

let merged = top + "\n" + current.substring(startIdx);

// Also we need to close the `export const generatePDF = (form) => {` block at the end.
if (!merged.includes("return docPDF;")) {
  merged += "\n  return docPDF;\n};\n";
} else {
  // It has return docPDF;, but does it have the closing brace for generatePDF?
  if (!merged.endsWith("};\n") && !merged.endsWith("}")) {
      merged += "\n};\n";
  }
}

// But wait, the `interviewRating` logic in `current` is missing its `} else if (form.type === 'interviewRating') {` opening!
// Where did it start in `current`?
// "CANDIDATE INFORMATION:" is inside interviewRating.
// Wait, `reconstruct_top.ts` has:
/*
  try {
    if (form.type === 'interviewRating') {
      docPDF.addImage(wisLogoBase64, 'PNG', 10, 5, 80, 21);
    } else if (form.type === 'clearance') {
      // Skip global logo
    } else {
      docPDF.addImage(wisLogoBase64, 'PNG', 12, 8, 45, 14);
    }
  } catch (e) {
    console.warn("Failed to add logo to PDF:", e);
  }
*/
// We need to START the if/else chain!
// Before `// Header Logo Simulation (Left Side)`, it should be `if (form.type === 'interviewRating') {`
merged = merged.replace("// Header Logo Simulation (Left Side)", "  if (form.type === 'interviewRating') {\n    // Header Logo Simulation (Left Side)");

fs.writeFileSync('src/utils/formPdfGenerator.ts', merged);
