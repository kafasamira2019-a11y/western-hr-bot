const fs = require('fs'); 
const txt = fs.readFileSync('telegram_bot.ts', 'utf8'); 
console.log(txt.indexOf("bot.on('document', async (ctx) => {")); 
console.log(txt.indexOf("delete userState[chatId];"));
