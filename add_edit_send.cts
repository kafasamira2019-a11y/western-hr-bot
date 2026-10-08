import * as fs from 'fs';

let c = fs.readFileSync('src/components/Interviews.tsx', 'utf8');

// 1. Add editId state
if (!c.includes('const [editId')) {
  c = c.replace(
    "const [location, setLocation] = useState('https://maps.app.goo.gl/xJT3esDBezChYgM29?g_st=it');",
    "const [location, setLocation] = useState('https://maps.app.goo.gl/xJT3esDBezChYgM29?g_st=it');\n  const [editId, setEditId] = useState<string | null>(null);"
  );
}

// 2. Add handleEdit and sendInvitation functions
const newFunctions = `
  const handleEdit = (inv: any) => {
    setSelectedAppId(inv.applicationId);
    setInterviewDate(inv.interviewDate || '');
    setInterviewTime(inv.interviewTime || '');
    setInterviewType(inv.interviewType || 'Online');
    setStage(inv.stage || 'First round');
    setBuilding(inv.building || 'E');
    setFloor(inv.floor || '2nd');
    setLocation(inv.location || 'https://maps.app.goo.gl/xJT3esDBezChYgM29?g_st=it');
    setEditId(inv.id);
    setShowForm(true);
  };

  const sendInvitation = async (inv: any) => {
    const app = applications.find(a => a.id === inv.applicationId);
    if (!app || !app.telegramChatId) {
      alert('Cannot send invitation: Candidate did not apply via Telegram or Chat ID is missing.');
      return;
    }

    const msg = \`🎉 **ការអញ្ជើញមកសម្ភាសន៍ / Interview Invitation**

Dear **\${inv.candidateName}**,

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
Tel: 015 672 353\`;

    try {
      const res = await fetch('https://api.telegram.org/bot8879984624:AAEHqarqaXI3KffYuFLelAyNhJmQqCN_qrg/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: app.telegramChatId,
          text: msg,
          parse_mode: 'Markdown'
        })
      });
      if (res.ok) {
        alert('✅ Invitation sent to candidate successfully!');
      } else {
        const error = await res.text();
        alert('❌ Failed to send invitation: ' + error);
      }
    } catch (e) {
      console.error(e);
      alert('❌ Error sending invitation');
    }
  };
`;

if (!c.includes('const handleEdit')) {
  c = c.replace("const updateStatus = async", newFunctions + "\n  const updateStatus = async");
}

// 3. Update handleSchedule payload and updateDoc
const handleScheduleOld = `      const payload: any = {
        applicationId: app.id,
        candidateName: app.name,
        position: app.position || 'Not specified',
        interviewDate,
        interviewTime,
        interviewType,
        stage,
        location,
        status: 'Scheduled',
        createdAt: Date.now()
      };`;
const handleScheduleNew = `      const payload: any = {
        applicationId: app.id,
        candidateName: app.name,
        position: app.position || 'Not specified',
        interviewDate,
        interviewTime,
        interviewType,
        stage,
        building,
        floor,
        location,
        status: 'Scheduled',
        createdAt: Date.now()
      };`;
c = c.replace(handleScheduleOld, handleScheduleNew);

const addDocOld = `await addDoc(collection(db, 'interviews'), payload);`;
const addDocNew = `if (editId) {
        await updateDoc(doc(db, 'interviews', editId), payload);
        setEditId(null);
      } else {
        await addDoc(collection(db, 'interviews'), payload);
      }`;
c = c.replace(addDocOld, addDocNew);

// Fix title in form
c = c.replace("Schedule New Interview</h3>", "{editId ? 'Edit Interview' : 'Schedule New Interview'}</h3>");
c = c.replace("Cancel' : <><Plus className=\"w-4 h-4\" /> Schedule Interview</>}", "Cancel' : <><Plus className=\"w-4 h-4\" /> Schedule Interview</>}\n        </button>\n        {showForm && editId && (\n          <button onClick={() => { setShowForm(false); setEditId(null); }} className=\"flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition ml-2\">\n            Cancel Edit\n          </button>\n        )}");

c = c.replace("Save Schedule</button>", "{editId ? 'Update Schedule' : 'Save Schedule'}</button>");

// Add Send Icon
if (!c.includes('Send,')) {
    c = c.replace('Plus, Trash2, FileDown, ExternalLink, Eye, X, Download } from \'lucide-react\';', 'Plus, Trash2, FileDown, ExternalLink, Eye, X, Download, Send, Edit2 } from \'lucide-react\';');
}

// Update buttons in table
const buttonsOld = `<button onClick={() => deleteInterview(inv.id)} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>`;
const buttonsNew = `<div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(inv)} className="text-blue-500 hover:text-blue-700 p-1" title="Edit Interview">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => sendInvitation(inv)} className="text-green-500 hover:text-green-700 p-1" title="Send Invitation to Telegram">
                          <Send className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteInterview(inv.id)} className="text-red-500 hover:text-red-700 p-1" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>`;
c = c.replace(buttonsOld, buttonsNew);

fs.writeFileSync('src/components/Interviews.tsx', c, 'utf8');
