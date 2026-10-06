import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle, Send, Upload } from 'lucide-react';
import { syncToGoogleSheet } from '../lib/sheets';

export default function CandidateForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', position: '', resumeLink: '' });
  const [file, setFile] = useState<File | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'link' | 'file'>('file');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 700 * 1024) { // 700KB limit for base64 in Firestore (Firestore 1MB limit)
        setErrorMsg('Due to database limits, file size must be under 700KB. For larger files, please provide a Google Drive link instead.');
        setFile(null);
        e.target.value = '';
      } else {
        setErrorMsg('');
        setFile(selectedFile);
      }
    }
  };

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadMethod === 'file' && !file) {
      setErrorMsg('Please select a PDF file to upload.');
      return;
    }
    if (uploadMethod === 'link' && !formData.resumeLink) {
      setErrorMsg('Please provide a resume link.');
      return;
    }

    setStatus('submitting');
    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        status: 'new',
        isShortlisted: false,
        appliedAt: Date.now()
      };

      if (uploadMethod === 'link') {
        payload.resumeLink = formData.resumeLink;
      } else if (file) {
        payload.resumeBase64 = await getBase64(file);
        payload.resumeName = file.name;
      }

      const docRef = await addDoc(collection(db, 'applications'), payload);
      
      // Sync to Google Sheets
      await syncToGoogleSheet('add', {
        id: docRef.id,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        position: payload.position,
        status: payload.status,
        resumeLink: payload.resumeLink || (file ? `PDF Uploaded (${file.name})` : '')
      });

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', position: '', resumeLink: '' });
      setFile(null);
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || 'Failed to submit application');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-md mx-auto mt-12 text-center">
        <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Application Received</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thank you for applying. Our hiring team will review your profile and contact you soon.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 md:mt-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Info */}
        <div className="relative p-8 sm:p-10 md:w-2/5 text-white flex flex-col justify-start overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 pt-12">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-blue-500 opacity-20 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-cyan-400 opacity-20 blur-3xl pointer-events-none"></div>
          <a href="https://drive.google.com/file/d/1f1iEwR66HuJAvT9haXLr2_BAR5EpBPtD/view?usp=drive_link" target="_blank" rel="noopener noreferrer">
            <img src="/wis-logo.png" alt="Logo" className="w-72 mb-8 relative z-10 object-contain hover:opacity-90 transition-opacity cursor-pointer bg-white/90 p-4 rounded-xl shadow-lg" />
          </a>
          <h2 className="text-4xl font-extrabold mb-4 relative z-10 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">Join Our Team</h2>
          <p className="text-blue-100/80 text-lg leading-relaxed relative z-10 font-light">
            We are always looking for talented and passionate individuals to join the Western International School team. Fill out the form to submit your application directly to our HR portal.
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="p-6 sm:p-8 md:w-3/5">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Candidate Application</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all shadow-sm"
                placeholder="Jane Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all shadow-sm"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all shadow-sm"
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position Applying For</label>
              <input
                  list="positionList"
                  type="text"
                  required
                  value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all shadow-sm"
                placeholder="Select or type your position"
                />
                <datalist id="positionList">
                  <option value="Academic Advisor" />
                  <option value="Academic Coordinator" />
                  <option value="Academic Director" />
                  <option value="Accountant" />
                  <option value="Admin Manager" />
                  <option value="Admin Officer" />
                  <option value="Admin Supervisor" />
                  <option value="Administrative Assistant" />
                  <option value="Assistant School Principal" />
                  <option value="Cashier" />
                  <option value="Discipline Officer" />
                  <option value="Digital Learning Coordinator" />
                  <option value="EN - Computer" />
                  <option value="EN - Early Childhood Teacher" />
                  <option value="EN - Grammar Teacher" />
                  <option value="EN - Math Teacher" />
                  <option value="EN - Physics Teacher" />
                  <option value="EN - Social Studies Teacher" />
                  <option value="English Director" />
                  <option value="English Teacher" />
                  <option value="Finance Director" />
                  <option value="Finance Manager" />
                  <option value="Finance Officer" />
                  <option value="Financial Controller" />
                  <option value="GEP Director" />
                  <option value="GEP Office" />
                  <option value="HR Assistant" />
                  <option value="HR Director" />
                  <option value="HR Manager" />
                  <option value="HR Officer" />
                  <option value="HR Supervisor" />
                  <option value="ICT Coordinator" />
                  <option value="IT Manager" />
                  <option value="IT Officer" />
                  <option value="IT Support Technician" />
                  <option value="KH - Chemistry Teacher" />
                  <option value="KH - Coordinator" />
                  <option value="KH - Math Teacher" />
                  <option value="KH - Physics Teacher" />
                  <option value="KH - Social Studies Teacher" />
                  <option value="Khmer Director" />
                  <option value="Khmer Teacher" />
                  <option value="Logistics Officer" />
                  <option value="Network Administrator" />
                  <option value="Office Manager" />
                  <option value="Operations Director" />
                  <option value="Operations Manager" />
                  <option value="Payroll Officer" />
                  <option value="Procurement Officer" />
                  <option value="School Counselor" />
                  <option value="School Counselling Manager" />
                  <option value="School Counselling Supervisor" />
                  <option value="School Nurse" />
                  <option value="School Principal" />
                  <option value="Student Affairs Coordinator" />
                  <option value="Student Affairs Officer" />
                  <option value="Teacher Assistant" />
                  <option value="Transport Manager" />
                  <option value="Vice President of Academic" />
                  <option value="Vice President of Finance" />
                  <option value="Vice President of Operations" />
                  <option value="Vice School Principal" />
                </datalist>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Resume Submission</label>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => { setUploadMethod('file'); setErrorMsg(''); }}
                    className={`text-xs px-2 py-1 rounded transition ${uploadMethod === 'file' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}
                  >
                    Upload PDF
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setUploadMethod('link'); setErrorMsg(''); }}
                    className={`text-xs px-2 py-1 rounded transition ${uploadMethod === 'link' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}
                  >
                    Provide Link
                  </button>
                </div>
              </div>

              {uploadMethod === 'link' ? (
                <div className="relative">
                  <input
                    type="url"
                    required
                    value={formData.resumeLink}
                    onChange={(e) => setFormData({ ...formData, resumeLink: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="https://linkedin.com/in/..."
                  />
                  <Upload className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    required
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 dark:text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-medium
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      dark:file:bg-blue-900/30 dark:file:text-blue-300
                      dark:hover:file:bg-blue-900/50
                      border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 p-1"
                  />
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                {uploadMethod === 'link' ? 'Provide a link to your hosted resume (Google Drive) or LinkedIn profile.' : 'Upload a PDF file (Max size: 700KB).'}
              </p>
            </div>

            {status === 'error' && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
