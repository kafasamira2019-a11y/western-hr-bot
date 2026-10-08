const fs = require('fs');
let content = fs.readFileSync('telegram_bot.ts', 'utf8');
content = content.replace(/await uploadBytes\(storageRef, buffer, /g, 'await uploadBytes(storageRef, buffer as any, ');
fs.writeFileSync('telegram_bot.ts', content);
console.log('Fixed types!');
