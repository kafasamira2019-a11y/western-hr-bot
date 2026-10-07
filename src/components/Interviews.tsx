import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { Calendar, Clock, Video, MapPin, Search, Plus, Trash2, FileDown, ExternalLink, Eye, X, Download, Send, Edit2 } from 'lucide-react';
import { syncToGoogleSheet } from '../lib/sheets';

export default function Interviews() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [previewPdf, setPreviewPdf] = useState<{name: string, base64: string} | null>(null);
  
  const [selectedAppId, setSelectedAppId] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewType, setInterviewType] = useState('Online');
  const [stage, setStage] = useState('First round');
  const [building, setBuilding] = useState('E');
  const [floor, setFloor] = useState('2nd');
  const [location, setLocation] = useState('https://maps.app.goo.gl/xJT3esDBezChYgM29?g_st=it');
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch interviews
    const qInterviews = query(collection(db, 'interviews'), orderBy('createdAt', 'desc'));
    const unsubInterviews = onSnapshot(qInterviews, (snap) => {
      setInterviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch applications for the dropdown
    const qApps = query(collection(db, 'applications'), orderBy('appliedAt', 'desc'));
    const unsubApps = onSnapshot(qApps, (snap) => {
      setApplications(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubInterviews(); unsubApps(); };
  }, []);

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

    const msg = `🎉 **ការអញ្ជើញមកសម្ភាសន៍ / Interview Invitation**

ជម្រាបសួរ / Dear **${inv.candidateName}**,

យើងខ្ញុំមានសេចក្តីសោមនស្សរីករាយ សូមអញ្ជើញលោក/លោកស្រីមកចូលរួមការសម្ភាសន៍ការងារសម្រាប់តួនាទី **${inv.position}** នៅសាលាអន្តរជាតិវេស្ទើន។
We are pleased to invite you for an interview for the position of **${inv.position}** at Western International School.

📅 **កាលបរិច្ឆេទ / Date:** ${inv.interviewDate}
⏰ **ម៉ោង / Time:** ${inv.interviewTime}
🏢 **ទម្រង់សម្ភាសន៍ / Type:** ${inv.interviewType} (${inv.stage})
📍 **អគារ / Building:** ${inv.building || 'E'}, **ជាន់ទី / Floor:** ${inv.floor || '2nd'}
🔗 **ទីតាំង / Location:** [មើលទីតាំងផែនទី / View Location/Link](${inv.location})

សូមអញ្ជើញមកអោយបានទៀងទាត់ពេលវេលា។ សូមអរគុណ!
Please be on time. Thank you!

**ទំនាក់ទំនងផ្នែកធនធានមនុស្ស / Contact HR:**
តេឡេក្រាម / Telegram: @Western_HR_Recruitment
ទូរស័ព្ទ / Tel: 015 672 353`;

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

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId) return alert('Select a candidate');

    const app = applications.find(a => a.id === selectedAppId);
    if (!app) return;

    try {
      const payload: any = {
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
      };
      
      if (app.resumeLink) payload.resumeLink = app.resumeLink;
      if (app.resumeBase64) payload.resumeBase64 = app.resumeBase64;
      if (app.resumeName) payload.resumeName = app.resumeName;

      if (editId) {
        await updateDoc(doc(db, 'interviews', editId), payload);
        setEditId(null);
      } else {
        await addDoc(collection(db, 'interviews'), payload);
      }
      
      await syncToGoogleSheet('schedule', { id: payload.applicationId, scheduleDate: interviewDate, scheduleTime: interviewTime, scheduleType: interviewType, stage, location });
      setShowForm(false);
      setSelectedAppId('');
      setInterviewDate('');
      setInterviewTime('');
    } catch (err) {
      console.error(err);
      alert('Error scheduling interview');
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'interviews', id), { status });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteInterview = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'interviews', id));
      await syncToGoogleSheet('delete_interview', { id });
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Pass the First round interview': return 'bg-green-100 text-green-800';
      case 'Pass the Second Round Interview': return 'bg-emerald-100 text-emerald-800';
      case 'Offer Job': return 'bg-purple-100 text-purple-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Interviews</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Schedule and track candidate interviews.</p>
        </div>
        <button 
          onClick={() => { setShowForm(!showForm); setEditId(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
        >
          {showForm ? 'Cancel' : <><Plus className="w-4 h-4" /> Schedule Interview</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{editId ? 'Edit Interview' : 'Schedule New Interview'}</h3>
          <form onSubmit={handleSchedule} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Candidate</label>
              <select required value={selectedAppId} onChange={(e) => setSelectedAppId(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select a candidate...</option>
                {applications.map(app => (
                  <option key={app.id} value={app.id}>{app.name} ({app.position || 'No Position'})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input type="date" required value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
              <input type="time" required value={interviewTime} onChange={(e) => setInterviewTime(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select value={interviewType} onChange={(e) => setInterviewType(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Online">Online</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stage</label>
              <select value={stage} onChange={(e) => setStage(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                <option value="First round">First round</option>
                <option value="Second round">Second round</option>
                <option value="Final Round">Final Round</option>
              </select>
            </div>
                          <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location / Link</label>
                <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Room 101 or Zoom Link" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="md:col-span-2 pt-2 flex gap-2">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition">{editId ? 'Update Schedule' : 'Save Schedule'}</button>
              {editId && (
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 rounded-lg transition">Cancel</button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Candidate</th>
                <th className="px-6 py-4 font-medium">Schedule</th>
                <th className="px-6 py-4 font-medium">Details</th>
                <th className="px-6 py-4 font-medium">Resume</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {interviews.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No interviews scheduled.</td></tr>
              ) : (
                interviews.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{inv.candidateName}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{inv.position}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300"><Calendar className="w-3 h-3" /> {inv.interviewDate}</div>
                      <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5"><Clock className="w-3 h-3" /> {inv.interviewTime}</div>
                    </td>
                                          <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                          {inv.interviewType === 'Online' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />} {inv.interviewType}
                        </div>
                        <div className="text-gray-500 text-xs mt-0.5">{inv.stage}</div>
                        {inv.location && <div className="text-gray-500 font-medium text-xs mt-1">📍 {inv.location}</div>}
                      </td>
                    <td className="px-6 py-4">
                      {inv.resumeBase64 ? (
                        <button 
                          onClick={() => setPreviewPdf({ name: inv.resumeName || `resume_${inv.candidateName}.pdf`, base64: inv.resumeBase64 })}
                          className="text-blue-600 hover:underline flex items-center gap-1 text-xs"
                        >
                          <Eye className="w-3 h-3" /> Preview PDF
                        </button>
                      ) : inv.resumeLink ? (
                        <a href={inv.resumeLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 text-xs"><ExternalLink className="w-3 h-3" /> View Link</a>
                      ) : <span className="text-gray-400 text-xs">No doc</span>}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={inv.status}
                        onChange={(e) => updateStatus(inv.id, e.target.value)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full outline-none cursor-pointer appearance-none ${getStatusColor(inv.status)}`}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Pass the First round interview">Pass First Round</option>
                        <option value="Pass the Second Round Interview">Pass Second Round</option>
                        <option value="Offer Job">Offer Job</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(inv)} className="text-blue-500 hover:text-blue-700 p-1" title="Edit Interview">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => sendInvitation(inv)} className="text-green-500 hover:text-green-700 p-1" title="Send Invitation to Telegram">
                          <Send className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteInterview(inv.id)} className="text-red-500 hover:text-red-700 p-1" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {previewPdf && ( sessionStorage.setItem('currentPdfBase64', previewPdf.base64 || previewPdf), 
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setPreviewPdf(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate pr-4">{previewPdf.name}</h3>
              <button onClick={() => setPreviewPdf(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-md transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 h-full overflow-hidden bg-gray-100 dark:bg-gray-900">
              <iframe src="/pdf-viewer.html" className="w-full h-full border-0" title="PDF Preview" />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <a 
                href={previewPdf.base64} 
                download={previewPdf.name} 
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                <Download className="w-4 h-4" /> Download PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
