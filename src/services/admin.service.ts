import type { AdminUser, Category, DefaultKantongTemplate } from '../types';

const DUMMY_USERS: AdminUser[] = [
    {
        id: '1',
        email: 'demo@coin.app',
        phone: '+62812345678',
        role: 'admin',
        status: 'active',
        createdAt: '2025-01-01',
    },
    {
        id: '2',
        email: 'user1@coin.app',
        phone: '+62812345679',
        role: 'user',
        status: 'active',
        createdAt: '2025-01-05',
    },
    {
        id: '3',
        email: 'user2@coin.app',
        role: 'user',
        status: 'active',
        createdAt: '2025-01-10',
    },
    {
        id: '4',
        email: 'user3@coin.app',
        phone: '+62812345680',
        role: 'user',
        status: 'disabled',
        createdAt: '2025-01-15',
    },
];

const DUMMY_CATEGORIES: Category[] = [
    { id: '1', name: 'Food', type: 'transaction', isDefault: true },
    { id: '2', name: 'Transport', type: 'transaction', isDefault: true },
    { id: '3', name: 'Shopping', type: 'transaction', isDefault: true },
    { id: '4', name: 'Salary', type: 'transaction', isDefault: true },
    { id: '5', name: 'Freelance', type: 'transaction', isDefault: false },
    { id: '6', name: 'Bills', type: 'transaction', isDefault: true },
    { id: '7', name: 'Entertainment', type: 'transaction', isDefault: true },
    { id: '8', name: 'Daily Needs', type: 'kantong', isDefault: true },
    { id: '9', name: 'Bills', type: 'kantong', isDefault: true },
    { id: '10', name: 'Savings', type: 'kantong', isDefault: true },
    { id: '11', name: 'Emergency', type: 'kantong', isDefault: true },
];

const DUMMY_KANTONG_TEMPLATE: DefaultKantongTemplate[] = [
    {
        id: '1',
        name: 'Main Wallet',
        category: 'Daily Needs',
        initialBalance: 0,
        isLocked: false,
    },
    {
        id: '2',
        name: 'Emergency Fund',
        category: 'Emergency',
        initialBalance: 0,
        isLocked: true,
    },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const adminService = {
    async getDashboardStats() {
        await delay(600);
        return {
            totalUsers: 4,
            activeUsers: 3,
            totalKantong: 15,
            totalTransactions: 42,
            userGrowth: [
                { month: 'Sep', users: 2 },
                { month: 'Oct', users: 2 },
                { month: 'Nov', users: 3 },
                { month: 'Dec', users: 3 },
                { month: 'Jan', users: 4 },
            ],
        };
    },

    async getUsers(): Promise<AdminUser[]> {
        await delay(500);
        return [...DUMMY_USERS];
    },

    async getUserById(id: string): Promise<AdminUser | null> {
        await delay(300);
        return DUMMY_USERS.find(u => u.id === id) || null;
    },

    async updateUserStatus(id: string, status: 'active' | 'disabled'): Promise<AdminUser> {
        await delay(500);
        const index = DUMMY_USERS.findIndex(u => u.id === id);
        if (index === -1) throw new Error('User not found');
        DUMMY_USERS[index].status = status;
        return DUMMY_USERS[index];
    },

    async getCategories(): Promise<Category[]> {
        await delay(500);
        return [...DUMMY_CATEGORIES];
    },

    async getCategoriesByType(type: 'transaction' | 'kantong'): Promise<Category[]> {
        await delay(400);
        return DUMMY_CATEGORIES.filter(c => c.type === type);
    },

    async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
        await delay(600);
        const newCategory: Category = {
            ...category,
            id: Date.now().toString(),
        };
        DUMMY_CATEGORIES.push(newCategory);
        return newCategory;
    },

    async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
        await delay(600);
        const index = DUMMY_CATEGORIES.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Category not found');
        DUMMY_CATEGORIES[index] = { ...DUMMY_CATEGORIES[index], ...updates };
        return DUMMY_CATEGORIES[index];
    },

    async deleteCategory(id: string): Promise<void> {
        await delay(500);
        const index = DUMMY_CATEGORIES.findIndex(c => c.id === id);
        if (index !== -1) {
            DUMMY_CATEGORIES.splice(index, 1);
        }
    },

    async getDefaultKantongTemplate(): Promise<DefaultKantongTemplate[]> {
        await delay(500);
        return [...DUMMY_KANTONG_TEMPLATE];
    },

    async updateDefaultKantongTemplate(
        templates: DefaultKantongTemplate[]
    ): Promise<DefaultKantongTemplate[]> {
        await delay(600);
        DUMMY_KANTONG_TEMPLATE.length = 0;
        DUMMY_KANTONG_TEMPLATE.push(...templates);
        return [...DUMMY_KANTONG_TEMPLATE];
    },
};
