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
  getDoc,
} from 'firebase/firestore';
import { Sale, SaleFormData } from '../types/sale';
import { tankService } from './tankService';

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
    // Önce satışı getir
    const saleRef = doc(db, COLLECTION_NAME, id);
    const saleDoc = await getDoc(saleRef);
    
    if (!saleDoc.exists()) {
      throw new Error('Satış bulunamadı');
    }

    const saleData = saleDoc.data() as Sale;
    
    // Satıştaki her bir balığı stoka geri ekle
    if (saleData.items && saleData.items.length > 0) {
      for (const item of saleData.items) {
        // tankId varsa stoku geri ekle
        if (item.tankId) {
          try {
            // Satılan miktarı (quantity + gift) geri ekle
            const returnQuantity = Number(item.quantity) + Number(item.gift);
            if (returnQuantity > 0) {
              await tankService.updateTankStock(
                item.tankId,
                '', // tankName - tankService içinde güncellenir
                item.fishId,
                item.fishName,
                item.categoryName,
                returnQuantity // Pozitif değer - stoka ekleme
              );
            }
          } catch (error) {
            console.error('Stok geri ekleme hatası:', error);
            // Hata durumunda devam et, silme işlemini durdurma
          }
        }
      }
    }

    // Satışı sil
    await deleteDoc(saleRef);
  },

  // Tüm Satışları Getirme
  async getAllSales(): Promise<Sale[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
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
        subtotal: Number(data.subtotal) || 0,
        discount: Number(data.discount) || 0,
        total: Number(data.total) || 0,
        notes: data.notes || '',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    return sales;
  },
};
