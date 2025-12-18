
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}

export interface BankAccount {
  id: string;
  name: string;
  balance: number;
  type: 'Savings' | 'Checking' | 'Credit Card' | 'Cash';
  currency: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  date: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AppState {
  user: User | null;
  accounts: BankAccount[];
  transactions: Transaction[];
  categories: Category[];
}
