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
  where,
} from 'firebase/firestore';
import { Tank, TankFormData, TankStock } from '../types/tank';

const TANKS_COLLECTION = 'tanks';
const TANK_STOCKS_COLLECTION = 'tankStocks';

export const tankService = {
  // Tank CRUD Operations
  
  async addTank(tankData: TankFormData): Promise<string> {
    const docRef = await addDoc(collection(db, TANKS_COLLECTION), {
      ...tankData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async updateTank(id: string, tankData: Partial<TankFormData>): Promise<void> {
    const tankRef = doc(db, TANKS_COLLECTION, id);
    await updateDoc(tankRef, {
      ...tankData,
      updatedAt: Timestamp.now(),
    });
  },

  async deleteTank(id: string): Promise<void> {
    const tankRef = doc(db, TANKS_COLLECTION, id);
    await deleteDoc(tankRef);
  },

  async deactivateTank(id: string): Promise<void> {
    const tankRef = doc(db, TANKS_COLLECTION, id);
    await updateDoc(tankRef, {
      isActive: false,
      updatedAt: Timestamp.now(),
    });
  },

  async getAllTanks(): Promise<Tank[]> {
    const q = query(collection(db, TANKS_COLLECTION), orderBy('name'));
    const querySnapshot = await getDocs(q);

    const tanks: Tank[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tanks.push({
        id: doc.id,
        name: data.name || '',
        code: data.code || '',
        isActive: data.isActive ?? true,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    return tanks;
  },

  async getActiveTanks(): Promise<Tank[]> {
    const q = query(
      collection(db, TANKS_COLLECTION),
      where('isActive', '==', true),
      orderBy('name')
    );
    const querySnapshot = await getDocs(q);

    const tanks: Tank[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tanks.push({
        id: doc.id,
        name: data.name || '',
        code: data.code || '',
        isActive: data.isActive ?? true,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    return tanks;
  },

  // Tank Stock Operations

  async getTankStocks(tankId?: string): Promise<TankStock[]> {
    let q;
    if (tankId) {
      q = query(
        collection(db, TANK_STOCKS_COLLECTION),
        where('tankId', '==', tankId),
        orderBy('fishTypeName')
      );
    } else {
      q = query(collection(db, TANK_STOCKS_COLLECTION), orderBy('tankName'));
    }

    const querySnapshot = await getDocs(q);

    const stocks: TankStock[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      stocks.push({
        id: doc.id,
        tankId: data.tankId || '',
        tankName: data.tankName,
        fishTypeId: data.fishTypeId || '',
        fishTypeName: data.fishTypeName,
        categoryName: data.categoryName,
        quantity: data.quantity || 0,
        lastUpdated: data.lastUpdated,
      });
    });

    return stocks;
  },

  async updateTankStock(
    tankId: string,
    tankName: string,
    fishTypeId: string,
    fishTypeName: string,
    categoryName: string,
    quantityChange: number
  ): Promise<void> {
    // Find existing stock record
    const q = query(
      collection(db, TANK_STOCKS_COLLECTION),
      where('tankId', '==', tankId),
      where('fishTypeId', '==', fishTypeId)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Create new stock record
      if (quantityChange > 0) {
        await addDoc(collection(db, TANK_STOCKS_COLLECTION), {
          tankId,
          tankName,
          fishTypeId,
          fishTypeName,
          categoryName,
          quantity: quantityChange,
          lastUpdated: Timestamp.now(),
        });
      }
    } else {
      // Update existing stock record
      const stockDoc = querySnapshot.docs[0];
      const currentQuantity = stockDoc.data().quantity || 0;
      const newQuantity = currentQuantity + quantityChange;

      if (newQuantity > 0) {
        await updateDoc(doc(db, TANK_STOCKS_COLLECTION, stockDoc.id), {
          quantity: newQuantity,
          tankName,
          fishTypeName,
          categoryName,
          lastUpdated: Timestamp.now(),
        });
      } else if (newQuantity === 0) {
        // Delete if quantity reaches zero
        await deleteDoc(doc(db, TANK_STOCKS_COLLECTION, stockDoc.id));
      } else {
        throw new Error('Stok miktarı negatif olamaz');
      }
    }
  },

  async setTankStock(
    tankId: string,
    tankName: string,
    fishTypeId: string,
    fishTypeName: string,
    categoryName: string,
    quantity: number
  ): Promise<void> {
    // Find existing stock record
    const q = query(
      collection(db, TANK_STOCKS_COLLECTION),
      where('tankId', '==', tankId),
      where('fishTypeId', '==', fishTypeId)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Create new stock record
      if (quantity > 0) {
        await addDoc(collection(db, TANK_STOCKS_COLLECTION), {
          tankId,
          tankName,
          fishTypeId,
          fishTypeName,
          categoryName,
          quantity,
          lastUpdated: Timestamp.now(),
        });
      }
    } else {
      // Update existing stock record
      const stockDoc = querySnapshot.docs[0];

      if (quantity > 0) {
        await updateDoc(doc(db, TANK_STOCKS_COLLECTION, stockDoc.id), {
          quantity,
          tankName,
          fishTypeName,
          categoryName,
          lastUpdated: Timestamp.now(),
        });
      } else if (quantity === 0) {
        // Delete if quantity is zero
        await deleteDoc(doc(db, TANK_STOCKS_COLLECTION, stockDoc.id));
      } else {
        throw new Error('Stok miktarı negatif olamaz');
      }
    }
  },

  async checkTankStock(tankId: string, fishTypeId: string): Promise<number> {
    const q = query(
      collection(db, TANK_STOCKS_COLLECTION),
      where('tankId', '==', tankId),
      where('fishTypeId', '==', fishTypeId)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return 0;
    }

    return querySnapshot.docs[0].data().quantity || 0;
  },

  async getAllTankStocks(): Promise<TankStock[]> {
    const q = query(collection(db, TANK_STOCKS_COLLECTION), orderBy('tankName'));
    const querySnapshot = await getDocs(q);

    const stocks: TankStock[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      stocks.push({
        id: doc.id,
        tankId: data.tankId || '',
        tankName: data.tankName,
        fishTypeId: data.fishTypeId || '',
        fishTypeName: data.fishTypeName,
        categoryName: data.categoryName,
        quantity: data.quantity || 0,
        lastUpdated: data.lastUpdated,
      });
    });

    return stocks;
  },
};
