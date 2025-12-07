import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { Sale, SaleFormData } from '../types/sale';

const COLLECTION_NAME = 'sales';

export const salesService = {
  // Satış Ekleme
  async addSale(sale: SaleFormData): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...sale,
      date: Timestamp.fromDate(sale.date),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Satış Güncelleme
  async updateSale(id: string, data: Partial<SaleFormData>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { ...data, updatedAt: Timestamp.now() };
    
    if (data.date) {
      updateData.date = Timestamp.fromDate(data.date);
    }
    
    await updateDoc(docRef, updateData);
  },

  // Satış Silme
  async deleteSale(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  // Tüm Satışları Getirme
  async getAllSales(): Promise<Sale[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    const sales: Sale[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sales.push({
        id: doc.id,
        customerId: data.customerId || '',
        customerName: data.customerName || '',
        date: data.date,
        items: data.items || [],
        subtotal: data.subtotal || 0,
        discount: data.discount || 0,
        total: data.total || 0,
        notes: data.notes || '',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    return sales;
  },
};
