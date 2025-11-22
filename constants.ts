
import { Product, Operation, Move, Warehouse, Location } from './types';

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Steel Rods 10mm', sku: 'ST-1001', category: 'Raw Material', stock: 150, minStock: 50, price: 12.50, location: 'Rack A1', status: 'In Stock' },
  { id: '2', name: 'Aluminum Sheet', sku: 'AL-2002', category: 'Raw Material', stock: 20, minStock: 30, price: 45.00, location: 'Rack A2', status: 'Low Stock' },
  { id: '3', name: 'Office Chair X1', sku: 'FUR-3001', category: 'Furniture', stock: 0, minStock: 10, price: 120.00, location: 'Warehouse B', status: 'Out of Stock' },
  { id: '4', name: 'Copper Wire 50m', sku: 'EL-4005', category: 'Electronics', stock: 500, minStock: 100, price: 8.00, location: 'Rack C1', status: 'In Stock' },
  { id: '5', name: 'Industrial Glue', sku: 'CH-5001', category: 'Chemicals', stock: 45, minStock: 20, price: 15.50, location: 'Safe Zone', status: 'In Stock' },
];

export const MOCK_OPERATIONS: Operation[] = [
  { id: '1', reference: 'WH/IN/0001', type: 'Receipt', source: 'Vendor: SteelCo', destination: 'WH/Stock', contact: 'SteelCo Inc.', status: 'Done', scheduleDate: '2023-10-25', items: [{ productId: '1', quantity: 50, done: 50 }] },
  { id: '2', reference: 'WH/OUT/0001', type: 'Delivery', source: 'WH/Stock', destination: 'Customer: Acme Inc', contact: 'Acme Inc.', status: 'Ready', scheduleDate: '2023-10-26', items: [{ productId: '3', quantity: 10, done: 0 }] },
  { id: '3', reference: 'WH/INT/0001', type: 'Internal', source: 'WH/Stock', destination: 'WH/Production', contact: 'Internal', status: 'Draft', scheduleDate: '2023-10-27', items: [{ productId: '1', quantity: 20, done: 0 }] },
  { id: '4', reference: 'WH/IN/0002', type: 'Receipt', source: 'Vendor: AluWorld', destination: 'WH/Stock', contact: 'AluWorld Ltd.', status: 'Waiting', scheduleDate: '2023-10-28', items: [{ productId: '2', quantity: 100, done: 0 }] },
  { id: '5', reference: 'WH/ADJ/0001', type: 'Adjustment', source: 'Virtual Loss', destination: 'WH/Stock', contact: 'System', status: 'Done', scheduleDate: '2023-10-24', items: [{ productId: '2', quantity: 3, done: 3 }] },
  { id: '6', reference: 'WH/OUT/0002', type: 'Delivery', source: 'WH/Stock', destination: 'Customer: Globex', contact: 'Globex Corp', status: 'Waiting', scheduleDate: '2023-10-29', items: [{ productId: '4', quantity: 50, done: 0 }] },
];

export const MOCK_MOVES: Move[] = [
  { id: '1', reference: 'WH/IN/0001', date: '2023-10-25 10:30', product: '[ST-1001] Steel Rods 10mm', from: 'Vendor', to: 'WH/Stock', quantity: 50, status: 'Done', contact: 'SteelCo Inc.', type: 'in' },
  { id: '2', reference: 'WH/ADJ/0001', date: '2023-10-24 14:15', product: '[AL-2002] Aluminum Sheet', from: 'Virtual Loss', to: 'WH/Stock', quantity: 3, status: 'Done', contact: 'System', type: 'internal' },
  { id: '3', reference: 'WH/OUT/0000', date: '2023-10-20 09:00', product: '[FUR-3001] Office Chair X1', from: 'WH/Stock', to: 'Customer', quantity: 5, status: 'Done', contact: 'Previous Customer', type: 'out' },
];

export const MOCK_WAREHOUSES: Warehouse[] = [
  { id: '1', name: 'Main Warehouse', shortCode: 'WH', address: '123 Industrial Parkway, NY' },
];

export const MOCK_LOCATIONS: Location[] = [
  { id: '1', name: 'Stock', shortCode: 'Stock', warehouseId: '1' },
  { id: '2', name: 'Input', shortCode: 'IN', warehouseId: '1' },
  { id: '3', name: 'Output', shortCode: 'OUT', warehouseId: '1' },
  { id: '4', name: 'Quality Control', shortCode: 'QC', warehouseId: '1' },
];
