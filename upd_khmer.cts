import * as fs from 'fs';

let c = fs.readFileSync('src/components/Interviews.tsx', 'utf8');

const oldMsg = `Dear **\${inv.candidateName}**,

We are pleased to invite you for an interview for the position of **\${inv.position}** at Western International School.

📅 **Date:** \${inv.interviewDate}
⏰ **Time:** \${inv.interviewTime}
🏢 **Type:** \${inv.interviewType} (\${inv.stage})
📍 **Building:** \${inv.building || 'E'}, **Floor:** \${inv.floor || '2nd'}
🔗 **Location / Link:** [View Location/Link](\${inv.location})

សូមអញ្ជើញមកអោយបានទៀងទាត់ពេលវេលា។ សូមអរគុណ!
Please be on time. Thank you!

**Contact HR:**
Telegram: @Western_HR_Recruitment
Tel: 015 672 353`;

const newMsg = `ជម្រាបសួរ / Dear **\${inv.candidateName}**,

យើងខ្ញុំមានសេចក្តីសោមនស្សរីករាយ សូមអញ្ជើញលោក/លោកស្រីមកចូលរួមការសម្ភាសន៍ការងារសម្រាប់តួនាទី **\${inv.position}** នៅសាលាអន្តរជាតិវេស្ទើន។
We are pleased to invite you for an interview for the position of **\${inv.position}** at Western International School.

📅 **កាលបរិច្ឆេទ / Date:** \${inv.interviewDate}
⏰ **ម៉ោង / Time:** \${inv.interviewTime}
🏢 **ទម្រង់សម្ភាសន៍ / Type:** \${inv.interviewType} (\${inv.stage})
📍 **អគារ / Building:** \${inv.building || 'E'}, **ជាន់ទី / Floor:** \${inv.floor || '2nd'}
🔗 **ទីតាំង / Location:** [មើលទីតាំងផែនទី / View Location/Link](\${inv.location})

សូមអញ្ជើញមកអោយបានទៀងទាត់ពេលវេលា។ សូមអរគុណ!
Please be on time. Thank you!

**ទំនាក់ទំនងផ្នែកធនធានមនុស្ស / Contact HR:**
តេឡេក្រាម / Telegram: @Western_HR_Recruitment
ទូរស័ព្ទ / Tel: 015 672 353`;

c = c.replace(oldMsg, newMsg);

fs.writeFileSync('src/components/Interviews.tsx', c, 'utf8');
