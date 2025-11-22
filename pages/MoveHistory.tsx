
import React, { useState } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from 'lucide-react';
import Card from '../components/ui/Card';
import { useData } from '../context/DataContext';

const MoveHistory: React.FC = () => {
  const { moves } = useData();
  const [search, setSearch] = useState('');

  // Sort moves by date descending
  const sortedMoves = [...moves].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredMoves = sortedMoves.filter(m => 
    m.reference.toLowerCase().includes(search.toLowerCase()) ||
    m.product.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
         <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Move History</h2>
            <p className="text-slate-500 dark:text-gray-400">Audit log of every stock movement.</p>
         </div>
      </div>

      <Card className="p-4 flex gap-4 !bg-white dark:!bg-glass-100/50 items-center" noPadding>
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search moves..." 
                className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <button className="p-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl text-slate-500 dark:text-gray-300 transition-colors">
            <Filter size={20} />
         </button>
      </Card>

      <div className="bg-white dark:bg-glass-100 border border-slate-200 dark:border-glass-border rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-gray-400 border-b border-slate-200 dark:border-white/5">
                <tr>
                    <th className="p-4 pl-6">Date</th>
                    <th className="p-4">Reference</th>
                    <th className="p-4">Product</th>
                    <th className="p-4">From</th>
                    <th className="p-4">To</th>
                    <th className="p-4 text-right">Quantity</th>
                    <th className="p-4">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredMoves.map((move) => (
                    <tr key={move.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4 pl-6 text-slate-600 dark:text-gray-400">{move.date}</td>
                        <td className="p-4 font-mono text-blue-600 dark:text-purple-400">{move.reference}</td>
                        <td className="p-4 font-medium text-slate-900 dark:text-white">{move.product}</td>
                        <td className="p-4 text-slate-500 dark:text-gray-400">{move.from}</td>
                        <td className="p-4 text-slate-500 dark:text-gray-400">{move.to}</td>
                        <td className="p-4 text-right font-mono">
                            <span className={`flex items-center justify-end gap-1 ${
                                move.type === 'in' ? 'text-green-600 dark:text-green-400' : 
                                move.type === 'out' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
                            }`}>
                                {move.type === 'in' && '+'}{move.type === 'out' && '-'}{move.quantity}
                                {move.type === 'in' && <ArrowDownLeft size={14} />}
                                {move.type === 'out' && <ArrowUpRight size={14} />}
                                {move.type === 'internal' && <ArrowRightLeft size={14} />}
                            </span>
                        </td>
                        <td className="p-4">
                            <span className="px-2 py-1 rounded bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs border border-green-200 dark:border-green-500/20">
                                {move.status.toUpperCase()}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default MoveHistory;
