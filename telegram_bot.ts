import { Telegraf } from 'telegraf';
import * as http from 'http';
import * as https from 'https';

const port = process.env.PORT || 3000;
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.url && req.url.startsWith('/cv/')) {
    const fileId = req.url.split('/cv/')[1];
    try {
      const fileLink = await bot.telegram.getFileLink(fileId);
      
      https.get(fileLink.href, (telegramRes) => {
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Length': telegramRes.headers['content-length'] || ''
        });
        telegramRes.pipe(res);
      }).on('error', (e) => {
        res.statusCode = 500;
        res.end('Error streaming file');
      });
    } catch (e) {
      res.statusCode = 404;
      res.end('File not found or invalid file_id');
    }
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Telegram Bot is running!\n');
});
server.listen(port, () => { console.log(`Server running at port ${port}/`); });

  // Render Free Tier keep-alive ping
  setInterval(() => {
    fetch('https://western-hr-bot.onrender.com/').then(res => {
      console.log('Self-ping successful:', res.status);
    }).catch(err => {
      console.error('Self-ping failed:', err.message);
    });
  }, 14 * 60 * 1000); // Ping every 14 minutes


import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { generatePDF } from './src/utils/formPdfGenerator';

import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { NewMessage } from 'telegram/events';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import fs from 'fs';
const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const bot = new Telegraf('8879984624:AAEHqarqaXI3KffYuFLelAyNhJmQqCN_qrg');

bot.telegram.setMyCommands([
  { command: 'start', description: 'ចាប់ផ្តើមដាក់ពាក្យ | Start Application' }
]).catch(console.error);

const userState: Record<number, any> = {};

bot.start((ctx) => {
  const chatId = ctx.chat.id;
  userState[chatId] = { step: 1, data: {} };
  const welcomeMsg = `🎓 **សូមស្វាគមន៍មកកាន់សាលាអន្តរជាតិវេស្ទើន! | Welcome to Western International School!**\n\nសូមអរគុណចំពោះចំណាប់អារម្មណ៍របស់អ្នកក្នុងការចូលរួមជាមួយក្រុមការងារ និងអ្នកជំនាញអប់រំរបស់យើង។ យើងប្តេជ្ញាចិត្តក្នុងការលើកកម្ពស់ឧត្តមភាពសិក្សា និងពង្រឹងសមត្ថភាពអ្នកដឹកនាំជំនាន់ក្រោយ។\n\nThank you for your interest in joining our dedicated team of educators and professionals. We are committed to fostering academic excellence and empowering the next generation of leaders.\n\nដើម្បីចាប់ផ្តើមដំណើរការដាក់ពាក្យ សូមវាយបញ្ចូលឈ្មោះពេញរបស់អ្នក៖\nTo begin your application process, please reply with your **Full Name**:`;
  ctx.reply(welcomeMsg, { parse_mode: 'Markdown' });
});

bot.on('text', async (ctx) => {
  const chatId = ctx.chat.id;
  if (!userState[chatId]) {
    return ctx.reply("សូមចុចលើ /start ឬ Menu ដើម្បីចាប់ផ្តើម។\nPlease type /start or use the menu to begin.");
  }
  const state = userState[chatId];
  if (state.step === 1) {
    state.data.name = ctx.message.text;
    state.step = 2;
    ctx.reply("អស្ចារ្យណាស់! តើអ្នកកំពុងដាក់ពាក្យសម្រាប់តួនាទីអ្វី?\nGreat! What **Position** are you applying for?", { parse_mode: 'Markdown' });
  } else if (state.step === 2) {
    state.data.position = ctx.message.text;
    state.step = 3;
    ctx.reply("សូមផ្តល់អាសយដ្ឋានអ៊ីមែលរបស់អ្នក៖\nPlease provide your **Email Address**:", { parse_mode: 'Markdown' });
  } else if (state.step === 3) {
    state.data.email = ctx.message.text;
    state.step = 4;
    ctx.reply("សូមផ្តល់លេខទូរស័ព្ទរបស់អ្នក៖\nPlease provide your **Phone Number**:", { parse_mode: 'Markdown' });
  } else if (state.step === 4) {
    state.data.phone = ctx.message.text;
    state.step = 5;
    ctx.reply("ជិតរួចរាល់ហើយ! សូមបញ្ចូលប្រវត្តិរូបសង្ខេប (CV/Resume) ជាទម្រង់ PDF របស់អ្នក៖\nAlmost done! Please upload your **CV/Resume (PDF format)**:", { parse_mode: 'Markdown' });
  } else if (state.step === 10) {
    state.data.forwardedApp.candidateName = ctx.message.text;
    state.step = 11;
    ctx.reply("តើគាត់ចង់ដាក់ពាក្យលើតួនាទីអ្វី?\nWhat position do they want to apply for?", { parse_mode: 'Markdown' });
  } else if (state.step === 11) {
    const position = ctx.message.text;
    const appInfo = state.data.forwardedApp;
    
    ctx.reply("កំពុងបញ្ចូលឯកសាររបស់បេក្ខជន... | Uploading candidate's application...");
    
    try {
      const fileLink = await ctx.telegram.getFileLink(appInfo.fileId);
      
  
      const newApp = {
        name: appInfo.candidateName,
        phone: 'Unknown',
        position: position,
        status: 'new',
        source: 'Forwarded by HR',
        telegramChatId: chatId.toString(),
        appliedAt: new Date().toISOString(),
        resumeBase64: 'https://western-hr-bot.onrender.com/cv/' + appInfo.fileId,
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
          resumeLink: `Telegram CV Uploaded (${appInfo.fileName})`
        })
      });
  
      ctx.reply(`✅ CV របស់លោកអ្នកត្រូវបានផ្ញើចូលក្នុងប្រព័ន្ធជ្រើសរើសបុគ្គលិកដោយជោគជ័យ។\n✅ Your CV has been successfully submitted to the recruitment system.`);
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
          
      
          const newApp = {
            name: state.data.name,
            phone: state.data.phone,
            position: candidatePosition,
            status: 'new',
            source: 'Telegram Bot',
            telegramChatId: chatId.toString(),
            appliedAt: new Date().toISOString(),
            resumeBase64: 'https://western-hr-bot.onrender.com/cv/' + fileId,
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
              resumeLink: `Telegram CV Uploaded (${fileName})`
            })
          });
      
          ctx.reply(`✅ CV របស់លោកអ្នកត្រូវបានផ្ញើចូលក្នុងប្រព័ន្ធជ្រើសរើសបុគ្គលិកដោយជោគជ័យ។\n✅ Your CV has been successfully submitted to the recruitment system.`);
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
        return ctx.reply("ឯកសារទទួលបាន! តើបេក្ខជននេះមានឈ្មោះអ្វី?\nDocument received! What is the candidate's name?", { parse_mode: 'Markdown' });
    }
});

const processedForms = new Set();
onSnapshot(collection(db, 'forms'), (snapshot) => {
  snapshot.docChanges().forEach(async (change) => {
    if (change.type === 'added') {
      if (processedForms.has(change.doc.id)) return;
      processedForms.add(change.doc.id);
      const form = change.doc.data();
      if (form.type === 'jobOffer' && form.createdAt > Date.now() - 300000) {
        if (form.candidateId) {
          const appDoc = await getDoc(doc(db, 'applications', form.candidateId));
          if (appDoc.exists()) {
            const app = appDoc.data();
            if (app.telegramChatId) {
              const msg = `🔔 **Congratulations ${form.candidateName}!**\n\nWe are thrilled to offer you the position of **${form.positionTitle}** at Western International School.\n\n**Start Date:** **${form.startDate}**\n**Salary Offer:** **${form.payAmount || 'N/A'} (${form.payType || ''})**\n**Employment Type:** **${form.offerEmploymentType || 'N/A'}**\n\nOur HR team will be in touch with you shortly to finalize the official paperwork. Welcome aboard!\n\n**More information:**\nTelegram: [Western_HR_Recruitment](https://t.me/Western_HR_Recruitment)\nTel: 015 672 353\nEmail: jobs@western.edu.kh`;
              bot.telegram.sendMessage(app.telegramChatId, msg, { parse_mode: 'Markdown' }).catch(console.error);
              
              try {
                // Generate PDF on the server side using the exact same generator used in frontend!
                const docPdf = generatePDF(form as any, false);
                const pdfBase64 = docPdf.output('datauristring');
                const base64Data = pdfBase64.replace(/^data:application\/pdf;(filename=.*?;)?base64,/, '');
                const pdfBuffer = Buffer.from(base64Data, 'base64');
                const pdfFilename = `Job_Offer_${form.candidateName.replace(/\s+/g, '_')}.pdf`;
                bot.telegram.sendDocument(app.telegramChatId, { source: pdfBuffer, filename: pdfFilename }).catch(console.error);
              } catch (e) {
                console.error('Error sending PDF document:', e);
              }
            }
          }
        }
      }
    }
  });
});

bot.launch().then(() => console.log('Telegram Bot ESM running...')).catch((err) => {
  console.error('Bot launch failed:', err);
  process.exit(1);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));