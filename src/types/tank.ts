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
  size?: 'small' | 'medium' | 'large'; // Balık boyu
  quantity: number;
  unitCost?: number; // Birim maliyet (0 = kendi üretim)
  totalCost?: number; // Toplam maliyet (quantity * unitCost)
  deathCount?: number; // Toplam ölü balık sayısı
  totalDeathLoss?: number; // Ölümlerden kaynaklanan toplam zarar (deathCount * unitCost)
  lastUpdated?: Timestamp;
}

export interface TankStockFormData {
  tankId: string;
  fishTypeId: string;
  quantity: number;
}
