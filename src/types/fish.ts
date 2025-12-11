import { Timestamp } from 'firebase/firestore';

export interface FishCategory {
  id?: string;
  name: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type FishSize = 'small' | 'medium' | 'large';

export interface Fish {
  id?: string;
  categoryId: string;
  categoryName: string;
  name: string;
  unitPrice: number;
  stock?: number;
  availableSizes?: FishSize[]; // ['small', 'medium', 'large']
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
