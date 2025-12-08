import { Timestamp } from 'firebase/firestore';

export interface Tank {
  id?: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface TankFormData {
  name: string;
  code: string;
}

export interface TankStock {
  id?: string;
  tankId: string;
  tankName?: string;
  fishTypeId: string;
  fishTypeName?: string;
  categoryName?: string;
  quantity: number;
  lastUpdated?: Timestamp;
}

export interface TankStockFormData {
  tankId: string;
  fishTypeId: string;
  quantity: number;
}
