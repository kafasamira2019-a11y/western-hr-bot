const fs = require('fs');
let content = fs.readFileSync('telegram_bot.ts', 'utf8');

if (!content.includes('TelegramClient')) {
    const importStatement = "import { TelegramClient } from 'telegram';\nimport { StringSession } from 'telegram/sessions';\nimport { NewMessage } from 'telegram/events';\nimport { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';\n";
    
    // add imports after other imports
    content = content.replace(/import fs from 'fs';/, importStatement + "import fs from 'fs';");
    
    const userBotLogic = `
// --- GRAMJS USERBOT ---
const apiId = 32250553;
const apiHash = "1555d8a69465b327b5372a49a317dbb6";
let sessionString = process.env.TELEGRAM_SESSION || "";
if (!sessionString) {
  try {
    sessionString = fs.readFileSync('session.txt', 'utf8').trim();
  } catch (e) {
    console.warn("No session.txt found and TELEGRAM_SESSION is not set.");
  }
}

if (sessionString) {
  const stringSession = new StringSession(sessionString);
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  const storage = getStorage(app);

  client.start({
    phoneNumber: async () => "",
    password: async () => "",
    phoneCode: async () => "",
    onError: (err) => console.log(err),
  }).then(() => {
    console.log("Userbot connected successfully!");
    
    client.addEventHandler(async (event) => {
      const message = event.message;
      if (message.isPrivate && message.media) {
        const text = (message.message || "").toLowerCase();
        
        if (text.includes("apply") || text.includes("cv") || text.includes("resume") || text.includes("សុំដាក់ពាក្យ") || text.includes("work") || text.includes("ការងារ")) {
          console.log("Found potential CV application from", message.senderId);
          
          let position = "General";
          if (text.includes("hr")) position = "HR";
          else if (text.includes("it")) position = "IT";
          else if (text.includes("teacher") || text.includes("គ្រូ")) position = "Teacher";
          else if (text.includes("admin")) position = "Admin";
          else if (text.includes("account")) position = "Accounting";
          else if (text.includes("market") || text.includes("sale")) position = "Marketing";
          else if (text.includes("clean") || text.includes("អនាម័យ")) position = "Cleaner";
          else if (text.includes("guard") || text.includes("សន្តិសុខ")) position = "Security Guard";
          
          try {
            const buffer = await client.downloadMedia(message.media, {});
            if (buffer) {
              const fileName = \`cvs/\${message.senderId}_\${Date.now()}.pdf\`;
              const storageRef = ref(storage, fileName);
              await uploadBytes(storageRef, buffer, { contentType: 'application/pdf' });
              const downloadUrl = await getDownloadURL(storageRef);
              
              await addDoc(collection(db, 'candidates'), {
                name: \`Candidate \${message.senderId}\`,
                position: position,
                cvUrl: downloadUrl,
                source: 'Telegram',
                status: 'New',
                appliedAt: new Date().toISOString(),
                telegramId: message.senderId.toString(),
                messageText: message.message
              });
              
              await client.sendMessage(message.senderId, {
                message: \`អរគុណដែលបានចាប់អារម្មណ៍ការងារនៅ Western! យើងខ្ញុំបានទទួល CV របស់អ្នកសម្រាប់តួនាទី \${position} រួចរាល់ហើយ។ ក្រុមការងារ HR នឹងពិនិត្យ និងទាក់ទងទៅអ្នកវិញក្នុងពេលឆាប់ៗ។\`
              });
              console.log("Processed candidate:", message.senderId, position);
            }
          } catch (e) {
            console.error("Error processing CV:", e);
          }
        }
      }
    }, new NewMessage({}));
  });
}
`;

    content += "\n" + userBotLogic;
    fs.writeFileSync('telegram_bot.ts', content);
    console.log('Added userbot logic');
} else {
    console.log('Already added');
}
