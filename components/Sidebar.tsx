import React from 'react';
import { LayoutDashboard, Package, ArrowRightLeft, History, Settings, LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

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
    { id: 'products', label: 'Products', icon: Package, path: '/products' },
    { id: 'operations', label: 'Operations', icon: ArrowRightLeft, path: '/operations' },
    { id: 'history', label: 'Move History', icon: History, path: '/history' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
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
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white/80 dark:bg-[#0F172A]/95 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 z-50 transition-all duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Stock<span className="text-blue-500">Master</span>
            </h1>
          </div>
          <button onClick={toggleMobile} className="md:hidden text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2">
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
                className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'text-blue-600 dark:text-white' 
                    : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-50 dark:bg-gradient-to-r dark:from-blue-600/20 dark:to-cyan-600/20 border border-blue-200 dark:border-blue-500/30 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon size={20} className={`relative z-10 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'group-hover:text-blue-500 dark:group-hover:text-blue-300'}`} />
                <span className="relative z-10 font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-6">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/80 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
          <div className="mt-4 flex items-center gap-3 px-4 pt-4 border-t border-slate-200 dark:border-white/5">
             <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-gray-700 border border-slate-300 dark:border-gray-600 overflow-hidden">
                <img src="https://picsum.photos/100/100" alt="User" className="w-full h-full object-cover" />
             </div>
             <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Manan Bhanushali</span>
                <span className="text-xs text-slate-500 dark:text-gray-500">Warehouse Mgr.</span>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;