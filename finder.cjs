const fs = require('fs');
const lines = fs.readFileSync('telegram_bot.ts', 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("bot.on('document', async (ctx) => {")) {
        console.log(i + 1);
    }
}
