import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Plus, Check, X, FileText, Download, Eye, Trash2, Edit, Shield } from 'lucide-react';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { syncToGoogleSheet } from '../lib/sheets';
import { generatePDF, getFormTypeLabel, STANDARD_JOB_RESPONSIBILITIES, getStandardJobOfferDescription } from '../utils/formPdfGenerator';

export default function InternalForms() {
  const [forms, setForms] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewForm, setPreviewForm] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [watermarkEnabled, setWatermarkEnabled] = useState<boolean>(true);
  const [watermarkText, setWatermarkText] = useState<string>('Confidential');
  
  const initialFormState = {
    type: 'manpower', 
    title: '', 
    details: '',
    headcount: 1,
    positionTitle: '',
    department: '',
    reportTo: '',
    contractType: 'Unfixed Duration',
    employmentStatus: 'FT',
    isNewPosition: 'YES',
    planStatus: 'In Plan',
    predecessor: '',
    baseLocation: '',
    requestDate: new Date().toISOString().split('T')[0],
    expectedDate: '',
    itEquipment: [] as string[],
    
    // Salary form specific
    employeeType: 'New Employee',
    employeeName: '',
    sex: '',
    nationality: '',
    campus: '',
    employeeId: '',
    salaryEmploymentType: 'Full-Time',
    salaryReason: '',
    monthlyRate: '',
    hourlyRate: '',
    salaryIncrease: false,
    teachingHours: '',
    workingDays: 'Monday to Friday',
    specificDate: '',
    deductionSD_USD: '',
    deductionSD_period: '',
    deductionSD_times: '',
    deductionSD_effective: '',
    deductionKWPF_USD: '',
    deductionKWPF_period: '',
    deductionKWPF_times: '',
    deductionKWPF_effective: '',

    // Staff Profile specific
    staffProfileType: 'Full-time', // Full-time, Semi- Full-time, Part-time, Intern
    nameKhmer: '',
    startDate: '',
    dateOfBirth: '',
    khIdPassport: '',
    age: '',
    placeOfBirth: '',
    permanentAddress: '',
    currentAddress: '',
    contactNo: '',
    email: '',
    familyContact: '',
    relationship: '',
    stateOfficial: 'No',
    bankAccountNo: '',
    workPermitNo: '',
    docSalaryApproval: false,
    docJobDescription: false,
    docEmploymentContract: false,
    docCopyCV: false,
    docEducationCertificate: false,
    docManpowerRequest: false,
    docForeignEmployeeContract: false,
    docKhmerIDCard: false,
    maritalStatus: 'Single',
    maritalStatusOthers: '',
    numberOfChildren: '',
    education: [
      { degree: '', major: '', institution: '', year: '' },
      { degree: '', major: '', institution: '', year: '' }
    ],
    employments: [
      { employer: '', position: '', from: '', to: '' },
      { employer: '', position: '', from: '', to: '' }
    ],
    endDateContract: '',

    // Job Offer Approval specific
    candidateName: '',
    candidateAddressLine1: '',
    candidateAddressLine2: '',
    candidateAddressLine3: '',
    candidateAddressLine4: '',
    offerDate: new Date().toISOString().split('T')[0],
    jobDescription: getStandardJobOfferDescription(''),
    payAmount: '',
    payType: 'monthly',
    offerEmploymentType: 'Full-Time',
    workingDay: 'Monday to Saturday morning',
    lunchBreak: '12:00 PM - 1:00 PM (1 Hour)',
    numberOfHours: 'Monday to Saturday morning',
    benefits: '',
    timeOff: '',
    location: '',
    bindingOffer: 'binding',
    validForDays: '',
    companySignatory: '',
    companySignatoryTitle: '',

    // Job Description specific (HRRE-01)
    jobGroup: 'III',
    jobStatus: 'Full-time',
    jobSummary: '',
    keyResponsibilities: '',
    qualDegree: '',
    qualMajor: '',
    qualExperience: '',
    skillSoft: '',
    skillLanguage: 'Khmer and English',
    skillComputer: 'Ms. Office',
    ackEmployeeDate: '',
    ackSupervisorDate: '',
    ackDirectorDate: '',
    
    ackHrDate: '',
    
    // Promotion / Transfer specific
    isPromotion: false,
    isTransfer: false,
    isPayrollChange: false,
    employeeStatus: 'Full-time',
    positionEffectiveDate: '',
    salaryEffectiveDate: '',
    rateChange: '',
    rateChangeType: 'month',
    rateChangeTo: '',
    rateChangeTypeTo: 'month',
    reasonForChange: false,
    reasonFrom: '',
    reasonTo: '',
    transferCampus: false,
    campusFrom: '',
    campusTo: '',
    transferPosition: false,
    positionFrom: '',
    positionTo: '',
    isPromotionCheck: false,
    promotionFrom: '',
    promotionTo: '',
    isDemotion: false,
    demotionFrom: '',
    demotionTo: '',
    statusChange: false,
    statusFrom: 'Full-time',
    statusTo: 'Full-time',
    workingDaysChange: false,
    workingDaysFromEnd: 'Saturday',
    workingDaysToEnd: 'Saturday',
    workingHoursChange: false,
    hoursAmFromStart: '7:30 AM',
    hoursAmFromEnd: '11:30 AM',
    hoursAmToStart: '7:30 AM',
    hoursAmToEnd: '11:30 AM',
    hoursPmFromStart: '1:00 PM',
    hoursPmFromEnd: '5:00 PM',
    hoursPmToStart: '1:00 PM',
    hoursPmToEnd: '5:00 PM'

  };

  const [formData, setFormData] = useState(initialFormState);

  // Helper to remove any undefined properties before sending to Firestore
  const cleanFirestoreData = (data: Record<string, any>) => {
    const result: Record<string, any> = {};
    for (const [key, val] of Object.entries(data)) {
      if (val === undefined) continue;
      if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
        result[key] = cleanFirestoreData(val);
      } else if (Array.isArray(val)) {
        result[key] = val.map(item => (item !== null && typeof item === 'object' ? cleanFirestoreData(item) : (item === undefined ? '' : item)));
      } else {
        result[key] = val;
      }
    }
    return result;
  };

  const handleCandidateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const candidateId = e.target.value;
    if (!candidateId) return;
    
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
      const posTitle = candidate.position || '';
      setFormData(prev => ({
        ...prev,
        employeeName: candidate.name || prev.employeeName || '',
        candidateName: candidate.name || prev.candidateName || '',
        email: candidate.email || prev.email || '',
        contactNo: candidate.phone || prev.contactNo || '',
          candidateId: candidate.id,
        positionTitle: posTitle || prev.positionTitle || '',
        keyResponsibilities: prev.type === 'jobDescription'
          ? (prev.keyResponsibilities || STANDARD_JOB_RESPONSIBILITIES)
          : (prev.keyResponsibilities ?? ''),
        jobDescription: prev.type === 'jobOffer'
          ? ((!prev.jobDescription || prev.jobDescription.includes('Western International School')) ? getStandardJobOfferDescription(posTitle || prev.positionTitle) : prev.jobDescription)
          : (prev.jobDescription || '')
      }));
    }
  };

  useEffect(() => {
    const qForms = query(collection(db, 'forms'), orderBy('createdAt', 'desc'));
    const unsubForms = onSnapshot(qForms, (snapshot) => {
      setForms(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.warn("Firestore error forms:", err));

    const qCandidates = query(collection(db, 'applications'), orderBy('appliedAt', 'desc'));
    const unsubCandidates = onSnapshot(qCandidates, (snapshot) => {
      setCandidates(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.warn("Firestore error candidates:", err));

    return () => {
      unsubForms();
      unsubCandidates();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = cleanFirestoreData(formData);
      delete dataToSave.id;



      let formId = editingId;
      if (editingId) {
        await updateDoc(doc(db, 'forms', editingId), {
          ...dataToSave,
          updatedAt: Date.now()
        });
      } else {
        const docRef = await addDoc(collection(db, 'forms'), {
          ...dataToSave,
          createdBy: 'Admin User',
          createdAt: Date.now()
        });
        formId = docRef.id;
      }

      const formTitle = getFormTypeLabel(dataToSave.type) + (dataToSave.candidateName ? ' - ' + dataToSave.candidateName : '');
        const docPDF = generatePDF(dataToSave as any);
        const dataUri = docPDF.output('datauristring') as string;
        const base64Data = dataUri.split(',')[1];

        await syncToGoogleSheet('add_form', {
          id: formId,
          formName: formTitle,
          dateIssue: new Date().toISOString().split('T')[0],
          position: dataToSave.positionTitle || dataToSave.position || '',
          fileBase64: base64Data
        });
      setShowNewModal(false);
      setEditingId(null);
      setFormData(initialFormState);
    } catch (err) { alert(err.message || err.toString());
      console.error("Error saving form to Firestore:", err);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'forms', id));
    await syncToGoogleSheet('delete_form', { id });
  };

  const handleEdit = (form: any) => {
    const isOldNanny = form.keyResponsibilities && form.keyResponsibilities.includes('Looks after children not yet of school going age');
    const updatedForm = {
      ...initialFormState,
      ...form,
      keyResponsibilities: (form.type === 'jobDescription' && (!form.keyResponsibilities || isOldNanny))
        ? STANDARD_JOB_RESPONSIBILITIES
        : (form.keyResponsibilities ?? ''),
      jobDescription: (form.type === 'jobOffer' && (!form.jobDescription || !form.jobDescription.trim()))
        ? getStandardJobOfferDescription(form.positionTitle || '')
        : (form.jobDescription ?? ''),
      workingDay: form.workingDay || form.numberOfHours || 'Monday to Saturday morning',
      lunchBreak: form.lunchBreak || '12:00 PM - 1:00 PM (1 Hour)',
      payType: form.payType || 'monthly'
    };
    
    // Ensure all undefined fields are converted to empty string
    Object.keys(updatedForm).forEach(k => {
      if (updatedForm[k] === undefined) {
        updatedForm[k] = '';
      }
    });

    setFormData(updatedForm);
    setEditingId(form.id);
    setShowNewModal(true);
  };

  const handleEquipmentChange = (item: string) => {
    setFormData(prev => {
      const eq = prev.itEquipment;
      if (eq.includes(item)) return { ...prev, itEquipment: eq.filter(i => i !== item) };
      return { ...prev, itEquipment: [...eq, item] };
    });
  };

  const updatePreview = (form: any, watermark: boolean, text: string) => {
    const doc = generatePDF(form, { watermark, watermarkText: text });
    const base64 = doc.output('datauristring').split(',')[1];
    setPreviewForm(form);
    setPreviewUrl(base64);
  };

  const handlePreviewPDF = (form: any) => {
    updatePreview(form, watermarkEnabled, watermarkText);
  };

  const sendToTelegram = async (pdfBlob: Blob, filename: string) => {
    const botToken = '8887092698:AAGslqH8Y6qUxfxfJxpWaUnueQBMffCbJ8k';
    const chatId = '-1004376585084';
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('document', pdfBlob, filename);
    formData.append('caption', `New Internal Form Generated: ${filename}`);

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        console.error("Failed to send to Telegram", await response.text());
      }
    } catch (err) { alert(err.message || err.toString());
      console.error("Error sending to Telegram", err);
    }
  };

  const executeDownloadPDF = async () => {
    if (!previewForm) return;
    const doc = generatePDF(previewForm, { 
      watermark: watermarkEnabled, 
      watermarkText 
    });
    const filename = `Form_${previewForm.type}_${previewForm.id || Date.now()}.pdf`;
    
    // Save locally
    doc.save(filename);
    
    // Send to Telegram
    const pdfBlob = doc.output('blob');
    await sendToTelegram(pdfBlob, filename);

    setPreviewUrl(null);
    setPreviewForm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Internal Workflows</h2>
        <button 
          onClick={() => {
            setFormData(initialFormState);
            setEditingId(null);
            setShowNewModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map(form => (
          <div key={form.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide
                ${form.type === 'manpower' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : ''}
                ${form.type === 'jobDescription' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : ''}
                ${form.type === 'salary' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : ''}
                ${form.type === 'jobOffer' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                ${form.type === 'staffProfile' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' : ''}
                ${form.type === 'interviewRating' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : ''}
                ${form.type === 'clearance' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' : ''}
                ${form.type === 'unpaidMaternity' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' : ''}
                ${form.type === 'promotionTransfer' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' : ''}
                ${form.type === 'resigned' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : ''}
              `}>
                {getFormTypeLabel(form.type)}
              </span>
            </div>
            
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">{form.positionTitle || form.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-grow">{form.details}</p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <button onClick={() => handlePreviewPDF(form)} className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1 text-sm font-medium" title="Preview PDF">
                  <Eye className="w-4 h-4" /> Preview
                </button>
                <button 
                  onClick={async () => {
                    const doc = generatePDF(form, { watermark: watermarkEnabled, watermarkText });
                    const filename = `Form_${form.type}_${form.id || Date.now()}.pdf`;
                    doc.save(filename);
                    const pdfBlob = doc.output('blob');
                    await sendToTelegram(pdfBlob, filename);
                  }} 
                  className="text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1 text-sm font-medium" 
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" /> PDF
                </button>
                <button onClick={() => handleEdit(form)} className="text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 transition flex items-center gap-1 text-sm font-medium" title="Edit Form">
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => handleDelete(form.id)} className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition flex items-center gap-1 text-sm font-medium" title="Delete Form">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {forms.length === 0 && (
           <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
             <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
             <p>No forms or requests found.</p>
           </div>
        )}
      </div>

      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{editingId ? 'Edit Request' : 'Create Request'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Form Type</label>
                <select 
                  value={formData.type}
                  onChange={e => {
                    const newType = e.target.value;
                    if (newType === 'jobDescription') {
                      setFormData(prev => ({
                        ...initialFormState,
                        type: newType,
                        positionTitle: prev.positionTitle || 'HR Strategy & Operations Specialist',
                        department: prev.department || 'Human Resources',
                        reportTo: prev.reportTo || 'HR Director / School Principal',
                        baseLocation: prev.baseLocation || 'Phnom Penh',
                        jobGroup: prev.jobGroup || 'III',
                        jobStatus: prev.jobStatus || 'Full-time',
                        jobSummary: prev.jobSummary || 'Responsible for executing and supporting human resources operations, talent acquisition, employee relations, and policy compliance aligned with WIS organizational objectives.',
                        keyResponsibilities: STANDARD_JOB_RESPONSIBILITIES,
                        qualDegree: prev.qualDegree || 'Bachelor’s degree',
                        qualMajor: prev.qualMajor || 'Human Resources Management, Business Administration, or related field',
                        qualExperience: prev.qualExperience || '2–5 years of progressive experience in HR functions',
                        skillSoft: prev.skillSoft || '• Excellent communication, interpersonal, and consultative skills.\n• Strong problem-solving, conflict resolution, and decision-making abilities.\n• High level of integrity, discretion, and confidentiality.\n• Ability to build relationships and influence at all levels of the organization.',
                        skillLanguage: prev.skillLanguage || 'Khmer and English',
                        skillComputer: prev.skillComputer || 'Microsoft Office, HRIS Tools, AI Tools',
                        employeeName: prev.employeeName || ''
                      }));
                    } else if (newType === 'jobOffer') {
                      setFormData(prev => {
                        const posTitle = prev.positionTitle || '';
                        return {
                          ...initialFormState,
                          type: newType,
                          positionTitle: posTitle,
                          candidateName: prev.candidateName || prev.employeeName || '',
                          jobDescription: getStandardJobOfferDescription(posTitle),
                          email: prev.email || '',
                          contactNo: prev.contactNo || ''
                        };
                      });
                    } else {
                      setFormData({...initialFormState, type: newType});
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                >
                  <option value="manpower">Manpower Request</option>
                  <option value="jobDescription">Job Description Form (HRRE-01)</option>
                  <option value="salary">Salary Approval</option>
                  <option value="jobOffer">Job Offer Approval</option>
                  <option value="staffProfile">Staff Profile</option>
                  <option value="interviewRating">Interview Rating</option>
                  <option value="clearance">Clearance</option>
                  <option value="unpaidMaternity">Unpaid/Maternity</option>
                  <option value="promotionTransfer">Promotion/Transfer/Adjustment</option>
                  <option value="resigned">Resigned</option>
                </select>
              </div>

              {formData.type !== 'manpower' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                  <label className="block text-sm font-medium mb-1 text-blue-800 dark:text-blue-300">Auto-fill from Candidate</label>
                  <select 
                    onChange={handleCandidateSelect}
                    className="w-full px-3 py-2 border border-blue-200 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Select Candidate to Auto-fill --</option>
                    {candidates.map(c => (
                      <option key={c.id} value={c.id}>{c.name} - {c.position}</option>
                    ))}
                  </select>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Selecting a candidate will pre-fill their name, contact, and position details below.</p>
                </div>
              )}

              {formData.type === 'manpower' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title of Position</label>
                      <input 
                        required type="text" 
                        value={formData.positionTitle}
                        onChange={e => setFormData({...formData, positionTitle: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Headcount</label>
                      <input 
                        required type="number" min="1"
                        value={formData.headcount}
                        onChange={e => setFormData({...formData, headcount: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Department</label>
                      <input 
                        required type="text" 
                        value={formData.department}
                        onChange={e => setFormData({...formData, department: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Report to</label>
                      <input 
                        required type="text" 
                        value={formData.reportTo}
                        onChange={e => setFormData({...formData, reportTo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Contract Type</label>
                      <select 
                        value={formData.contractType}
                        onChange={e => setFormData({...formData, contractType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                      >
                        <option value="Unfixed Duration">Unfixed Duration(Khmer Staff)</option>
                        <option value="Fixed Duration">Fixed Duration</option>
                        <option value="Temporary">Temporary</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Status</label>
                      <select 
                        value={formData.employmentStatus}
                        onChange={e => setFormData({...formData, employmentStatus: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                      >
                        <option value="FT">Full-Time (FT)</option>
                        <option value="SFT">SFT</option>
                        <option value="PT">Part-Time (PT)</option>
                        <option value="INTERN">Internship (INTERN)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">New Position</label>
                      <select 
                        value={formData.isNewPosition}
                        onChange={e => setFormData({...formData, isNewPosition: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                      >
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Plan Status</label>
                      <select 
                        value={formData.planStatus}
                        onChange={e => setFormData({...formData, planStatus: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                      >
                        <option value="In Plan">In Plan</option>
                        <option value="Out Plan">Out Plan</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Predecessor (if Out Plan)</label>
                      <input 
                        type="text" 
                        value={formData.predecessor}
                        onChange={e => setFormData({...formData, predecessor: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Base Location</label>
                      <input 
                        required type="text" 
                        value={formData.baseLocation}
                        onChange={e => setFormData({...formData, baseLocation: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date of Request</label>
                      <input 
                        required type="date" 
                        value={formData.requestDate}
                        onChange={e => setFormData({...formData, requestDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date of Expected</label>
                      <input 
                        required type="date" 
                        value={formData.expectedDate}
                        onChange={e => setFormData({...formData, expectedDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">IT Equipment Required</label>
                    <div className="flex flex-wrap gap-4">
                      {['Laptop', 'Desktop', 'Internet Access', 'Uniform', 'Email', 'Others'].map(item => (
                        <label key={item} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <input 
                            type="checkbox" 
                            checked={formData.itEquipment.includes(item)}
                            onChange={() => handleEquipmentChange(item)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Justification / Remarks</label>
                    <textarea 
                      rows={3}
                      value={formData.details}
                      onChange={e => setFormData({...formData, details: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white resize-none" 
                    />
                  </div>
                </>
              ) : formData.type === 'salary' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Employee Type</label>
                      <select 
                        value={formData.employeeType}
                        onChange={e => setFormData({...formData, employeeType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                      >
                        <option value="Old Employee">Old Employee</option>
                        <option value="New Employee">New Employee</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Employee Name</label>
                      <input 
                        required type="text" 
                        value={formData.employeeName}
                        onChange={e => setFormData({...formData, employeeName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Sex</label>
                      <input 
                        type="text" 
                        value={formData.sex}
                        onChange={e => setFormData({...formData, sex: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nationality</label>
                      <input 
                        type="text" 
                        value={formData.nationality}
                        onChange={e => setFormData({...formData, nationality: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Position</label>
                      <input 
                        required type="text" 
                        value={formData.positionTitle}
                        onChange={e => setFormData({...formData, positionTitle: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Department</label>
                      <input 
                        required type="text" 
                        value={formData.department}
                        onChange={e => setFormData({...formData, department: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Campus</label>
                      <input 
                        type="text" 
                        value={formData.campus}
                        onChange={e => setFormData({...formData, campus: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Expected Employment Date</label>
                      <input 
                        type="date" 
                        value={formData.expectedDate}
                        onChange={e => setFormData({...formData, expectedDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Employee ID</label>
                      <input 
                        type="text" 
                        value={formData.employeeId}
                        onChange={e => setFormData({...formData, employeeId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Employment Type</label>
                      <select 
                        value={formData.salaryEmploymentType}
                        onChange={e => setFormData({...formData, salaryEmploymentType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                      >
                        <option value="Full-Time">Full-Time</option>
                        <option value="Semi-Full Time">Semi-Full Time</option>
                        <option value="Semi-Full-Time">Semi-Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Temporary">Temporary</option>
                        <option value="Out Plan">Out Plan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Directly report to</label>
                      <input 
                        type="text" 
                        value={formData.reportTo}
                        onChange={e => setFormData({...formData, reportTo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Position Status</label>
                      <select 
                        value={formData.isNewPosition}
                        onChange={e => setFormData({...formData, isNewPosition: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                      >
                        <option value="YES">New Position</option>
                        <option value="NO">Replacement</option>
                      </select>
                    </div>
                    {formData.isNewPosition === 'NO' && (
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Replacement (Predecessor)</label>
                        <input 
                          type="text" 
                          value={formData.predecessor}
                          onChange={e => setFormData({...formData, predecessor: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                        />
                      </div>
                    )}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Reasons</label>
                      <textarea 
                        rows={2}
                        value={formData.salaryReason}
                        onChange={e => setFormData({...formData, salaryReason: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white resize-none" 
                      />
                    </div>
                    
                    {/* Salary / Wage */}
                    <div className="sm:col-span-2 mt-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Salary/Wage</h4>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Monthly Rate</label>
                      <input 
                        type="text" 
                        value={formData.monthlyRate}
                        onChange={e => setFormData({...formData, monthlyRate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Hourly Rate</label>
                      <input 
                        type="text" 
                        value={formData.hourlyRate}
                        onChange={e => setFormData({...formData, hourlyRate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <input 
                          type="checkbox"
                          checked={formData.salaryIncrease}
                          onChange={e => setFormData({...formData, salaryIncrease: e.target.checked})}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Salary Increase After the Probationary Period
                      </label>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Number of teaching hours per week</label>
                      <input 
                        type="text" 
                        value={formData.teachingHours}
                        onChange={e => setFormData({...formData, teachingHours: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Working Days</label>
                      <div className="flex flex-wrap gap-4 mb-2">
                        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <input type="radio" name="workingDays" checked={formData.workingDays === 'Monday to Friday'} onChange={() => setFormData({...formData, workingDays: 'Monday to Friday'})} className="text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm">Monday to Friday</span>
                        </label>
                        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <input type="radio" name="workingDays" checked={formData.workingDays === 'Monday to Saturday'} onChange={() => setFormData({...formData, workingDays: 'Monday to Saturday'})} className="text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm">Monday to Saturday</span>
                        </label>
                        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <input type="radio" name="workingDays" checked={formData.workingDays === 'Others'} onChange={() => setFormData({...formData, workingDays: 'Others'})} className="text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm">Others (Specific date)</span>
                        </label>
                      </div>
                      {formData.workingDays === 'Others' && (
                        <input 
                          type="text" 
                          value={formData.specificDate}
                          onChange={e => setFormData({...formData, specificDate: e.target.value})}
                          placeholder="Specify dates..."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                        />
                      )}
                    </div>
                    
                    {/* Security Deposit */}
                    <div className="sm:col-span-2 mt-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Security Deposit (Part-Time) & Khmer Work Permit Fee</h4>
                    </div>
                    <div className="sm:col-span-2 grid grid-cols-4 gap-2 items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">SD Deduction:</span>
                      <input type="text" placeholder="USD" value={formData.deductionSD_USD} onChange={e => setFormData({...formData, deductionSD_USD: e.target.value})} className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white" />
                      <input type="text" placeholder="period" value={formData.deductionSD_period} onChange={e => setFormData({...formData, deductionSD_period: e.target.value})} className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white" />
                      <input type="text" placeholder="times" value={formData.deductionSD_times} onChange={e => setFormData({...formData, deductionSD_times: e.target.value})} className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white" />
                      <span className="text-sm text-right pr-2 text-gray-700 dark:text-gray-300">effective:</span>
                      <input type="text" placeholder="from date" value={formData.deductionSD_effective} onChange={e => setFormData({...formData, deductionSD_effective: e.target.value})} className="col-span-3 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    
                    <div className="sm:col-span-2 grid grid-cols-4 gap-2 items-center mt-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">KWPF Deduction:</span>
                      <input type="text" placeholder="USD" value={formData.deductionKWPF_USD} onChange={e => setFormData({...formData, deductionKWPF_USD: e.target.value})} className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white" />
                      <input type="text" placeholder="period" value={formData.deductionKWPF_period} onChange={e => setFormData({...formData, deductionKWPF_period: e.target.value})} className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white" />
                      <input type="text" placeholder="times" value={formData.deductionKWPF_times} onChange={e => setFormData({...formData, deductionKWPF_times: e.target.value})} className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white" />
                      <span className="text-sm text-right pr-2 text-gray-700 dark:text-gray-300">effective:</span>
                      <input type="text" placeholder="from date" value={formData.deductionKWPF_effective} onChange={e => setFormData({...formData, deductionKWPF_effective: e.target.value})} className="col-span-3 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    
                  </div>
                </>
              ) : formData.type === 'staffProfile' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Type of Employee</label>
                      <select 
                        value={formData.staffProfileType}
                        onChange={e => setFormData({...formData, staffProfileType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Semi- Full-time">Semi- Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Intern">Intern</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name in English</label>
                      <input 
                        required type="text" 
                        value={formData.employeeName}
                        onChange={e => setFormData({...formData, employeeName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name in Khmer</label>
                      <input 
                        type="text" 
                        value={formData.nameKhmer}
                        onChange={e => setFormData({...formData, nameKhmer: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Sex</label>
                      <input 
                        type="text" 
                        value={formData.sex}
                        onChange={e => setFormData({...formData, sex: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Campus</label>
                      <input 
                        type="text" 
                        value={formData.campus}
                        onChange={e => setFormData({...formData, campus: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Position</label>
                      <input 
                        required type="text" 
                        value={formData.positionTitle}
                        onChange={e => setFormData({...formData, positionTitle: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Department</label>
                      <input 
                        required type="text" 
                        value={formData.department}
                        onChange={e => setFormData({...formData, department: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Staff ID</label>
                      <input 
                        type="text" 
                        value={formData.employeeId}
                        onChange={e => setFormData({...formData, employeeId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Starting Date of Employment</label>
                      <input 
                        type="date" 
                        value={formData.startDate}
                        onChange={e => setFormData({...formData, startDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date of Birth</label>
                      <input 
                        type="date" 
                        value={formData.dateOfBirth}
                        onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">KH ID/Passport No</label>
                      <input 
                        type="text" 
                        value={formData.khIdPassport}
                        onChange={e => setFormData({...formData, khIdPassport: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Age</label>
                      <input 
                        type="text" 
                        value={formData.age}
                        onChange={e => setFormData({...formData, age: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nationality</label>
                      <input 
                        type="text" 
                        value={formData.nationality}
                        onChange={e => setFormData({...formData, nationality: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Place of Birth</label>
                      <input 
                        type="text" 
                        value={formData.placeOfBirth}
                        onChange={e => setFormData({...formData, placeOfBirth: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Permanent Address</label>
                      <input 
                        type="text" 
                        value={formData.permanentAddress}
                        onChange={e => setFormData({...formData, permanentAddress: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Current Address</label>
                      <input 
                        type="text" 
                        value={formData.currentAddress}
                        onChange={e => setFormData({...formData, currentAddress: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Contact No</label>
                      <input 
                        type="text" 
                        value={formData.contactNo}
                        onChange={e => setFormData({...formData, contactNo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">E-mail</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Family Contact</label>
                      <input 
                        type="text" 
                        value={formData.familyContact}
                        onChange={e => setFormData({...formData, familyContact: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Relationship</label>
                      <input 
                        type="text" 
                        value={formData.relationship}
                        onChange={e => setFormData({...formData, relationship: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    
                    <div className="sm:col-span-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Additional Details</h4>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">State Official/ State Teacher</label>
                      <select 
                        value={formData.stateOfficial}
                        onChange={e => setFormData({...formData, stateOfficial: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bank Account Number</label>
                      <input 
                        type="text" 
                        value={formData.bankAccountNo}
                        onChange={e => setFormData({...formData, bankAccountNo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Work permit Card No</label>
                      <input 
                        type="text" 
                        value={formData.workPermitNo}
                        onChange={e => setFormData({...formData, workPermitNo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Marital Status</label>
                      <select 
                        value={formData.maritalStatus}
                        onChange={e => setFormData({...formData, maritalStatus: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Others">Others (please specify)</option>
                      </select>
                    </div>
                    {formData.maritalStatus === 'Others' && (
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Specify Others</label>
                        <input 
                          type="text" 
                          value={formData.maritalStatusOthers}
                          onChange={e => setFormData({...formData, maritalStatusOthers: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Number of Children</label>
                      <input 
                        type="text" 
                        value={formData.numberOfChildren}
                        onChange={e => setFormData({...formData, numberOfChildren: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>

                    <div className="sm:col-span-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Documents Attached</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <label className="flex items-center gap-2"><input type="checkbox" checked={formData.docSalaryApproval} onChange={e => setFormData({...formData, docSalaryApproval: e.target.checked})} /> Salary Approval Form</label>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={formData.docManpowerRequest} onChange={e => setFormData({...formData, docManpowerRequest: e.target.checked})} /> Manpower Request form</label>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={formData.docJobDescription} onChange={e => setFormData({...formData, docJobDescription: e.target.checked})} /> Job Description</label>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={formData.docForeignEmployeeContract} onChange={e => setFormData({...formData, docForeignEmployeeContract: e.target.checked})} /> Foreign employee contract</label>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={formData.docEmploymentContract} onChange={e => setFormData({...formData, docEmploymentContract: e.target.checked})} /> Employment Contract (Khmer)</label>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={formData.docKhmerIDCard} onChange={e => setFormData({...formData, docKhmerIDCard: e.target.checked})} /> Khmer ID Card</label>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={formData.docCopyCV} onChange={e => setFormData({...formData, docCopyCV: e.target.checked})} /> Copy CV</label>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={formData.docEducationCertificate} onChange={e => setFormData({...formData, docEducationCertificate: e.target.checked})} /> Education Certificate</label>
                      </div>
                    </div>
                  </div>
                </>
              ) : formData.type === 'jobOffer' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Candidate Name</label>
                      <input 
                        type="text" 
                        value={formData.candidateName}
                        onChange={e => setFormData({...formData, candidateName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date of Offer</label>
                      <input 
                        type="date" 
                        value={formData.offerDate}
                        onChange={e => setFormData({...formData, offerDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>

                    <div className="sm:col-span-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Offer Details</h4>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Job Title</label>
                      <input 
                        type="text" 
                        value={formData.positionTitle}
                        onChange={e => {
                          const newTitle = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            positionTitle: newTitle,
                            jobDescription: (!prev.jobDescription || prev.jobDescription.includes('Western International School'))
                              ? getStandardJobOfferDescription(newTitle)
                              : prev.jobDescription
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Start Date (est.)</label>
                      <input 
                        type="date" 
                        value={formData.startDate}
                        onChange={e => setFormData({...formData, startDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Description (Offer Notification)</label>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, jobDescription: getStandardJobOfferDescription(prev.positionTitle) }))}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          Use Standard Offer Letter
                        </button>
                      </div>
                      <textarea 
                        rows={4}
                        value={formData.jobDescription || getStandardJobOfferDescription(formData.positionTitle)}
                        onChange={e => setFormData({...formData, jobDescription: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Salary Offer</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="e.g. 800"
                          value={formData.payAmount}
                          onChange={e => setFormData({...formData, payAmount: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                        />
                        <select 
                          value={formData.payType || 'monthly'}
                          onChange={e => setFormData({...formData, payType: e.target.value})}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                        >
                          <option value="hourly">Hourly ($/hr)</option>
                          <option value="monthly">Monthly (salary)</option>
                          <option value="yearly">Yearly (salary)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Type of Employment</label>
                      <select 
                        value={formData.offerEmploymentType}
                        onChange={e => setFormData({...formData, offerEmploymentType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                      >
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Working Day</label>
                      <select 
                        value={formData.workingDay || 'Monday to Saturday morning'}
                        onChange={e => setFormData({...formData, workingDay: e.target.value, numberOfHours: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      >
                        <option value="Monday to Saturday morning">Monday to Saturday morning</option>
                        <option value="Monday to Friday">Monday to Friday</option>
                        <option value="Monday to Saturday">Monday to Saturday (Full Day)</option>
                        <option value="Monday to Friday & Saturday morning">Monday to Friday & Saturday morning</option>
                        <option value="Shift Rotation (Monday - Sunday)">Shift Rotation (Monday - Sunday)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Location</label>
                      <input 
                        type="text" 
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Benefits</label>
                      <input 
                        type="text" 
                        value={formData.benefits}
                        onChange={e => setFormData({...formData, benefits: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Lunch Break</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 12:00 PM - 1:00 PM (1 Hour)"
                        value={formData.lunchBreak || ''}
                        onChange={e => setFormData({...formData, lunchBreak: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>

                    <div className="sm:col-span-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Offer Conditions</h4>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Binding Status</label>
                      <select 
                        value={formData.bindingOffer}
                        onChange={e => setFormData({...formData, bindingOffer: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                      >
                        <option value="binding">Binding</option>
                        <option value="non-binding">Non-binding</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Valid for (Days)</label>
                      <input 
                        type="number" min="1"
                        value={formData.validForDays}
                        onChange={e => setFormData({...formData, validForDays: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Company Signatory Name</label>
                      <input 
                        type="text" 
                        value={formData.companySignatory}
                        onChange={e => setFormData({...formData, companySignatory: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Company Signatory Title</label>
                      <input 
                        type="text" 
                        value={formData.companySignatoryTitle}
                        onChange={e => setFormData({...formData, companySignatoryTitle: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                  </div>
                </>
              ) : formData.type === 'jobDescription' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Job Title</label>
                      <input 
                        type="text" 
                        value={formData.positionTitle}
                        onChange={e => setFormData({...formData, positionTitle: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                        placeholder="e.g. Nanny"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Department</label>
                      <input 
                        type="text" 
                        value={formData.department}
                        onChange={e => setFormData({...formData, department: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                        placeholder="e.g. Academics"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Report To</label>
                      <input 
                        type="text" 
                        value={formData.reportTo}
                        onChange={e => setFormData({...formData, reportTo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                        placeholder="e.g. TA Team Leader"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Base Location</label>
                      <input 
                        type="text" 
                        value={formData.baseLocation}
                        onChange={e => setFormData({...formData, baseLocation: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                        placeholder="e.g. Phnom Penh"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Job Group</label>
                      <input 
                        type="text" 
                        value={formData.jobGroup}
                        onChange={e => setFormData({...formData, jobGroup: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                        placeholder="e.g. III"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Status</label>
                      <select 
                        value={formData.jobStatus}
                        onChange={e => setFormData({...formData, jobStatus: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Semi- Full-time">Semi- Full-time</option>
                        <option value="Intern">Intern</option>
                        <option value="Probation">Probation</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">A. Job Summary</h4>
                      <textarea 
                        rows={3}
                        value={formData.jobSummary}
                        onChange={e => setFormData({...formData, jobSummary: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white resize-none" 
                        placeholder="Brief summary of the role..."
                      />
                    </div>

                    <div className="sm:col-span-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">B. Key Roles and Responsibilities (Prioritized Responsibilities)</h4>
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, keyResponsibilities: STANDARD_JOB_RESPONSIBILITIES})}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium underline hover:no-underline"
                          title="Apply standard responsibilities from WIS template"
                        >
                          Reset to Standard Order (Attach file)
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Follows WIS standard ordered categories and points (applied to all positions)</p>
                      <textarea 
                        rows={10}
                        value={formData.keyResponsibilities}
                        onChange={e => setFormData({...formData, keyResponsibilities: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white resize-y font-mono text-xs" 
                        placeholder="HR Strategy and Planning:&#10;1. Develop and implement HR strategies..."
                      />
                    </div>

                    <div className="sm:col-span-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">C. Job Qualification (Required Education / Experience)</h4>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Degree</label>
                      <input 
                        type="text" 
                        value={formData.qualDegree}
                        onChange={e => setFormData({...formData, qualDegree: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                        placeholder="e.g. High school/ Diploma"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Major</label>
                      <input 
                        type="text" 
                        value={formData.qualMajor}
                        onChange={e => setFormData({...formData, qualMajor: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                        placeholder="e.g. Education or related field"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Work Experience</label>
                      <input 
                        type="text" 
                        value={formData.qualExperience}
                        onChange={e => setFormData({...formData, qualExperience: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                        placeholder="e.g. Child care experience"
                      />
                    </div>

                    <div className="sm:col-span-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">D. Skill Requirements</h4>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Soft Skills</label>
                      <textarea 
                        rows={2}
                        value={formData.skillSoft}
                        onChange={e => setFormData({...formData, skillSoft: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white resize-none" 
                        placeholder="e.g. Communication, empathy, vital elements in education..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Language</label>
                      <input 
                        type="text" 
                        value={formData.skillLanguage}
                        onChange={e => setFormData({...formData, skillLanguage: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                        placeholder="e.g. Khmer and English"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Computer Skills</label>
                      <input 
                        type="text" 
                        value={formData.skillComputer}
                        onChange={e => setFormData({...formData, skillComputer: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                        placeholder="e.g. Ms. Office"
                      />
                    </div>

                    <div className="sm:col-span-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">E. Acknowledgement</h4>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Employee Name (Signatory)</label>
                      <input 
                        type="text" 
                        value={formData.employeeName}
                        onChange={e => setFormData({...formData, employeeName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                        placeholder="Auto-filled from candidate or type name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Employee Signed Date</label>
                      <input 
                        type="date" 
                        value={formData.ackEmployeeDate}
                        onChange={e => setFormData({...formData, ackEmployeeDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      />
                    </div>
                  </div>
                </>
              
              ) : formData.type === 'interviewRating' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Candidate Name</label>
                      <input type="text" value={formData.candidateName || ''} onChange={e => setFormData({...formData, candidateName: e.target.value, title: `Interview Rating: ${e.target.value}`})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tel</label>
                      <input type="text" value={formData.contactNo || ''} onChange={e => setFormData({...formData, contactNo: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Gender</label>
                      <select value={formData.gender || ''} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white">
                        <option value="">Select</option>
                        <option value="F">Female</option>
                        <option value="M">Male</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Staff Type</label>
                      <select value={formData.staffType || ''} onChange={e => setFormData({...formData, staffType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white">
                        <option value="Staff">Staff</option>
                        <option value="Teachers (FT)">Teachers (FT)</option>
                        <option value="Teachers (PT)">Teachers (PT)</option>
                        <option value="Teachers (SFT)">Teachers (SFT)</option>
                        <option value="Teachers (INTERN)">Teachers (INTERN)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nationality</label>
                      <input type="text" value={formData.nationality || 'Khmer'} onChange={e => setFormData({...formData, nationality: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Apply for (position)</label>
                      <input type="text" value={formData.positionTitle || ''} onChange={e => setFormData({...formData, positionTitle: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Interview Date</label>
                      <input type="text" value={formData.interviewDate || ''} onChange={e => setFormData({...formData, interviewDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" placeholder="DD/MM/YYYY" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Current Salary</label>
                      <input type="text" value={formData.currentSalary || ''} onChange={e => setFormData({...formData, currentSalary: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Expected Salary (USD)</label>
                      <input type="text" value={formData.expectedSalary || ''} onChange={e => setFormData({...formData, expectedSalary: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date Available</label>
                      <input type="text" value={formData.dateAvailable || ''} onChange={e => setFormData({...formData, dateAvailable: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Ratings (1 = Poor, 5 = Excellent)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      {[
                        { k: 'r_dress', l: 'Dress' }, { k: 'r_grooming', l: 'Grooming' }, { k: 'r_bodyLang', l: 'Body Language' }, { k: 'r_eye', l: 'Eye Contact' },
                        { k: 'r_education', l: 'Education' }, { k: 'r_technical', l: 'Technical Quals' }, { k: 'r_experience', l: 'Experience' }, { k: 'r_accomplish', l: 'Accomplishments' },
                        { k: 'r_computer', l: 'Computer Skills' }, { k: 'r_language', l: 'Language Skills' }, { k: 'r_interpersonal', l: 'Interpersonal' },
                        { k: 'r_creativity', l: 'Creativity' }, { k: 'r_logic', l: 'Logic' }, { k: 'r_decision', l: 'Decision Making' }, { k: 'r_commitment', l: 'Commitment' },
                        { k: 'r_potential', l: 'Potential' }, { k: 'r_knowledgeOrg', l: 'Knowledge of Org' }, { k: 'r_interestPos', l: 'Interest in Pos' }, { k: 'r_flexibility', l: 'Flexibility' }, { k: 'r_enthusiasm', l: 'Enthusiasm' }
                      ].map(f => (
                        <div key={f.k} className="flex justify-between items-center">
                          <label className="text-xs text-gray-600 dark:text-gray-400 w-1/2">{f.l}</label>
                          <select value={formData[f.k] || ''} onChange={e => setFormData({...formData, [f.k]: e.target.value})} className="w-1/2 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-transparent">
                            <option value="">-</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option>
                          </select>
                        </div>
                      ))}
                      
                      <div className="flex justify-between items-center sm:col-span-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <label className="font-semibold text-gray-900 dark:text-white">Total Overall Score</label>
                        <input type="text" value={formData.totalScore || ''} onChange={e => setFormData({...formData, totalScore: e.target.value})} className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-center" placeholder="e.g. 85" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Relative Working in WIS</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <input type="text" placeholder="Name" value={formData.relativeName || ''} onChange={e => setFormData({...formData, relativeName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                      <input type="text" placeholder="Gender" value={formData.relativeGender || ''} onChange={e => setFormData({...formData, relativeGender: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                      <input type="text" placeholder="Position" value={formData.relativePosition || ''} onChange={e => setFormData({...formData, relativePosition: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>

                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Summary Comments</label>
                    <textarea value={formData.summaryComments || ''} onChange={e => setFormData({...formData, summaryComments: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white min-h-[60px]" />

                    <div className="flex flex-wrap gap-4 items-center">
                      <label className="font-medium text-gray-700 dark:text-gray-300">Decision:</label>
                      <select value={formData.decision || ''} onChange={e => setFormData({...formData, decision: e.target.value})} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white">
                        <option value="">Select</option><option value="HIRE">HIRE</option><option value="CONSIDER">CONSIDER</option><option value="REJECT">REJECT</option>
                      </select>
                      {formData.decision === 'HIRE' && (
                        <input type="text" placeholder="Confirmed Salary (USD)" value={formData.hireSalary || ''} onChange={e => setFormData({...formData, hireSalary: e.target.value})} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                      )}
                    </div>
                  </div>
                </>
              ) : formData.type === 'clearance' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Employee ID</label>
                      <input type="text" value={formData.employeeId || ''} onChange={e => setFormData({...formData, employeeId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Employee Name</label>
                      <input type="text" value={formData.employeeName || ''} onChange={e => setFormData({...formData, employeeName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Starting Date</label>
                      <input type="text" value={formData.startDate || ''} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Position</label>
                      <input type="text" value={formData.positionTitle || ''} onChange={e => setFormData({...formData, positionTitle: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Campus</label>
                      <input type="text" value={formData.campus || ''} onChange={e => setFormData({...formData, campus: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Phone number</label>
                      <input type="text" value={formData.contactNo || ''} onChange={e => setFormData({...formData, contactNo: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Last day of work</label>
                      <input type="text" value={formData.lastDayOfWork || ''} onChange={e => setFormData({...formData, lastDayOfWork: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                  </div>
                </>
              
              ) : formData.type === 'promotionTransfer' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="col-span-full flex gap-4 mb-2">
                      <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isPromotion} onChange={e => setFormData({...formData, isPromotion: e.target.checked})} /> Promotion</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isTransfer} onChange={e => setFormData({...formData, isTransfer: e.target.checked})} /> Employee Transfer</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isPayrollChange} onChange={e => setFormData({...formData, isPayrollChange: e.target.checked})} /> Payroll Change</label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Employee's Name</label>
                      <input type="text" value={formData.employeeName || ''} onChange={e => setFormData({...formData, employeeName: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Position</label>
                      <input type="text" value={formData.positionTitle || ''} onChange={e => setFormData({...formData, positionTitle: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Sex</label>
                      <input type="text" value={formData.sex || ''} onChange={e => setFormData({...formData, sex: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Employment Date</label>
                      <input type="date" value={formData.employmentDate || ''} onChange={e => setFormData({...formData, employmentDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Department</label>
                      <input type="text" value={formData.department || ''} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Campus</label>
                      <input type="text" value={formData.campus || ''} onChange={e => setFormData({...formData, campus: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Employee Status</label>
                      <select value={formData.employeeStatus || 'Full-time'} onChange={e => setFormData({...formData, employeeStatus: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800">
                        <option value="Full-time">Full-time</option>
                        <option value="Semi Full-time">Semi Full-time</option>
                        <option value="Part-time">Part-time</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Employee's ID</label>
                      <input type="text" value={formData.employeeId || ''} onChange={e => setFormData({...formData, employeeId: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Position Effective Date</label>
                      <input type="date" value={formData.positionEffectiveDate || ''} onChange={e => setFormData({...formData, positionEffectiveDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Salary Effective Date</label>
                      <input type="date" value={formData.salaryEffectiveDate || ''} onChange={e => setFormData({...formData, salaryEffectiveDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                    </div>
                    
                    <div className="col-span-full border-t pt-2 mt-2 font-bold">Changes details</div>
                    
                    <div className="col-span-full grid grid-cols-2 gap-4 border p-3 rounded-lg">
                      <div>
                         <label className="text-sm font-medium">Rate Change ($):</label>
                         <div className="flex gap-2 mt-1">
                           <input type="number" value={formData.rateChange || ''} onChange={e => setFormData({...formData, rateChange: e.target.value})} className="w-24 px-2 py-1 border rounded" />
                           <select value={formData.rateChangeType || 'month'} onChange={e => setFormData({...formData, rateChangeType: e.target.value})} className="px-2 py-1 border rounded"><option value="hour">hour</option><option value="month">month</option></select>
                         </div>
                      </div>
                      <div>
                         <label className="text-sm font-medium">To ($):</label>
                         <div className="flex gap-2 mt-1">
                           <input type="number" value={formData.rateChangeTo || ''} onChange={e => setFormData({...formData, rateChangeTo: e.target.value})} className="w-24 px-2 py-1 border rounded" />
                           <select value={formData.rateChangeTypeTo || 'month'} onChange={e => setFormData({...formData, rateChangeTypeTo: e.target.value})} className="px-2 py-1 border rounded"><option value="hour">hour</option><option value="month">month</option></select>
                         </div>
                      </div>
                    </div>

                    {['reasonForChange', 'transferCampus', 'transferPosition', 'isPromotionCheck', 'isDemotion'].map(field => (
                      <div key={field} className="col-span-full grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-4 flex items-center gap-2">
                           <input type="checkbox" checked={formData[field]} onChange={e => setFormData({...formData, [field]: e.target.checked})} />
                           <label className="text-sm font-medium capitalize">{field.replace('is', '').replace(/([A-Z])/g, ' $1')}</label>
                        </div>
                        <div className="col-span-4 flex items-center gap-2">
                           <span className="text-sm">From</span>
                           <input type="text" value={formData[field === 'reasonForChange' ? 'reasonFrom' : field === 'transferCampus' ? 'campusFrom' : field === 'transferPosition' ? 'positionFrom' : field === 'isPromotionCheck' ? 'promotionFrom' : 'demotionFrom'] || ''} onChange={e => setFormData({...formData, [field === 'reasonForChange' ? 'reasonFrom' : field === 'transferCampus' ? 'campusFrom' : field === 'transferPosition' ? 'positionFrom' : field === 'isPromotionCheck' ? 'promotionFrom' : 'demotionFrom']: e.target.value})} className="w-full px-2 py-1 border rounded dark:bg-gray-800" />
                        </div>
                        <div className="col-span-4 flex items-center gap-2">
                           <span className="text-sm">To</span>
                           <input type="text" value={formData[field === 'reasonForChange' ? 'reasonTo' : field === 'transferCampus' ? 'campusTo' : field === 'transferPosition' ? 'positionTo' : field === 'isPromotionCheck' ? 'promotionTo' : 'demotionTo'] || ''} onChange={e => setFormData({...formData, [field === 'reasonForChange' ? 'reasonTo' : field === 'transferCampus' ? 'campusTo' : field === 'transferPosition' ? 'positionTo' : field === 'isPromotionCheck' ? 'promotionTo' : 'demotionTo']: e.target.value})} className="w-full px-2 py-1 border rounded dark:bg-gray-800" />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (

                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
                    <input 
                      required type="text" 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" 
                      placeholder="e.g. Senior Frontend Developer Hire"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Details / Justification</label>
                    <textarea 
                      required rows={4}
                      value={formData.details}
                      onChange={e => setFormData({...formData, details: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white resize-none" 
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 justify-end pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={() => { setShowNewModal(false); setEditingId(null); setFormData(initialFormState); }} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">{editingId ? 'Save Changes' : 'Submit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {previewUrl && ( sessionStorage.setItem('currentPdfBase64', previewUrl.base64 || previewUrl), 
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Form Preview
              </h3>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Watermark Controls */}
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-lg px-2.5 py-1 text-xs text-gray-700 dark:text-gray-200 shadow-xs">
                  <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <label className="flex items-center gap-1.5 cursor-pointer select-none font-medium">
                    <input 
                      type="checkbox" 
                      checked={watermarkEnabled}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setWatermarkEnabled(checked);
                        if (previewForm) updatePreview(previewForm, checked, watermarkText);
                      }}
                      className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    Watermark
                  </label>
                  <input 
                    type="text"
                    value={watermarkText}
                    onChange={(e) => {
                      const txt = e.target.value;
                      setWatermarkText(txt);
                      if (previewForm && watermarkEnabled) updatePreview(previewForm, true, txt);
                    }}
                    placeholder="Confidential"
                    disabled={!watermarkEnabled}
                    className="w-24 px-1.5 py-0.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white disabled:opacity-40"
                  />
                </div>

                <button 
                  onClick={() => { setPreviewUrl(null); setPreviewForm(null); }}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  Close
                </button>
                <button 
                  onClick={executeDownloadPDF}
                  className="px-3.5 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1.5 transition shadow-sm"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </div>
            <div className="flex-grow w-full bg-gray-100 dark:bg-gray-900 relative">
              <iframe src="/pdf-viewer.html" className="w-full h-full border-0 absolute inset-0" title="PDF Preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
