import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CashTransaction, CashBalance } from '../types/cash';

class CashService {
  private collectionName = 'cash_transactions';

  async addTransaction(transaction: Omit<CashTransaction, 'id' | 'createdAt'>): Promise<void> {
    await addDoc(collection(db, this.collectionName), {
      ...transaction,
      createdAt: Timestamp.now(),
    });
  }

  async deleteTransaction(id: string): Promise<void> {
    await deleteDoc(doc(db, this.collectionName, id));
  }

  async getAllTransactions(): Promise<CashTransaction[]> {
    const q = query(collection(db, this.collectionName), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
    })) as CashTransaction[];
  }

  async getBalanceByUser(transactions: CashTransaction[]): Promise<CashBalance[]> {
    const balanceMap = new Map<string, CashBalance>();

    transactions.forEach((transaction) => {
      const existing = balanceMap.get(transaction.userId) || {
        userId: transaction.userId,
        username: transaction.username,
        balance: 0,
      };

      existing.balance += transaction.type === 'income' ? Number(transaction.amount) : -Number(transaction.amount);
      balanceMap.set(transaction.userId, existing);
    });

    return Array.from(balanceMap.values());
  }
}

export const cashService = new CashService();
