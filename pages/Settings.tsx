
import React, { useState } from 'react';
import { MOCK_WAREHOUSES, MOCK_LOCATIONS } from '../constants';
import { Warehouse, MapPin, Save } from 'lucide-react';
import Card from '../components/ui/Card';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'warehouse' | 'locations'>('warehouse');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
         <h2 className="text-3xl font-bold text-white">Settings</h2>
         <p className="text-gray-400">Configure your warehouse and stock locations.</p>
      </div>

      <div className="flex border-b border-white/10">
        <button 
            onClick={() => setActiveTab('warehouse')}
            className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'warehouse' ? 'border-purple-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
            Warehouses
        </button>
        <button 
            onClick={() => setActiveTab('locations')}
            className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'locations' ? 'border-purple-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
            Locations
        </button>
      </div>

      {activeTab === 'warehouse' ? (
          <div className="space-y-6">
             {MOCK_WAREHOUSES.map((wh) => (
                 <Card key={wh.id} className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                            <Warehouse size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Main Warehouse</h3>
                            <p className="text-sm text-gray-400">Primary storage facility</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Warehouse Name</label>
                            <input type="text" defaultValue={wh.name} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Short Code</label>
                            <input type="text" defaultValue={wh.shortCode} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-400">Address</label>
                            <input type="text" defaultValue={wh.address} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button className="flex items-center gap-2 bg-primary hover:bg-primary-glow text-white px-6 py-2 rounded-lg font-medium transition-all">
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                 </Card>
             ))}
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_LOCATIONS.map((loc) => (
                <Card key={loc.id} className="p-6 hover:border-purple-500/50 transition-colors group cursor-pointer">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">{loc.name}</h4>
                                <span className="text-xs font-mono text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded">{loc.shortCode}</span>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
            <button className="border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-all">
                <span className="text-3xl mb-2">+</span>
                <span className="font-medium">Add Location</span>
            </button>
          </div>
      )}
    </div>
  );
};

export default Settings;
