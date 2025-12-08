export interface Collection {
  id?: string;
  saleId: string;
  customerId: string;
  customerName: string;
  saleTotal: number;
  collectedAmount: number;
  date: string;
  notes?: string;
  createdAt?: string;
}

export interface CollectionFormData {
  saleId: string;
  customerId: string;
  customerName: string;
  saleTotal: number;
  collectedAmount: number;
  date: Date;
  notes?: string;
}
