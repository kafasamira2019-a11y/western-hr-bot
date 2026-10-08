const fs = require('fs');
let content = fs.readFileSync('telegram_bot.ts', 'utf8').replace(/\r\n/g, '\n');

const start = content.indexOf("bot.on('document', async (ctx) => {");
const realEnd = content.indexOf("const processedForms = new Set();");

if (start === -1 || realEnd === -1) {
    console.log("Could not find start or realEnd", start, realEnd);
    process.exit(1);
}

const before = content.substring(0, start);
const after = content.substring(realEnd);

const newBlock = `bot.on('document', async (ctx) => {
    const chatId = ctx.chat.id;
    let candidateName = "Unknown Candidate";
    let candidatePhone = "Unknown";
    let candidatePosition = "General (Forwarded)";
    let isForwarded = false;

    if (ctx.message.forward_origin || ctx.message.forward_date) {
        isForwarded = true;
        if (ctx.message.forward_origin && ctx.message.forward_origin.sender_user) {
            candidateName = ctx.message.forward_origin.sender_user.first_name || "";
            if (ctx.message.forward_origin.sender_user.last_name) candidateName += " " + ctx.message.forward_origin.sender_user.last_name;
        } else if (ctx.message.forward_from) {
            candidateName = ctx.message.forward_from.first_name || "";
            if (ctx.message.forward_from.last_name) candidateName += " " + ctx.message.forward_from.last_name;
        } else if (ctx.message.forward_sender_name) {
            candidateName = ctx.message.forward_sender_name;
        } else {
            candidateName = "Candidate (Hidden Name)";
        }
        
        const caption = (ctx.message.caption || '').toLowerCase();
        if (caption.includes('hr')) candidatePosition = 'HR';
        else if (caption.includes('it')) candidatePosition = 'IT';
        else if (caption.includes('teacher') || caption.includes('គ្រូ')) candidatePosition = 'Teacher';
        else if (caption.includes('admin')) candidatePosition = 'Admin';
        else if (caption.includes('account')) candidatePosition = 'Accounting';
        else if (caption.includes('market') || caption.includes('sale')) candidatePosition = 'Marketing';
        else if (caption.includes('principal')) candidatePosition = 'School Principal';
        
    } else {
        if (!userState[chatId] || userState[chatId].step !== 5) {
          return ctx.reply("សូមវាយ /start ឬប្រើ Menu ដើម្បីចាប់ផ្តើម។ | Please type /start or use the menu to begin.");
        }
        const state = userState[chatId];
        candidateName = state.data.name;
        candidatePhone = state.data.phone;
        candidatePosition = state.data.position;
    }

    const fileId = ctx.message.document.file_id;
    const fileName = ctx.message.document.file_name;
  
    if (!fileName || !fileName.toLowerCase().endsWith('.pdf')) {
      return ctx.reply("សូមបញ្ជូនតែឯកសារ PDF ប៉ុណ្ណោះ។ | Please upload a PDF file only.");
    }
  
    ctx.reply("កំពុងបញ្ចូលឯកសាររបស់អ្នក... | Uploading application...");
  
    try {
      const fileLink = await ctx.telegram.getFileLink(fileId);
      const response = await fetch(fileLink);
      const buffer = await response.arrayBuffer();
      const base64Resume = Buffer.from(buffer).toString('base64');
      
      if (base64Resume.length > 1000000) {
        return ctx.reply("សុំទោស ឯកសារ PDF របស់អ្នកធំពេក។ | Sorry, your PDF file is too large.");
      }
  
      const newApp = {
        name: candidateName,
        phone: candidatePhone,
        position: candidatePosition,
        status: 'new',
        source: isForwarded ? 'Forwarded by HR' : 'Telegram Bot',
        telegramChatId: chatId.toString(),
        appliedAt: new Date().toISOString(),
        resumeBase64: \`data:\${ctx.message.document.mime_type || 'application/pdf'};base64,\${base64Resume}\`,
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
          resumeLink: \`Telegram CV Uploaded (\${fileName})\`
        })
      });
  
      if (isForwarded) {
         ctx.reply(\`✅ CV របស់ \${candidateName} សម្រាប់តួនាទី \${candidatePosition} ត្រូវបានរក្សាចូលក្នុង Google Sheets ដោយជោគជ័យ!\`);
      } else {
         ctx.reply(\`ឯកសារដាក់ពាក្យសម្រាប់តួនាទី \${candidatePosition} ត្រូវបានរក្សាទុកដោយជោគជ័យ។ | Application saved successfully.\`, { parse_mode: 'Markdown' });
         delete userState[chatId];
      }
    } catch (error) {
      console.error("Error saving application:", error);
      ctx.reply("សុំទោស មានបញ្ហាក្នុងការបញ្ចូលទិន្នន័យ។ | Sorry, there was an error.");
      if (!isForwarded) delete userState[chatId];
    }
  });\n\n`;

fs.writeFileSync('telegram_bot.ts', before + newBlock + after, 'utf8');
console.log("Success");
