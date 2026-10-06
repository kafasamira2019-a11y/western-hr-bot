const fs = require('fs');
let c = fs.readFileSync('src/components/CandidateForm.tsx', 'utf8');

const oldImg = '<img src="https://drive.google.com/uc?export=view&id=1f1iEwR66HuJAvT9haXLr2_BAR5EpBPtD" alt="Logo" className="w-48 mb-6 relative z-10 object-contain" />';
const newImg = `<a href="https://drive.google.com/file/d/1f1iEwR66HuJAvT9haXLr2_BAR5EpBPtD/view?usp=drive_link" target="_blank" rel="noopener noreferrer">
            <img src="/logo.png" alt="Logo" className="w-48 mb-6 relative z-10 object-contain hover:opacity-90 transition-opacity cursor-pointer" />
          </a>`;

c = c.replace(oldImg, newImg);
fs.writeFileSync('src/components/CandidateForm.tsx', c);
