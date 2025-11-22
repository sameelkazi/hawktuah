import React, { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Operations from './pages/Operations';
import { MOCK_PRODUCTS, MOCK_OPERATIONS } from './constants';
import { Menu, Bell, Search, User } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate initial data load animation
  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  // Calculated KPIs
  const kpi = {
    totalProducts: MOCK_PRODUCTS.length,
    lowStockItems: MOCK_PRODUCTS.filter(p => p.stock <= p.minStock).length,
    pendingReceipts: MOCK_OPERATIONS.filter(o => o.type === 'Receipt' && o.status !== 'Done').length,
    pendingDeliveries: MOCK_OPERATIONS.filter(o => o.type === 'Delivery' && o.status !== 'Done').length,
    totalValue: MOCK_PRODUCTS.reduce((acc, curr) => acc + (curr.stock * curr.price), 0)
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard kpi={kpi} products={MOCK_PRODUCTS} />;
      case 'products': return <Products products={MOCK_PRODUCTS} />;
      case 'operations': return <Operations operations={MOCK_OPERATIONS} />;
      default: return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
            <p>This module is currently under development.</p>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0f0e17] flex items-center justify-center z-50">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-t-4 border-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-r-4 border-pink-500 rounded-full animate-spin animation-delay-150"></div>
          <div className="absolute inset-4 border-b-4 border-cyan-500 rounded-full animate-spin animation-delay-300"></div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#0f0e17] text-white font-sans selection:bg-purple-500/30">
        {/* Background Elements */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 flex">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isMobileOpen={isMobileMenuOpen}
            toggleMobile={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
          
          <main className="flex-1 min-w-0 transition-all duration-300">
            {/* Top Bar */}
            <header className="sticky top-0 z-30 px-6 py-4 bg-[#0f0e17]/80 backdrop-blur-lg border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4 md:hidden">
                <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-400 hover:text-white">
                  <Menu />
                </button>
                <span className="font-bold text-lg">StockMaster</span>
              </div>

              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-96 focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:bg-white/10 transition-all">
                <Search size={18} className="text-gray-400 mr-3" />
                <input type="text" placeholder="Global search..." className="bg-transparent border-none focus:outline-none text-sm w-full text-white placeholder-gray-500" />
                <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500 border border-white/10 rounded px-1.5 py-0.5">⌘</span>
                    <span className="text-xs text-gray-500 border border-white/10 rounded px-1.5 py-0.5">K</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                <div className="hidden md:flex items-center gap-3 pl-4 border-l border-white/10">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">Alex Morgan</p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[2px]">
                    <div className="w-full h-full rounded-full bg-[#0f0e17] flex items-center justify-center overflow-hidden">
                        <img src="https://picsum.photos/100/100" alt="User" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
