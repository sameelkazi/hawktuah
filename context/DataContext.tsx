
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Operation, Move, Warehouse, Location, KPIData } from '../types';

interface DataContextType {
  products: Product[];
  operations: Operation[];
  moves: Move[];
  warehouses: Warehouse[];
  locations: Location[];
  kpi: KPIData;
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  addOperation: (o: Operation) => void;
  updateOperation: (o: Operation) => void;
  validateOperation: (o: Operation) => void;
  updateWarehouse: (w: Warehouse) => void;
  resetData: () => void;
  simulateScenario: (type: 'crash' | 'viral' | 'hack') => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [moves, setMoves] = useState<Move[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const fetchData = async () => {
    try {
        const [prodRes, opRes, moveRes, whRes, locRes] = await Promise.all([
            fetch('/api/products'),
            fetch('/api/operations'),
            fetch('/api/moves'),
            fetch('/api/warehouses'),
            fetch('/api/locations')
        ]);

        setProducts(await prodRes.json());
        setOperations(await opRes.json());
        setMoves(await moveRes.json());
        setWarehouses(await whRes.json());
        setLocations(await locRes.json());
    } catch (err) {
        console.error("Failed to fetch data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Dynamic KPI Calculation
  const kpi: KPIData = {
    totalProducts: products.length,
    lowStockItems: products.filter(p => p.stock <= p.minStock).length,
    pendingReceipts: operations.filter(o => o.type === 'Receipt' && o.status !== 'Done' && o.status !== 'Cancelled').length,
    pendingDeliveries: operations.filter(o => o.type === 'Delivery' && o.status !== 'Done' && o.status !== 'Cancelled').length,
    totalValue: products.reduce((acc, curr) => acc + (curr.stock * curr.price), 0)
  };

  const addProduct = async (p: Product) => {
      await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(p)
      });
      fetchData();
  };
  
  const updateProduct = async (p: Product) => {
      await fetch(`/api/products/${p.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(p)
      });
      fetchData();
  };
  
  const deleteProduct = async (id: string) => {
      await fetch(`/api/products/${id}`, {
          method: 'DELETE'
      });
      fetchData();
  };

  const addOperation = async (o: Operation) => {
      await fetch('/api/operations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(o)
      });
      fetchData();
  };

  const updateOperation = async (o: Operation) => {
      await fetch(`/api/operations/${o.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(o)
      });
      fetchData();
  };

  const updateWarehouse = async (w: Warehouse) => {
      await fetch(`/api/warehouses/${w.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(w)
      });
      fetchData();
  };

  const resetData = async () => {
    await fetch('/api/reset', { method: 'POST' });
    fetchData();
  };

  // The Core Logic: Processing an operation
  const validateOperation = useCallback(async (o: Operation) => {
      await fetch('/api/operations/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(o)
      });
      fetchData();
  }, []);

  // Simulation Logic for Nexus
  const simulateScenario = async (type: 'crash' | 'viral' | 'hack') => {
      await fetch('/api/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type })
      });
      fetchData();
  };

  return (
    <DataContext.Provider value={{
      products, operations, moves, warehouses, locations, kpi,
      addProduct, updateProduct, deleteProduct,
      addOperation, updateOperation, validateOperation,
      updateWarehouse, resetData, simulateScenario
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
