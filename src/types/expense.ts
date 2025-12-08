import { Timestamp } from 'firebase/firestore';

export type ExpenseCategory = 'kira' | 'elektrik' | 'yem' | 'malzeme' | 'kargo' | 'diğer';
export type PaymentType = 'nakit' | 'kart' | 'havale';

export interface Expense {
  id?: string;
  date: Timestamp;
  monthKey: string;
  year: number;
  category: ExpenseCategory;
  amount: number;
  description?: string;
  paymentType?: PaymentType;
  relatedPartyId?: string;
  userId?: string;
  userName?: string;
  createdAt?: Timestamp;
  createdBy?: string;
}

export interface ExpenseFormData {
  date: Date;
  category: ExpenseCategory | string;
  amount: number;
  description?: string;
  paymentType?: PaymentType | string;
  relatedPartyId?: string;
  userId?: string;
}
