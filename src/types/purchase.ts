import { Timestamp } from 'firebase/firestore';

export interface PurchaseItem {
  fishTypeId: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  note?: string;
}

export interface Purchase {
  id?: string;
  supplierId?: string;
  
  date: Timestamp;
  monthKey: string;
  year: number;
  
  items: PurchaseItem[];
  
  grossTotal: number;
  discountAmount: number;
  netTotal: number;
  
  shippingCost?: number;
  totalCostWithShipping: number;
  
  notes?: string;
  
  createdAt: Timestamp;
  createdBy?: string;
}
