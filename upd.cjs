const fs = require('fs');

let content = fs.readFileSync('telegram_bot.ts', 'utf8');

const textStart = content.indexOf("bot.on('text',");
const documentStart = content.indexOf("bot.on('document',");
const processedFormsStart = content.indexOf("const processedForms = new Set();");

const beforeText = content.substring(0, textStart);
const afterDocument = content.substring(processedFormsStart);

const newTextAndDocument = `bot.on('text', async (ctx) => {
  const chatId = ctx.chat.id;
  if (!userState[chatId]) {
    return ctx.reply("សូមចុចលើ /start ឬ Menu ដើម្បីចាប់ផ្តើម។\\nPlease type /start or use the menu to begin.");
  }
  const state = userState[chatId];
  if (state.step === 1) {
    state.data.name = ctx.message.text;
    state.step = 2;
    ctx.reply("អស្ចារ្យណាស់! តើអ្នកកំពុងដាក់ពាក្យសម្រាប់តួនាទីអ្វី?\\nGreat! What **Position** are you applying for?", { parse_mode: 'Markdown' });
  } else if (state.step === 2) {
    state.data.position = ctx.message.text;
    state.step = 3;
    ctx.reply("សូមផ្តល់អាសយដ្ឋានអ៊ីមែលរបស់អ្នក៖\\nPlease provide your **Email Address**:", { parse_mode: 'Markdown' });
  } else if (state.step === 3) {
    state.data.email = ctx.message.text;
    state.step = 4;
    ctx.reply("សូមផ្តល់លេខទូរស័ព្ទរបស់អ្នក៖\\nPlease provide your **Phone Number**:", { parse_mode: 'Markdown' });
  } else if (state.step === 4) {
    state.data.phone = ctx.message.text;
    state.step = 5;
    ctx.reply("ជិតរួចរាល់ហើយ! សូមបញ្ចូលប្រវត្តិរូបសង្ខេប (CV/Resume) ជាទម្រង់ PDF របស់អ្នក៖\\nAlmost done! Please upload your **CV/Resume (PDF format)**:", { parse_mode: 'Markdown' });
  } else if (state.step === 10) {
    const position = ctx.message.text;
    const appInfo = state.data.forwardedApp;
    
    ctx.reply("កំពុងបញ្ចូលឯកសាររបស់បេក្ខជន... | Uploading candidate's application...");
    
    try {
      const fileLink = await ctx.telegram.getFileLink(appInfo.fileId);
      const response = await fetch(fileLink);
      const buffer = await response.arrayBuffer();
      const base64Resume = Buffer.from(buffer).toString('base64');
      
      if (base64Resume.length > 1000000) {
        return ctx.reply("សុំទោស ឯកសារ PDF ធំពេក។ | Sorry, the PDF file is too large.");
      }
  
      const newApp = {
        name: appInfo.candidateName,
        phone: 'Unknown',
        position: position,
        status: 'new',
        source: 'Forwarded by HR',
        telegramChatId: chatId.toString(),
        appliedAt: new Date().toISOString(),
        resumeBase64: \`data:\${appInfo.mimeType || 'application/pdf'};base64,\${base64Resume}\`,
        resumeName: appInfo.fileName
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
          resumeLink: \`Telegram CV Uploaded (\${appInfo.fileName})\`
        })
      });
  
      ctx.reply(\`✅ CV របស់លោកអ្នកត្រូវបានផ្ញើចូលក្នុងប្រព័ន្ធជ្រើសរើសបុគ្គលិកដោយជោគជ័យ។\\n✅ Your CV has been successfully submitted to the recruitment system.\`);
      delete userState[chatId];
    } catch (error) {
      console.error("Error saving forwarded application:", error);
      ctx.reply("សុំទោស មានបញ្ហាក្នុងការបញ្ចូលទិន្នន័យ។ | Sorry, there was an error.");
      delete userState[chatId];
    }
  }
});

bot.on('document', async (ctx) => {
    const chatId = ctx.chat.id;
    let candidateName = "Unknown Candidate";

    if (ctx.message.forward_origin || ctx.message.forward_date) {
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
        
        userState[chatId] = {
           step: 10,
           data: {
              forwardedApp: {
                 candidateName: candidateName,
                 fileId: ctx.message.document.file_id,
                 fileName: ctx.message.document.file_name,
                 mimeType: ctx.message.document.mime_type
              }
           }
        };
        return ctx.reply(\`អ្នកបានបញ្ជូន CV របស់បេក្ខជន **\${candidateName}** ។\\nតើគាត់ចង់ដាក់ពាក្យលើតួនាទីអ្វី?\\n\\nYou forwarded the CV of **\${candidateName}**.\\nWhat position do they want to apply for?\`, { parse_mode: 'Markdown' });
    } else {
        if (!userState[chatId] || userState[chatId].step !== 5) {
          return ctx.reply("សូមវាយ /start ឬប្រើ Menu ដើម្បីចាប់ផ្តើម។ | Please type /start or use the menu to begin.");
        }
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
    }
});\n\n`;

fs.writeFileSync('telegram_bot.ts', beforeText + newTextAndDocument + afterDocument, 'utf8');
console.log("Updated correctly!");
