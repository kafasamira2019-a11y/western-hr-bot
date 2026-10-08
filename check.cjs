const fs = require('fs');
const txt = fs.readFileSync('telegram_bot.ts', 'utf8');
const start = txt.indexOf("bot.on('text',");
console.log(txt.substring(start, start + 1500));
