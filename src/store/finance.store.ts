import { create } from 'zustand';
import type { Kantong, Transaction, DashboardStats, ReportData, Platform, AllocationRule, Liability, SavingTarget, CreateTransactionRequest, UpdateTransactionRequest } from '../types';
import { kantongService } from '../services/kantong.service';
import { transactionService } from '../services/transaction.service';
import { reportService } from '../services/report.service';
import { platformService } from '../services/platform.service';
import { allocationService } from '../services/allocation.service';
import { liabilityService } from '../services/liability.service';
import { savingTargetService } from '../services/saving-target.service';

interface FinanceState {
    kantongs: Kantong[];
    transactions: Transaction[];
    platforms: Platform[];
    allocationRules: AllocationRule[];
    liabilities: Liability[];
    savingTargets: SavingTarget[];
    dashboardStats: DashboardStats | null;
    reportData: ReportData | null;
    isLoading: boolean;
    error: string | null;
    selectedPocketId: string | null;

    fetchKantongs: () => Promise<void>;
    createKantong: (kantong: Omit<Kantong, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'>) => Promise<void>;
    updateKantong: (id: string, updates: Omit<Kantong, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'>) => Promise<void>;
    deleteKantong: (id: string) => Promise<void>;

    fetchTransactions: (pocketId?: string | null) => Promise<void>;
    createTransaction: (transaction: CreateTransactionRequest) => Promise<void>;
    updateTransaction: (id: string, updates: UpdateTransactionRequest) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    setSelectedPocketId: (pocketId: string | null) => void;

    fetchPlatforms: () => Promise<void>;
    createPlatform: (platform: Omit<Platform, 'id'>) => Promise<void>;
    updatePlatform: (id: string, updates: Partial<Platform>) => Promise<void>;
    deletePlatform: (id: string) => Promise<void>;

    fetchAllocationRules: () => Promise<void>;
    createAllocationRule: (rule: Omit<AllocationRule, 'id'>) => Promise<void>;
    updateAllocationRule: (id: string, updates: Partial<AllocationRule>) => Promise<void>;
    deleteAllocationRule: (id: string) => Promise<void>;

    fetchLiabilities: () => Promise<void>;
    createLiability: (liability: Omit<Liability, 'id'>) => Promise<void>;
    updateLiability: (id: string, updates: Partial<Liability>) => Promise<void>;
    deleteLiability: (id: string) => Promise<void>;

    fetchSavingTargets: () => Promise<void>;
    createSavingTarget: (target: Omit<SavingTarget, 'id'>) => Promise<void>;
    updateSavingTarget: (id: string, updates: Partial<SavingTarget>) => Promise<void>;
    deleteSavingTarget: (id: string) => Promise<void>;

    fetchDashboardStats: (month?: string, year?: string) => Promise<void>;
    fetchReportData: (startDate: string, endDate: string) => Promise<void>;

    clearError: () => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
    kantongs: [],
    transactions: [],
    platforms: [],
    allocationRules: [],
    liabilities: [],
    savingTargets: [],
    dashboardStats: null,
    reportData: null,
    isLoading: false,
    error: null,
    selectedPocketId: null,

    fetchKantongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const kantongs = await kantongService.getAll();
            set({ kantongs, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch kantongs',
                isLoading: false,
            });
        }
    },

    createKantong: async (kantong) => {
        set({ isLoading: true, error: null });
        try {
            await kantongService.create(kantong);
            const kantongs = await kantongService.getAll();
            set({ kantongs, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to create kantong',
                isLoading: false,
            });
            throw error;
        }
    },

    updateKantong: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            await kantongService.update(id, updates);
            const kantongs = await kantongService.getAll();
            set({ kantongs, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update kantong',
                isLoading: false,
            });
            throw error;
        }
    },

    deleteKantong: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await kantongService.delete(id);
            const kantongs = await kantongService.getAll();
            set({ kantongs, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete kantong',
                isLoading: false,
            });
            throw error;
        }
    },

    fetchTransactions: async (pocketId) => {
        set({ isLoading: true, error: null });
        try {
            const transactions = pocketId
                ? await transactionService.listByPocket(pocketId)
                : await transactionService.listAll();
            set({ transactions, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch transactions',
                isLoading: false,
            });
        }
    },

    createTransaction: async (transaction) => {
        set({ isLoading: true, error: null });
        try {
            await transactionService.create(transaction);
            const transactions = await transactionService.listAll();
            set({ transactions, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to create transaction',
                isLoading: false,
            });
            throw error;
        }
    },

    updateTransaction: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            await transactionService.update(id, updates);
            const transactions = await transactionService.listAll();
            set({ transactions, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update transaction',
                isLoading: false,
            });
            throw error;
        }
    },

    deleteTransaction: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await transactionService.delete(id);
            const transactions = await transactionService.listAll();
            set({ transactions, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete transaction',
                isLoading: false,
            });
            throw error;
        }
    },

    setSelectedPocketId: (pocketId) => {
        set({ selectedPocketId: pocketId });
    },

    fetchPlatforms: async () => {
        set({ isLoading: true, error: null });
        try {
            const platforms = await platformService.getAll();
            set({ platforms, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch platforms',
                isLoading: false,
            });
        }
    },

    createPlatform: async (platform) => {
        set({ isLoading: true, error: null });
        try {
            await platformService.create(platform);
            const platforms = await platformService.getAll();
            set({ platforms, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to create platform',
                isLoading: false,
            });
            throw error;
        }
    },

    updatePlatform: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            await platformService.update(id, updates);
            const platforms = await platformService.getAll();
            set({ platforms, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update platform',
                isLoading: false,
            });
            throw error;
        }
    },

    deletePlatform: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await platformService.delete(id);
            const platforms = await platformService.getAll();
            set({ platforms, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete platform',
                isLoading: false,
            });
            throw error;
        }
    },

    fetchAllocationRules: async () => {
        set({ isLoading: true, error: null });
        try {
            const allocationRules = await allocationService.getAll();
            set({ allocationRules, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch allocation rules',
                isLoading: false,
            });
        }
    },

    createAllocationRule: async (rule) => {
        set({ isLoading: true, error: null });
        try {
            await allocationService.create(rule);
            const allocationRules = await allocationService.getAll();
            set({ allocationRules, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to create allocation rule',
                isLoading: false,
            });
            throw error;
        }
    },

    updateAllocationRule: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            await allocationService.update(id, updates);
            const allocationRules = await allocationService.getAll();
            set({ allocationRules, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update allocation rule',
                isLoading: false,
            });
            throw error;
        }
    },

    deleteAllocationRule: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await allocationService.delete(id);
            const allocationRules = await allocationService.getAll();
            set({ allocationRules, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete allocation rule',
                isLoading: false,
            });
            throw error;
        }
    },

    fetchLiabilities: async () => {
        set({ isLoading: true, error: null });
        try {
            const liabilities = await liabilityService.getAll();
            set({ liabilities, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch liabilities',
                isLoading: false,
            });
        }
    },

    createLiability: async (liability) => {
        set({ isLoading: true, error: null });
        try {
            await liabilityService.create(liability);
            const liabilities = await liabilityService.getAll();
            set({ liabilities, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to create liability',
                isLoading: false,
            });
            throw error;
        }
    },

    updateLiability: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            await liabilityService.update(id, updates);
            const liabilities = await liabilityService.getAll();
            set({ liabilities, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update liability',
                isLoading: false,
            });
            throw error;
        }
    },

    deleteLiability: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await liabilityService.delete(id);
            const liabilities = await liabilityService.getAll();
            set({ liabilities, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete liability',
                isLoading: false,
            });
            throw error;
        }
    },

    fetchSavingTargets: async () => {
        set({ isLoading: true, error: null });
        try {
            const savingTargets = await savingTargetService.getAll();
            set({ savingTargets, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch saving targets',
                isLoading: false,
            });
        }
    },

    createSavingTarget: async (target) => {
        set({ isLoading: true, error: null });
        try {
            await savingTargetService.create(target);
            const savingTargets = await savingTargetService.getAll();
            set({ savingTargets, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to create saving target',
                isLoading: false,
            });
            throw error;
        }
    },

    updateSavingTarget: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            await savingTargetService.update(id, updates);
            const savingTargets = await savingTargetService.getAll();
            set({ savingTargets, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update saving target',
                isLoading: false,
            });
            throw error;
        }
    },

    deleteSavingTarget: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await savingTargetService.delete(id);
            const savingTargets = await savingTargetService.getAll();
            set({ savingTargets, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete saving target',
                isLoading: false,
            });
            throw error;
        }
    },

    fetchDashboardStats: async (month, year) => {
        set({ isLoading: true, error: null });
        try {
            const dashboardStats = await reportService.getDashboardStats(month, year);
            set({ dashboardStats, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats',
                isLoading: false,
            });
        }
    },

    fetchReportData: async (startDate, endDate) => {
        set({ isLoading: true, error: null });
        try {
            const reportData = await reportService.getReportData(startDate, endDate);
            set({ reportData, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch report data',
                isLoading: false,
            });
        }
    },

    clearError: () => set({ error: null }),
}));
