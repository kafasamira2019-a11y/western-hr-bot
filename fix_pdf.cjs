const fs = require('fs');

function fixFile(file, varName) {
    let c = fs.readFileSync(file, 'utf8');
    
    // Replace iframe src
    const iframeRegex = new RegExp(`<iframe\\s+src=\\{${varName}(?:\\.base64)?\\}\\s+className="([^"]+)"\\s+title="([^"]+)"\\s*(?:\\/>|>\\s*<\\/iframe>)`);
    c = c.replace(iframeRegex, `<iframe src="/pdf-viewer.html" className="$1" title="$2" />`);
    
    // Replace iframe src with different prop order if needed (InternalForms has className first or title first, let's just do a generic replace)
    // Wait, let's just do it directly.
    c = c.replace(new RegExp(`src=\\{${varName}(?:\\.base64)?\\}`, 'g'), 'src="/pdf-viewer.html"');
    
    // Add sessionStorage logic
    const modalStartRegex = new RegExp(`\\{${varName} && \\(`);
    c = c.replace(modalStartRegex, `{${varName} && ( sessionStorage.setItem('currentPdfBase64', ${varName}.base64 || ${varName}), `);
    
    fs.writeFileSync(file, c);
}

fixFile('src/components/Applications.tsx', 'previewPdf');
fixFile('src/components/Shortlist.tsx', 'previewPdf');
fixFile('src/components/Interviews.tsx', 'previewPdf');
fixFile('src/components/InternalForms.tsx', 'previewUrl');
