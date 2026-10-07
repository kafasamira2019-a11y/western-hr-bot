import { Telegraf } from 'telegraf';
import * as http from 'http';
const port = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
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

bot.on('text', (ctx) => {
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
  }
});

bot.on('document', async (ctx) => {
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
        resumeBase64: `data:${ctx.message.document.mime_type || 'application/pdf'};base64,${base64Resume}`,
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
  
      if (isForwarded) {
         ctx.reply(`✅ CV របស់ ${candidateName} សម្រាប់តួនាទី ${candidatePosition} ត្រូវបានរក្សាចូលក្នុង Google Sheets ដោយជោគជ័យ!`);
      } else {
         ctx.reply(`ឯកសារដាក់ពាក្យសម្រាប់តួនាទី ${candidatePosition} ត្រូវបានរក្សាទុកដោយជោគជ័យ។ | Application saved successfully.`, { parse_mode: 'Markdown' });
         delete userState[chatId];
      }
    } catch (error) {
      console.error("Error saving application:", error);
      ctx.reply("សុំទោស មានបញ្ហាក្នុងការបញ្ចូលទិន្នន័យ។ | Sorry, there was an error.");
      if (!isForwarded) delete userState[chatId];
    }
  });
});

const processedInterviews = new Set();
onSnapshot(collection(db, 'interviews'), (snapshot) => {
  snapshot.docChanges().forEach(async (change) => {
    if (change.type === 'added') {
      if (processedInterviews.has(change.doc.id)) return;
      processedInterviews.add(change.doc.id);
      const interview = change.doc.data();
      if (interview.status === 'Scheduled' && interview.createdAt > Date.now() - 300000) {
        const appDoc = await getDoc(doc(db, 'applications', interview.applicationId));
        if (appDoc.exists()) {
          const app = appDoc.data();
          if (app.telegramChatId) {
            const msg = `📅 **កាលវិភាគសម្ភាសន៍ការងារ | Interview Scheduled**\n\nសួស្តី ${interview.candidateName},\nការសម្ភាសន៍របស់អ្នកសម្រាប់តួនាទី **${interview.position || ''}** ត្រូវបានកំណត់ពេលវេលា!\n\n**កាលបរិច្ឆេទ | Date:** **${interview.interviewDate}**\n**ពេលវេលា | Time:** **${interview.interviewTime}**\n**ប្រភេទ | Type:** **${interview.interviewType}**\n**ទីតាំង | Location:** **${interview.location || 'N/A'}**\n\nសូមត្រៀមខ្លួនឲ្យបានរួចរាល់ ហើយទំនាក់ទំនងមកយើងប្រសិនបើអ្នកមានសំណួរអ្វីបន្ថែម។\n\nHello ${interview.candidateName},\nYour interview for **${interview.position || ''}** has been scheduled!\n\n**Date:** **${interview.interviewDate}**\n**Time:** **${interview.interviewTime}**\n**Type:** **${interview.interviewType}**\n**Location:** **${interview.location || 'N/A'}**\n\nPlease be prepared and let us know if you have any questions.\n\n**More information:**\nTelegram: [Western_HR_Recruitment](https://t.me/Western_HR_Recruitment)\nTel: 015 672 353\nEmail: jobs@western.edu.kh`;
            bot.telegram.sendMessage(app.telegramChatId, msg, { parse_mode: 'Markdown' }).catch(console.error);
          }
        }
      }
    }
  });
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

bot.launch().then(() => console.log('Telegram Bot ESM running...')).catch(console.error);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


// --- GRAMJS USERBOT ---
const apiId = 32250553;
const apiHash = "1555d8a69465b327b5372a49a317dbb6";
let sessionString = (process.env.TELEGRAM_SESSION || "").trim();
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
      if (message.media) {
        
          const text = (message.message || "").toLowerCase();
          
          if (true) {

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
                await client.sendMessage(message.peerId, { message: '⏳ Processing your CV, please wait...' });
                const base64Resume = buffer.toString('base64');
                if (base64Resume.length > 1000000) {
                   await client.sendMessage(message.peerId, { message: 'Sorry, your PDF file is too large. Please reduce the file size (under 700KB) and try again.' });
                   return;
                }
                const fileName = `cvs/${message.senderId}_${Date.now()}.pdf`;
                
                const newApp = {
                  name: 'Candidate ' + message.senderId,
                  phone: 'Unknown',
                  position: position,
                  status: 'new',
                  source: 'Telegram Direct',
                  telegramChatId: message.senderId.toString(),
                  appliedAt: new Date().toISOString(),
                  resumeBase64: `data:application/pdf;base64,${base64Resume}`,
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
                    resumeLink: `Telegram CV Uploaded`
                  })
                });

                await client.sendMessage(message.peerId, { message: 'អរគុណដែលបានចាប់អារម្មណ៍ការងារនៅ Western! យើងខ្ញុំបានទទួល CV របស់អ្នកសម្រាប់តួនាទី ' + position + ' រួចរាល់ហើយ។ ក្រុមការងារ HR នឹងពិនិត្យ និងទាក់ទងទៅអ្នកវិញក្នុងពេលឆាប់ៗ។' });
              }
            } catch (e) {

            console.error("Error processing CV:", e);
          }
        }
      }
    }, new NewMessage({}));
  });
}
