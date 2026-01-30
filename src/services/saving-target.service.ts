import type { SavingTarget } from '../types';

const DUMMY_SAVING_TARGETS: SavingTarget[] = [
    {
        id: '1',
        name: 'Emergency Fund',
        kantongId: '3',
        targetAmount: 10000000,
        deadline: '2026-12-31',
        note: 'Build 6 months emergency fund',
    },
    {
        id: '2',
        name: 'Vacation',
        kantongId: '4',
        targetAmount: 5000000,
        deadline: '2026-06-30',
        note: 'Summer vacation to Bali',
    },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const savingTargetService = {
    async getAll(): Promise<SavingTarget[]> {
        await delay(300);
        return [...DUMMY_SAVING_TARGETS];
    },

    async getById(id: string): Promise<SavingTarget | null> {
        await delay(200);
        return DUMMY_SAVING_TARGETS.find(t => t.id === id) || null;
    },

    async create(target: Omit<SavingTarget, 'id'>): Promise<SavingTarget> {
        await delay(400);
        const newTarget: SavingTarget = {
            ...target,
            id: Date.now().toString(),
        };
        DUMMY_SAVING_TARGETS.push(newTarget);
        return newTarget;
    },

    async update(id: string, updates: Partial<SavingTarget>): Promise<SavingTarget> {
        await delay(400);
        const index = DUMMY_SAVING_TARGETS.findIndex(t => t.id === id);
        if (index === -1) throw new Error('Saving target not found');

        DUMMY_SAVING_TARGETS[index] = { ...DUMMY_SAVING_TARGETS[index], ...updates };
        return DUMMY_SAVING_TARGETS[index];
    },

    async delete(id: string): Promise<void> {
        await delay(300);
        const index = DUMMY_SAVING_TARGETS.findIndex(t => t.id === id);
        if (index !== -1) {
            DUMMY_SAVING_TARGETS.splice(index, 1);
        }
    },
};
