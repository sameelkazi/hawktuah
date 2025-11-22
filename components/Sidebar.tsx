import React from 'react';
import { LayoutDashboard, Package, ArrowRightLeft, History, Settings, LogOut, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  toggleMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isMobileOpen, toggleMobile }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'operations', label: 'Operations', icon: ArrowRightLeft },
    { id: 'history', label: 'Move History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleMobile}
        />
      )}

      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: isMobileOpen ? 0 : 0 }}
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0f0e17]/90 backdrop-blur-xl border-r border-white/10 z-50 transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Stock<span className="text-purple-400">Master</span>
            </h1>
          </div>
          <button onClick={toggleMobile} className="md:hidden text-gray-400 hover:text-white">
            <Menu size={24} />
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
                  setActiveTab(item.id);
                  if (window.innerWidth < 768) toggleMobile();
                }}
                className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon size={20} className={`relative z-10 ${isActive ? 'text-purple-400' : 'group-hover:text-purple-300'}`} />
                <span className="relative z-10 font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-6">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
          <div className="mt-4 flex items-center gap-3 px-4">
             <div className="w-8 h-8 rounded-full bg-gray-700 border border-gray-600 overflow-hidden">
                <img src="https://picsum.photos/100/100" alt="User" className="w-full h-full object-cover" />
             </div>
             <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Alex Morgan</span>
                <span className="text-xs text-gray-500">Warehouse Mgr.</span>
             </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
