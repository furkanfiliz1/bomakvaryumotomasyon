import { Timestamp } from 'firebase/firestore';

export interface PurchaseItem {
  fishTypeId: string;
  size?: 'small' | 'medium' | 'large'; // Balık boyu
  qty: number;
  unitPrice: number; // Satın alma fiyatı
  unitCost?: number; // Stok maliyeti (birim başına, 0 = kendi üretim)
  lineTotal: number;
  note?: string;
  tankId?: string; // NEW: tank where fish will be placed
}

export interface Purchase {
  id?: string;
  supplierId?: string;
  
  date: Timestamp;
  monthKey: string;
  year: number;
  
  items: PurchaseItem[];
  
  grossTotal: number;
  travelCost?: number;
  totalCostWithShipping: number;
  
  notes?: string;
  
  createdAt: Timestamp;
  createdBy?: string;
}
