import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Purchase } from '../types/purchase';

export const purchaseService = {
  // Get all purchases
  getAllPurchases: async (): Promise<Purchase[]> => {
    try {
      const purchasesRef = collection(db, 'purchases');
      const q = query(purchasesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as unknown as Purchase[];
    } catch (error) {
      console.error('Error getting purchases:', error);
      throw error;
    }
  },

  // Add a new purchase
  addPurchase: async (purchaseData: Omit<Purchase, 'id' | 'createdAt'>): Promise<string> => {
    try {
      const purchasesRef = collection(db, 'purchases');
      const docRef = await addDoc(purchasesRef, {
        ...purchaseData,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding purchase:', error);
      throw error;
    }
  },

  // Update a purchase
  updatePurchase: async (id: string, purchaseData: Partial<Purchase>): Promise<void> => {
    try {
      const purchaseRef = doc(db, 'purchases', id);
      await updateDoc(purchaseRef, purchaseData);
    } catch (error) {
      console.error('Error updating purchase:', error);
      throw error;
    }
  },

  // Delete a purchase
  deletePurchase: async (id: string): Promise<void> => {
    try {
      const purchaseRef = doc(db, 'purchases', id);
      await deleteDoc(purchaseRef);
    } catch (error) {
      console.error('Error deleting purchase:', error);
      throw error;
    }
  },
};
