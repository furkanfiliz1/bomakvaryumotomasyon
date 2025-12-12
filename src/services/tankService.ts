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
        size: data.size || 'medium',
        quantity: Number(data.quantity) || 0,
        unitCost: Number(data.unitCost) || 0,
        totalCost: Number(data.totalCost) || 0,
        estimatedPrice: Number(data.estimatedPrice) || 0,
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
    quantityChange: number,
    unitCost: number = 0,
    size: 'small' | 'medium' | 'large' = 'medium',
    estimatedPrice: number = 0
  ): Promise<void> {
    // Find existing stock record with size
    const q = query(
      collection(db, TANK_STOCKS_COLLECTION),
      where('tankId', '==', tankId),
      where('fishTypeId', '==', fishTypeId),
      where('size', '==', size)
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
          size,
          quantity: Number(quantityChange),
          unitCost: Number(unitCost),
          totalCost: Number(quantityChange) * Number(unitCost),
          estimatedPrice: Number(estimatedPrice) || 0,
          lastUpdated: Timestamp.now(),
        });
      }
    } else {
      // Update existing stock record
      const stockDoc = querySnapshot.docs[0];
      const currentQuantity = Number(stockDoc.data().quantity) || 0;
      const currentUnitCost = Number(stockDoc.data().unitCost) || 0;
      const newQuantity = currentQuantity + Number(quantityChange);

      if (newQuantity > 0) {
        // Ağırlıklı ortalama maliyet hesaplama (Weighted Average Cost)
        const currentTotalCost = currentQuantity * currentUnitCost;
        const newPurchaseCost = Number(quantityChange) > 0 ? Number(quantityChange) * Number(unitCost) : 0;
        const newUnitCost = Number(quantityChange) > 0 
          ? (currentTotalCost + newPurchaseCost) / newQuantity
          : currentUnitCost;
        
        await updateDoc(doc(db, TANK_STOCKS_COLLECTION, stockDoc.id), {
          quantity: Number(newQuantity),
          unitCost: Number(newUnitCost),
          totalCost: Number(newQuantity) * Number(newUnitCost),
          estimatedPrice: Number(estimatedPrice) || Number(stockDoc.data().estimatedPrice) || 0,
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
    quantity: number,
    unitCost: number = 0,
    deathCount: number = 0,
    size: 'small' | 'medium' | 'large' = 'medium',
    estimatedPrice: number = 0
  ): Promise<void> {
    // Find existing stock record with size
    const q = query(
      collection(db, TANK_STOCKS_COLLECTION),
      where('tankId', '==', tankId),
      where('fishTypeId', '==', fishTypeId),
      where('size', '==', size)
    );

    const querySnapshot = await getDocs(q);
    const totalDeathLoss = Number(deathCount) * Number(unitCost);

    if (querySnapshot.empty) {
      // Create new stock record
      if (Number(quantity) > 0) {
        await addDoc(collection(db, TANK_STOCKS_COLLECTION), {
          tankId,
          tankName,
          fishTypeId,
          fishTypeName,
          categoryName,
          size,
          quantity: Number(quantity),
          unitCost: Number(unitCost),
          totalCost: Number(quantity) * Number(unitCost),
          estimatedPrice: Number(estimatedPrice) || 0,
          deathCount: Number(deathCount),
          totalDeathLoss: Number(totalDeathLoss),
          lastUpdated: Timestamp.now(),
        });
      }
    } else {
      // Update existing stock record
      const stockDoc = querySnapshot.docs[0];

      if (Number(quantity) >= 0) {
        // Keep the record even if quantity is 0 (when deaths equal initial quantity)
        await updateDoc(doc(db, TANK_STOCKS_COLLECTION, stockDoc.id), {
          quantity: Number(quantity),
          unitCost: Number(unitCost),
          totalCost: Number(quantity) * Number(unitCost),
          estimatedPrice: Number(estimatedPrice) || Number(stockDoc.data().estimatedPrice) || 0,
          deathCount: Number(deathCount),
          totalDeathLoss: Number(totalDeathLoss),
          tankName,
          fishTypeName,
          categoryName,
          lastUpdated: Timestamp.now(),
        });
      } else {
        throw new Error('Stok miktarı negatif olamaz');
      }
    }
  },

  async checkTankStock(tankId: string, fishTypeId: string, size: 'small' | 'medium' | 'large' = 'medium'): Promise<number> {
    const q = query(
      collection(db, TANK_STOCKS_COLLECTION),
      where('tankId', '==', tankId),
      where('fishTypeId', '==', fishTypeId),
      where('size', '==', size)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return 0;
    }

    return Number(querySnapshot.docs[0].data().quantity) || 0;
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
        size: data.size || 'medium',
        quantity: Number(data.quantity) || 0,
        unitCost: Number(data.unitCost) || 0,
        totalCost: Number(data.totalCost) || 0,
        estimatedPrice: Number(data.estimatedPrice) || 0,
        deathCount: Number(data.deathCount) || 0,
        totalDeathLoss: Number(data.totalDeathLoss) || 0,
        lastUpdated: data.lastUpdated,
      });
    });

    return stocks;
  },
};
