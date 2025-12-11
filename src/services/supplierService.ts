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
import { Supplier } from '../types/supplier';

const COLLECTION_NAME = 'suppliers';

export const supplierService = {
  // Tedarikçi Ekleme
  async addSupplier(supplier: {
    name: string;
    fishIds: string[];
    phone?: string;
    address?: string;
    notes?: string;
  }): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...supplier,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Tedarikçi Güncelleme
  async updateSupplier(
    id: string,
    data: {
      name?: string;
      fishIds?: string[];
      phone?: string;
      address?: string;
      notes?: string;
    },
  ): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  },

  // Tedarikçi Silme
  async deleteSupplier(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  // Tüm Tedarikçileri Getirme
  async getAllSuppliers(): Promise<Supplier[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);

    const suppliers: Supplier[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      suppliers.push({
        id: docSnap.id,
        name: data.name || '',
        fishIds: data.fishIds || [],
        phone: data.phone || '',
        address: data.address || '',
        notes: data.notes || '',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    return suppliers;
  },

  // Tek Tedarikçi Getirme
  async getSupplierById(id: string): Promise<Supplier | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name || '',
      fishIds: data.fishIds || [],
      phone: data.phone || '',
      address: data.address || '',
      notes: data.notes || '',
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};
