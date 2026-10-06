import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { Download, FileDown, Search, Filter, Star, Trash2, Mail, ExternalLink, MoreVertical, Eye, X, Phone } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { syncToGoogleSheet } from '../lib/sheets';

export default function Applications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [filterName, setFilterName] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [previewPdf, setPreviewPdf] = useState<{name: string, base64: string} | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'applications'), orderBy('appliedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(apps);
      
      // Auto-update 'new' candidates older than 7 days to 'reviewing'
      const now = new Date();
      apps.forEach(app => {
        if (app.status === 'new' && app.appliedAt) {
          const appDate = typeof app.appliedAt === 'string' ? new Date(app.appliedAt) : new Date(app.appliedAt.seconds ? app.appliedAt.seconds * 1000 : app.appliedAt);
          const diffDays = (now.getTime() - appDate.getTime()) / (1000 * 3600 * 24);
          if (diffDays > 7) {
            updateDoc(doc(db, 'applications', app.id), { status: 'reviewing' }).catch(console.error);
          }
        }
      });
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'applications', id), { status: newStatus });
      // In a real app, this would trigger a cloud function to send an automated status update email to the candidate.
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleShortlist = async (id: string, currentVal: boolean) => {
    try {
      const newVal = !currentVal;
      await updateDoc(doc(db, 'applications', id), { isShortlisted: newVal });
      await syncToGoogleSheet('update', { id, isShortlisted: newVal });
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'applications', id));
      await syncToGoogleSheet('delete', { id });
    } catch(err) {
      console.error(err);
    }
  }

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Candidate Applications Report', 14, 15);
    
    const tableData = applications.map(app => [
      app.name,
      app.email,
      app.status.toUpperCase(),
      app.isShortlisted ? 'Yes' : 'No',
      format(app.appliedAt, 'MMM dd, yyyy')
    ]);

    autoTable(doc, {
      head: [['Name', 'Email', 'Status', 'Shortlisted', 'Applied Date']],
      body: tableData,
      startY: 20,
    });

    doc.save('applications_report.pdf');
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(applications.map(app => ({
      Name: app.name,
      Email: app.email,
      Status: app.status.toUpperCase(),
      Shortlisted: app.isShortlisted ? 'Yes' : 'No',
      'Resume Link': app.resumeLink,
      'Applied Date': format(app.appliedAt, 'MMM dd, yyyy HH:mm')
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applications");
    XLSX.writeFile(wb, "applications_report.xlsx");
  };

  const filteredApps = applications.filter(item => {
    const target = item.name || item.candidateName || '';
    const position = item.position || '';
    const dateField = item.appliedAt || item.date || item.createdAt;
    
    const matchesName = filterName === '' || String(target).toLowerCase().includes(filterName.toLowerCase());
    const matchesPosition = filterPosition === '' || String(position).toLowerCase().includes(filterPosition.toLowerCase());
    
    let matchesDate = true;
    if (filterDate && dateField) {
      try {
        const itemDate = typeof dateField === 'string' ? new Date(dateField) : new Date(dateField.seconds ? dateField.seconds * 1000 : dateField);
        const yyyy = itemDate.getFullYear();
        const mm = String(itemDate.getMonth() + 1).padStart(2, '0');
        const dd = String(itemDate.getDate()).padStart(2, '0');
        const formatted = `${yyyy}-${mm}-${dd}`;
        matchesDate = formatted === filterDate;
      } catch(e) {}
    }
    
    const matchesStatus = typeof statusFilter !== 'undefined' ? (statusFilter === 'all' || item.status === statusFilter) : true;
    
    return matchesName && matchesPosition && matchesDate && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'reviewing': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'interviewed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'offered': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'hired': return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Applications</h2>
        <div className="flex gap-2">
          <button onClick={exportPDF} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <FileDown className="w-4 h-4" /> PDF
          </button>
          <button onClick={exportExcel} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <Download className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 w-full">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter by name..." 
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter by position..." 
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="relative">
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent py-2 pl-2 pr-4 outline-none text-gray-900 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="reviewing">Reviewing</option>
            <option value="interviewed">Interviewed</option>
            <option value="offered">Offered</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Candidate</th>
                <th className="px-6 py-4 font-medium">Position</th>
                <th className="px-6 py-4 font-medium">Applied Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Resume</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleToggleShortlist(app.id, app.isShortlisted)}
                          className={`p-1 rounded-full transition ${app.isShortlisted ? 'text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' : 'text-gray-300 hover:text-gray-400 hover:bg-gray-100 dark:text-gray-600 dark:hover:text-gray-500'}`}
                          title="Toggle Shortlist"
                        >
                          <Star className="w-5 h-5" fill={app.isShortlisted ? 'currentColor' : 'none'} />
                        </button>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{app.name}</div>
                          <div className="text-gray-500 text-xs flex flex-col gap-0.5 mt-0.5">
                            <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> {app.email}</div>
                            {app.phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {app.phone}</div>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {app.position || <span className="text-gray-400 italic">Not specified</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {format(app.appliedAt, 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full outline-none cursor-pointer appearance-none ${getStatusColor(app.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="interviewed">Interviewed</option>
                        <option value="offered">Offered</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {app.resumeBase64 ? (
                        <button 
                          onClick={() => setPreviewPdf({ name: app.resumeName || `resume_${app.name}.pdf`, base64: app.resumeBase64 })}
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-xs"
                        >
                          Preview PDF <Eye className="w-3 h-3" />
                        </button>
                      ) : app.resumeLink ? (
                        <a 
                          href={app.resumeLink} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-xs"
                        >
                          View Link <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">No resume</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => handleToggleShortlist(app.id, app.isShortlisted)}
                        className={`p-2 rounded-lg transition flex items-center gap-1 text-xs font-medium border ${app.isShortlisted ? 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700/50' : 'text-gray-600 border-gray-200 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'}`}
                        title="Shortlist Candidate"
                      >
                        <Star className="w-4 h-4" fill={app.isShortlisted ? 'currentColor' : 'none'} />
                        {app.isShortlisted ? 'Shortlisted' : 'Shortlist'}
                      </button>
                      <button 
                        onClick={() => handleDelete(app.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent dark:hover:bg-red-900/20 rounded-lg transition"
                        title="Delete Application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
