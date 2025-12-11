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
import { cashService } from './cashService';

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
      amount: Number(expense.amount),
      description: expense.description || '',
      paymentType: expense.paymentType || '',
      relatedPartyId: expense.relatedPartyId || '',
      userId: expense.userId || '',
      userName: expense.userName || '',
      createdAt: Timestamp.now(),
      createdBy: expense.userId || '',
    });

    // Ödeme tipi nakit ise kasadan düş
    if (expense.paymentType === 'nakit' && expense.userId && expense.userName) {
      await cashService.addTransaction({
        userId: expense.userId,
        username: expense.userName,
        amount: Number(expense.amount),
        type: 'expense',
        description: `Gider: ${expense.category} - ${expense.description || 'Açıklama yok'}`,
      });
    }

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
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const expenses: Expense[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      expenses.push({
        id: doc.id,
        date: data.date,
        monthKey: data.monthKey || '',
        year: Number(data.year) || 0,
        category: data.category || 'diğer',
        amount: Number(data.amount) || 0,
        description: data.description || '',
        paymentType: data.paymentType || '',
        relatedPartyId: data.relatedPartyId || '',
        userId: data.userId || '',
        userName: data.userName || '',
        createdAt: data.createdAt,
        createdBy: data.createdBy || '',
      });
    });

    return expenses;
  },
};
