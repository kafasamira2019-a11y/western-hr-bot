import React, { useState } from 'react';
import { User, Briefcase, Award, CheckSquare, Target } from 'lucide-react';

export default function Staff() {
  // Mock data for staff profiles to demonstrate functionality
  const [activeTab, setActiveTab] = useState<'profile' | 'tasks' | 'career'>('profile');
  
  const staffMember = {
    name: "Alex Johnson",
    role: "Senior Tech Recruiter",
    department: "Human Resources",
    joinDate: "Jan 15, 2024",
    avatar: "https://i.pravatar.cc/150?u=alex"
  };

  const tasks = [
    { id: 1, text: "Review final round interviews for Frontend Dev", completed: false },
    { id: 2, text: "Draft offer letter for Sarah Smith", completed: true },
    { id: 3, text: "Update Q3 hiring metrics presentation", completed: false }
  ];

  const careerGoals = [
    { id: 1, text: "Complete Advanced Sourcing Certification", progress: 60 },
    { id: 2, text: "Lead a cross-functional hiring panel", progress: 100 },
    { id: 3, text: "Reduce average time-to-hire by 10%", progress: 30 }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Profile</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 border-b border-gray-100 dark:border-gray-700">
          <img src={staffMember.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-gray-50 dark:border-gray-700 shadow-sm" />
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{staffMember.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{staffMember.role} • {staffMember.department}</p>
            <p className="text-sm text-gray-400 mt-2">Joined {staffMember.joinDate}</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
            Edit Profile
          </button>
        </div>
        
        <div className="flex border-b border-gray-100 dark:border-gray-700">
          <button onClick={() => setActiveTab('profile')} className={`flex-1 py-4 text-sm font-medium border-b-2 transition ${activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Overview</button>
          <button onClick={() => setActiveTab('tasks')} className={`flex-1 py-4 text-sm font-medium border-b-2 transition ${activeTab === 'tasks' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>My Tasks</button>
          <button onClick={() => setActiveTab('career')} className={`flex-1 py-4 text-sm font-medium border-b-2 transition ${activeTab === 'career' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Career Progression</button>
        </div>

        <div className="p-6 md:p-8">
          {activeTab === 'profile' && (
            <div className="space-y-6 text-gray-600 dark:text-gray-300">
               <div>
                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><Briefcase className="w-5 h-5 text-gray-400" /> About</h3>
                 <p>Experienced technical recruiter specializing in engineering and product roles. Passionate about building inclusive and high-performing teams.</p>
               </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><CheckSquare className="w-5 h-5 text-gray-400" /> Action Items</h3>
              {tasks.map(task => (
                <label key={task.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition">
                  <input type="checkbox" defaultChecked={task.completed} className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className={task.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}>{task.text}</span>
                </label>
              ))}
            </div>
          )}

          {activeTab === 'career' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"><Target className="w-5 h-5 text-gray-400" /> Development Goals</h3>
              {careerGoals.map(goal => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-700 dark:text-gray-200">{goal.text}</span>
                    <span className="text-blue-600 dark:text-blue-400">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${goal.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
