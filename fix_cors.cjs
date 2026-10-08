const fs = require('fs');
let content = fs.readFileSync('telegram_bot.ts', 'utf8');

const importHttpIndex = content.indexOf("import * as http from 'http';");
content = content.substring(0, importHttpIndex) + "import * as http from 'http';\nimport * as https from 'https';\n" + content.substring(importHttpIndex + "import * as http from 'http';".length);

const serverStart = content.indexOf("const server = http.createServer(async (req, res) => {");
const serverEnd = content.indexOf("});\nserver.listen(port", serverStart) + 3;

const newServer = `const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.url && req.url.startsWith('/cv/')) {
    const fileId = req.url.split('/cv/')[1];
    try {
      const fileLink = await bot.telegram.getFileLink(fileId);
      
      https.get(fileLink.href, (telegramRes) => {
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Length': telegramRes.headers['content-length'] || ''
        });
        telegramRes.pipe(res);
      }).on('error', (e) => {
        res.statusCode = 500;
        res.end('Error streaming file');
      });
    } catch (e) {
      res.statusCode = 404;
      res.end('File not found or invalid file_id');
    }
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Telegram Bot is running!\\n');
});`;

content = content.substring(0, serverStart) + newServer + content.substring(serverEnd);
fs.writeFileSync('telegram_bot.ts', content, 'utf8');
console.log('Server updated for CORS and piping');
