import { Product, Operation } from './types';

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Steel Rods 10mm', sku: 'ST-1001', category: 'Raw Material', stock: 150, minStock: 50, price: 12.50, location: 'Rack A1', status: 'In Stock' },
  { id: '2', name: 'Aluminum Sheet', sku: 'AL-2002', category: 'Raw Material', stock: 20, minStock: 30, price: 45.00, location: 'Rack A2', status: 'Low Stock' },
  { id: '3', name: 'Office Chair X1', sku: 'FUR-3001', category: 'Furniture', stock: 0, minStock: 10, price: 120.00, location: 'Warehouse B', status: 'Out of Stock' },
  { id: '4', name: 'Copper Wire 50m', sku: 'EL-4005', category: 'Electronics', stock: 500, minStock: 100, price: 8.00, location: 'Rack C1', status: 'In Stock' },
  { id: '5', name: 'Industrial Glue', sku: 'CH-5001', category: 'Chemicals', stock: 45, minStock: 20, price: 15.50, location: 'Safe Zone', status: 'In Stock' },
];

export const MOCK_OPERATIONS: Operation[] = [
  { id: '1', reference: 'WH/IN/0001', type: 'Receipt', source: 'Vendor: SteelCo', destination: 'Stock', status: 'Done', date: '2023-10-25', items: [{ productId: '1', quantity: 50 }] },
  { id: '2', reference: 'WH/OUT/0001', type: 'Delivery', source: 'Stock', destination: 'Customer: Acme Inc', status: 'Ready', date: '2023-10-26', items: [{ productId: '3', quantity: 10 }] },
  { id: '3', reference: 'WH/INT/0001', type: 'Internal', source: 'Rack A1', destination: 'Production Floor', status: 'Draft', date: '2023-10-27', items: [{ productId: '1', quantity: 20 }] },
  { id: '4', reference: 'WH/IN/0002', type: 'Receipt', source: 'Vendor: AluWorld', destination: 'Stock', status: 'Waiting', date: '2023-10-28', items: [{ productId: '2', quantity: 100 }] },
  { id: '5', reference: 'WH/ADJ/0001', type: 'Adjustment', source: 'Virtual Loss', destination: 'Stock', status: 'Done', date: '2023-10-24', items: [{ productId: '2', quantity: -3 }] },
];
