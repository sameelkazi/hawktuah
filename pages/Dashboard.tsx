import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell 
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Package, AlertTriangle, Truck, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';
import { KPIData, Product } from '../types';
import { motion } from 'framer-motion';

interface DashboardProps {
  kpi: KPIData;
  products: Product[];
}

const COLORS = ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981'];

const Dashboard: React.FC<DashboardProps> = ({ kpi, products }) => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-gray-400">Welcome back, here's what's happening in your warehouse today.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-glass-200 hover:bg-glass-300 border border-glass-border rounded-lg text-sm text-white transition-all">Last 7 Days</button>
           <button className="px-4 py-2 bg-primary hover:bg-primary-glow rounded-lg text-sm text-white shadow-lg shadow-primary/30 transition-all font-medium">Export Report</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Products', value: kpi.totalProducts, icon: Package, color: 'text-blue-400', bg: 'bg-blue-400/10', trend: '+12%' },
          { label: 'Low Stock Items', value: kpi.lowStockItems, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10', trend: '-2%' },
          { label: 'Pending Receipts', value: kpi.pendingReceipts, icon: Truck, color: 'text-green-400', bg: 'bg-green-400/10', trend: '+5%' },
          { label: 'Pending Deliveries', value: kpi.pendingDeliveries, icon: RefreshCw, color: 'text-purple-400', bg: 'bg-purple-400/10', trend: '+18%' },
        ].map((stat, index) => (
          <Card key={index} delay={index * 0.1} className="relative overflow-hidden group">
             <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl group-hover:w-32 group-hover:h-32 transition-all duration-500`}></div>
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} ring-1 ring-inset ring-white/5`}>
                <stat.icon size={24} />
              </div>
              <span className={`flex items-center text-sm font-medium ${stat.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {stat.trend.startsWith('+') ? <ArrowUpRight size={16} className="mr-1"/> : <ArrowDownRight size={16} className="mr-1"/>}
                {stat.trend}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
              <p className="text-gray-400 text-sm font-medium mt-1">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <Card className="lg:col-span-2 min-h-[400px]" delay={0.4}>
          <h3 className="text-xl font-bold text-white mb-6">Stock Movements</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stockData}>
                <defs>
                  <linearGradient id="colorReceipts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Area type="monotone" dataKey="receipts" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorReceipts)" />
                <Area type="monotone" dataKey="deliveries" stroke="#EC4899" strokeWidth={3} fillOpacity={1} fill="url(#colorDel)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="min-h-[400px]" delay={0.5}>
          <h3 className="text-xl font-bold text-white mb-2">Inventory Value</h3>
          <p className="text-gray-400 text-sm mb-6">Distribution by Category</p>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-white">1.2k</span>
              <span className="text-xs text-gray-400">Items</span>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-gray-300">{entry.name}</span>
                </div>
                <span className="font-medium text-white">{entry.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
