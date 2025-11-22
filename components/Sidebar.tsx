
import React, { useState, useEffect } from 'react';
import { LayoutGrid, Box, ArrowRightLeft, History, Settings, LogOut, Truck, Boxes, UserCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar, SidebarBody, SidebarLink } from './ui/sidebar';
import { ShimmerButton } from './ui/ShimmerButton';

interface SidebarProps {
  isMobileOpen: boolean;
  toggleMobile: () => void;
}

const AppSidebar: React.FC<SidebarProps> = ({ isMobileOpen, toggleMobile }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (isMobileOpen !== open) {
      setOpen(isMobileOpen);
    }
  }, [isMobileOpen]);

  const links = [
    { 
        label: 'Dashboard', 
        href: '/dashboard', 
        icon: <LayoutGrid className="h-[22px] w-[22px] flex-shrink-0" strokeWidth={1.5} /> 
    },
    { 
        label: 'Inventory', 
        href: '/products', 
        icon: <Box className="h-[22px] w-[22px] flex-shrink-0" strokeWidth={1.5} /> 
    },
    { 
        label: 'Operations', 
        href: '/operations', 
        icon: <ArrowRightLeft className="h-[22px] w-[22px] flex-shrink-0" strokeWidth={1.5} /> 
    },
    { 
        label: 'Audit Log', 
        href: '/history', 
        icon: <History className="h-[22px] w-[22px] flex-shrink-0" strokeWidth={1.5} /> 
    },
    { 
        label: 'Configuration', 
        href: '/settings', 
        icon: <Settings className="h-[22px] w-[22px] flex-shrink-0" strokeWidth={1.5} /> 
    },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  const Logo = () => {
    return (
      <div className="font-normal flex space-x-3 items-center text-sm py-2 relative z-20">
        <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
             <Box size={22} strokeWidth={2.5} className="text-white" />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col"
        >
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight leading-none">
                StockMaster
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-widest mt-0.5">
                PRO v2.0
            </span>
        </motion.div>
      </div>
    );
  };

  const LogoIcon = () => {
    return (
      <div className="font-normal flex items-center text-sm py-2 relative z-20 justify-center w-full">
        <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
             <Box size={22} strokeWidth={2.5} />
        </div>
      </div>
    );
  };

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 h-screen sticky top-0">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="mb-10 flex flex-col">
            {open ? <Logo /> : <LogoIcon />}
          </div>
          <div className="flex flex-col gap-3">
            {links.map((link, idx) => {
                const isActive = location.pathname === link.href;
                return (
                    <SidebarLink 
                        key={idx} 
                        link={link} 
                        className={`relative group ${isActive ? 'text-blue-600 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                    >
                        {/* Active Background Indicator */}
                        {isActive && (
                             <motion.div
                                layoutId="activeNav"
                                className="absolute inset-0 bg-blue-50 dark:bg-white/10 rounded-xl border border-blue-100 dark:border-white/5 shadow-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                             />
                        )}
                    </SidebarLink>
                );
            })}
          </div>
        </div>
        
        <div className="mt-auto flex flex-col gap-4">
          <div className={`flex items-center ${open ? 'gap-3 px-2' : 'justify-center'}`}>
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 p-[2px] flex-shrink-0 overflow-hidden cursor-pointer hover:scale-105 transition-transform ring-2 ring-transparent hover:ring-blue-500/50">
                    <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        className="h-full w-full object-cover rounded-full"
                        alt="Avatar"
                    />
                </div>
                {open && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="flex flex-col overflow-hidden"
                    >
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate">Manan B.</span>
                        <span className="text-[10px] text-slate-500 dark:text-gray-400 truncate">Warehouse Mgr.</span>
                    </motion.div>
                )}
          </div>
          
          {open && (
             <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
             >
                 <ShimmerButton 
                    onClick={handleLogout}
                    className="w-full h-10 !px-0 shadow-sm shadow-red-500/10"
                    background="linear-gradient(90deg, #EF4444, #B91C1C)"
                    shimmerColor="#FCA5A5"
                    borderRadius="12px"
                >
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-white">
                        <LogOut size={14} strokeWidth={2.5} />
                        <span>Sign Out</span>
                    </div>
                </ShimmerButton>
             </motion.div>
          )}
          {!open && (
              <button onClick={handleLogout} className="mx-auto p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
              </button>
          )}

           {/* Small Admin Icon */}
           <div className="flex justify-center pt-2 border-t border-slate-200 dark:border-white/5">
              <button 
                onClick={() => navigate('/admin-login')}
                className="text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-colors p-1"
                title="Admin Login"
              >
                <ShieldCheck size={16} />
              </button>
           </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
};

export default AppSidebar;
