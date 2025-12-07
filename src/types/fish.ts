import { Timestamp } from 'firebase/firestore';

export interface FishCategory {
  id?: string;
  name: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Fish {
  id?: string;
  categoryId: string;
  categoryName: string;
  name: string;
  unitPrice: number;
  stock?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
