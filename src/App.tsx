import React, { useState, useEffect } from 'react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { 
  LayoutDashboard, Users, FileText, UserCircle, ClipboardCheck, 
  LogOut, Moon, Sun, Menu, X, ShieldAlert, Star, Calendar, PieChart 
} from 'lucide-react';
import CandidateForm from './components/CandidateForm';
import Dashboard from './components/Dashboard';
import Applications from './components/Applications';
import Shortlist from './components/Shortlist';
import Interviews from './components/Interviews';
import Reports from './components/Reports';
import InternalForms from './components/InternalForms';
import Staff from './components/Staff';
import Onboarding from './components/Onboarding';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Custom Login State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    // Check local storage for mock user
    const savedUser = localStorage.getItem('recruitProAdmin');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    if (loginUsername === 'admin' && loginPassword === 'admin@168') {
      // Create mock user
      const mockUser = {
        displayName: 'Admin User',
        email: 'admin@recruitpro.com',
        uid: 'admin-123'
      };
      
      setUser(mockUser);
      localStorage.setItem('recruitProAdmin', JSON.stringify(mockUser));
      setShowLoginModal(false);
    } else {
      setLoginError('Invalid username or password.');
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    setUser(null);
    localStorage.removeItem('recruitProAdmin');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex flex-col items-start gap-3 my-1">
              <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-48 flex items-center justify-center">
                <img src="/wis-logo-header.png" alt="Western International School Logo" className="w-full object-contain" />
              </div>
              <div className="flex items-center gap-2 pl-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                 <h1 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-wider">WIS-RMS</h1>
              </div>
            </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full transition">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={handleLogin}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <ShieldAlert className="w-4 h-4" /> HR Login
            </button>
          </div>
        </header>
        
        <main className="pb-12">
          <CandidateForm />
        </main>
        
        {/* Custom Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">HR Login</h2>
                  <button onClick={() => setShowLoginModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={submitLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                    <input
                      type="text"
                      required
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="Enter password"
                    />
                  </div>
                  
                  {loginError && (
                    <div className="p-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm border border-red-200 dark:border-red-800">
                      {loginError}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-70 flex justify-center"
                  >
                    {loginLoading ? 'Authenticating...' : 'Sign In'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: Users },
    { id: 'shortlist', label: 'Shortlist', icon: Star },
    { id: 'interviews', label: 'Interviews', icon: Calendar },
    { id: 'forms', label: 'Internal Forms', icon: FileText },
    { id: 'reports', label: 'Reports', icon: PieChart },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'applications': return <Applications />;
      case 'shortlist': return <Shortlist />;
      case 'interviews': return <Interviews />;
      case 'forms': return <InternalForms />;
      case 'staff': return <Staff />;
      case 'onboarding': return <Onboarding />;
      case 'reports': return <Reports />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 flex flex-col`}>
        <div className="p-6 flex justify-between items-center">
          <div className="flex flex-col items-start gap-3 my-1">
              <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-48 flex items-center justify-center">
                <img src="/wis-logo-header.png" alt="Western International School Logo" className="w-full object-contain" />
              </div>
              <div className="flex items-center gap-2 pl-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                 <h1 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-wider">WIS-RMS</h1>
              </div>
            </div>
          <button className="lg:hidden text-gray-500" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-500'}`} />
                {tab.label}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4 px-2">
             <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="User" className="w-8 h-8 rounded-full" />
             <div className="overflow-hidden">
               <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.displayName || 'Admin User'}</p>
               <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
             </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className="flex-1 flex justify-center p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={handleLogout} className="flex-1 flex justify-center items-center gap-2 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition text-sm font-medium">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 dark:text-gray-400">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold text-gray-900 dark:text-white">{tabs.find(t => t.id === activeTab)?.label}</span>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
