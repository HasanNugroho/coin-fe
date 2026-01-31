import { create } from 'zustand';
import type { User, Category, DefaultKantongTemplate } from '../types';
import { authService } from '../services/auth.service';
import { adminService } from '../services/admin.service';
import { categoryService } from '../services/category.service';

interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    totalKantong: number;
    totalTransactions: number;
    userGrowth: { month: string; users: number }[];
}

interface AdminState {
    users: User[];
    categories: Category[];
    kantongTemplates: DefaultKantongTemplate[];
    dashboardStats: DashboardStats | null;
    isLoading: boolean;
    error: string | null;

    fetchDashboardStats: () => Promise<void>;
    fetchUsers: () => Promise<void>;
    updateUserStatus: (id: string, status: 'active' | 'disabled') => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    fetchCategories: () => Promise<void>;
    createCategory: (category: { name: string; type: 'transaction' | 'pocket'; is_default?: boolean; parent_id?: string; transaction_type?: 'income' | 'expense' | string; description?: string; icon?: string; color?: string; }) => Promise<void>;
    updateCategory: (id: string, updates: { name?: string; type?: 'transaction' | 'pocket'; is_default?: boolean; parent_id?: string; transaction_type?: 'income' | 'expense' | string; description?: string; icon?: string; color?: string; }) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    fetchKantongTemplates: () => Promise<void>;
    updateKantongTemplates: (templates: DefaultKantongTemplate[]) => Promise<void>;
    clearError: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
    users: [],
    categories: [],
    kantongTemplates: [],
    dashboardStats: null,
    isLoading: false,
    error: null,

    fetchDashboardStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const dashboardStats = await adminService.getDashboardStats();
            set({ dashboardStats, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats',
                isLoading: false,
            });
        }
    },

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const { users } = await authService.listUsers();
            set({ users, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch users',
                isLoading: false,
            });
        }
    },

    updateUserStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        try {
            if (status === 'active') {
                await authService.enableUser(id);
            } else {
                await authService.disableUser(id);
            }
            const { users } = await authService.listUsers();
            set({ users, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update user status',
                isLoading: false,
            });
            throw error;
        }
    },

    deleteUser: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await authService.deleteUser(id);
            const { users } = await authService.listUsers();
            set({ users, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete user',
                isLoading: false,
            });
            throw error;
        }
    },

    fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
            const categories = await categoryService.listCategories();
            set({ categories, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch categories',
                isLoading: false,
            });
        }
    },

    createCategory: async (category) => {
        set({ isLoading: true, error: null });
        try {
            await categoryService.createCategory({
                name: category.name,
                type: category.type as 'transaction' | 'pocket',
                is_default: category.is_default,
                parent_id: category.parent_id,
                transaction_type: category.transaction_type,
                description: category.description,
                icon: category.icon,
                color: category.color,
            });
            const categories = await categoryService.listCategories();
            set({ categories, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to create category',
                isLoading: false,
            });
            throw error;
        }
    },

    updateCategory: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            await categoryService.updateCategory(id, {
                name: updates.name,
                type: updates.type as 'transaction' | 'pocket' | undefined,
                is_default: updates.is_default,
                parent_id: updates.parent_id || undefined,
            });
            const categories = await categoryService.listCategories();
            set({ categories, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update category',
                isLoading: false,
            });
            throw error;
        }
    },

    deleteCategory: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await categoryService.deleteCategory(id);
            const categories = await categoryService.listCategories();
            set({ categories, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete category',
                isLoading: false,
            });
            throw error;
        }
    },

    fetchKantongTemplates: async () => {
        set({ isLoading: true, error: null });
        try {
            const kantongTemplates = await adminService.getDefaultKantongTemplate();
            set({ kantongTemplates, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch kantong templates',
                isLoading: false,
            });
        }
    },

    updateKantongTemplates: async (templates) => {
        set({ isLoading: true, error: null });
        try {
            const kantongTemplates = await adminService.updateDefaultKantongTemplate(templates);
            set({ kantongTemplates, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update kantong templates',
                isLoading: false,
            });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));
