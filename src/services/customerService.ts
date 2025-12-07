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
import { Customer } from '../types/customer';

const COLLECTION_NAME = 'customers';

export const customerService = {
  // Müşteri Ekleme
  async addCustomer(customer: { name: string; type: string | number; phone?: string; city?: string; notes?: string }): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...customer,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Müşteri Güncelleme
  async updateCustomer(id: string, data: { name?: string; type?: string | number; phone?: string; city?: string; notes?: string }): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  },

  // Müşteri Silme
  async deleteCustomer(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  // Tüm Müşterileri Getirme
  async getAllCustomers(): Promise<Customer[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
    const querySnapshot = await getDocs(q);

    const customers: Customer[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      customers.push({
        id: doc.id,
        name: data.name || '',
        type: data.type || 'bireysel',
        phone: data.phone || '',
        city: data.city || '',
        notes: data.notes || '',
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      });
    });

    return customers;
  },
};
