import { create } from 'zustand';
import type { AllocationRule } from '../types';
import { allocationService } from '../services/allocation.service';

interface AllocationState {
    rules: AllocationRule[];
    isLoading: boolean;
    error: string | null;

    fetchRules: () => Promise<void>;
    addRule: (rule: Omit<AllocationRule, 'id'>) => Promise<void>;
    updateRule: (id: string, updates: Partial<AllocationRule>) => Promise<void>;
    deleteRule: (id: string) => Promise<void>;
    toggleRuleActive: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useAllocationStore = create<AllocationState>((set) => ({
    rules: [],
    isLoading: false,
    error: null,

    fetchRules: async () => {
        set({ isLoading: true, error: null });
        try {
            const rules = await allocationService.getAll();
            set({ rules, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch allocation rules',
                isLoading: false,
            });
        }
    },

    addRule: async (rule) => {
        set({ isLoading: true, error: null });
        try {
            await allocationService.create(rule);
            const rules = await allocationService.getAll();
            set({ rules, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to add allocation rule',
                isLoading: false,
            });
            throw error;
        }
    },

    updateRule: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            await allocationService.update(id, updates);
            const rules = await allocationService.getAll();
            set({ rules, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update allocation rule',
                isLoading: false,
            });
            throw error;
        }
    },

    deleteRule: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await allocationService.delete(id);
            const rules = await allocationService.getAll();
            set({ rules, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete allocation rule',
                isLoading: false,
            });
            throw error;
        }
    },

    toggleRuleActive: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const rule = await allocationService.getById(id);
            if (rule) {
                await allocationService.update(id, { isActive: !rule.isActive });
                const rules = await allocationService.getAll();
                set({ rules, isLoading: false });
            }
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to toggle allocation rule',
                isLoading: false,
            });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));
