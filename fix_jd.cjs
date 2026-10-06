const fs = require('fs');

let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

c = c.replace(
  "const jdText = form.jobDescription || getStandardJobOfferDescription();",
  "const jdText = form.jobDescription || getStandardJobOfferDescription(form.positionTitle || '');"
);

const oldDesc = "export const STANDARD_JOB_RESPONSIBILITIES = \"The candidate will be responsible for executing the core duties and responsibilities of the position, ensuring high-quality performance aligned with school objectives, supporting the team, and maintaining professional standards of ethics and conduct. A detailed operational job description and key performance indicators will be provided upon commencement.\";\n\nexport const getStandardJobOfferDescription = () => STANDARD_JOB_RESPONSIBILITIES;";

const newDesc = "export const getStandardJobOfferDescription = (title?: string) => {\n  const pos = title ? title : 'the position';\n  return `We are pleased to offer you employment for the position of ${pos} at Western International School. In this role, you will be responsible for executing the core duties and responsibilities of the position, ensuring high-quality performance aligned with school objectives, supporting the team, and maintaining professional standards of ethics and conduct. A detailed operational job description and key performance indicators will be provided upon commencement.`;\n};\nexport const STANDARD_JOB_RESPONSIBILITIES = getStandardJobOfferDescription();";

c = c.replace(oldDesc, newDesc);

fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
