import type { Kantong } from '../types';

const DUMMY_KANTONG: Kantong[] = [
    {
        id: '1',
        name: 'Main Wallet',
        category: 'Daily Needs',
        type: 'main',
        balance: 5420000,
        isLocked: false,
        color: '#3b82f6',
    },
    {
        id: '2',
        name: 'Monthly Bills',
        category: 'Bills',
        type: 'allocation',
        balance: 2500000,
        isLocked: false,
        color: '#ef4444',
    },
    {
        id: '3',
        name: 'Emergency Fund',
        category: 'Emergency',
        type: 'saving',
        balance: 10000000,
        isLocked: true,
        color: '#f59e0b',
    },
    {
        id: '4',
        name: 'Vacation Savings',
        category: 'Lifestyle',
        type: 'saving',
        balance: 3750000,
        isLocked: false,
        color: '#8b5cf6',
    },
    {
        id: '5',
        name: 'Investment Fund',
        category: 'Investment',
        type: 'allocation',
        balance: 15000000,
        isLocked: true,
        color: '#10b981',
    },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const kantongService = {
    async getAll(): Promise<Kantong[]> {
        await delay(500);
        return [...DUMMY_KANTONG];
    },

    async getById(id: string): Promise<Kantong | null> {
        await delay(300);
        return DUMMY_KANTONG.find(k => k.id === id) || null;
    },

    async create(kantong: Omit<Kantong, 'id'>): Promise<Kantong> {
        await delay(600);
        const newKantong: Kantong = {
            ...kantong,
            id: Date.now().toString(),
        };
        DUMMY_KANTONG.push(newKantong);
        return newKantong;
    },

    async update(id: string, updates: Partial<Kantong>): Promise<Kantong> {
        await delay(600);
        const index = DUMMY_KANTONG.findIndex(k => k.id === id);
        if (index === -1) throw new Error('Kantong not found');

        DUMMY_KANTONG[index] = { ...DUMMY_KANTONG[index], ...updates };
        return DUMMY_KANTONG[index];
    },

    async delete(id: string): Promise<void> {
        await delay(500);
        const index = DUMMY_KANTONG.findIndex(k => k.id === id);
        if (index !== -1) {
            DUMMY_KANTONG.splice(index, 1);
        }
    },
};
