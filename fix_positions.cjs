const fs = require('fs');

const positions = [
    "Academic Advisor",
    "Academic Coordinator",
    "Academic Director",
    "Accountant",
    "Admin Manager",
    "Admin Officer",
    "Admin Supervisor",
    "Administrative Assistant",
    "Assistant School Principal",
    "Cashier",
    "Discipline Officer",
    "Digital Learning Coordinator",
    "EN - Computer",
    "EN - Early Childhood Teacher",
    "EN - Grammar Teacher",
    "EN - Math Teacher",
    "EN - Physics Teacher",
    "EN - Social Studies Teacher",
    "English Director",
    "English Teacher",
    "Finance Director",
    "Finance Manager",
    "Finance Officer",
    "Financial Controller",
    "GEP Director",
    "GEP Office",
    "HR Assistant",
    "HR Director",
    "HR Manager",
    "HR Officer",
    "HR Supervisor",
    "ICT Coordinator",
    "IT Manager",
    "IT Officer",
    "IT Support Technician",
    "KH - Chemistry Teacher",
    "KH - Coordinator",
    "KH - Math Teacher",
    "KH - Physics Teacher",
    "KH - Social Studies Teacher",
    "Khmer Director",
    "Khmer Teacher",
    "Logistics Officer",
    "Network Administrator",
    "Office Manager",
    "Operations Director",
    "Operations Manager",
    "Payroll Officer",
    "Procurement Officer",
    "School Counselor",
    "School Counselling Manager",
    "School Counselling Supervisor",
    "School Nurse",
    "School Principal",
    "Student Affairs Coordinator",
    "Student Affairs Officer",
    "Teacher Assistant",
    "Transport Manager",
    "Vice President of Academic",
    "Vice President of Finance",
    "Vice President of Operations",
    "Vice School Principal"
];

let optionsHtml = positions.map(p => `                  <option value="${p}" />`).join('\n');
const datalistHtml = `<datalist id="positionList">\n${optionsHtml}\n                </datalist>`;

let c = fs.readFileSync('src/components/CandidateForm.tsx', 'utf8');

c = c.replace(/<input\s*type="text"\s*required\s*value=\{formData\.position\}/g, `<input\n                  list="positionList"\n                  type="text"\n                  required\n                  value={formData.position}`);

c = c.replace(/placeholder="e\.g\. Senior Software Engineer"\s*\/>/g, `placeholder="Select or type your position"\n                />\n                ${datalistHtml}`);

fs.writeFileSync('src/components/CandidateForm.tsx', c);
