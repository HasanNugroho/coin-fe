import type { Platform } from '../types';

const SYSTEM_PLATFORMS: Platform[] = [
    { id: '1', name: 'BCA', type: 'bank', isSystem: true },
    { id: '2', name: 'BRI', type: 'bank', isSystem: true },
    { id: '3', name: 'Mandiri', type: 'bank', isSystem: true },
    { id: '4', name: 'GoPay', type: 'ewallet', isSystem: true },
    { id: '5', name: 'OVO', type: 'ewallet', isSystem: true },
    { id: '6', name: 'ShopeePay', type: 'ewallet', isSystem: true },
    { id: '7', name: 'Dana', type: 'ewallet', isSystem: true },
    { id: '8', name: 'Cash', type: 'cash', isSystem: true },
    { id: '9', name: 'Credit Card', type: 'credit', isSystem: true },
];

const CUSTOM_PLATFORMS: Platform[] = [];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const platformService = {
    async getAll(): Promise<Platform[]> {
        await delay(300);
        return [...SYSTEM_PLATFORMS, ...CUSTOM_PLATFORMS];
    },

    async getSystemPlatforms(): Promise<Platform[]> {
        await delay(300);
        return [...SYSTEM_PLATFORMS];
    },

    async getById(id: string): Promise<Platform | null> {
        await delay(200);
        const all = [...SYSTEM_PLATFORMS, ...CUSTOM_PLATFORMS];
        return all.find(p => p.id === id) || null;
    },

    async create(platform: Omit<Platform, 'id'>): Promise<Platform> {
        await delay(400);
        const newPlatform: Platform = {
            ...platform,
            id: Date.now().toString(),
        };
        CUSTOM_PLATFORMS.push(newPlatform);
        return newPlatform;
    },

    async update(id: string, updates: Partial<Platform>): Promise<Platform> {
        await delay(400);
        const index = CUSTOM_PLATFORMS.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Platform not found');

        CUSTOM_PLATFORMS[index] = { ...CUSTOM_PLATFORMS[index], ...updates };
        return CUSTOM_PLATFORMS[index];
    },

    async delete(id: string): Promise<void> {
        await delay(300);
        const index = CUSTOM_PLATFORMS.findIndex(p => p.id === id);
        if (index !== -1) {
            CUSTOM_PLATFORMS.splice(index, 1);
        }
    },
};
