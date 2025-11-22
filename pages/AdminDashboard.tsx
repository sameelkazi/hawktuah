
import React, { useState } from 'react';
import { Search, Plus, Trash2, Save, Shield, LayoutGrid, Box, ArrowRightLeft, History, Settings, Users } from 'lucide-react';
import Card from '../components/ui/Card';
import { ShimmerButton } from '../components/ui/ShimmerButton';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  permissions: {
    dashboard: boolean;
    inventory: boolean;
    operations: boolean;
    audit_log: boolean;
    settings: boolean;
    user_mgmt: boolean;
  };
  isDirty?: boolean;
}

const MOCK_USERS: AdminUser[] = [
  {
    id: '1', name: 'Manan Bhanushali', email: 'manan@stockmaster.com', role: 'Super Admin', avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    permissions: { dashboard: true, inventory: true, operations: true, audit_log: true, settings: true, user_mgmt: true }
  },
  {
    id: '2', name: 'Sarah Connor', email: 'sarah.c@stockmaster.com', role: 'Warehouse Mgr', avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    permissions: { dashboard: true, inventory: true, operations: true, audit_log: true, settings: false, user_mgmt: false }
  },
  {
    id: '3', name: 'John Smith', email: 'john.s@stockmaster.com', role: 'Stock Clerk', avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
    permissions: { dashboard: false, inventory: true, operations: true, audit_log: false, settings: false, user_mgmt: false }
  },
  {
    id: '4', name: 'Emily Blunt', email: 'emily.b@stockmaster.com', role: 'Auditor', avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    permissions: { dashboard: true, inventory: true, operations: false, audit_log: true, settings: false, user_mgmt: false }
  },
  {
    id: '5', name: 'Michael Scott', email: 'michael.s@stockmaster.com', role: 'Regional Mgr', avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    permissions: { dashboard: true, inventory: false, operations: false, audit_log: true, settings: false, user_mgmt: false }
  },
  {
    id: '6', name: 'David Kim', email: 'david.k@stockmaster.com', role: 'Logistics', avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    permissions: { dashboard: true, inventory: true, operations: true, audit_log: false, settings: false, user_mgmt: false }
  },
  {
    id: '7', name: 'Jessica Jones', email: 'jessica.j@stockmaster.com', role: 'Intern', avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
    permissions: { dashboard: false, inventory: false, operations: true, audit_log: false, settings: false, user_mgmt: false }
  },
];

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const permissionColumns = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { key: 'inventory', label: 'Inventory', icon: Box },
    { key: 'operations', label: 'Operations', icon: ArrowRightLeft },
    { key: 'audit_log', label: 'Audit Log', icon: History },
    { key: 'settings', label: 'Config', icon: Settings },
    { key: 'user_mgmt', label: 'Users', icon: Users },
  ] as const;

  const handleToggle = (userId: string, key: keyof AdminUser['permissions']) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          permissions: { ...u.permissions, [key]: !u.permissions[key] },
          isDirty: true
        };
      }
      return u;
    }));
  };

  const handleSave = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isDirty: false } : u));
    showToast('User permissions updated successfully', 'success');
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
                   <Shield className="text-red-600 dark:text-red-500" size={32} />
                </div>
                Admin Console
            </h2>
            <p className="text-slate-500 dark:text-gray-400 mt-1 ml-1">Manage user roles and system access privileges.</p>
        </div>
        <div className="flex gap-3">
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 flex items-center w-64 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <Search size={18} className="text-slate-400 mr-2" />
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white w-full placeholder-slate-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button className="px-4 py-2 bg-white dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-white/10 rounded-xl transition-colors flex items-center gap-2 font-medium text-sm">
                <Trash2 size={16} />
                Remove
            </button>
            <ShimmerButton
                 onClick={() => showToast('Create user wizard opening...', 'info')}
                 background="linear-gradient(90deg, #2563EB, #0284c7)"
                 shimmerColor="rgba(255,255,255,0.4)"
                 className="shadow-lg shadow-blue-500/20 !rounded-xl !py-2 !h-10"
                 borderRadius="12px"
            >
                <div className="flex items-center gap-2 text-white text-sm font-bold">
                    <Plus size={16} />
                    <span>Add User</span>
                </div>
            </ShimmerButton>
        </div>
      </div>

      {/* Permission Matrix */}
      <Card className="!bg-white dark:!bg-[#0F172A]/80 overflow-hidden" noPadding>
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead className="bg-slate-50 dark:bg-[#131c31] text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 border-b border-slate-200 dark:border-white/10">
                    <tr>
                        <th className="p-5 sticky left-0 bg-slate-50 dark:bg-[#131c31] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[280px]">User Profile</th>
                        {permissionColumns.map(col => (
                            <th key={col.key} className="p-4 text-center min-w-[100px]">
                                <div className="flex flex-col items-center gap-1">
                                    <col.icon size={16} className="mb-1 opacity-70" />
                                    {col.label}
                                </div>
                            </th>
                        ))}
                        <th className="p-4 text-center sticky right-0 bg-slate-50 dark:bg-[#131c31] z-20 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {filteredUsers.map((user) => (
                        <motion.tr 
                            key={user.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                        >
                            {/* User Info Column */}
                            <td className="p-4 sticky left-0 bg-white dark:bg-[#0F172A] group-hover:bg-slate-50 dark:group-hover:bg-[#1e293b] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden border border-slate-200 dark:border-white/10">
                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#0F172A] ${user.role === 'Super Admin' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">{user.name}</div>
                                        <div className="text-xs text-slate-500 dark:text-gray-400 flex flex-col">
                                            <span>{user.email}</span>
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 mt-0.5">{user.role}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>

                            {/* Permissions Columns */}
                            {permissionColumns.map((col) => (
                                <td key={col.key} className="p-4 text-center relative">
                                    {/* Vertical Hover Highlight */}
                                    <div className="absolute inset-y-0 left-0 right-0 bg-transparent group-hover:bg-white/5 pointer-events-none"></div>
                                    
                                    <div className="relative z-10 flex justify-center">
                                        <label className="relative flex items-center justify-center p-2 rounded-full cursor-pointer transition-all active:scale-90">
                                            <input
                                                type="checkbox"
                                                className="peer appearance-none w-6 h-6 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-white/5 checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer"
                                                checked={user.permissions[col.key as keyof typeof user.permissions]}
                                                onChange={() => handleToggle(user.id, col.key as keyof typeof user.permissions)}
                                            />
                                            <svg
                                                className="absolute w-4 h-4 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-all transform scale-50 peer-checked:scale-100"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </label>
                                    </div>
                                </td>
                            ))}

                            {/* Action Column */}
                            <td className="p-4 sticky right-0 bg-white dark:bg-[#0F172A] group-hover:bg-slate-50 dark:group-hover:bg-[#1e293b] z-10 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] transition-colors">
                                <button
                                    onClick={() => handleSave(user.id)}
                                    disabled={!user.isDirty}
                                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all w-full ${
                                        user.isDirty 
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500 active:scale-95' 
                                        : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-gray-600 cursor-default'
                                    }`}
                                >
                                    <Save size={14} />
                                    {user.isDirty ? 'Save' : 'Synced'}
                                </button>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
