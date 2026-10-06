const fs = require('fs');

const targetRegex = /<div className="flex flex-col items-start gap-1 mt-1">\s*<img src="\/wis-logo-header\.png" alt="Logo" className="h-10 object-contain bg-white\/90 px-1 py-0\.5 rounded shadow-sm" \/>\s*<h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">WIS-RMS<\/h1>\s*<\/div>/g;

const replacement = `<div className="flex flex-col items-start gap-3 my-1">
              <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-48 flex items-center justify-center">
                <img src="/wis-logo-header.png" alt="Western International School Logo" className="w-full object-contain" />
              </div>
              <div className="flex items-center gap-2 pl-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                 <h1 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-wider">WIS-RMS</h1>
              </div>
            </div>`;

let c = fs.readFileSync('src/App.tsx', 'utf8');
c = c.replace(targetRegex, replacement);
fs.writeFileSync('src/App.tsx', c);
