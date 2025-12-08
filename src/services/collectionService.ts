import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Collection, CollectionFormData } from '../types/collection';
import { cashService } from './cashService';

const COLLECTION_NAME = 'collections';
const SALES_USER_ID = 'CEUQM60I32jmou5sA4rU'; // Sabit kullanıcı ID'si satışlar için

class CollectionService {
  async addCollection(collectionData: CollectionFormData): Promise<void> {
    // Tahsilat kaydı oluştur
    await addDoc(collection(db, COLLECTION_NAME), {
      ...collectionData,
      date: Timestamp.fromDate(collectionData.date),
      createdAt: Timestamp.now(),
    });

    // Kasaya gelir olarak ekle
    await cashService.addTransaction({
      userId: SALES_USER_ID,
      username: 'Satışlar',
      amount: collectionData.collectedAmount,
      type: 'income',
      description: `${collectionData.customerName} - Satış Tahsilatı`,
    });
  }

  async getAllCollections(): Promise<Collection[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate().toISOString(),
        createdAt: data.createdAt?.toDate().toISOString(),
      } as Collection;
    });
  }

  async getCollectionsBySale(saleId: string): Promise<Collection[]> {
    const allCollections = await this.getAllCollections();
    return allCollections.filter((c) => c.saleId === saleId);
  }
}

export const collectionService = new CollectionService();
