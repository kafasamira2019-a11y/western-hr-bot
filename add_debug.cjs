const fs = require('fs');
let content = fs.readFileSync('telegram_bot.ts', 'utf8');

const replacement = `
            try {
              const buffer = await client.downloadMedia(message.media, {});
              if (buffer) {
                await client.sendMessage(message.peerId, { message: '⏳ Processing your CV, please wait...' });
                const base64Resume = buffer.toString('base64');
`;

content = content.replace(/try\s*\{\s*const buffer = await client\.downloadMedia\(message\.media,\s*\{\}\);\s*if\s*\(buffer\)\s*\{/, replacement);

fs.writeFileSync('telegram_bot.ts', content);
console.log('Added Processing message!');
