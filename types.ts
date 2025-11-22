
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  location: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export type OperationType = 'Receipt' | 'Delivery' | 'Internal' | 'Adjustment';
export type OperationStatus = 'Draft' | 'Waiting' | 'Ready' | 'Done' | 'Cancelled';

export interface OperationItem {
  productId: string;
  quantity: number;
  done: number;
}

export interface Operation {
  id: string;
  reference: string;
  type: OperationType;
  source: string;
  destination: string;
  contact: string;
  status: OperationStatus;
  scheduleDate: string;
  items: OperationItem[];
}

export interface Move {
  id: string;
  reference: string;
  date: string;
  product: string;
  from: string;
  to: string;
  quantity: number;
  status: 'Done' | 'Cancelled';
  contact: string;
  type: 'in' | 'out' | 'internal';
}

export interface Warehouse {
  id: string;
  name: string;
  shortCode: string;
  address: string;
}

export interface Location {
  id: string;
  name: string;
  shortCode: string;
  warehouseId: string;
}

export interface KPIData {
  totalProducts: number;
  lowStockItems: number;
  pendingReceipts: number;
  pendingDeliveries: number;
  totalValue: number;
}
