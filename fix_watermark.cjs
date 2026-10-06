const fs = require('fs');
let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');
c = c.replace(/\s*\} catch \{/, `
  }
    
  // Apply subtle diagonal watermark across all pages if enabled
  if (options?.watermark !== false) {
    const watermarkText = options?.watermarkText || 'Confidential';
    const totalPages = docPDF.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      docPDF.setPage(p);
      const pageWidth = docPDF.internal.pageSize.getWidth();
      const pageHeight = docPDF.internal.pageSize.getHeight();

      let appliedGState = false;
      try {
        docPDF.setGState(new GState({ opacity: 0.15 }));
        appliedGState = true;
      } catch {`);
fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
