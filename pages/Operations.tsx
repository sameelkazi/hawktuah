
import React, { useState } from 'react';
import { Operation, OperationStatus } from '../types';
import { List, Kanban, Plus, Printer, X, ChevronRight, Clock, CheckCircle2, AlertOctagon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/ui/Card';
import { ShimmerButton } from '../components/ui/ShimmerButton';
import { useToast } from '../context/ToastContext';
import { useData } from '../context/DataContext';

const Operations: React.FC = () => {
  const { operations, products, addOperation, updateOperation, validateOperation } = useData();
  const { showToast } = useToast();
  const [view, setView] = useState<'kanban' | 'list'>('list');
  const [selectedOp, setSelectedOp] = useState<Operation | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeType, setActiveType] = useState<'All' | 'Receipt' | 'Delivery' | 'Internal' | 'Adjustment'>('All');
  const [isValidating, setIsValidating] = useState(false);

  const statuses: OperationStatus[] = ['Draft', 'Waiting', 'Ready', 'Done'];
  const filteredOps = operations.filter(op => activeType === 'All' || op.type === activeType);

  const handleNewOperation = (type: string) => {
    const newOp: Operation = {
      id: Date.now().toString(),
      reference: `WH/${type.substring(0,3).toUpperCase()}/${Date.now().toString().slice(-4)}`,
      type: type as any,
      source: type === 'Receipt' ? 'Vendor' : 'WH/Stock',
      destination: type === 'Delivery' ? 'Customer' : 'WH/Stock',
      contact: '',
      status: 'Draft',
      scheduleDate: new Date().toISOString().split('T')[0],
      items: []
    };
    
    addOperation(newOp);
    setSelectedOp(newOp);
    setIsFormOpen(true);
    showToast(`New ${type} draft created`, 'info');
  };

  const handleStatusChange = (op: Operation, newStatus: OperationStatus) => {
    if (newStatus === 'Done') {
        handleValidate(op);
        return;
    }
    
    const updated = { ...op, status: newStatus };
    updateOperation(updated);
    setSelectedOp(updated);
  };

  const handleValidate = (op: Operation) => {
    if (op.items.length === 0) {
        showToast('Cannot validate empty operation', 'error');
        return;
    }

    setIsValidating(true);
    setTimeout(() => {
        validateOperation(op);
        setIsValidating(false);
        // Update local selected op to reflect change
        setSelectedOp({...op, status: 'Done'});
        showToast('Operation validated & stock updated', 'success');
    }, 800);
  };

  const addItemToOp = (op: Operation, productId: string) => {
     const exists = op.items.find(i => i.productId === productId);
     if (exists) return;

     const updatedOp = {
         ...op,
         items: [...op.items, { productId, quantity: 1, done: 1 }]
     };
     updateOperation(updatedOp);
     setSelectedOp(updatedOp);
  };

  const updateItemQty = (op: Operation, productId: string, qty: number) => {
     const updatedOp = {
         ...op,
         items: op.items.map(i => i.productId === productId ? { ...i, quantity: qty, done: qty } : i)
     };
     updateOperation(updatedOp);
     setSelectedOp(updatedOp);
  };

  return (
    <div className="h-full flex flex-col relative space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Operations</h2>
            <p className="text-slate-500 dark:text-gray-400">Tactical overview of receipts and transfers.</p>
        </div>
        <div className="flex items-center gap-4 self-start md:self-auto">
          <div className="flex bg-slate-100 dark:bg-white/5 rounded-xl p-1 border border-slate-200 dark:border-white/10 backdrop-blur-md">
            <button 
                onClick={() => setView('list')}
                className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
                <List size={20} />
            </button>
            <button 
                onClick={() => setView('kanban')}
                className={`p-2 rounded-lg transition-all ${view === 'kanban' ? 'bg-white dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
                <Kanban size={20} />
            </button>
          </div>
          <ShimmerButton
             onClick={() => handleNewOperation('Delivery')}
             background="linear-gradient(90deg, #2563EB, #0891B2)"
             shimmerColor="rgba(255,255,255,0.4)"
             className="shadow-lg shadow-blue-500/20 !rounded-xl"
             borderRadius="12px"
          >
            <div className="flex items-center gap-2 text-white">
                <Plus size={20} />
                <span className="font-bold">New Transfer</span>
            </div>
          </ShimmerButton>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {['All', 'Receipt', 'Delivery', 'Internal', 'Adjustment'].map((type) => (
              <button
                  key={type}
                  onClick={() => setActiveType(type as any)}
                  className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                      activeType === type 
                      ? 'bg-slate-900 dark:bg-white/10 text-white border-transparent dark:border-white/20 shadow-lg' 
                      : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border-transparent'
                  }`}
              >
                  {type}
              </button>
          ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {view === 'list' ? (
             <Card className="p-0 overflow-hidden h-full flex flex-col !bg-white dark:!bg-[#0F172A]/60" noPadding>
                <div className="overflow-auto custom-scrollbar h-full">
                  <table className="w-full text-left text-sm min-w-[800px]">
                    <thead className="bg-slate-50 dark:bg-[#020617] text-slate-500 dark:text-gray-400 font-medium sticky top-0 z-10 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
                      <tr>
                        <th className="p-5 pl-6">Reference</th>
                        <th className="p-5">Contact</th>
                        <th className="p-5">Schedule</th>
                        <th className="p-5">Route</th>
                        <th className="p-5">Progress</th>
                        <th className="p-5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {filteredOps.map(op => {
                        const totalItems = op.items.reduce((acc, i) => acc + i.quantity, 0);
                        const doneItems = op.items.reduce((acc, i) => acc + i.done, 0);
                        const progress = totalItems > 0 ? (doneItems / totalItems) * 100 : 0;
                        
                        return (
                        <tr 
                          key={op.id} 
                          onClick={() => { setSelectedOp(op); setIsFormOpen(true); }}
                          className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group border-l-2 border-transparent hover:border-blue-500"
                        >
                          <td className="p-5 pl-6">
                            <span className="font-mono text-blue-600 dark:text-blue-400 group-hover:text-blue-500 font-bold">{op.reference}</span>
                            <div className="text-xs text-slate-500 dark:text-gray-500 mt-1">{op.type}</div>
                          </td>
                          <td className="p-5 font-medium text-slate-900 dark:text-white">{op.contact || <span className="text-slate-400 dark:text-gray-600 italic">Internal</span>}</td>
                          <td className="p-5 text-slate-500 dark:text-gray-400">
                              <div className="flex items-center gap-2">
                                  <Clock size={14} />
                                  {op.scheduleDate}
                              </div>
                          </td>
                          <td className="p-5">
                              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
                                  <span className="bg-slate-100 dark:bg-white/5 px-2 py-1 rounded border border-slate-200 dark:border-white/5">{op.source}</span>
                                  <ChevronRight size={12} />
                                  <span className="bg-slate-100 dark:bg-white/5 px-2 py-1 rounded border border-slate-200 dark:border-white/5">{op.destination}</span>
                              </div>
                          </td>
                          <td className="p-5 w-48">
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400 mb-1">
                                <span>{doneItems}/{totalItems}</span>
                                <span>Done</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-black/40 rounded-full h-1.5">
                                <div 
                                    className={`h-1.5 rounded-full ${op.status === 'Done' ? 'bg-green-500' : 'bg-blue-500'}`} 
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                          </td>
                          <td className="p-5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                              op.status === 'Done' ? 'bg-green-100 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400' :
                              op.status === 'Ready' ? 'bg-blue-100 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400' :
                              op.status === 'Waiting' ? 'bg-orange-100 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400' :
                              'bg-slate-100 dark:bg-gray-500/10 border-slate-200 dark:border-gray-500/20 text-slate-500 dark:text-gray-500'
                            }`}>
                              {op.status === 'Done' && <CheckCircle2 size={12} />}
                              {op.status === 'Waiting' && <AlertOctagon size={12} />}
                              {op.status}
                            </span>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
             </Card>
        ) : (
            // Kanban View
            <div className="h-full overflow-x-auto pb-4 custom-scrollbar">
                <div className="flex gap-6 min-w-[1200px] h-full">
                    {statuses.map((status) => {
                        const opsInCol = filteredOps.filter(o => o.status === status);
                        const colorClass = 
                             status === 'Done' ? 'border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 
                             status === 'Ready' ? 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 
                             status === 'Waiting' ? 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 
                             'border-slate-300 dark:border-gray-500/50';

                        return (
                            <div key={status} className="flex-1 min-w-[300px] flex flex-col bg-slate-50 dark:bg-[#0F172A]/40 rounded-3xl p-2 backdrop-blur-sm border border-slate-200 dark:border-white/5">
                                {/* Column Header */}
                                <div className={`flex items-center justify-between mb-4 p-3 rounded-2xl border ${colorClass} bg-white dark:bg-[#16161E]`}>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-slate-700 dark:text-gray-200 uppercase tracking-wider text-sm">{status}</h3>
                                    </div>
                                    <span className="text-xs bg-slate-100 dark:bg-white/10 font-mono px-2 py-1 rounded-md text-slate-600 dark:text-white">{opsInCol.length}</span>
                                </div>

                                <div className="flex-1 space-y-3 overflow-y-auto px-1 custom-scrollbar">
                                    <AnimatePresence>
                                    {opsInCol.map((op) => (
                                        <motion.div
                                            key={op.id}
                                            layoutId={op.id}
                                            onClick={() => { setSelectedOp(op); setIsFormOpen(true); }}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="relative bg-white dark:bg-glass-200 hover:bg-slate-50 dark:hover:bg-glass-300 border border-slate-200 dark:border-white/5 rounded-2xl p-5 cursor-pointer group transition-all hover:-translate-y-1 overflow-hidden shadow-sm dark:shadow-none"
                                        >
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
                                            
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded border border-blue-100 dark:border-blue-500/20">
                                                    {op.reference}
                                                </span>
                                                <span className="text-[10px] text-slate-400 dark:text-gray-400 uppercase tracking-widest">{op.type}</span>
                                            </div>
                                            
                                            <p className="text-sm font-bold text-slate-900 dark:text-white mb-4">{op.contact || 'Internal Operation'}</p>
                                            
                                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-3">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-400">
                                                    <Clock size={12} />
                                                    {op.scheduleDate}
                                                </div>
                                                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-gradient-to-tr dark:from-gray-700 dark:to-gray-800 border border-slate-300 dark:border-white/10 flex items-center justify-center text-[10px] text-slate-600 dark:text-white shadow-sm">
                                                    A
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    </AnimatePresence>
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
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed inset-y-0 right-0 w-full md:w-[800px] z-[60] bg-white dark:bg-[#0F172A] border-l border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Form Header */}
                <div className="bg-slate-50 dark:bg-[#16161E] border-b border-slate-200 dark:border-white/10 p-6 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{selectedOp.reference}</h2>
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs rounded border border-blue-200 dark:border-blue-500/30 uppercase">{selectedOp.type}</span>
                        </div>
                        <p className="text-slate-500 dark:text-gray-500 text-sm">Operation Details & Line Items</p>
                    </div>
                    <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} className="text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                    {/* Status Stepper */}
                    <div className="w-full bg-slate-100 dark:bg-glass-100 rounded-xl p-1 flex overflow-x-auto">
                        {statuses.map((status, idx) => {
                             const isActive = selectedOp.status === status;
                             const isPast = statuses.indexOf(selectedOp.status) > idx;
                             
                             return (
                                <button 
                                    key={status}
                                    onClick={() => handleStatusChange(selectedOp, status)}
                                    disabled={selectedOp.status === 'Done'}
                                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                                        isActive ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm dark:shadow-lg dark:shadow-blue-500/20' : 
                                        isPast ? 'text-blue-600 dark:text-blue-400' :
                                        'text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white'
                                    } ${selectedOp.status === 'Done' && !isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {status}
                                </button>
                             );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {selectedOp.status !== 'Done' && (
                            <div className="flex-1">
                                <ShimmerButton 
                                    onClick={() => handleValidate(selectedOp)}
                                    disabled={isValidating}
                                    className="w-full shadow-lg shadow-green-500/20"
                                    background="linear-gradient(90deg, #16a34a, #10b981)"
                                    shimmerColor="#a7f3d0"
                                    borderRadius="12px"
                                >
                                    <div className="flex items-center justify-center gap-2 text-white font-bold">
                                        {isValidating ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                Validating...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 size={20} />
                                                Validate Operation
                                            </>
                                        )}
                                    </div>
                                </ShimmerButton>
                            </div>
                        )}
                         <ShimmerButton 
                            onClick={() => showToast('Print job sent to printer', 'success')}
                            className="w-auto shadow-sm border border-slate-200 dark:border-white/10 !text-slate-700 dark:!text-white"
                            background="var(--bg-secondary)"
                            shimmerColor="#94a3b8"
                            borderRadius="12px"
                         >
                            <div className="flex items-center justify-center gap-2">
                                <Printer size={18} />
                            </div>
                        </ShimmerButton>
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-wider text-slate-500 dark:text-gray-500 font-bold ml-1">Contact</label>
                            <input 
                                type="text"
                                value={selectedOp.contact}
                                onChange={e => {
                                    const up = {...selectedOp, contact: e.target.value};
                                    setSelectedOp(up);
                                    updateOperation(up);
                                }}
                                disabled={selectedOp.status === 'Done'}
                                className="w-full bg-slate-100 dark:bg-white/5 rounded-xl px-4 py-3 text-slate-900 dark:text-white border border-slate-200 dark:border-white/5 outline-none focus:border-blue-500"
                                placeholder="Contact Name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-wider text-slate-500 dark:text-gray-500 font-bold ml-1">Schedule Date</label>
                            <div className="bg-slate-100 dark:bg-white/5 rounded-xl px-4 py-3 text-slate-900 dark:text-white border border-slate-200 dark:border-white/5">{selectedOp.scheduleDate}</div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-wider text-slate-500 dark:text-gray-500 font-bold ml-1">Source</label>
                            <div className="bg-slate-100 dark:bg-white/5 rounded-xl px-4 py-3 text-slate-900 dark:text-white border border-slate-200 dark:border-white/5 font-mono text-sm">{selectedOp.source}</div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-wider text-slate-500 dark:text-gray-500 font-bold ml-1">Destination</label>
                            <div className="bg-slate-100 dark:bg-white/5 rounded-xl px-4 py-3 text-slate-900 dark:text-white border border-slate-200 dark:border-white/5 font-mono text-sm">{selectedOp.destination}</div>
                        </div>
                    </div>

                    {/* Product Lines */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Product Lines</h3>
                        <div className="bg-slate-50 dark:bg-[#16161E] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 pl-6">Product</th>
                                        <th className="p-4">Demand</th>
                                        <th className="p-4">Done</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                                    {selectedOp.items.map((item, i) => {
                                        const product = products.find(p => p.id === item.productId);
                                        return (
                                            <tr key={i} className="group hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                                                <td className="p-4 pl-6">
                                                    <div className="font-medium text-slate-900 dark:text-white">{product?.name}</div>
                                                    <div className="text-xs text-blue-600 dark:text-blue-400 font-mono">[{product?.sku}]</div>
                                                </td>
                                                <td className="p-4 text-slate-600 dark:text-gray-300">{item.quantity}</td>
                                                <td className="p-4">
                                                    {selectedOp.status === 'Done' ? (
                                                        <span className="text-green-600 dark:text-green-400 font-bold">{item.done}</span>
                                                    ) : (
                                                        <input 
                                                            type="number" 
                                                            value={item.done}
                                                            onChange={(e) => updateItemQty(selectedOp, item.productId, Number(e.target.value))}
                                                            className="w-20 bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded px-2 py-1 text-slate-900 dark:text-white text-center" 
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {selectedOp.items.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="p-8 text-center text-slate-500 dark:text-gray-500 italic">
                                                No products added yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {selectedOp.status !== 'Done' && (
                            <div className="mt-4 p-4 border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-white/5">
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Add Product</label>
                                <div className="flex gap-2">
                                    <select 
                                        className="flex-1 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                                        onChange={(e) => {
                                            if(e.target.value) addItemToOp(selectedOp, e.target.value);
                                            e.target.value = "";
                                        }}
                                    >
                                        <option value="">Select a product...</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} (Current: {p.stock})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
      {isFormOpen && <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-[50]" onClick={() => setIsFormOpen(false)} />}
    </div>
  );
};

export default Operations;
