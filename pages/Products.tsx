
import React, { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, MapPin, AlertCircle, Box } from 'lucide-react';
import { Product } from '../types';
import Card from '../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';

interface ProductsProps {
  products: Product[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Inventory</h2>
          <p className="text-slate-500 dark:text-gray-400 mt-1">Manage stock levels and product catalog.</p>
        </div>
        <button 
            onClick={() => showToast('Product creation wizard coming soon!', 'info')}
            className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] transition-all transform hover:scale-105 active:scale-95 border border-blue-500/50"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters */}
      <Card className="p-2 flex flex-col md:flex-row gap-4 items-center justify-between !bg-white dark:!bg-white/5 backdrop-blur-md" noPadding>
        <div className="p-3 w-full flex gap-4 items-center">
            <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
                type="text" 
                placeholder="Search SKU, Name, Tag..." 
                className="w-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            </div>
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-white/10 pl-4">
            <button 
                onClick={() => setView('grid')}
                className={`p-2.5 rounded-lg transition-all ${view === 'grid' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
                <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                    <div className="bg-current rounded-[2px]"></div><div className="bg-current rounded-[2px]"></div>
                    <div className="bg-current rounded-[2px]"></div><div className="bg-current rounded-[2px]"></div>
                </div>
            </button>
            <button 
                onClick={() => setView('list')}
                className={`p-2.5 rounded-lg transition-all ${view === 'list' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
                <div className="flex flex-col gap-0.5 w-5 h-5 justify-center">
                    <div className="bg-current h-0.5 w-full rounded-full"></div>
                    <div className="bg-current h-0.5 w-full rounded-full"></div>
                    <div className="bg-current h-0.5 w-full rounded-full"></div>
                </div>
            </button>
            </div>
        </div>
      </Card>

      {/* Content */}
      <div className={`grid ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
        <AnimatePresence>
          {filteredProducts.map((product, idx) => {
            const stockPercentage = Math.min(100, (product.stock / (product.minStock * 3)) * 100);
            const isLowStock = product.stock <= product.minStock;
            
            return (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
            >
              {view === 'grid' ? (
                <Card className="h-full flex flex-col !bg-white dark:!bg-[#0F172A]/60 hover:shadow-xl dark:hover:!bg-[#0F172A]/90" noPadding>
                   <div className="p-6 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-2xl shadow-inner">
                                <Box className="text-slate-400 dark:text-gray-400" size={24} />
                            </div>
                            <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${isLowStock ? 'bg-red-100 border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400' : 'bg-emerald-100 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'}`}>
                                {product.status}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 truncate">{product.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-gray-500 font-mono">{product.sku}</p>
                        </div>
                        
                        {/* Visual Stock Bar */}
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-500 dark:text-gray-400">Stock Level</span>
                                <span className="text-slate-900 dark:text-white font-mono">{product.stock} / {product.minStock * 3}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-black/40 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stockPercentage}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className={`h-full rounded-full ${isLowStock ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`} 
                                />
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-400">
                                <MapPin size={14} className="text-blue-500/70" />
                                {product.location}
                            </div>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">${product.price}</span>
                        </div>
                   </div>
                </Card>
              ) : (
                 // List View
                <div className="group relative bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl p-4 flex items-center justify-between transition-all duration-300 hover:border-blue-400/30 dark:hover:border-blue-500/30 shadow-sm dark:shadow-none">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 flex items-center justify-center">
                             <Box className="text-slate-400 dark:text-gray-400" size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">{product.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-gray-500 font-mono">{product.sku}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-8 flex-[2] items-center">
                        <div className="text-sm text-slate-500 dark:text-gray-400 hidden md:block">{product.category}</div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-mono text-slate-900 dark:text-white">{product.stock} Units</span>
                            <div className="w-20 h-1 bg-slate-200 dark:bg-black/40 rounded-full overflow-hidden">
                                <div className={`h-full ${isLowStock ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${stockPercentage}%` }}></div>
                            </div>
                        </div>
                        <div className="text-sm font-mono text-slate-900 dark:text-white">${product.price}</div>
                        <div className="flex justify-end">
                             <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white">
                                <MoreHorizontal size={18} />
                             </button>
                        </div>
                    </div>
                </div>
              )}
            </motion.div>
          )})}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Products;
