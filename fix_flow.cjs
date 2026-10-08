const fs = require('fs');
let content = fs.readFileSync('telegram_bot.ts', 'utf8');

const documentStart = content.indexOf("bot.on('document', async (ctx) => {");
const processedFormsStart = content.indexOf("const processedForms = new Set();");
const beforeDocument = content.substring(0, documentStart);
const afterDocument = content.substring(processedFormsStart);

const newDocument = `bot.on('document', async (ctx) => {
    const chatId = ctx.chat.id;

    if (userState[chatId] && userState[chatId].step === 5) {
        // NORMAL APPLICANT FLOW
        const state = userState[chatId];
        const candidatePosition = state.data.position;
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
            name: state.data.name,
            phone: state.data.phone,
            position: candidatePosition,
            status: 'new',
            source: 'Telegram Bot',
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
      
          ctx.reply(\`✅ CV របស់លោកអ្នកត្រូវបានផ្ញើចូលក្នុងប្រព័ន្ធជ្រើសរើសបុគ្គលិកដោយជោគជ័យ។\\n✅ Your CV has been successfully submitted to the recruitment system.\`);
          delete userState[chatId];
        } catch (error) {
          console.error("Error saving application:", error);
          ctx.reply("សុំទោស មានបញ្ហាក្នុងការបញ្ចូលទិន្នន័យ។ | Sorry, there was an error.");
          delete userState[chatId];
        }
    } else {
        // ADMIN FORWARD / DIRECT UPLOAD FLOW
        const fileName = ctx.message.document.file_name;
        if (!fileName || !fileName.toLowerCase().endsWith('.pdf')) {
          return ctx.reply("សូមបញ្ជូនតែឯកសារ PDF ប៉ុណ្ណោះ។ | Please upload a PDF file only.");
        }

        userState[chatId] = {
           step: 10,
           data: {
              forwardedApp: {
                 fileId: ctx.message.document.file_id,
                 fileName: ctx.message.document.file_name,
                 mimeType: ctx.message.document.mime_type
              }
           }
        };
        return ctx.reply("ឯកសារទទួលបាន! តើបេក្ខជននេះមានឈ្មោះអ្វី?\\nDocument received! What is the candidate's name?", { parse_mode: 'Markdown' });
    }
});\n\n`;

fs.writeFileSync('telegram_bot.ts', beforeDocument + newDocument + afterDocument, 'utf8');
console.log('Fixed');
