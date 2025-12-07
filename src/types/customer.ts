export type CustomerType = 'arabacı' | 'petshop' | 'bireysel';

export interface Customer {
  id?: string;
  name: string;
  type: CustomerType;
  phone?: string;
  city?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomerFormData {
  name: string;
  type: CustomerType;
  phone?: string;
  city?: string;
  notes?: string;
}
