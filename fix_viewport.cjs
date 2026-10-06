const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace('content="width=device-width, initial-scale=1.0"', 'content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"');
fs.writeFileSync('index.html', c);
