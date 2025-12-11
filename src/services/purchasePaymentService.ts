import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { PurchasePayment, PurchasePaymentFormData } from '../types/purchasePayment';
import { cashService } from './cashService';

const COLLECTION_NAME = 'purchase_payments';
const PURCHASE_USER_ID = 'CEUQM60I32jmou5sA4rU'; // Sabit kullanıcı ID'si satın alımlar için (Dükkan)

class PurchasePaymentService {
  async addPayment(paymentData: PurchasePaymentFormData): Promise<void> {
    // Ödeme kaydı oluştur - undefined alanları temizle
    const cleanPaymentData: Record<string, string | number | Timestamp> = {
      purchaseId: paymentData.purchaseId,
      supplierName: paymentData.supplierName,
      purchaseTotal: paymentData.purchaseTotal,
      paidAmount: paymentData.paidAmount,
      date: Timestamp.fromDate(paymentData.date),
      createdAt: Timestamp.now(),
    };

    // Sadece tanımlı alanları ekle
    if (paymentData.supplierId) {
      cleanPaymentData.supplierId = paymentData.supplierId;
    }
    if (paymentData.notes) {
      cleanPaymentData.notes = paymentData.notes;
    }

    await addDoc(collection(db, COLLECTION_NAME), cleanPaymentData);

    // Kasadan gider olarak düş
    await cashService.addTransaction({
      userId: PURCHASE_USER_ID,
      username: 'Dükkan',
      amount: Number(paymentData.paidAmount),
      type: 'expense',
      description: `${paymentData.supplierName} - Satın Alım Ödemesi`,
    });
  }

  async getAllPayments(): Promise<PurchasePayment[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate().toISOString(),
        createdAt: data.createdAt?.toDate().toISOString(),
      } as PurchasePayment;
    });
  }

  async getPaymentsByPurchase(purchaseId: string): Promise<PurchasePayment[]> {
    const allPayments = await this.getAllPayments();
    return allPayments.filter((p) => p.purchaseId === purchaseId);
  }
}

export const purchasePaymentService = new PurchasePaymentService();
