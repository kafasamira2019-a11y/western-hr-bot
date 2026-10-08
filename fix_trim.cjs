const fs = require('fs');
let content = fs.readFileSync('telegram_bot.ts', 'utf8');
content = content.replace('let sessionString = process.env.TELEGRAM_SESSION || "";', 'let sessionString = (process.env.TELEGRAM_SESSION || "").trim();');
fs.writeFileSync('telegram_bot.ts', content);
console.log("Replaced");
