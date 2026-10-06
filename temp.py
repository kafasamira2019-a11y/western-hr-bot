import sys
with open('telegram_bot.cjs', 'r', encoding='utf-8') as f:
    c = f.read()

target = "bot.telegram.sendMessage(app.telegramChatId, msg, { parse_mode: 'Markdown' }).catch(console.error);"
rep = """bot.telegram.sendMessage(app.telegramChatId, msg, { parse_mode: 'Markdown' }).catch(console.error);
              if (form.pdfBase64) {
                try {
                  const base64Data = form.pdfBase64.replace(/^data:application\\/pdf;(filename=.*?;)?base64,/, '');
                  const pdfBuffer = Buffer.from(base64Data, 'base64');
                  bot.telegram.sendDocument(app.telegramChatId, { source: pdfBuffer, filename: Job_Offer_.pdf }).catch(console.error);
                } catch (e) {
                  console.error('Error sending PDF document:', e);
                }
              }"""
c = c.replace(target, rep)

with open('telegram_bot.cjs', 'w', encoding='utf-8') as f:
    f.write(c)
