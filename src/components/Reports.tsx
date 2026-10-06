import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';
import { Download, FileDown, Search, Filter, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function Reports() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [positionFilter, setPositionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Extract unique positions and statuses
  const positions = Array.from(new Set(interviews.map(i => i.position).filter(Boolean)));
  const statuses = Array.from(new Set(interviews.map(i => i.status).filter(Boolean)));

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const q = query(collection(db, 'interviews'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setInterviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching interviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const filteredInterviews = interviews.filter(inv => {
    let match = true;
    if (positionFilter !== 'all' && inv.position !== positionFilter) match = false;
    if (statusFilter !== 'all' && inv.status !== statusFilter) match = false;
    if (dateFrom && inv.interviewDate < dateFrom) match = false;
    if (dateTo && inv.interviewDate > dateTo) match = false;
    return match;
  });

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Interview Reports', 14, 15);
    
    const tableData = filteredInterviews.map(inv => [
      inv.candidateName,
      inv.position || 'N/A',
      inv.interviewDate + ' ' + inv.interviewTime,
      inv.stage,
      inv.status
    ]);

    autoTable(doc, {
      head: [['Candidate', 'Position', 'Schedule', 'Stage', 'Status']],
      body: tableData,
      startY: 20,
      theme: 'grid',
    });

    doc.save('interview-report.pdf');
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredInterviews.map(inv => ({
      Candidate: inv.candidateName,
      Position: inv.position,
      Date: inv.interviewDate,
      Time: inv.interviewTime,
      Type: inv.interviewType,
      Stage: inv.stage,
      Status: inv.status
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Interviews");
    XLSX.writeFile(wb, "interview-report.xlsx");
  };

  if (loading) return <div className="p-6 text-gray-500">Loading reports...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Generate reports for candidates and interviews.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportPDF} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <FileDown className="w-4 h-4" /> Export PDF
          </button>
          <button onClick={exportExcel} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <Download className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position</label>
          <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none">
            <option value="all">All Positions</option>
            {positions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interview Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none">
            <option value="all">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Date</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Date</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Candidate</th>
                <th className="px-6 py-4 font-medium">Position</th>
                <th className="px-6 py-4 font-medium">Schedule</th>
                <th className="px-6 py-4 font-medium">Stage</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInterviews.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No results found matching criteria.</td></tr>
              ) : (
                filteredInterviews.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{inv.candidateName}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{inv.position}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{inv.interviewDate} at {inv.interviewTime}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{inv.stage}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{inv.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
