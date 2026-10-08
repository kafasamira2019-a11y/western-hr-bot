const fs = require('fs');
let c = fs.readFileSync('telegram_bot.ts', 'utf8');

const search1 = "resumeBase64: `data:${appInfo.mimeType || 'application/pdf'};base64,${base64Resume}`";
const replace1 = "resumeBase64: 'https://western-hr-bot.onrender.com/cv/' + appInfo.fileId";

const search2 = "resumeBase64: `data:${ctx.message.document.mime_type || 'application/pdf'};base64,${base64Resume}`";
const replace2 = "resumeBase64: 'https://western-hr-bot.onrender.com/cv/' + fileId";

c = c.replace(search1, replace1).replace(search2, replace2);
fs.writeFileSync('telegram_bot.ts', c, 'utf8');
