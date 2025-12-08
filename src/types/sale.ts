import { Timestamp } from 'firebase/firestore';

export type SaleStatus = 'pending' | 'partial' | 'paid';

export interface SaleItem {
  fishId: string;
  fishName: string;
  categoryName: string;
  quantity: number;
  gift: number;
  mortality: number;
  soldQuantity: number;
  unitPrice: number;
  total: number;
  tankId?: string; // NEW: tank where fish come from
}

export interface Sale {
  id?: string;
  customerId: string;
  customerName: string;
  date: Timestamp;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  
  // NEW: Payment tracking fields
  paidAmount?: number;
  remainingAmount?: number;
  status?: SaleStatus;
}

export interface SaleFormData {
  customerId: string;
  customerName: string;
  date: Date;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  notes?: string;
}
