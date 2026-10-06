const fs = require('fs');
let c = fs.readFileSync('src/utils/formPdfGenerator.ts', 'utf8');

c += `\n
export const getFormTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    manpower: "Manpower Request",
    jobDescription: "Job Description Form",
    salary: "Salary Approval",
    jobOffer: "Job Offer Approval",
    staffProfile: "Staff Profile",
    interviewRating: "Interview Rating",
    clearance: "Clearance",
    unpaidMaternity: "Unpaid-Maternity",
    promotionTransfer: "Promotion-Transfer-adjustment",
    resigned: "Resigned"
  };
  return map[type] || type;
};

export const STANDARD_JOB_RESPONSIBILITIES = "The candidate will be responsible for executing the core duties and responsibilities of the position, ensuring high-quality performance aligned with school objectives, supporting the team, and maintaining professional standards of ethics and conduct. A detailed operational job description and key performance indicators will be provided upon commencement.";

export const getStandardJobOfferDescription = () => STANDARD_JOB_RESPONSIBILITIES;
`;

fs.writeFileSync('src/utils/formPdfGenerator.ts', c);
