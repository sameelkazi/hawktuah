
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Operation, Move, Warehouse, Location, KPIData } from '../types';
import { MOCK_PRODUCTS, MOCK_OPERATIONS, MOCK_MOVES, MOCK_WAREHOUSES, MOCK_LOCATIONS } from '../constants';

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
  // Initialize state from localStorage or fall back to mocks
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sm_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });

  const [operations, setOperations] = useState<Operation[]>(() => {
    const saved = localStorage.getItem('sm_operations');
    return saved ? JSON.parse(saved) : MOCK_OPERATIONS;
  });

  const [moves, setMoves] = useState<Move[]>(() => {
    const saved = localStorage.getItem('sm_moves');
    return saved ? JSON.parse(saved) : MOCK_MOVES;
  });

  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => {
    const saved = localStorage.getItem('sm_warehouses');
    return saved ? JSON.parse(saved) : MOCK_WAREHOUSES;
  });

  const [locations, setLocations] = useState<Location[]>(() => {
    const saved = localStorage.getItem('sm_locations');
    return saved ? JSON.parse(saved) : MOCK_LOCATIONS;
  });

  // Persist to localStorage on change
  useEffect(() => localStorage.setItem('sm_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('sm_operations', JSON.stringify(operations)), [operations]);
  useEffect(() => localStorage.setItem('sm_moves', JSON.stringify(moves)), [moves]);
  useEffect(() => localStorage.setItem('sm_warehouses', JSON.stringify(warehouses)), [warehouses]);
  useEffect(() => localStorage.setItem('sm_locations', JSON.stringify(locations)), [locations]);

  // Dynamic KPI Calculation
  const kpi: KPIData = {
    totalProducts: products.length,
    lowStockItems: products.filter(p => p.stock <= p.minStock).length,
    pendingReceipts: operations.filter(o => o.type === 'Receipt' && o.status !== 'Done' && o.status !== 'Cancelled').length,
    pendingDeliveries: operations.filter(o => o.type === 'Delivery' && o.status !== 'Done' && o.status !== 'Cancelled').length,
    totalValue: products.reduce((acc, curr) => acc + (curr.stock * curr.price), 0)
  };

  const addProduct = (p: Product) => setProducts(prev => [...prev, p]);
  
  const updateProduct = (p: Product) => setProducts(prev => prev.map(prod => prod.id === p.id ? p : prod));
  
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  const addOperation = (o: Operation) => setOperations(prev => [o, ...prev]);

  const updateOperation = (o: Operation) => setOperations(prev => prev.map(op => op.id === o.id ? o : op));

  const updateWarehouse = (w: Warehouse) => setWarehouses(prev => prev.map(wh => wh.id === w.id ? w : wh));

  const resetData = () => {
    setProducts(MOCK_PRODUCTS);
    setOperations(MOCK_OPERATIONS);
    setMoves(MOCK_MOVES);
    setWarehouses(MOCK_WAREHOUSES);
    setLocations(MOCK_LOCATIONS);
  };

  // The Core Logic: Processing an operation
  const validateOperation = useCallback((op: Operation) => {
    if (op.status === 'Done') return;

    // 1. Update Operation Status
    const completedOp = { ...op, status: 'Done' as const };
    setOperations(prev => prev.map(o => o.id === op.id ? completedOp : o));

    // 2. Update Stocks & Create Moves
    const newMoves: Move[] = [];
    const productUpdates = new Map<string, number>();

    op.items.forEach(item => {
      // Determine direction
      let qtyChange = 0;
      let moveType: 'in' | 'out' | 'internal' = 'internal';
      
      if (op.type === 'Receipt') {
        qtyChange = item.done;
        moveType = 'in';
      } else if (op.type === 'Delivery') {
        qtyChange = -item.done;
        moveType = 'out';
      } else if (op.type === 'Adjustment') {
        // For adjustment, assume 'done' is the added/removed amount (can be negative)
        qtyChange = item.done;
        moveType = item.done >= 0 ? 'in' : 'out';
      } else if (op.type === 'Internal') {
        // Internal doesn't change total stock count in this simple model, 
        // but in a real app would change location. 
        // For now we assume it just validates.
        qtyChange = 0; 
        moveType = 'internal';
      }

      productUpdates.set(item.productId, qtyChange);

      // Create Move Record
      const product = products.find(p => p.id === item.productId);
      if (product) {
        newMoves.push({
          id: Date.now().toString() + Math.random().toString(),
          reference: op.reference,
          date: new Date().toLocaleString(),
          product: `[${product.sku}] ${product.name}`,
          from: op.source,
          to: op.destination,
          quantity: Math.abs(item.done),
          status: 'Done',
          contact: op.contact,
          type: moveType
        });
      }
    });

    // Apply Stock Updates
    setProducts(prev => prev.map(p => {
      const change = productUpdates.get(p.id);
      if (change !== undefined && change !== 0) {
        const newStock = Math.max(0, p.stock + change);
        const newStatus = newStock === 0 ? 'Out of Stock' : newStock <= p.minStock ? 'Low Stock' : 'In Stock';
        return { ...p, stock: newStock, status: newStatus as any };
      }
      return p;
    }));

    // Add Moves
    setMoves(prev => [...newMoves, ...prev]);

  }, [products]);

  // Simulation Logic for Nexus
  const simulateScenario = (type: 'crash' | 'viral' | 'hack') => {
    if (type === 'crash') {
        // Reduce stock of high value items, simulating cancelled orders or loss
        setProducts(prev => prev.map(p => {
            if (Math.random() > 0.5) return p; // Affect 50% of items
            const loss = Math.floor(p.stock * 0.3); // Lose 30%
            return { ...p, stock: p.stock - loss, status: (p.stock - loss) <= p.minStock ? 'Low Stock' : p.status };
        }));
    } else if (type === 'viral') {
        // Drastically reduce stock (sales surge)
        setProducts(prev => prev.map(p => {
            if (p.category !== 'Electronics' && Math.random() > 0.3) return p;
            const sales = Math.floor(p.stock * 0.6); // Sell 60%
            return { ...p, stock: p.stock - sales, status: (p.stock - sales) <= p.minStock ? 'Low Stock' : p.status };
        }));
    } else if (type === 'hack') {
        // Randomize stock levels to simulate data corruption
        setProducts(prev => prev.map(p => ({
            ...p, 
            stock: Math.floor(Math.random() * 500),
            status: 'In Stock'
        })));
    }
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
