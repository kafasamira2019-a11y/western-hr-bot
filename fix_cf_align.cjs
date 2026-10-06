const fs = require('fs');
let c = fs.readFileSync('src/components/CandidateForm.tsx', 'utf8');
c = c.replace('className="relative p-8 sm:p-10 md:w-2/5 text-white flex flex-col justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950"', 'className="relative p-8 sm:p-10 md:w-2/5 text-white flex flex-col justify-start overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 pt-12"');
fs.writeFileSync('src/components/CandidateForm.tsx', c);
