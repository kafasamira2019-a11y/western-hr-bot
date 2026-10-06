const fs = require('fs');
let c = fs.readFileSync('telegram_bot.cjs', 'utf8');
const target = "bot.telegram.sendMessage(app.telegramChatId, msg, { parse_mode: 'Markdown' }).catch(console.error);";
const replacement = ot.telegram.sendMessage(app.telegramChatId, msg, { parse_mode: 'Markdown' }).catch(console.error);

              if (form.pdfBase64) {
                try {
                  const base64Data = form.pdfBase64.replace(/^data:application\\/pdf;(filename=.*?;)?base64,/, '');
                  const pdfBuffer = Buffer.from(base64Data, 'base64');
                  bot.telegram.sendDocument(app.telegramChatId, { source: pdfBuffer, filename: \Job_Offer_\.pdf\ }).catch(console.error);
                } catch (e) {
                  console.error('Error sending PDF document:', e);
                }
              };
c = c.replace(target, replacement);
fs.writeFileSync('telegram_bot.cjs', c);
