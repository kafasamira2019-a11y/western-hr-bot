import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import input from 'input';
import fs from 'fs';

const apiId = 32250553;
const apiHash = "1555d8a69465b327b5372a49a317dbb6";
const stringSession = new StringSession("");

(async () => {
  console.log("Loading interactive setup...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  
  await client.start({
    phoneNumber: async () => await input.text("Please enter your phone number (e.g. +855...): "),
    password: async () => await input.text("Please enter your 2FA password (leave blank if none): "),
    phoneCode: async () => await input.text("Please enter the code you received in Telegram: "),
    onError: (err) => console.log(err),
  });
  
  console.log("Connected successfully!");
  const sessionString = client.session.save();
  fs.writeFileSync('session.txt', sessionString);
  console.log("Session saved to session.txt! You can now close this terminal.");
  await client.disconnect();
})();
