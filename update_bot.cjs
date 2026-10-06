const fs = require('fs');
let content = fs.readFileSync('telegram_bot.ts', 'utf8');

const oldMsg = 'const msg = `📅 **Interview Scheduled**\\n\\nHello ${interview.candidateName},\\nYour interview for **${interview.position || \'\'}** has been scheduled!\\n\\n**Date:** **${interview.interviewDate}**\\n**Time:** **${interview.interviewTime}**\\n**Type:** **${interview.interviewType}**\\n\\nPlease be prepared and let us know if you have any questions.\\n\\n**More information:**\\nTelegram: [Western_HR_Recruitment](https://t.me/Western_HR_Recruitment)\\nTel: 015 672 353\\nEmail: jobs@western.edu.kh`;';

const newMsg = 'const msg = `📅 **កាលវិភាគសម្ភាសន៍ការងារ | Interview Scheduled**\\n\\nសួស្តី ${interview.candidateName},\\nការសម្ភាសន៍របស់អ្នកសម្រាប់តួនាទី **${interview.position || \'\'}** ត្រូវបានកំណត់ពេលវេលា!\\n\\n**កាលបរិច្ឆេទ | Date:** **${interview.interviewDate}**\\n**ពេលវេលា | Time:** **${interview.interviewTime}**\\n**ប្រភេទ | Type:** **${interview.interviewType}**\\n**ទីតាំង | Location:** **${interview.location || \'N/A\'}**\\n\\nសូមត្រៀមខ្លួនឲ្យបានរួចរាល់ ហើយទំនាក់ទំនងមកយើងប្រសិនបើអ្នកមានសំណួរអ្វីបន្ថែម។\\n\\nHello ${interview.candidateName},\\nYour interview for **${interview.position || \'\'}** has been scheduled!\\n\\n**Date:** **${interview.interviewDate}**\\n**Time:** **${interview.interviewTime}**\\n**Type:** **${interview.interviewType}**\\n**Location:** **${interview.location || \'N/A\'}**\\n\\nPlease be prepared and let us know if you have any questions.\\n\\n**More information:**\\nTelegram: [Western_HR_Recruitment](https://t.me/Western_HR_Recruitment)\\nTel: 015 672 353\\nEmail: jobs@western.edu.kh`;';

content = content.replace(oldMsg, newMsg);

fs.writeFileSync('telegram_bot.ts', content);
