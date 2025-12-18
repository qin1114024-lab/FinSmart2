
import { TransactionType, Category, BankAccount, Transaction } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food & Dining', type: TransactionType.EXPENSE, color: '#F87171' },
  { id: '2', name: 'Transportation', type: TransactionType.EXPENSE, color: '#60A5FA' },
  { id: '3', name: 'Housing', type: TransactionType.EXPENSE, color: '#34D399' },
  { id: '4', name: 'Entertainment', type: TransactionType.EXPENSE, color: '#A78BFA' },
  { id: '5', name: 'Salary', type: TransactionType.INCOME, color: '#10B981' },
  { id: '6', name: 'Investment', type: TransactionType.INCOME, color: '#FBBF24' },
  { id: '7', name: 'Shopping', type: TransactionType.EXPENSE, color: '#EC4899' },
  { id: '8', name: 'Healthcare', type: TransactionType.EXPENSE, color: '#F472B6' },
];

export const MOCK_ACCOUNTS: BankAccount[] = [
  { id: 'acc1', name: 'Main Savings', balance: 50000, type: 'Savings', currency: 'TWD' },
  { id: 'acc2', name: 'Credit Card', balance: -1200, type: 'Credit Card', currency: 'TWD' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', accountId: 'acc1', categoryId: '5', amount: 65000, type: TransactionType.INCOME, date: new Date(2023, 11, 5).toISOString(), description: 'Monthly Salary' },
  { id: 't2', accountId: 'acc1', categoryId: '1', amount: 150, type: TransactionType.EXPENSE, date: new Date(2023, 11, 6).toISOString(), description: 'Lunch' },
  { id: 't3', accountId: 'acc2', categoryId: '7', amount: 2500, type: TransactionType.EXPENSE, date: new Date(2023, 11, 7).toISOString(), description: 'New Shoes' },
  { id: 't4', accountId: 'acc1', categoryId: '2', amount: 50, type: TransactionType.EXPENSE, date: new Date(2023, 11, 8).toISOString(), description: 'MRT Fare' },
];
