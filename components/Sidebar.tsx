import React from 'react';
import { LayoutDashboard, Package, ArrowRightLeft, History, Settings, LogOut, X, ChevronRight, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShimmerButton } from './ui/ShimmerButton';

interface SidebarProps {
  isMobileOpen: boolean;
  toggleMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, toggleMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.split('/')[1] || 'dashboard';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'products', label: 'Inventory', icon: Package, path: '/products' },
    { id: 'operations', label: 'Operations', icon: ArrowRightLeft, path: '/operations' },
    { id: 'history', label: 'Audit Log', icon: History, path: '/history' },
    { id: 'settings', label: 'Configuration', icon: Settings, path: '/settings' },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={toggleMobile}
          />
        )}
      </AnimatePresence>

      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-white/80 dark:bg-[#0F172A]/90 backdrop-blur-2xl border-r border-slate-200 dark:border-white/5 z-50 transition-all duration-300 ease-in-out flex flex-col ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Logo Section */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center">
               <div className="absolute inset-0 bg-blue-500 blur-lg opacity-40 animate-pulse-slow"></div>
               <div className="relative w-full h-full bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 border border-white/10">
                  <Box size={24} strokeWidth={2.5} />
               </div>
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                Stock<span className="text-blue-500">Master</span>
                </h1>
                <span className="text--[10px] font-mono text-slate-400 dark:text-gray-500 uppercase tracking-widest">IMS v2.0</span>
            </div>
          </div>
          <button onClick={toggleMobile} className="md:hidden text-slate-500 dark:text-gray-400">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="px-4 mb-2 text-xs font-bold text-slate-400 dark:text-gray-600 uppercase tracking-widest">Menu</div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 768) toggleMobile();
                }}
                className={`relative w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group overflow-hidden ${
                  isActive 
                    ? 'text-white shadow-lg shadow-blue-500/25' 
                    : 'text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-gray-100'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                <div className="flex items-center gap-3 relative z-10">
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={`${isActive ? 'text-white' : 'group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors'}`} />
                    <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
                </div>
                
                {isActive && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative z-10"
                    >
                        <ChevronRight size={16} className="text-white/80" />
                    </motion.div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 m-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex items-center gap-3 relative z-10 mb-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-gray-700 border-2 border-white dark:border-gray-600 overflow-hidden shadow-sm">
                    <img src="https://picsum.photos/100/100" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate">Manan Bhanushali</span>
                    <span className="text-xs text-slate-500 dark:text-gray-400 truncate">Warehouse Manager</span>
                </div>
            </div>
            
            <ShimmerButton 
                onClick={handleLogout}
                className="w-full h-9 !px-3 shadow-sm shadow-red-500/20"
                background="linear-gradient(90deg, #EF4444, #DC2626)"
                shimmerColor="#FCA5A5"
                borderRadius="8px"
            >
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-white">
                    <LogOut size={14} />
                    <span>Sign Out</span>
                </div>
            </ShimmerButton>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
