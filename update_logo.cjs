const fs = require('fs');
let c = fs.readFileSync('src/components/CandidateForm.tsx', 'utf8');
c = c.replace(/<img src="\/logo\.png" alt="Logo" className="w-48 mb-6 relative z-10 object-contain hover:opacity-90 transition-opacity cursor-pointer" \/>/, '<img src="/wis-logo.png" alt="Logo" className="w-72 mb-8 relative z-10 object-contain hover:opacity-90 transition-opacity cursor-pointer bg-white/90 p-4 rounded-xl shadow-lg" />');
fs.writeFileSync('src/components/CandidateForm.tsx', c);
