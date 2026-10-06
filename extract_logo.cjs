const fs = require('fs');
let c = fs.readFileSync('dist/assets/index-oUBlyws4.js', 'utf8');
let match = c.match(/"data:image\/png;base64,[^"]+"/);
if (match) {
    let logo = match[0].replace(/"/g, '');
    fs.writeFileSync('src/utils/wisLogoBase64.ts', `export const wisLogoBase64 = "${logo}";`);
    console.log("Extracted logo");
} else {
    console.log("No logo found");
}
