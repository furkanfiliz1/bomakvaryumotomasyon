import { Timestamp } from 'firebase/firestore';

export interface PurchasePayment {
  id?: string;
  purchaseId: string;
  supplierId?: string;
  supplierName: string;
  purchaseTotal: number;
  paidAmount: number;
  date: Date | Timestamp;
  notes?: string;
  createdAt?: Timestamp;
}

export interface PurchasePaymentFormData {
  purchaseId: string;
  supplierId?: string;
  supplierName: string;
  purchaseTotal: number;
  paidAmount: number;
  date: Date;
  notes?: string;
}
