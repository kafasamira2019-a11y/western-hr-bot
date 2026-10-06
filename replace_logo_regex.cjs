const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(/<div className="flex items-center gap-2">\s*<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">R<\/div>\s*<h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">WIS-RMS<\/h1>\s*<\/div>/g, 
`<div className="flex flex-col items-start gap-1 mt-1">
              <img src="/wis-logo-header.png" alt="Logo" className="h-10 object-contain bg-white/90 px-1 py-0.5 rounded shadow-sm" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">WIS-RMS</h1>
            </div>`);

fs.writeFileSync('src/App.tsx', c);
