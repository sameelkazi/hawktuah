
import React, { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, MapPin, Box, ScanBarcode, ArrowUpDown } from 'lucide-react';
import { Product } from '../types';
import Card from '../components/ui/Card';
import { ShimmerButton } from '../components/ui/ShimmerButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';

interface ProductsProps {
  products: Product[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = products.filter(p => 
    (activeCategory === 'All' || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const categories = ['All', 'Raw Material', 'Furniture', 'Electronics', 'Chemicals', 'Tools', 'Packaging'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Inventory</h2>
          <p className="text-slate-500 dark:text-gray-400 mt-1">Global stock tracking and SKU management.</p>
        </div>
        <div className="flex gap-3">
             <button className="px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-colors flex items-center gap-2 font-medium">
                <ScanBarcode size={20} />
                <span className="hidden sm:inline">Scan Item</span>
             </button>
             <ShimmerButton 
                onClick={() => showToast('Product creation wizard coming soon!', 'info')}
                className="shadow-lg shadow-blue-500/20"
                background="linear-gradient(to right, #2563EB, #06B6D4)"
                shimmerColor="#ffffff"
                shimmerSize="0.1em"
                borderRadius="0.75rem"
             >
                <div className="flex items-center gap-2 text-white">
                   <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                   <span className="font-medium">Add Product</span>
                </div>
             </ShimmerButton>
        </div>
      </div>

      {/* Controls Section */}
      <div className="sticky top-20 z-20 space-y-4 bg-slate-50/80 dark:bg-[#020617]/80 backdrop-blur-xl py-4 -mx-4 px-4 md:mx-0 md:px-0 md:bg-transparent md:backdrop-blur-none transition-colors">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                <div className="relative bg-white dark:bg-[#0F172A] rounded-xl flex items-center border border-slate-200 dark:border-white/10 focus-within:border-blue-500 dark:focus-within:border-blue-500 transition-colors shadow-sm">
                    <Search className="ml-4 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by name, SKU, or tag..." 
                        className="w-full bg-transparent py-3.5 pl-3 pr-4 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-gray-500 focus:outline-none font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                 <div className="hidden md:flex items-center gap-2 mr-2">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <Filter size={16} />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <ArrowUpDown size={16} />
                        Sort
                    </button>
                 </div>
                 <div className="bg-white dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10 flex items-center">
                    <button 
                        onClick={() => setView('grid')}
                        className={`p-2.5 rounded-lg transition-all ${view === 'grid' ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                            <div className="bg-current rounded-[2px]"></div><div className="bg-current rounded-[2px]"></div>
                            <div className="bg-current rounded-[2px]"></div><div className="bg-current rounded-[2px]"></div>
                        </div>
                    </button>
                    <button 
                        onClick={() => setView('list')}
                        className={`p-2.5 rounded-lg transition-all ${view === 'list' ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        <div className="flex flex-col gap-0.5 w-5 h-5 justify-center">
                            <div className="bg-current h-0.5 w-full rounded-full"></div>
                            <div className="bg-current h-0.5 w-full rounded-full"></div>
                            <div className="bg-current h-0.5 w-full rounded-full"></div>
                        </div>
                    </button>
                 </div>
            </div>
          </div>

          {/* Horizontal Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                        activeCategory === cat 
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg' 
                        : 'bg-white dark:bg-white/5 text-slate-600 dark:text-gray-400 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10'
                    }`}
                  >
                      {cat}
                  </button>
              ))}
          </div>
      </div>

      {/* Content Grid/List */}
      <div className={`grid ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, idx) => {
            const stockPercentage = Math.min(100, (product.stock / (product.minStock * 3)) * 100);
            const isLowStock = product.stock <= product.minStock;
            const isOutStock = product.stock === 0;
            
            return (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
            >
              {view === 'grid' ? (
                <Card className="h-full flex flex-col !bg-white dark:!bg-[#0F172A]/60 hover:shadow-xl dark:hover:!bg-[#0F172A]/90 group" noPadding>
                    {/* Hover Glitch Effect Border */}
                   <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/30 transition-colors pointer-events-none z-10"></div>
                   
                   <div className="p-6 flex flex-col h-full relative z-0">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-gray-400 shadow-inner relative overflow-hidden">
                                <Box size={24} strokeWidth={1.5} />
                                {isLowStock && <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>}
                            </div>
                            <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                isOutStock ? 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-white/5 dark:border-white/10 dark:text-gray-500' :
                                isLowStock ? 'bg-red-100 border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400' : 
                                'bg-emerald-100 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
                            }`}>
                                {product.status}
                            </div>
                        </div>

                        <div className="mb-6 flex-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{product.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-gray-500 font-mono bg-slate-100 dark:bg-white/5 inline-block px-1.5 py-0.5 rounded">{product.sku}</p>
                        </div>
                        
                        {/* Stock Visual */}
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-xs mb-1 font-medium">
                                <span className="text-slate-500 dark:text-gray-400">Available</span>
                                <span className={`${isLowStock ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{product.stock} Units</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stockPercentage}%` }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className={`h-full rounded-full ${isLowStock ? 'bg-red-500' : 'bg-blue-500'}`} 
                                />
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-400">
                                <MapPin size={14} className="text-slate-400" />
                                {product.location}
                            </div>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                        </div>
                   </div>
                </Card>
              ) : (
                 // List View
                <div className="group relative bg-white dark:bg-[#0F172A]/60 hover:bg-slate-50 dark:hover:bg-[#0F172A]/80 border border-slate-200 dark:border-white/5 rounded-xl p-4 flex items-center justify-between transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-500/30 shadow-sm dark:shadow-none">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex items-center gap-5 flex-[2]">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400">
                             <Box size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">{product.name}</h3>
                            <div className="flex gap-2 mt-0.5">
                                <span className="text-xs text-slate-500 dark:text-gray-500 font-mono bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded">{product.sku}</span>
                                <span className="text-xs text-slate-400 dark:text-gray-600">•</span>
                                <span className="text-xs text-slate-500 dark:text-gray-400">{product.category}</span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center justify-between flex-[3] gap-8">
                        <div className="flex flex-col gap-1 w-32">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Stock</span>
                                <span className={`font-bold ${isLowStock ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{product.stock}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full ${isLowStock ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${stockPercentage}%` }}></div>
                            </div>
                        </div>
                        
                        <div className="text-right w-24">
                             <span className="text-sm font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                        </div>

                        <div className="w-24 text-right">
                            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${
                                isLowStock ? 'bg-red-50 border-red-100 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400' : 
                                'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
                            }`}>
                                {product.status === 'Low Stock' ? 'Low' : 'OK'}
                            </span>
                        </div>
                    </div>
                    
                    <button className="ml-4 p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white">
                        <MoreHorizontal size={20} />
                    </button>
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
