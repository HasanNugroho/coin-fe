import type { Transaction } from '../types';

const DUMMY_TRANSACTIONS: Transaction[] = [
    {
        id: '1',
        type: 'income',
        amount: 15000000,
        date: '2026-01-01',
        category: 'Salary',
        kantongId: '1',
        note: 'Monthly salary',
    },
    {
        id: '2',
        type: 'expense',
        amount: 150000,
        date: '2026-01-05',
        category: 'Food',
        kantongId: '1',
        note: 'Groceries',
    },
    {
        id: '3',
        type: 'expense',
        amount: 500000,
        date: '2026-01-10',
        category: 'Shopping',
        kantongId: '1',
        note: 'New shoes',
    },
    {
        id: '4',
        type: 'income',
        amount: 3000000,
        date: '2026-01-15',
        category: 'Freelance',
        kantongId: '1',
        note: 'Web design project',
    },
    {
        id: '5',
        type: 'expense',
        amount: 1200000,
        date: '2026-01-20',
        category: 'Bills',
        kantongId: '2',
        note: 'Electricity and water',
    },
    {
        id: '6',
        type: 'expense',
        amount: 250000,
        date: '2026-01-22',
        category: 'Transport',
        kantongId: '1',
        note: 'Fuel',
    },
    {
        id: '7',
        type: 'expense',
        amount: 800000,
        date: '2026-01-25',
        category: 'Entertainment',
        kantongId: '4',
        note: 'Concert tickets',
    },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const transactionService = {
    async getAll(filters?: {
        startDate?: string;
        endDate?: string;
        category?: string;
        kantongId?: string;
        type?: string;
    }): Promise<Transaction[]> {
        await delay(500);

        let filtered = [...DUMMY_TRANSACTIONS];

        if (filters?.startDate) {
            filtered = filtered.filter(t => t.date >= filters.startDate!);
        }
        if (filters?.endDate) {
            filtered = filtered.filter(t => t.date <= filters.endDate!);
        }
        if (filters?.category) {
            filtered = filtered.filter(t => t.category === filters.category);
        }
        if (filters?.kantongId) {
            filtered = filtered.filter(t => t.kantongId === filters.kantongId);
        }
        if (filters?.type) {
            filtered = filtered.filter(t => t.type === filters.type);
        }

        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },

    async getById(id: string): Promise<Transaction | null> {
        await delay(300);
        return DUMMY_TRANSACTIONS.find(t => t.id === id) || null;
    },

    async create(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
        await delay(600);
        const newTransaction: Transaction = {
            ...transaction,
            id: Date.now().toString(),
        };
        DUMMY_TRANSACTIONS.push(newTransaction);
        return newTransaction;
    },

    async update(id: string, updates: Partial<Transaction>): Promise<Transaction> {
        await delay(600);
        const index = DUMMY_TRANSACTIONS.findIndex(t => t.id === id);
        if (index === -1) throw new Error('Transaction not found');

        DUMMY_TRANSACTIONS[index] = { ...DUMMY_TRANSACTIONS[index], ...updates };
        return DUMMY_TRANSACTIONS[index];
    },

    async delete(id: string): Promise<void> {
        await delay(500);
        const index = DUMMY_TRANSACTIONS.findIndex(t => t.id === id);
        if (index !== -1) {
            DUMMY_TRANSACTIONS.splice(index, 1);
        }
    },
};
