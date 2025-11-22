import React from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Package, AlertTriangle, Truck, RefreshCw, 
  Scan, Zap, ClipboardCheck, Server, Database, Wifi
} from 'lucide-react';
import Card from '../components/ui/Card';
import { KPIData } from '../types';

interface DashboardProps {
  kpi: KPIData;
}

// Blue & Cyan Palette
const COLORS = ['#3B82F6', '#06B6D4', '#8B5CF6', '#10B981'];

const Dashboard: React.FC<DashboardProps> = ({ kpi }) => {
  const stockData = [
    { name: 'Mon', receipts: 40, deliveries: 24 },
    { name: 'Tue', receipts: 30, deliveries: 13 },
    { name: 'Wed', receipts: 20, deliveries: 58 },
    { name: 'Thu', receipts: 27, deliveries: 39 },
    { name: 'Fri', receipts: 18, deliveries: 48 },
    { name: 'Sat', receipts: 23, deliveries: 38 },
    { name: 'Sun', receipts: 34, deliveries: 43 },
  ];

  const pieData = [
    { name: 'Raw Material', value: 400 },
    { name: 'Finished', value: 300 },
    { name: 'Components', value: 300 },
    { name: 'Scrap', value: 200 },
  ];

  const QuickAction = ({ icon: Icon, label, color, hoverColor }: { icon: any, label: string, color: string, hoverColor: string }) => (
    <button className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all hover:-translate-y-1 overflow-hidden shadow-sm dark:shadow-none">
      <div className={`absolute inset-0 bg-gradient-to-br ${hoverColor} opacity-0 group-hover:opacity-10 transition-opacity`} />
      <div className={`mb-2 p-3 rounded-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 group-hover:scale-110 transition-transform ${color}`}>
        <Icon size={24} />
      </div>
      <span className="text-sm font-medium text-slate-600 dark:text-gray-300 group-hover:text-slate-900 dark:group-hover:text-white">{label}</span>
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs font-mono text-green-600 dark:text-green-500 uppercase tracking-widest">System Online</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Command Center</h2>
          <p className="text-slate-500 dark:text-gray-400">Real-time overview of warehouse logistics.</p>
        </div>
        
        <div className="flex gap-3">
           <button className="px-5 py-2.5 bg-white dark:bg-glass-200 hover:bg-slate-50 dark:hover:bg-glass-300 border border-slate-200 dark:border-glass-border rounded-xl text-sm text-slate-700 dark:text-white transition-all backdrop-blur-md shadow-sm dark:shadow-none">
             Run Diagnostics
           </button>
           <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm text-white shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] transition-all font-medium border border-blue-500/50">
             Generate Report
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: KPIs & Charts */}
        <div className="lg:col-span-2 space-y-8">
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Total Products', value: kpi.totalProducts, icon: Package, color: 'text-blue-500', bg: 'from-blue-500/10 to-transparent', border: 'border-blue-500/30', trend: '+12%' },
              { label: 'Low Stock Alerts', value: kpi.lowStockItems, icon: AlertTriangle, color: 'text-red-500', bg: 'from-red-500/10 to-transparent', border: 'border-red-500/30', trend: '-2%' },
              { label: 'Inbound', value: kpi.pendingReceipts, icon: Truck, color: 'text-green-500', bg: 'from-green-500/10 to-transparent', border: 'border-green-500/30', trend: '+5%' },
              { label: 'Outbound', value: kpi.pendingDeliveries, icon: RefreshCw, color: 'text-cyan-500', bg: 'from-cyan-500/10 to-transparent', border: 'border-cyan-500/30', trend: '+18%' },
            ].map((stat, index) => (
              <Card key={index} delay={index * 0.1} className={`!bg-gradient-to-br ${stat.bg} !border-l-4 ${stat.border} dark:bg-opacity-10`}>
                <div className="flex justify-between items-start">
                  <div>
                     <p className="text-slate-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{stat.label}</p>
                     <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">{stat.value}</h3>
                  </div>
                  <div className={`p-2.5 rounded-lg bg-white dark:bg-black/20 shadow-sm dark:shadow-none ${stat.color}`}>
                    <stat.icon size={22} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded bg-white/50 dark:bg-black/20 ${stat.trend.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stat.trend.startsWith('+') ? <ArrowUpRight size={12} className="mr-1"/> : <ArrowDownRight size={12} className="mr-1"/>}
                    {stat.trend}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-gray-500">vs last week</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Main Chart */}
          <Card className="min-h-[400px]" delay={0.4}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Stock Flow Analytics</h3>
                    <p className="text-xs text-slate-500 dark:text-gray-500 font-mono">INBOUND VS OUTBOUND TRAFFIC</p>
                </div>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-xs text-slate-400"><div className="w-2 h-2 bg-blue-500 rounded-full"></div>Receipts</span>
                    <span className="flex items-center gap-1 text-xs text-slate-400"><div className="w-2 h-2 bg-cyan-500 rounded-full"></div>Deliveries</span>
                </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stockData}>
                  <defs>
                    <linearGradient id="colorReceipts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color, rgba(255,255,255,0.1))" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#fff', fontWeight: 500 }}
                    cursor={{ stroke: 'rgba(59,130,246,0.3)', strokeWidth: 2 }}
                  />
                  <Area type="monotone" dataKey="receipts" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorReceipts)" animationDuration={2000} />
                  <Area type="monotone" dataKey="deliveries" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#colorDel)" animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right Column: Quick Actions, Distribution, Status */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            <QuickAction icon={Scan} label="Scan" color="text-cyan-500" hoverColor="from-cyan-500/20 to-blue-500/20" />
            <QuickAction icon={Zap} label="Transfer" color="text-blue-500" hoverColor="from-blue-500/20 to-indigo-500/20" />
            <QuickAction icon={ClipboardCheck} label="Audit" color="text-emerald-500" hoverColor="from-emerald-500/20 to-teal-500/20" />
          </div>

          {/* Pie Chart */}
          <Card className="min-h-[340px]" delay={0.5}>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Inventory Value</h3>
            <p className="text-xs text-slate-500 dark:text-gray-500 font-mono mb-6">ASSET DISTRIBUTION</p>
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
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
                <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">1.2k</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-gray-400">Items</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-xs p-2 rounded-lg bg-slate-50 dark:bg-white/5">
                  <div className="w-2 h-2 rounded-sm shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-slate-700 dark:text-gray-300 truncate">{entry.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* System Health Widget */}
          <Card className="p-4 !bg-slate-900 dark:!bg-black/40 border-t border-slate-800 dark:border-white/10" noPadding>
              <div className="p-5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Wifi size={16} className="text-green-400" />
                    System Status
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Server size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-300">Server Latency</span>
                        </div>
                        <span className="text-sm font-mono text-green-400">24ms</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full w-[20%] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center gap-3">
                            <Database size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-300">Database Load</span>
                        </div>
                        <span className="text-sm font-mono text-blue-400">42%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full w-[42%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
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