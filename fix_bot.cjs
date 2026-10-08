const fs = require('fs');
let content = fs.readFileSync('telegram_bot.ts', 'utf8');

const pingCode = `
  // Render Free Tier keep-alive ping
  setInterval(() => {
    fetch('https://western-hr-bot.onrender.com/').then(res => {
      console.log('Self-ping successful:', res.status);
    }).catch(err => {
      console.error('Self-ping failed:', err.message);
    });
  }, 14 * 60 * 1000); // Ping every 14 minutes
`;

if (!content.includes('Self-ping')) {
    content = content.replace(/server\.listen\(port, \(\) => \{\s*console\.log\(`Server running at port \$\{port\}\/`\);\s*\}\);/, 'server.listen(port, () => { console.log(`Server running at port ${port}/`); });\n' + pingCode);
    fs.writeFileSync('telegram_bot.ts', content);
    console.log('Added keep-alive ping!');
} else {
    console.log('Keep-alive already exists');
}
