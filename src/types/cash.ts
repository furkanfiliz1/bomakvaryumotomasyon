export interface CashTransaction {
  id?: string;
  userId: string;
  username: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  createdAt?: string;
}

export interface CashBalance {
  userId: string;
  username: string;
  balance: number;
}
