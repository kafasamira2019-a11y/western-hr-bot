const fs = require('fs');
let c = fs.readFileSync('src/components/CandidateForm.tsx', 'utf8');
c = c.replace('className="max-w-4xl mx-auto mt-12 px-4"', 'className="max-w-4xl mx-auto mt-6 md:mt-12 px-4 sm:px-6 lg:px-8"');
c = c.replace('className="relative p-10 md:w-2/5 text-white flex flex-col justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950"', 'className="relative p-8 sm:p-10 md:w-2/5 text-white flex flex-col justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950"');
c = c.replace('className="p-8 md:w-3/5"', 'className="p-6 sm:p-8 md:w-3/5"');
fs.writeFileSync('src/components/CandidateForm.tsx', c);
