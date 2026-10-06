const fs = require('fs');
let c = fs.readFileSync('src/components/InternalForms.tsx', 'utf8');

c = c.replace(/const pdfUrl = doc\.output\('bloburl'\);\s*setPreviewForm\(form\);\s*setPreviewUrl\(pdfUrl\.toString\(\)\);/, `const base64 = doc.output('datauristring').split(',')[1];
    setPreviewForm(form);
    setPreviewUrl(base64);`);

fs.writeFileSync('src/components/InternalForms.tsx', c);
