const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `<div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">WIS-RMS</h1>
            </div>`;

const target2 = `<div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">WIS-RMS</h1>
            </div>`;

const replaceWith = `<div className="flex flex-col items-start gap-1">
              <img src="/wis-logo-header.png" alt="Logo" className="h-10 object-contain bg-white/90 p-1 rounded" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">WIS-RMS</h1>
            </div>`;

c = c.replace(target1, replaceWith);
c = c.replace(target2, replaceWith);

fs.writeFileSync('src/App.tsx', c);
