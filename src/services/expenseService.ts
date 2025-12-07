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
import { Expense } from '../types/expense';

const COLLECTION_NAME = 'expenses';

export const expenseService = {
  // Gider Ekleme
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async addExpense(expense: any): Promise<string> {
    const date = expense.date;
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const year = date.getFullYear();

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      date: Timestamp.fromDate(expense.date),
      monthKey,
      year,
      category: expense.category,
      amount: expense.amount,
      description: expense.description || '',
      paymentType: expense.paymentType || '',
      relatedPartyId: expense.relatedPartyId || '',
      createdAt: Timestamp.now(),
      createdBy: '',
    });
    return docRef.id;
  },

  // Gider Güncelleme
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateExpense(id: string, data: any): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { ...data };

    if (data.date) {
      const date = data.date;
      updateData.date = Timestamp.fromDate(date);
      updateData.monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      updateData.year = date.getFullYear();
    }

    await updateDoc(docRef, updateData);
  },

  // Gider Silme
  async deleteExpense(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  // Tüm Giderleri Getirme
  async getAllExpenses(): Promise<Expense[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    const expenses: Expense[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      expenses.push({
        id: doc.id,
        date: data.date,
        monthKey: data.monthKey || '',
        year: data.year || 0,
        category: data.category || 'diğer',
        amount: data.amount || 0,
        description: data.description || '',
        paymentType: data.paymentType || '',
        relatedPartyId: data.relatedPartyId || '',
        createdAt: data.createdAt,
        createdBy: data.createdBy || '',
      });
    });

    return expenses;
  },
};
