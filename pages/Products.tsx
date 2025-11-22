import React, { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, MapPin, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import Card from '../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductsProps {
  products: Product[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Products</h2>
          <p className="text-gray-400">Manage your inventory items and stock levels.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary-glow text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-purple-500/25 transition-all transform hover:scale-105 active:scale-95">
          <Plus size={20} />
          <span>Create Product</span>
        </button>
      </div>

      {/* Filters */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between !bg-glass-100/50">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by Name, SKU..." 
            className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                <div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div><div className="bg-current rounded-sm"></div>
            </div>
          </button>
          <button 
             onClick={() => setView('list')}
             className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
          >
             <div className="flex flex-col gap-0.5 w-5 h-5 justify-center">
                <div className="bg-current h-0.5 w-full rounded-full"></div>
                <div className="bg-current h-0.5 w-full rounded-full"></div>
                <div className="bg-current h-0.5 w-full rounded-full"></div>
            </div>
          </button>
          <div className="w-px h-6 bg-white/10 mx-2"></div>
          <button className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 hover:bg-white/5 rounded-lg transition-all">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </Card>

      {/* Content */}
      <div className={`grid ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
        <AnimatePresence>
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
            >
              {view === 'grid' ? (
                <div className="group relative bg-glass-100 hover:bg-glass-200 border border-glass-border rounded-2xl p-5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  <div className="absolute top-4 right-4">
                    <button className="text-gray-500 hover:text-white transition-colors">
                        <MoreHorizontal size={20} />
                    </button>
                  </div>
                  <div className="mb-4 w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-xl">
                    📦
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                  <p className="text-xs text-gray-400 mb-4 font-mono">{product.sku}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">On Hand</span>
                        <span className={`font-semibold ${product.stock <= product.minStock ? 'text-red-400' : 'text-white'}`}>
                            {product.stock} Units
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Price</span>
                        <span className="text-white">${product.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin size={12} />
                        {product.location}
                    </div>
                    {product.stock <= product.minStock && (
                        <div className="flex items-center gap-1 text-xs text-red-400 font-medium bg-red-400/10 px-2 py-1 rounded-full">
                            <AlertCircle size={12} />
                            Low Stock
                        </div>
                    )}
                  </div>
                </div>
              ) : (
                 // List View
                <div className="bg-glass-100 hover:bg-glass-200 border border-glass-border rounded-xl p-4 flex items-center justify-between transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-lg">📦</div>
                        <div>
                            <h3 className="font-bold text-white">{product.name}</h3>
                            <p className="text-xs text-gray-400 font-mono">{product.sku}</p>
                        </div>
                    </div>
                    <div className="hidden md:block text-sm text-gray-300">{product.category}</div>
                    <div className="text-sm font-mono text-white">{product.stock} Units</div>
                    <div className="text-sm font-mono text-white">${product.price}</div>
                    <div className={`text-xs px-3 py-1 rounded-full ${product.stock <= product.minStock ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {product.status}
                    </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Products;
