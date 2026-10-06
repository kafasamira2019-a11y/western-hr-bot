import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Clock, CheckCircle, Target } from 'lucide-react';

const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#14b8a6', '#ef4444'];

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    shortlisted: 0,
    hired: 0,
    avgTimeToHire: 14 // Mocked for prototype
  });
  const [pipelineData, setPipelineData] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'applications'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0;
      let shortlisted = 0;
      let hired = 0;
      const statusCounts: Record<string, number> = {
        new: 0, reviewing: 0, interviewed: 0, offered: 0, hired: 0, rejected: 0
      };

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        total++;
        if (data.isShortlisted) shortlisted++;
        if (data.status === 'hired') hired++;
        if (statusCounts[data.status] !== undefined) {
          statusCounts[data.status]++;
        }
      });

      setStats({
        total,
        shortlisted,
        hired,
        avgTimeToHire: hired > 0 ? 14 : 0 // Real calculation would use timestamps
      });

      setPipelineData([
        { name: 'New', count: statusCounts.new },
        { name: 'Reviewing', count: statusCounts.reviewing },
        { name: 'Interviewed', count: statusCounts.interviewed },
        { name: 'Offered', count: statusCounts.offered },
        { name: 'Hired', count: statusCounts.hired }
      ]);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recruitment Overview</h2>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Applications</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Shortlisted</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.shortlisted}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Hired Candidates</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.hired}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Avg Time-to-Hire</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgTimeToHire} <span className="text-sm font-normal text-gray-500">days</span></h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recruitment Pipeline</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip 
                  cursor={{fill: 'rgba(0,0,0,0.05)'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {
                    pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Application Sources</h3>
          <div className="flex items-center justify-center h-72">
             <div className="text-center text-gray-500 dark:text-gray-400">
               {/* Simplified mock since we only track general form applications in this iteration */}
               <div className="w-48 h-48 rounded-full border-8 border-blue-500 flex items-center justify-center">
                 <div className="text-center">
                   <div className="text-2xl font-bold text-gray-900 dark:text-white">100%</div>
                   <div className="text-xs">Direct Portal</div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
