import type { Liability } from '../types';

const DUMMY_LIABILITIES: Liability[] = [
    {
        id: '1',
        name: 'Credit Card BCA',
        type: 'credit',
        totalAmount: 5000000,
        paidAmount: 2000000,
        dueDate: '2026-02-15',
        note: 'Monthly credit card bill',
    },
    {
        id: '2',
        name: 'Phone Installment',
        type: 'installment',
        totalAmount: 3000000,
        paidAmount: 600000,
        dueDate: '2026-02-20',
        note: '5 months remaining',
    },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const liabilityService = {
    async getAll(): Promise<Liability[]> {
        await delay(300);
        return [...DUMMY_LIABILITIES];
    },

    async getById(id: string): Promise<Liability | null> {
        await delay(200);
        return DUMMY_LIABILITIES.find(l => l.id === id) || null;
    },

    async create(liability: Omit<Liability, 'id'>): Promise<Liability> {
        await delay(400);
        const newLiability: Liability = {
            ...liability,
            id: Date.now().toString(),
        };
        DUMMY_LIABILITIES.push(newLiability);
        return newLiability;
    },

    async update(id: string, updates: Partial<Liability>): Promise<Liability> {
        await delay(400);
        const index = DUMMY_LIABILITIES.findIndex(l => l.id === id);
        if (index === -1) throw new Error('Liability not found');

        DUMMY_LIABILITIES[index] = { ...DUMMY_LIABILITIES[index], ...updates };
        return DUMMY_LIABILITIES[index];
    },

    async delete(id: string): Promise<void> {
        await delay(300);
        const index = DUMMY_LIABILITIES.findIndex(l => l.id === id);
        if (index !== -1) {
            DUMMY_LIABILITIES.splice(index, 1);
        }
    },
};
