const fs = require('fs');

let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');
c = c.replace(
    `drawCheck("Part-Time", form.offerEmploymentType === 'Part-Time', 90, y, 4);`,
    `drawCheck("Semi-Full-Time", form.offerEmploymentType === 'Semi-Full-Time', 90, y, 4);\n    drawCheck("Part-Time", form.offerEmploymentType === 'Part-Time', 130, y, 4);`
);
fs.writeFileSync('src/utils/formPdfGenerator.ts', c, 'utf8');

let c2 = fs.readFileSync('src/components/InternalForms.tsx', 'utf8');
c2 = c2.replace(
    `<option value="Part-Time">Part-Time</option>`,
    `<option value="Semi-Full-Time">Semi-Full-Time</option>\n                        <option value="Part-Time">Part-Time</option>`
);
fs.writeFileSync('src/components/InternalForms.tsx', c2, 'utf8');
