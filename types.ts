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

export interface Operation {
  id: string;
  reference: string;
  type: OperationType;
  source: string;
  destination: string;
  status: OperationStatus;
  date: string;
  items: { productId: string; quantity: number }[];
}

export interface KPIData {
  totalProducts: number;
  lowStockItems: number;
  pendingReceipts: number;
  pendingDeliveries: number;
  totalValue: number;
}
