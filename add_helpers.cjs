const fs = require('fs');
let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

c = `import { format } from 'date-fns';\n` + c;

const helperFunctions = `
const fitTextToBox = (doc: any, text: string, maxWidth: number, options?: any) => {
  const initialFontSize = options?.initialFontSize || 11;
  const minFontSize = options?.minFontSize || 7.5;
  const lineSpacingFactor = options?.lineSpacingFactor || 1.22;
  
  let fontSize = initialFontSize;
  doc.setFontSize(fontSize);
  let lines = doc.splitTextToSize(text || '', maxWidth);
  
  return {
    fontSize,
    lines,
    totalHeight: lines.length * fontSize * lineSpacingFactor * 0.3527
  };
};
`;

let insertIndex = c.indexOf("export const generatePDF");
c = c.substring(0, insertIndex) + helperFunctions + "\n" + c.substring(insertIndex);

fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
