import React, { useState } from 'react';
import { Operation, OperationStatus } from '../types';
import { ArrowRight, Calendar, CheckCircle2, Clock, FileText, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface OperationsProps {
  operations: Operation[];
}

const Operations: React.FC<OperationsProps> = ({ operations }) => {
  const [activeType, setActiveType] = useState<'All' | 'Receipt' | 'Delivery' | 'Internal' | 'Adjustment'>('All');
  
  const statuses: OperationStatus[] = ['Draft', 'Waiting', 'Ready', 'Done'];

  const filteredOps = operations.filter(op => activeType === 'All' || op.type === activeType);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'Waiting': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Ready': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Done': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold text-white">Operations</h2>
            <p className="text-gray-400">Track inventory movement across the warehouse.</p>
        </div>
        <div className="flex bg-glass-100 rounded-xl p-1 border border-white/10">
            {['All', 'Receipt', 'Delivery', 'Internal', 'Adjustment'].map((type) => (
                <button
                    key={type}
                    onClick={() => setActiveType(type as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeType === type 
                        ? 'bg-primary text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                    {type}
                </button>
            ))}
        </div>
      </div>

      {/* Kanban Board Scroll Container */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-[1000px]">
            {statuses.map((status) => {
                const opsInCol = filteredOps.filter(o => o.status === status);
                
                return (
                    <div key={status} className="flex-1 min-w-[280px] flex flex-col bg-glass-100/30 rounded-2xl border border-white/5 p-4">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${
                                    status === 'Done' ? 'bg-green-500' : 
                                    status === 'Ready' ? 'bg-blue-500' : 
                                    status === 'Waiting' ? 'bg-orange-500' : 'bg-gray-500'
                                }`}></span>
                                <h3 className="font-bold text-gray-200">{status}</h3>
                                <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-gray-400">{opsInCol.length}</span>
                            </div>
                            <button className="text-gray-500 hover:text-white"><MoreVertical size={16} /></button>
                        </div>

                        <div className="flex-1 space-y-3">
                            {opsInCol.map((op, idx) => (
                                <motion.div
                                    key={op.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-[#16161e] border border-white/10 rounded-xl p-4 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all group cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                                            {op.reference}
                                        </span>
                                        {op.type === 'Receipt' && <span className="text-[10px] uppercase tracking-wider font-bold text-green-400">IN</span>}
                                        {op.type === 'Delivery' && <span className="text-[10px] uppercase tracking-wider font-bold text-secondary">OUT</span>}
                                        {op.type === 'Internal' && <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400">INT</span>}
                                        {op.type === 'Adjustment' && <span className="text-[10px] uppercase tracking-wider font-bold text-orange-400">ADJ</span>}
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-300 mb-3">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-500 uppercase">From</span>
                                            <span className="font-medium">{op.source}</span>
                                        </div>
                                        <ArrowRight size={14} className="text-gray-600" />
                                        <div className="flex flex-col text-right">
                                            <span className="text-[10px] text-gray-500 uppercase">To</span>
                                            <span className="font-medium">{op.destination}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Calendar size={12} />
                                            {op.date}
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs text-gray-300 border border-white/10">
                                            AM
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {opsInCol.length === 0 && (
                                <div className="h-32 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl">
                                    <span className="text-sm text-gray-600">No items</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default Operations;
