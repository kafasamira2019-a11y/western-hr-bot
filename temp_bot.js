const { Telegraf } = require('telegraf');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, doc, getDoc, onSnapshot } = require('firebase/firestore');

const firebaseConfig = require('./firebase-applet-config.json');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const bot = new Telegraf('8879984624:AAEHqarqaXI3KffYuFLelAyNhJmQqCN_qrg');

const userState = {};

bot.start((ctx) => {
  const chatId = ctx.chat.id;
  userState[chatId] = { step: 1, data: {} };
  ctx.reply("👋 Welcome to Western International School Recruitment!\n\nPlease enter your **Full Name**:", { parse_mode: 'Markdown' });
});

bot.on('text', (ctx) => {
  const chatId = ctx.chat.id;
  if (!userState[chatId]) {
    return ctx.reply("Please type /start to begin.");
  }
  const state = userState[chatId];
  if (state.step === 1) {
    state.data.name = ctx.message.text;
    state.step = 2;
    ctx.reply("Great! What **Position** are you applying for?", { parse_mode: 'Markdown' });
  } else if (state.step === 2) {
    state.data.position = ctx.message.text;
    state.step = 3;
    ctx.reply("Please provide your **Email Address**:", { parse_mode: 'Markdown' });
  } else if (state.step === 3) {
    state.data.email = ctx.message.text;
    state.step = 4;
    ctx.reply("Please provide your **Phone Number**:", { parse_mode: 'Markdown' });
  } else if (state.step === 4) {
    state.data.phone = ctx.message.text;
    state.step = 5;
    ctx.reply("Almost done! Please upload your **CV/Resume (PDF format)**:", { parse_mode: 'Markdown' });
  }
});

bot.on('document', async (ctx) => {
  const chatId = ctx.chat.id;
  if (!userState[chatId] || userState[chatId].step !== 5) {
    return ctx.reply("Please type /start to begin.");
  }

  const state = userState[chatId];
  const fileId = ctx.message.document.file_id;
  const fileName = ctx.message.document.file_name;

  if (!fileName.toLowerCase().endsWith('.pdf')) {
    return ctx.reply("Please upload a PDF file.");
  }

  ctx.reply("Uploading your application...");

  try {
    const fileLink = await ctx.telegram.getFileLink(fileId);
    const response = await fetch(fileLink);
    const buffer = await response.arrayBuffer();
    const base64Resume = Buffer.from(buffer).toString('base64');
    
    if (base64Resume.length > 1000000) {
      return ctx.reply("❌ Sorry, your PDF file is too large (over 700KB). Please reduce the file size and try again.");
    }

    const newApp = {
      name: state.data.name,
      position: state.data.position,
      email: state.data.email,
      phone: state.data.phone,
      status: 'new',
      source: 'Telegram Bot',
      telegramChatId: chatId,
      appliedAt: new Date().toISOString(),
      resumeBase64: \data:\;base64,\\,
      resumeName: fileName
    };

    await addDoc(collection(db, 'applications'), newApp);

    await fetch('https://script.google.com/macros/s/AKfycbysfNk318SVRHJwYvYLzingJMtiFMmofhtwRWvFm80SkmxC42EZebC1YLhyD1gAYtxD/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        name: newApp.name,
        position: newApp.position,
        status: newApp.status,
        resumeLink: \PDF Uploaded (\)\
      })
    });

    ctx.reply(\👆 Thank you, \!\n\nYour application for **\** (with Resume attached) has been successfully submitted to the recruitment system.\nWe will review your application and contact you soon.\, { parse_mode: 'Markdown' });
    
    delete userState[chatId];
  } catch (error) {
    console.error("Error saving application:", error);
    ctx.reply("❌ Sorry, there was an error submitting your application. Please try again later or type /start to restart.");
    delete userState[chatId];
  }
});

onSnapshot(collection(db, 'interviews'), (snapshot) => {
  snapshot.docChanges().forEach(async (change) => {
    if (change.type === 'added') {
      const interview = change.doc.data();
      if (interview.status === 'Scheduled' && interview.createdAt > Date.now() - 300000) {
        const appDoc = await getDoc(doc(db, 'applications', interview.applicationId));
        if (appDoc.exists()) {
          const app = appDoc.data();
          if (app.telegramChatId) {
            const msg = \📅 **Interview Scheduled**\n\nHello \,\nYour interview for **\** has been scheduled!\n\n**Date:** **\**\n**Time:** **\**\n**Type:** **\**\n\nPlease be prepared and let us know if you have any questions.\n\n**More information:**\nTelegram: [Western_HR_Recruitment](https://t.me/Western_HR_Recruitment)\nTel: 015 672 353\nEmail: jobs@western.edu.kh\;
            bot.telegram.sendMessage(app.telegramChatId, msg, { parse_mode: 'Markdown' }).catch(console.error);
          }
        }
      }
    }
  });
});

onSnapshot(collection(db, 'forms'), (snapshot) => {
  snapshot.docChanges().forEach(async (change) => {
    if (change.type === 'added') {
      const form = change.doc.data();
      if (form.type === 'jobOffer' && form.createdAt > Date.now() - 300000) {
        if (form.candidateId) {
          const appDoc = await getDoc(doc(db, 'applications', form.candidateId));
          if (appDoc.exists()) {
            const app = appDoc.data();
            if (app.telegramChatId) {
              const msg = \🔔 **Congratulations \!**\n\nWe are thrilled to offer you the position of **\** at Western International School.\n\n**Start Date:** **\**\n**Salary Offer:** **\ (\)**\n**Employment Type:** **\**\n\nOur HR team will be in touch with you shortly to finalize the official paperwork. Welcome aboard!\n\n**More information:**\nTelegram: [Western_HR_Recruitment](https://t.me/Western_HR_Recruitment)\nTel: 015 672 353\nEmail: jobs@western.edu.kh\;
              bot.telegram.sendMessage(app.telegramChatId, msg, { parse_mode: 'Markdown' }).catch(console.error);
              
              if (form.pdfBase64) {
                try {
                  const base64Data = form.pdfBase64.replace(/^data:application\\/pdf;(filename=.*?;)?base64,/, '');
                  const pdfBuffer = Buffer.from(base64Data, 'base64');
                  const pdfFilename = \Job_Offer_\.pdf\;
                  bot.telegram.sendDocument(app.telegramChatId, { source: pdfBuffer, filename: pdfFilename }).catch(console.error);
                } catch (e) {
                  console.error('Error sending PDF document:', e);
                }
              }
            }
          }
        }
      }
    }
  });
});

bot.launch().then(() => console.log('Telegram Bot running...')).catch(console.error);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
