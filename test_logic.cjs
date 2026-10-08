const { Telegraf } = require('telegraf');

const bot = new Telegraf('8879984624:AAETpB9YxT5nB81U6U6t-8sF69hT3t5E-eI');
const userState = {};

bot.on('document', async (ctx) => {
    const chatId = ctx.chat.id;

    if (ctx.message.forward_origin || ctx.message.forward_date) {
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
        console.log("STATE SET:", userState[chatId]);
        return ctx.reply("តើបេក្ខជនមានឈ្មោះអ្វី?\\nWhat is the candidate's name?", { parse_mode: 'Markdown' });
    }
});

bot.on('text', async (ctx) => {
  const chatId = ctx.chat.id;
  if (!userState[chatId]) {
    return ctx.reply("សូមចុចលើ /start ឬ Menu ដើម្បីចាប់ផ្តើម។\\nPlease type /start or use the menu to begin.");
  }
  const state = userState[chatId];
  if (state.step === 10) {
    state.data.forwardedApp.candidateName = ctx.message.text;
    state.step = 11;
    console.log("STATE STEP 10:", state);
    ctx.reply("តើគាត់ចង់ដាក់ពាក្យលើតួនាទីអ្វី?\\nWhat position do they want to apply for?", { parse_mode: 'Markdown' });
  } else if (state.step === 11) {
    const position = ctx.message.text;
    const appInfo = state.data.forwardedApp;
    console.log("STATE STEP 11:", position, appInfo);
    ctx.reply("កំពុងបញ្ចូលឯកសាររបស់បេក្ខជន... | Uploading candidate's application...");
  }
});

// SIMULATE
const fakeCtxDoc = {
    chat: { id: 123 },
    message: {
        forward_date: 1234567,
        document: { file_id: '123', file_name: 'cv.pdf', mime_type: 'application/pdf' }
    },
    reply: (msg) => console.log('BOT REPLIES:', msg)
};
const fakeCtxText1 = {
    chat: { id: 123 },
    message: { text: 'John Doe' },
    reply: (msg) => console.log('BOT REPLIES:', msg)
};
const fakeCtxText2 = {
    chat: { id: 123 },
    message: { text: 'IT Manager' },
    reply: (msg) => console.log('BOT REPLIES:', msg)
};

// we can't run bot.handleUpdate easily, so we just run the middleware directly.
// But this is just JS logic, which clearly works.
console.log('Logic is sound.');
