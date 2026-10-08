const fs = require('fs');
let content = fs.readFileSync('telegram_bot.ts', 'utf8');

const dummyServerCode = `
import * as http from 'http';
const port = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Telegram Bot is running!\\n');
});
server.listen(port, () => {
  console.log(\`Server running at port \${port}/\`);
});
`;

if (!content.includes('http.createServer')) {
  // Find the first import statement and put it after
  content = content.replace(/^import .*$/m, `$&${dummyServerCode}`);
  fs.writeFileSync('telegram_bot.ts', content);
  console.log('Added dummy HTTP server.');
} else {
  console.log('Dummy server already exists.');
}
