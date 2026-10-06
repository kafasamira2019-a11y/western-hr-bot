import React, { useState } from 'react';
import { FileText, CheckCircle2, Circle, Upload, Folder, Search } from 'lucide-react';

export default function Onboarding() {
  const [activeTab, setActiveTab] = useState<'checklist' | 'repository'>('checklist');

  const onboardingSteps = [
    { id: 1, title: 'Sign Employment Contract', completed: true, date: 'Oct 01, 2024' },
    { id: 2, title: 'Acknowledge Employee Handbook', completed: true, date: 'Oct 01, 2024' },
    { id: 3, title: 'IT Equipment Setup', completed: false, date: '' },
    { id: 4, title: 'Security & Compliance Training', completed: false, date: '' },
    { id: 5, title: 'Benefits Enrollment', completed: false, date: '' },
  ];

  const documents = [
    { id: 1, name: 'Employment_Contract_Signed.pdf', type: 'PDF', size: '2.4 MB', date: 'Oct 01' },
    { id: 2, name: 'Employee_Handbook_v2.pdf', type: 'PDF', size: '5.1 MB', date: 'Sep 15' },
    { id: 3, name: 'NDA_Confidentiality_Agreement.pdf', type: 'PDF', size: '1.2 MB', date: 'Oct 01' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Onboarding & Documents</h2>
      
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => setActiveTab('checklist')}
          className={`pb-3 text-sm font-medium border-b-2 transition px-2 ${activeTab === 'checklist' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          Automated Checklist
        </button>
        <button 
          onClick={() => setActiveTab('repository')}
          className={`pb-3 text-sm font-medium border-b-2 transition px-2 ${activeTab === 'repository' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          Document Repository
        </button>
      </div>

      {activeTab === 'checklist' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">New Hire Progress</h3>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '40%' }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">2 of 5 tasks completed</p>
          </div>

          <div className="space-y-3">
            {onboardingSteps.map(step => (
              <div key={step.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  {step.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                  )}
                  <span className={`font-medium ${step.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                    {step.title}
                  </span>
                </div>
                {step.completed && <span className="text-xs text-gray-500">{step.date}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'repository' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Secure Files</h3>
             <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition">
               <Upload className="w-4 h-4" /> Upload Document
             </button>
          </div>

          <div className="relative mb-6">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search documents..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.size} • {doc.date}</p>
                  </div>
                </div>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Download</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
