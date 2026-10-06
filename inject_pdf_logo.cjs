const fs = require('fs');
const logoB64 = fs.readFileSync('logo_base64.txt', 'utf8');

let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

const injection = `
  docPDF.setLineDashPattern([], 0);
  
  // Embed WIS Logo on every form
  try {
    const wisLogoBase64 = "data:image/png;base64,${logoB64}";
    docPDF.addImage(wisLogoBase64, 'PNG', 12, 8, 45, 14);
  } catch (e) {
    console.warn("Failed to add logo to PDF:", e);
  }
`;

c = c.replace(/docPDF\.setLineDashPattern\(\[\], 0\);/, injection);
fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
