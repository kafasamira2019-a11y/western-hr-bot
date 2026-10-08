const fs = require('fs');
let content = fs.readFileSync('telegram_bot.ts', 'utf8');

const replacement = `
            try {
              const buffer = await client.downloadMedia(message.media, {});
              if (buffer) {
                const base64Resume = buffer.toString('base64');
                if (base64Resume.length > 1000000) {
                   await client.sendMessage(message.peerId, { message: 'Sorry, your PDF file is too large. Please reduce the file size (under 700KB) and try again.' });
                   return;
                }
                const fileName = \`cvs/\${message.senderId}_\${Date.now()}.pdf\`;
                
                const newApp = {
                  name: 'Candidate ' + message.senderId,
                  phone: 'Unknown',
                  position: position,
                  status: 'new',
                  source: 'Telegram Direct',
                  telegramChatId: message.senderId.toString(),
                  appliedAt: new Date().toISOString(),
                  resumeBase64: \`data:application/pdf;base64,\${base64Resume}\`,
                  resumeName: fileName
                };
                const docRef = await addDoc(collection(db, 'applications'), newApp);
                
                await fetch('https://script.google.com/macros/s/AKfycbyDAB6OE9BnC6HNVs_yl5A4BsRurxHoVJsnt-GW4ZiQWiWD_w9-7NBVP_vkgi2pImM6/exec', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                  body: new URLSearchParams({
                    action: 'add',
                    id: docRef.id,
                    name: newApp.name,
                    email: '',
                    phone: newApp.phone,
                    position: newApp.position,
                    status: newApp.status,
                    resumeLink: \`Telegram CV Uploaded\`
                  })
                });

                await client.sendMessage(message.peerId, { message: 'អរគុណដែលបានចាប់អារម្មណ៍ការងារនៅ Western! យើងខ្ញុំបានទទួល CV របស់អ្នកសម្រាប់តួនាទី ' + position + ' រួចរាល់ហើយ។ ក្រុមការងារ HR នឹងពិនិត្យ និងទាក់ទងទៅអ្នកវិញក្នុងពេលឆាប់ៗ។' });
              }
            } catch (e) {
`;

content = content.replace(/try\s*\{\s*const buffer = await client\.downloadMedia\(message\.media,\s*\{\}\);\s*if\s*\(buffer\)\s*\{[\s\S]*?await client\.sendMessage\(message\.senderId,[\s\S]*?\}\s*catch\s*\(e\)\s*\{/, replacement);

fs.writeFileSync('telegram_bot.ts', content);
console.log('Fixed storage logic!');
