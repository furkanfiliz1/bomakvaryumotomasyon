import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore';

export interface FirestoreResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Firestore servisleri - CRUD işlemleri
 */
export class FirestoreService {
  /**
   * Koleksiyondaki tüm dökümanları al
   */
  static async getCollection<T>(
    collectionName: string
  ): Promise<FirestoreResponse<T[]>> {
    try {
      console.log(`🔄 Getting collection: ${collectionName}`);
      
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);

      const data: T[] = [];
      snapshot.forEach((doc) => {
        const docData = doc.data();
        data.push({
          id: doc.id,
          ...docData,
          // Timestamp'lari Date'e çevir
          createdAt: docData.createdAt?.toDate?.() || docData.createdAt,
          updatedAt: docData.updatedAt?.toDate?.() || docData.updatedAt,
        } as T);
      });

      console.log(`✅ Collection ${collectionName} loaded:`, data.length, 'documents');
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`❌ getCollection error for ${collectionName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      };
    }
  }

  /**
   * ID'ye göre tek döküman al
   */
  static async getDocument<T>(
    collectionName: string,
    documentId: string
  ): Promise<FirestoreResponse<T>> {
    try {
      console.log(`🔍 Getting document: ${collectionName}/${documentId}`);
      
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const docData = docSnap.data();
        const data = {
          id: docSnap.id,
          ...docData,
          createdAt: docData.createdAt?.toDate?.() || docData.createdAt,
          updatedAt: docData.updatedAt?.toDate?.() || docData.updatedAt,
        } as T;

        console.log(`✅ Document found:`, data);
        
        return {
          success: true,
          data,
        };
      } else {
        console.log(`⚠️ Document not found: ${collectionName}/${documentId}`);
        return {
          success: false,
          error: 'Döküman bulunamadı',
        };
      }
    } catch (error) {
      console.error(`❌ getDocument error:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      };
    }
  }

  /**
   * Query ile koleksiyon sorgula
   */
  static async queryCollection<T>(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ): Promise<FirestoreResponse<T[]>> {
    try {
      console.log(`🔍 Querying collection: ${collectionName}`, constraints);
      
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, ...constraints);
      const snapshot = await getDocs(q);

      const data: T[] = [];
      snapshot.forEach((doc) => {
        const docData = doc.data();
        data.push({
          id: doc.id,
          ...docData,
          createdAt: docData.createdAt?.toDate?.() || docData.createdAt,
          updatedAt: docData.updatedAt?.toDate?.() || docData.updatedAt,
        } as T);
      });

      console.log(`✅ Query completed:`, data.length, 'documents');
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`❌ queryCollection error:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      };
    }
  }

  /**
   * Yeni döküman ekle
   */
  static async addDocument<T>(
    collectionName: string,
    data: Omit<T, 'id'>
  ): Promise<FirestoreResponse<string>> {
    try {
      console.log(`➕ Adding document to ${collectionName}:`, data);
      
      const collectionRef = collection(db, collectionName);
      const timestamp = Timestamp.now();
      
      const docData = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      const docRef = await addDoc(collectionRef, docData);
      
      console.log(`✅ Document added with ID: ${docRef.id}`);
      
      return {
        success: true,
        data: docRef.id,
      };
    } catch (error) {
      console.error(`❌ addDocument error:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      };
    }
  }

  /**
   * Döküman güncelle
   */
  static async updateDocument(
    collectionName: string,
    documentId: string,
    data: Partial<Record<string, unknown>>
  ): Promise<FirestoreResponse<void>> {
    try {
      console.log(`✏️ Updating document: ${collectionName}/${documentId}`, data);
      
      const docRef = doc(db, collectionName, documentId);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(docRef, updateData);
      
      console.log(`✅ Document updated successfully`);
      
      return {
        success: true,
      };
    } catch (error) {
      console.error(`❌ updateDocument error:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      };
    }
  }

  /**
   * Döküman sil
   */
  static async deleteDocument(
    collectionName: string,
    documentId: string
  ): Promise<FirestoreResponse<void>> {
    try {
      console.log(`🗑️ Deleting document: ${collectionName}/${documentId}`);
      
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);
      
      console.log(`✅ Document deleted successfully`);
      
      return {
        success: true,
      };
    } catch (error) {
      console.error(`❌ deleteDocument error:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      };
    }
  }
}

// Kolaylık için named export'lar
export const {
  getCollection,
  getDocument,
  queryCollection,
  addDocument,
  updateDocument,
  deleteDocument,
} = FirestoreService;

export default FirestoreService;