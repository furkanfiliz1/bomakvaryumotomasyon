import { Timestamp } from 'firebase/firestore';

export interface Supplier {
  id?: string;
  name: string;
  fishIds: string[]; // Tedarikçinin ürettiği balık türleri
  phone?: string;
  address?: string;
  notes?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
