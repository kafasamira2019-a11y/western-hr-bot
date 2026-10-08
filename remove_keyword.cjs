const fs = require('fs');
let content = fs.readFileSync('telegram_bot.ts', 'utf8');

const replacement = `
          const text = (message.message || "").toLowerCase();
          
          if (true) {
`;

content = content.replace(/const text = \(message\.message \|\| ""\)\.toLowerCase\(\);\s*if\s*\([^\{]+\)\s*\{/, replacement);

fs.writeFileSync('telegram_bot.ts', content);
console.log('Removed keyword requirement!');
