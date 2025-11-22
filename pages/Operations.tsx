import React, { useState } from 'react';
import { Operation, OperationStatus, Product } from '../types';
import { MOCK_OPERATIONS, MOCK_PRODUCTS } from '../constants';
import { ArrowRight, Calendar, MoreVertical, List, Kanban, Plus, Printer, X, Save, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/ui/Card';

const Operations: React.FC = () => {
  const [view, setView] = useState<'kanban' | 'list'>('list');
  const [operations, setOperations] = useState<Operation[]>(MOCK_OPERATIONS);
  const [selectedOp, setSelectedOp] = useState<Operation | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeType, setActiveType] = useState<'All' | 'Receipt' | 'Delivery' | 'Internal' | 'Adjustment'>('All');

  const statuses: OperationStatus[] = ['Draft', 'Waiting', 'Ready', 'Done'];

  const filteredOps = operations.filter(op => activeType === 'All' || op.type === activeType);

  const handleNewOperation = (type: string) => {
    const newOp: Operation = {
      id: Date.now().toString(),
      reference: `WH/${type.substring(0,3).toUpperCase()}/000${operations.length + 1}`,
      type: type as any,
      source: 'WH/Stock',
      destination: 'Customer',
      contact: '',
      status: 'Draft',
      scheduleDate: new Date().toISOString().split('T')[0],
      items: []
    };
    setSelectedOp(newOp);
    setIsFormOpen(true);
  };

  const handleStatusChange = (op: Operation, newStatus: OperationStatus) => {
    const updated = { ...op, status: newStatus };
    setSelectedOp(updated);
    setOperations(operations.map(o => o.id === op.id ? updated : o));
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold text-white">Operations</h2>
            <p className="text-gray-400">Manage receipts, deliveries, and transfers.</p>
        </div>
        <div className="flex items-center gap-4 self-start md:self-auto">
          <div className="flex bg-glass-100 rounded-xl p-1 border border-white/10">
            <button 
                onClick={() => setView('list')}
                className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                <List size={20} />
            </button>
            <button 
                onClick={() => setView('kanban')}
                className={`p-2 rounded-lg transition-colors ${view === 'kanban' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                <Kanban size={20} />
            </button>
          </div>
          <button 
            onClick={() => handleNewOperation('Delivery')}
            className="flex items-center gap-2 bg-primary hover:bg-primary-glow text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-purple-500/25 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
          {['All', 'Receipt', 'Delivery', 'Internal', 'Adjustment'].map((type) => (
              <button
                  key={type}
                  onClick={() => setActiveType(type as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      activeType === type 
                      ? 'bg-white/10 text-white border border-white/10' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                  {type}
              </button>
          ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {view === 'list' ? (
             <Card className="p-0 overflow-hidden h-full flex flex-col bg-glass-100/50">
                <div className="overflow-auto custom-scrollbar h-full">
                  <table className="w-full text-left text-sm min-w-[800px]">
                    <thead className="bg-white/5 text-gray-400 font-medium sticky top-0 z-10 backdrop-blur-md">
                      <tr>
                        <th className="p-4">Reference</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Schedule Date</th>
                        <th className="p-4">Source</th>
                        <th className="p-4">Destination</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredOps.map(op => (
                        <tr 
                          key={op.id} 
                          onClick={() => { setSelectedOp(op); setIsFormOpen(true); }}
                          className="hover:bg-white/5 transition-colors cursor-pointer group"
                        >
                          <td className="p-4 font-mono text-purple-400 group-hover:text-purple-300">{op.reference}</td>
                          <td className="p-4 font-medium text-white">{op.contact || '-'}</td>
                          <td className="p-4 text-gray-400">{op.scheduleDate}</td>
                          <td className="p-4 text-gray-400">{op.source}</td>
                          <td className="p-4 text-gray-400">{op.destination}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                              op.status === 'Done' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                              op.status === 'Ready' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                              op.status === 'Waiting' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                              'bg-gray-500/10 border-gray-500/20 text-gray-400'
                            }`}>
                              {op.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </Card>
        ) : (
            // Kanban View
            <div className="h-full overflow-x-auto pb-4 custom-scrollbar">
                <div className="flex gap-6 min-w-[1000px] h-full">
                    {statuses.map((status) => {
                        const opsInCol = filteredOps.filter(o => o.status === status);
                        return (
                            <div key={status} className="flex-1 min-w-[280px] flex flex-col bg-glass-100/30 rounded-2xl border border-white/5 p-4 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${
                                            status === 'Done' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 
                                            status === 'Ready' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 
                                            status === 'Waiting' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'bg-gray-500'
                                        }`}></div>
                                        <h3 className="font-bold text-gray-200">{status}</h3>
                                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-gray-400">{opsInCol.length}</span>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                                    {opsInCol.map((op, idx) => (
                                        <motion.div
                                            key={op.id}
                                            layoutId={op.id}
                                            onClick={() => { setSelectedOp(op); setIsFormOpen(true); }}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-[#16161e]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                                                    {op.reference}
                                                </span>
                                                <span className="text-xs text-gray-500">{op.type}</span>
                                            </div>
                                            <p className="text-sm font-medium text-white mb-2">{op.contact || 'Internal'}</p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>{op.scheduleDate}</span>
                                                <div className="flex -space-x-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-700 border border-[#16161e] flex items-center justify-center text-[10px] text-white">A</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}
      </div>

      {/* Detailed Form Overlay */}
      <AnimatePresence>
        {isFormOpen && selectedOp && (
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-0 z-[60] bg-[#0f0e17] overflow-y-auto custom-scrollbar"
            >
                {/* Form Header */}
                <div className="sticky top-0 z-50 bg-[#0f0e17]/95 backdrop-blur-xl border-b border-white/10 p-4 md:p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-white">{selectedOp.reference}</h2>
                        <span className="hidden md:inline text-gray-500 text-sm">/</span>
                        <span className="hidden md:inline text-purple-400 text-sm font-medium">{selectedOp.type}</span>
                    </div>
                    <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} className="text-gray-400 hover:text-white" />
                    </button>
                </div>

                {/* Action Bar */}
                <div className="p-4 md:p-6 pb-0 flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        {selectedOp.status !== 'Done' && (
                            <button 
                                onClick={() => handleStatusChange(selectedOp, 'Done')}
                                className="flex-1 md:flex-none px-6 py-2 bg-primary hover:bg-primary-glow text-white rounded-lg shadow-lg shadow-purple-500/20 transition-all"
                            >
                                Validate
                            </button>
                        )}
                         <button className="flex-1 md:flex-none px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all flex items-center justify-center gap-2">
                            <Printer size={16} />
                            Print
                        </button>
                        <button 
                            onClick={() => setIsFormOpen(false)}
                            className="flex-1 md:flex-none px-4 py-2 bg-transparent hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Status Bar */}
                    <div className="flex items-center rounded-lg overflow-hidden border border-white/10 w-full md:w-auto overflow-x-auto">
                        {statuses.map((status, idx) => {
                             const isActive = selectedOp.status === status;
                             const isPast = statuses.indexOf(selectedOp.status) > idx;
                             
                             return (
                                <div 
                                    key={status}
                                    className={`px-4 py-2 text-sm font-medium flex items-center justify-center flex-1 md:flex-none whitespace-nowrap gap-2 ${
                                        isActive ? 'bg-primary text-white' : 
                                        isPast ? 'bg-primary/20 text-purple-300' :
                                        'bg-glass-100 text-gray-500'
                                    } ${idx !== statuses.length - 1 ? 'border-r border-white/10' : ''}`}
                                >
                                    {status}
                                </div>
                             );
                        })}
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
                    <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Contact / Partner</label>
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    value={selectedOp.contact}
                                    readOnly
                                    className="w-full bg-white/5 border-b border-white/20 py-2 text-lg text-white focus:outline-none focus:border-purple-500 transition-all"
                                />
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Operation Type</label>
                                <div className="text-gray-300 py-2 border-b border-white/20">{selectedOp.type}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Schedule Date</label>
                                <input 
                                    type="date" 
                                    value={selectedOp.scheduleDate}
                                    className="bg-transparent text-white border-b border-white/20 py-1.5 focus:border-purple-500 outline-none w-full"
                                />
                            </div>
                         </div>
                    </div>

                    <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Source Location</label>
                            <div className="w-full bg-white/5 border-b border-white/20 py-2 text-white">{selectedOp.source}</div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Destination Location</label>
                            <div className="w-full bg-white/5 border-b border-white/20 py-2 text-white">{selectedOp.destination}</div>
                         </div>
                    </div>
                </div>

                {/* Product Lines */}
                <div className="flex-1 p-4 md:p-6 bg-white/5 mt-4 min-h-[300px]">
                    <h3 className="text-lg font-bold text-white mb-4">Product Lines</h3>
                    <div className="bg-black/20 rounded-xl overflow-hidden border border-white/10 overflow-x-auto">
                        <table className="w-full text-left text-sm min-w-[600px]">
                            <thead className="bg-white/5 text-gray-400">
                                <tr>
                                    <th className="p-3 pl-6">Product</th>
                                    <th className="p-3">Demand</th>
                                    <th className="p-3">Done</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {selectedOp.items.map((item, i) => {
                                    const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
                                    return (
                                        <tr key={i}>
                                            <td className="p-3 pl-6 font-medium text-purple-300">
                                                [{product?.sku}] {product?.name}
                                            </td>
                                            <td className="p-3 text-gray-300">{item.quantity}</td>
                                            <td className="p-3 text-gray-300">{item.done}</td>
                                        </tr>
                                    );
                                })}
                                {/* Add Line Placeholder */}
                                <tr className="hover:bg-white/5 cursor-pointer group">
                                    <td colSpan={3} className="p-3 pl-6 text-gray-500 group-hover:text-purple-400 transition-colors">
                                        + Add a line
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Operations;