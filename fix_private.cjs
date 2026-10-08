const fs = require('fs');
let content = fs.readFileSync('telegram_bot.ts', 'utf8');
content = content.replace('if (message.isPrivate && message.media) {', 'if (!message.out && message.media) {');
fs.writeFileSync('telegram_bot.ts', content);
console.log('Fixed private condition!');
