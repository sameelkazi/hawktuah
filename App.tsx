
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Operations from './pages/Operations';
import MoveHistory from './pages/MoveHistory';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { Menu, Bell, Search, Sun, Moon } from 'lucide-react';
import { ToastProvider } from './context/ToastContext';
import { DataProvider } from './context/DataContext';

// Loading Component
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-white dark:bg-[#020617] flex items-center justify-center z-50 transition-colors duration-500">
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
      <div className="absolute inset-2 border-r-4 border-cyan-500 rounded-full animate-spin animation-delay-150"></div>
      <div className="absolute inset-4 border-b-4 border-indigo-500 rounded-full animate-spin animation-delay-300"></div>
    </div>
  </div>
);

// Content Wrapper for Animations
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

// Layout for the Main App
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });
  const location = useLocation();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 flex transition-colors duration-500">
      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse-slow dark:bg-blue-900/20"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse-slow dark:bg-cyan-900/20" style={{ animationDelay: '2s' }}></div>
      </div>

      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        toggleMobile={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <main className="flex-1 min-w-0 relative z-10 flex flex-col h-screen transition-all duration-300">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 px-4 md:px-6 py-4 bg-white/70 dark:bg-[#020617]/80 backdrop-blur-lg border-b border-slate-200 dark:border-white/5 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white">
            <Menu />
            </button>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">StockMaster</span>
        </div>

        <div className="hidden md:flex items-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 w-96 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:bg-white dark:focus-within:bg-white/10 transition-all">
            <Search size={18} className="text-slate-400 dark:text-gray-400 mr-3" />
            <input type="text" placeholder="Global search..." className="bg-transparent border-none focus:outline-none text-sm w-full text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500" />
            <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400 dark:text-gray-500 border border-slate-200 dark:border-white/10 rounded px-1.5 py-0.5">⌘</span>
                <span className="text-xs text-slate-400 dark:text-gray-500 border border-slate-200 dark:border-white/10 rounded px-1.5 py-0.5">K</span>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <button 
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="relative p-2 text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-white/10">
            <div className="text-right">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Manan Bhanushali</p>
                <p className="text-xs text-slate-500 dark:text-gray-500">Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-white dark:bg-[#0f0e17] flex items-center justify-center overflow-hidden">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                </div>
            </div>
            </div>
        </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-[1600px] mx-auto w-full custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

// Inner Routes Component
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
        <Route path="/operations" element={<PageTransition><Operations /></PageTransition>} />
        <Route path="/history" element={<PageTransition><MoveHistory /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
        <Route path="/admin-dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <ToastProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/*" element={
              <AppLayout>
                <AnimatedRoutes />
              </AppLayout>
            } />
          </Routes>
        </Router>
      </DataProvider>
    </ToastProvider>
  );
};

export default App;
