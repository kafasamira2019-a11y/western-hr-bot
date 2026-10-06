const fs = require('fs');
let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

c = c.replace(/drawCheck\("hourly \(\$\/hr\)", form\.payType === 'hourly', 65, y - 3, 4\);/, `drawCheck("hourly ($/hr)", form.payType === 'hourly', 65, y, 4);`);
c = c.replace(/drawCheck\("monthly \(salary\)", form\.payType === 'monthly', 95, y - 3, 4\);/, `drawCheck("monthly (salary)", form.payType === 'monthly', 95, y, 4);`);
c = c.replace(/drawCheck\("yearly \(salary\)", form\.payType === 'yearly', 135, y - 3, 4\);/, `drawCheck("yearly (salary)", form.payType === 'yearly', 135, y, 4);`);

c = c.replace(/drawCheck\("Full-Time", form\.offerEmploymentType === 'Full-Time', 60, y - 3, 4\);/, `drawCheck("Full-Time", form.offerEmploymentType === 'Full-Time', 60, y, 4);`);
c = c.replace(/drawCheck\("Part-Time", form\.offerEmploymentType === 'Part-Time', 90, y - 3, 4\);/, `drawCheck("Part-Time", form.offerEmploymentType === 'Part-Time', 90, y, 4);`);

c = c.replace(/drawCheck\("binding", true, 60, y - 3, 4\);/, `drawCheck("binding", true, 60, y, 4);`);
c = c.replace(/drawCheck\("non-binding offer and is valid for 3 days\. Thank you for considering us\.", false, 82, y - 3, 4\);/, `drawCheck("non-binding offer and is valid for 3 days. Thank you for considering us.", false, 82, y, 4);`);

fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
