import { db } from '../config/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { Fish, FishCategory } from '../types/fish';

const CATEGORIES_COLLECTION = 'fishCategories';
const FISHES_COLLECTION = 'fishes';

export const fishService = {
  // Tüm Balık Kategorilerini Getirme
  async getAllCategories(): Promise<FishCategory[]> {
    const querySnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));

    const categories: FishCategory[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      categories.push({
        id: doc.id,
        name: data.name || '',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    return categories;
  },

  // Kategoriye Göre Balıkları Getirme
  async getFishesByCategory(categoryId: string): Promise<Fish[]> {
    const q = query(
      collection(db, FISHES_COLLECTION),
      where('categoryId', '==', categoryId),
      orderBy('name')
    );
    const querySnapshot = await getDocs(q);

    const fishes: Fish[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      fishes.push({
        id: doc.id,
        categoryId: data.categoryId || '',
        categoryName: data.categoryName || '',
        name: data.name || '',
        unitPrice: Number(data.unitPrice) || 0,
        stock: Number(data.stock) || 0,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    return fishes;
  },

  // Tüm Balıkları Getirme
  async getAllFishes(): Promise<Fish[]> {
    const querySnapshot = await getDocs(collection(db, FISHES_COLLECTION));

    const fishes: Fish[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      fishes.push({
        id: doc.id,
        categoryId: data.categoryId || '',
        categoryName: data.categoryName || '',
        name: data.name || '',
        unitPrice: Number(data.unitPrice) || 0,
        stock: Number(data.stock) || 0,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    return fishes;

    return fishes;
  },
};
