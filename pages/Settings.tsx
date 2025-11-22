import React, { useState } from 'react';
import { MOCK_WAREHOUSES, MOCK_LOCATIONS } from '../constants';
import { Warehouse, MapPin, Save, Loader2 } from 'lucide-react';
import Card from '../components/ui/Card';
import { useToast } from '../context/ToastContext';
import { ShimmerButton } from '../components/ui/ShimmerButton';

const Settings: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'warehouse' | 'locations'>('warehouse');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
        setIsSaving(false);
        showToast('Warehouse settings saved successfully', 'success');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
         <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h2>
         <p className="text-slate-500 dark:text-gray-400">Configure your warehouse and stock locations.</p>
      </div>

      <div className="flex border-b border-slate-200 dark:border-white/10">
        <button 
            onClick={() => setActiveTab('warehouse')}
            className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'warehouse' ? 'border-blue-500 text-blue-600 dark:text-white' : 'border-transparent text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-gray-300'}`}
        >
            Warehouses
        </button>
        <button 
            onClick={() => setActiveTab('locations')}
            className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'locations' ? 'border-blue-500 text-blue-600 dark:text-white' : 'border-transparent text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-gray-300'}`}
        >
            Locations
        </button>
      </div>

      {activeTab === 'warehouse' ? (
          <div className="space-y-6">
             {MOCK_WAREHOUSES.map((wh) => (
                 <Card key={wh.id} className="p-6 !bg-white dark:!bg-[#0F172A]/80" noPadding>
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Warehouse size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Main Warehouse</h3>
                                <p className="text-sm text-slate-500 dark:text-gray-400">Primary storage facility</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-gray-400">Warehouse Name</label>
                                <input type="text" defaultValue={wh.name} className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-gray-400">Short Code</label>
                                <input type="text" defaultValue={wh.shortCode} className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-colors" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-gray-400">Address</label>
                                <input type="text" defaultValue={wh.address} className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-colors" />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <ShimmerButton 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                background="linear-gradient(90deg, #3B82F6, #06B6D4)"
                                shimmerColor="#ffffff"
                                borderRadius="8px"
                            >
                                <div className="flex items-center gap-2 text-white font-bold">
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </div>
                            </ShimmerButton>
                        </div>
                    </div>
                 </Card>
             ))}
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_LOCATIONS.map((loc) => (
                <Card key={loc.id} className="p-6 hover:border-blue-500/50 transition-colors group cursor-pointer !bg-white dark:!bg-[#0F172A]/80" noPadding>
                    <div className="p-6 flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-400 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">{loc.name}</h4>
                                <span className="text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10 px-2 py-0.5 rounded">{loc.shortCode}</span>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
            <button 
                onClick={() => showToast('Location creation form coming soon', 'info')}
                className="border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-white hover:border-blue-400 dark:hover:border-white/30 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
                <span className="text-3xl mb-2">+</span>
                <span className="font-medium">Add Location</span>
            </button>
          </div>
      )}
    </div>
  );
};

export default Settings;
