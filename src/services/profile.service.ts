import type { UserProfile } from '../types';

const DUMMY_PROFILE: UserProfile = {
    id: '1',
    email: 'demo@coin.app',
    phone: '+62812345678',
    telegramId: '@demouser',
    baseSalary: 15000000,
    salaryCycle: 'monthly',
    salaryDay: 1,
    currency: 'IDR',
    role: 'user',
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const profileService = {
    async getProfile(): Promise<UserProfile> {
        await delay(500);
        return { ...DUMMY_PROFILE };
    },

    async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
        await delay(600);
        const updated = { ...DUMMY_PROFILE, ...updates };
        Object.assign(DUMMY_PROFILE, updated);
        return updated;
    },
};
