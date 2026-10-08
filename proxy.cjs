const fs = require('fs');
let content = fs.readFileSync('telegram_bot.ts', 'utf8');

const serverStart = content.indexOf("const server = http.createServer((req, res) => {");
const serverEnd = content.indexOf("});\nserver.listen(port", serverStart) + 3;

const newServer = `const server = http.createServer(async (req, res) => {
  if (req.url && req.url.startsWith('/cv/')) {
    const fileId = req.url.split('/cv/')[1];
    try {
      const fileLink = await bot.telegram.getFileLink(fileId);
      res.writeHead(302, { Location: fileLink.href });
      res.end();
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

// Also need to increase limit to 5MB, and stop storing base64!
// Replace: if (base64Resume.length > 1000000)
// Actually we can skip downloading to buffer completely!
content = content.replace(/const response = await fetch\(fileLink\);[\s\S]*?if \(base64Resume\.length > 1000000\) \{[\s\S]*?\}/g, '');

// Now we need to update newApp object.
// replace resumeBase64: \`data:...\` with resumeBase64: \`https://western-hr-bot.onrender.com/cv/\${fileId}\` (or we can just store the URL).
// Wait, we still need to store it as a link in the apps script.
// Let's manually replace the upload logic.
fs.writeFileSync('telegram_bot.ts', content, 'utf8');
console.log('Server updated');
