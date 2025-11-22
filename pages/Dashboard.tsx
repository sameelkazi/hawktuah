
import React from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Package, AlertTriangle, Truck, RefreshCw, 
  Scan, Zap, ClipboardCheck, Wifi, Activity, Calendar, MoreHorizontal
} from 'lucide-react';
import Card from '../components/ui/Card';
import { KPIData } from '../types';
import { motion } from 'framer-motion';

interface DashboardProps {
  kpi: KPIData;
}

// Enhanced Palette
const COLORS = ['#3B82F6', '#06B6D4', '#8B5CF6', '#10B981'];

// Mock Data for Sparklines
const sparklineData = [
  { v: 10 }, { v: 25 }, { v: 15 }, { v: 35 }, { v: 20 }, { v: 45 }, { v: 30 }, { v: 55 }
];

const Dashboard: React.FC<DashboardProps> = ({ kpi }) => {
  const stockData = [
    { name: 'Mon', receipts: 40, deliveries: 24 },
    { name: 'Tue', receipts: 30, deliveries: 13 },
    { name: 'Wed', receipts: 20, deliveries: 98 },
    { name: 'Thu', receipts: 27, deliveries: 39 },
    { name: 'Fri', receipts: 18, deliveries: 48 },
    { name: 'Sat', receipts: 23, deliveries: 38 },
    { name: 'Sun', receipts: 34, deliveries: 43 },
  ];

  const activityLog = [
    { id: 1, title: 'Large Receipt from SteelCo', type: 'Receipt', time: '10 mins ago', status: 'Done' },
    { id: 2, title: 'Urgent Delivery to Acme', type: 'Delivery', time: '32 mins ago', status: 'Ready' },
    { id: 3, title: 'Stock Adjustment: Rack A2', type: 'Adjustment', time: '1 hour ago', status: 'Done' },
    { id: 4, title: 'Internal Transfer to QC', type: 'Internal', time: '2 hours ago', status: 'Waiting' },
  ];

  const pieData = [
    { name: 'Raw Material', value: 400 },
    { name: 'Finished', value: 300 },
    { name: 'Components', value: 300 },
    { name: 'Scrap', value: 200 },
  ];

  const QuickAction = ({ icon: Icon, label, color, hoverColor }: { icon: any, label: string, color: string, hoverColor: string }) => (
    <button className="group relative flex flex-col items-center justify-center p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all hover:-translate-y-1 overflow-hidden shadow-sm dark:shadow-none">
      <div className={`absolute inset-0 bg-gradient-to-br ${hoverColor} opacity-0 group-hover:opacity-10 transition-opacity`} />
      <div className={`mb-3 p-3 rounded-xl bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 group-hover:scale-110 transition-transform ${color}`}>
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <span className="text-sm font-semibold text-slate-600 dark:text-gray-300 group-hover:text-slate-900 dark:group-hover:text-white">{label}</span>
    </button>
  );

  const StatCard = ({ label, value, icon: Icon, color, trend, trendDir }: any) => (
     <Card className="p-0 !bg-white dark:!bg-white/5 overflow-hidden group" noPadding>
        <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-white/0 to-white/5 dark:from-white/0 dark:to-white/5 rounded-bl-full pointer-events-none" />
        <div className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color.bg} ${color.text}`}>
                    <Icon size={22} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${trendDir === 'up' ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'}`}>
                    {trendDir === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {trend}
                </div>
            </div>
            <div>
                <p className="text-slate-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">{value}</h3>
            </div>
        </div>
        {/* Sparkline Area */}
        <div className="h-12 w-full mt-2">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                    <Line 
                        type="monotone" 
                        dataKey="v" 
                        stroke={color.hex} 
                        strokeWidth={3} 
                        dot={false}
                        animationDuration={3000}
                    />
                </LineChart>
             </ResponsiveContainer>
        </div>
     </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-2"
          >
             <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
             </div>
             <span className="text-xs font-bold text-green-600 dark:text-green-500 uppercase tracking-widest">Operational</span>
          </motion.div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h2>
        </div>
        
        <div className="flex gap-3">
           <button className="px-4 py-2 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-700 dark:text-white transition-all flex items-center gap-2">
             <Calendar size={16} className="text-slate-400" />
             <span>Last 7 Days</span>
           </button>
           <button className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm text-white shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] transition-all font-medium border border-blue-500/50 flex items-center gap-2">
             <RefreshCw size={16} />
             <span>Sync Data</span>
           </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
            label="Total Inventory" 
            value={kpi.totalProducts} 
            icon={Package} 
            color={{ bg: 'bg-blue-100 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', hex: '#3B82F6' }} 
            trend="12.5%" 
            trendDir="up" 
        />
        <StatCard 
            label="Pending Inbound" 
            value={kpi.pendingReceipts} 
            icon={Truck} 
            color={{ bg: 'bg-green-100 dark:bg-green-500/10', text: 'text-green-600 dark:text-green-400', hex: '#10B981' }} 
            trend="3.2%" 
            trendDir="up" 
        />
        <StatCard 
            label="Pending Outbound" 
            value={kpi.pendingDeliveries} 
            icon={Zap} 
            color={{ bg: 'bg-purple-100 dark:bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', hex: '#8B5CF6' }} 
            trend="0.8%" 
            trendDir="down" 
        />
        <StatCard 
            label="Stock Alerts" 
            value={kpi.lowStockItems} 
            icon={AlertTriangle} 
            color={{ bg: 'bg-red-100 dark:bg-red-500/10', text: 'text-red-600 dark:text-red-400', hex: '#EF4444' }} 
            trend="5.0%" 
            trendDir="down" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Chart */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="min-h-[450px] !p-8" delay={0.4}>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Flow Analytics</h3>
                    <p className="text-sm text-slate-500 dark:text-gray-500">Inbound vs Outbound Volume</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-lg border border-slate-200 dark:border-white/5">
                    <button className="px-3 py-1 rounded-md bg-white dark:bg-white/10 shadow-sm text-xs font-medium text-slate-900 dark:text-white">Weekly</button>
                    <button className="px-3 py-1 rounded-md text-xs font-medium text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white">Monthly</button>
                </div>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stockData}>
                  <defs>
                    <linearGradient id="colorReceipts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color, rgba(255,255,255,0.05))" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={15} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-15} />
                  <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '12px', 
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                        padding: '12px'
                    }}
                    itemStyle={{ color: '#fff', fontWeight: 500, fontSize: '13px' }}
                    cursor={{ stroke: 'rgba(59,130,246,0.3)', strokeWidth: 2, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="receipts" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorReceipts)" animationDuration={1500} />
                  <Area type="monotone" dataKey="deliveries" stroke="#06B6D4" strokeWidth={4} fillOpacity={1} fill="url(#colorDel)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Recent Activity Log */}
          <div className="space-y-4">
             <div className="flex justify-between items-center px-1">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Activity Feed</h3>
                 <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">View All</button>
             </div>
             <div className="grid gap-3">
                {activityLog.map((log, i) => (
                    <Card key={log.id} delay={0.5 + (i * 0.1)} className="!bg-white dark:!bg-white/5 hover:border-blue-300 dark:hover:border-white/20 transition-all group" noPadding>
                        <div className="p-4 flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                                log.type === 'Receipt' ? 'bg-green-100 border-green-200 text-green-600 dark:bg-green-500/20 dark:border-green-500/30 dark:text-green-400' :
                                log.type === 'Delivery' ? 'bg-blue-100 border-blue-200 text-blue-600 dark:bg-blue-500/20 dark:border-blue-500/30 dark:text-blue-400' :
                                'bg-orange-100 border-orange-200 text-orange-600 dark:bg-orange-500/20 dark:border-orange-500/30 dark:text-orange-400'
                            }`}>
                                {log.type === 'Receipt' ? <Truck size={18} /> : log.type === 'Delivery' ? <ArrowUpRight size={18} /> : <RefreshCw size={18} />}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{log.title}</h4>
                                <p className="text-xs text-slate-500 dark:text-gray-400 flex items-center gap-2 mt-0.5">
                                    <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                    {log.type}
                                    <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                    {log.time}
                                </p>
                            </div>
                            <div>
                                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${
                                    log.status === 'Done' ? 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-white/5 dark:border-white/10 dark:text-gray-400' :
                                    'bg-blue-100 border-blue-200 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400'
                                }`}>
                                    {log.status}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 px-1">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
                <QuickAction icon={Scan} label="Scanner" color="text-cyan-500" hoverColor="from-cyan-500/20 to-blue-500/20" />
                <QuickAction icon={Zap} label="Transfer" color="text-blue-500" hoverColor="from-blue-500/20 to-indigo-500/20" />
                <QuickAction icon={ClipboardCheck} label="Stock Audit" color="text-emerald-500" hoverColor="from-emerald-500/20 to-teal-500/20" />
                <QuickAction icon={MoreHorizontal} label="More" color="text-purple-500" hoverColor="from-purple-500/20 to-pink-500/20" />
            </div>
          </div>

          {/* Asset Distribution */}
          <Card className="min-h-[340px] !bg-white dark:!bg-white/5" delay={0.5}>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Asset Value</h3>
                    <p className="text-xs text-slate-500 dark:text-gray-500">Distribution by Category</p>
                </div>
                <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white"><MoreHorizontal size={20} /></button>
            </div>
            
            <div className="h-[220px] w-full relative mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">4</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-gray-400">Categories</span>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-slate-600 dark:text-gray-300 font-medium">{entry.name}</span>
                  </div>
                  <span className="text-slate-400 dark:text-gray-500 font-mono">{Math.round((entry.value / 1200) * 100)}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* System Status Widget - Fixed for Light Mode */}
          <Card className="!bg-white dark:!bg-black/40 border-t border-slate-200 dark:border-white/10 overflow-hidden relative" noPadding>
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-20"></div>
               <div className="p-5 relative z-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                        <Wifi size={14} className="text-green-500 dark:text-green-400" />
                        Server Health
                    </h3>
                    <Activity size={14} className="text-slate-400 dark:text-slate-500 animate-pulse" />
                </div>
                
                <div className="space-y-5">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-slate-500 dark:text-gray-400">Latency</span>
                            <span className="text-xs font-mono text-green-600 dark:text-green-400 font-bold">24ms</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full w-[20%] shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-slate-500 dark:text-gray-400">Database</span>
                            <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">Optimal</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-1.5">
                            <div className="bg-blue-500 h-1.5 rounded-full w-[80%] shadow-[0_0_10px_rgba(59,130,246,0.4)]"></div>
                        </div>
                    </div>
                </div>
              </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
