const fs = require('fs');
let content = fs.readFileSync('telegram_bot.ts', 'utf8');

content = content.replace(/const base64Resume = buffer\.toString\('base64'\);\s*const base64Resume = buffer\.toString\('base64'\);/, "const base64Resume = buffer.toString('base64');");

fs.writeFileSync('telegram_bot.ts', content);
console.log('Fixed duplicate variable!');
